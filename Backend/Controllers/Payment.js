const express = require('express');
const userModel = require('../Models/user');
const productModel = require('../Models/product');
const Order = require('../Models/order');
require('dotenv').config();
const crypto = require('crypto');
const axios = require('axios');

// Cashfree payment gateway integration
// Environment variables needed:
// CASHFREE_APP_ID - Cashfree App ID
// CASHFREE_SECRET_KEY - Cashfree Secret Key
// CASHFREE_API_URL - Cashfree API URL (sandbox or production)

// Helper function to generate a unique order ID
const generateOrderId = () => {
    return 'ORDER_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
};

// Helper function to verify Cashfree signature
const verifySignature = (orderId, orderAmount, referenceId, txStatus, paymentMode, txMsg, txTime, signature) => {
    const data = orderId + orderAmount + referenceId + txStatus + paymentMode + txMsg + txTime;
    const signatureHash = crypto
        .createHmac('sha256', process.env.CASHFREE_SECRET_KEY)
        .update(data)
        .digest('hex');
    return signatureHash === signature;
};

// Create a new payment order with enhanced error handling and validation
const createPaymentOrder = async (req, res) => {
    try {
        const { cartItems, shippingAddress, totalAmount, shippingPrice, taxPrice } = req.body;
        const userId = req.user.id;

        // Enhanced validation
        if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
            return res.status(400).json({ message: 'Cart items are required and must be a non-empty array' });
        }
    
        if (!shippingAddress) {
            return res.status(400).json({ message: 'Shipping address is required' });
        }
        
        if (!totalAmount || isNaN(totalAmount) || totalAmount <= 0) {
            return res.status(400).json({ message: 'Valid total amount is required' });
        }

        // Get user details with error handling
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create a unique order ID
        const orderId = generateOrderId();

        // Create order in Cashfree with improved payload
        const payload = {
            order_id: orderId,
            order_amount: totalAmount,
            order_currency: 'INR',
            order_note: 'Payment for Repcore Gym products',
            customer_details: {
                customer_id: userId,
                customer_name: user.fullname || 'Customer',
                customer_email: user.email,
                customer_phone: shippingAddress.phone
            },
            order_meta: {
                return_url: `${process.env.FRONTEND_URL}/checkout?order_id={order_id}&order_token={order_token}`,
                notify_url: `${process.env.BACKEND_URL}/payment/webhook`
            },
            order_tags: {
                source: "RepCore Gym",
                type: "ecommerce"
            },
            order_expiry_time: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes expiry
            order_splits: [] // Can be used for marketplace scenarios if needed
        };

        // Call Cashfree API to create order
        let response;
        try {
            response = await axios.post(
                `${process.env.CASHFREE_API_URL}/orders`,
                payload,
                {
                    headers: {
                        'x-client-id': process.env.CASHFREE_APP_ID,
                        'x-client-secret': process.env.CASHFREE_SECRET_KEY,
                        'x-api-version': '2022-01-01',
                        'Content-Type': 'application/json'
                    }
                }
            );
            // Cashfree API response received
        } catch (error) {
            console.error('Cashfree API Error:', error.response?.data || error.message);
            // Request details omitted in production
            throw new Error(`Payment gateway error: ${error.response?.data?.message || error.message}`);
        }

        // Prepare order items
        const orderItems = [];
        for (const item of cartItems) {
            const product = await productModel.findById(item.productId);
            if (!product) {
                return res.status(404).json({ message: `Product with ID ${item.productId} not found` });
            }

            // Check if product is in stock
            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `Product ${product.name} is out of stock. Available: ${product.stock}` });
            }

            orderItems.push({
                productId: item.productId,
                quantity: item.quantity,
                price: product.price,
                size: item.size,
                color: item.color
            });
        }

        // Create a new order using the Order model
        const newOrder = new Order({
            user: userId,
            orderItems: orderItems,
            shippingAddress,
            totalAmount,
            shippingPrice: shippingPrice || 0,
            taxPrice: taxPrice || 0,
            paymentMethod: 'Online',
            paymentStatus: 'Pending',
            orderStatus: 'Created',
            transactionId: orderId
        });

        // Save the order
        const savedOrder = await newOrder.save();

        // Add order reference to user's orders array
        await userModel.findByIdAndUpdate(userId, {
            $push: { orders: savedOrder._id }
        });

        // Prepare response data - ensure we only include each field once
        const responseData = {
            message: 'Payment order created successfully',
            order_id: orderId,
            order_token: response.data.cf_order_id || response.data.order_token,
            order_status: response.data.order_status || 'ACTIVE',
            payment_link: response.data.payment_link || response.data.payment_session_id,
            order: savedOrder
        };
        
        
        // Return the order data to the frontend
        return res.status(200).json(responseData);
    } catch (error) {
        console.error('Error creating payment order:', error);
        return res.status(500).json({ message: 'Error creating payment order', error: error.message });
    }
};

// Verify payment status with enhanced error handling and detailed response
const verifyPayment = async (req, res) => {
    try {
        const { order_id } = req.params;

        if (!order_id) {
            return res.status(400).json({ message: 'Order ID is required' });
        }

        // Call Cashfree API to get order status with error handling
        let response;
        try {
            response = await axios.get(
                `${process.env.CASHFREE_API_URL}/orders/${order_id}`,
                {
                    headers: {
                        'x-client-id': process.env.CASHFREE_APP_ID,
                        'x-client-secret': process.env.CASHFREE_SECRET_KEY,
                        'x-api-version': '2022-01-01',
                        'Content-Type': 'application/json'
                    }
                }
            );
        } catch (apiError) {
            console.error('Cashfree API error:', apiError.response?.data || apiError.message);
            return res.status(500).json({
                message: 'Failed to verify payment with payment gateway',
                error: apiError.response?.data?.message || apiError.message
            });
        }

        // Find the order by transaction ID
        const order = await Order.findOne({ transactionId: order_id });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Get detailed payment information
        const cashfreeOrderStatus = response.data.order_status;
        const paymentDetails = response.data.payments && response.data.payments.length > 0 
            ? response.data.payments[0] 
            : null;
        const paymentDetailStatus = paymentDetails?.payment_status || paymentDetails?.status;
        const isPaid = (
            cashfreeOrderStatus === 'PAID' ||
            cashfreeOrderStatus === 'SUCCESS' ||
            cashfreeOrderStatus === 'COMPLETED' ||
            paymentDetailStatus === 'SUCCESS' ||
            paymentDetailStatus === 'PAID' ||
            paymentDetailStatus === 'COMPLETED'
        );

        // Update the order status based on the payment status
        if (isPaid) {
            order.paymentStatus = 'Paid';
            order.orderStatus = 'Processing';
            
            // Update payment result with more details
            order.paymentResult = {
                id: response.data.cf_payment_id || paymentDetails?.cf_payment_id || '',
                status: cashfreeOrderStatus,
                update_time: new Date().toISOString(),
                email_address: response.data.customer_details?.customer_email || '',
                payment_method: paymentDetails?.payment_method || 'Online',
                payment_group: paymentDetails?.payment_group || '',
                payment_time: paymentDetails?.payment_time || new Date().toISOString()
            };
            
            await order.save();
            
            // Clear the user's cart after successful payment
            await userModel.findByIdAndUpdate(order.user, { cart: [] });

            // Update product stock with error handling
            for (const item of order.orderItems) {
                try {
                    await productModel.findByIdAndUpdate(item.productId, {
                        $inc: { stock: -item.quantity }
                    });
                } catch (stockError) {
                    console.error(`Error updating stock for product ${item.productId}:`, stockError);
                    // Continue processing other items even if one fails
                }
            }

            // Send confirmation email to user
            try {
                // Implement email sending logic here
           
            } catch (emailError) {
                console.error(`Failed to send payment confirmation email: ${emailError.message}`);
            }

            return res.status(200).json({
                message: 'Payment successful',
                order_status: 'PAID',
                order_details: order
            });
        } else if (cashfreeOrderStatus === 'ACTIVE' || cashfreeOrderStatus === 'PENDING') {
            return res.status(200).json({
                message: 'Payment pending',
                order_status: cashfreeOrderStatus
            });
        } else {
            order.paymentStatus = 'Failed';
            await order.save();

            return res.status(200).json({
                message: 'Payment failed',
                order_status: cashfreeOrderStatus
            });
        }
    } catch (error) {
        console.error('Error verifying payment:', error);
        return res.status(500).json({ message: 'Error verifying payment', error: error.message });
    }
};

// Handle Cashfree webhook
const handleWebhook = async (req, res) => {
    try {
        const {
            orderId,
            orderAmount,
            referenceId,
            txStatus,
            paymentMode,
            txMsg,
            txTime,
            signature
        } = req.body;

        // Webhook data received

        // Verify the signature
        const isValidSignature = verifySignature(
            orderId,
            orderAmount,
            referenceId,
            txStatus,
            paymentMode,
            txMsg,
            txTime,
            signature
        );

        if (!isValidSignature) {
            console.error('Invalid webhook signature');
            return res.status(400).json({ message: 'Invalid signature' });
        }

        // console.log(`Processing order ${orderId} with status ${txStatus}`);

        // Find the order by transaction ID
        const order = await Order.findOne({ transactionId: orderId });
        if (!order) {
            console.error(`Order not found for transaction ID: ${orderId}`);
            return res.status(404).json({ message: 'Order not found' });
        }

        // Update the order status based on the payment status
        if (txStatus === 'SUCCESS') {
            order.paymentStatus = 'Paid';
            order.orderStatus = 'Processing';
            
            // Update payment result
            order.paymentResult = {
                id: referenceId,
                status: txStatus,
                update_time: txTime,
                email_address: ''
            };
            
            await order.save();
            // Order marked as paid
            
            // Clear the user's cart after successful payment
            await userModel.findByIdAndUpdate(order.user, { cart: [] });
            // User cart cleared for order

            // Update product stock
            for (const item of order.orderItems) {
                await productModel.findByIdAndUpdate(item.productId, {
                    $inc: { stock: -item.quantity }
                });
            }
            
            // Send confirmation email to user
            try {
                // Implement email sending logic here
                // Confirmation email sent
            } catch (emailError) {
                console.error(`Failed to send confirmation email: ${emailError.message}`);
            }
        } else if (txStatus === 'FAILED') {
            order.paymentStatus = 'Failed';
            order.orderStatus = 'Cancelled';
            await order.save();
            // Order marked as failed
            
            // Restore product stock
            for (const item of order.orderItems) {
                await productModel.findByIdAndUpdate(item.productId, {
                    $inc: { stock: item.quantity }
                });
            }
            // Product stock restored for order
        }

        return res.status(200).json({ message: 'Webhook processed successfully' });
    } catch (error) {
        console.error('Error processing webhook:', error);
        return res.status(500).json({ message: 'Error processing webhook', error: error.message });
    }
};

// Get all orders for a user
const getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id;

        // Get orders for the user
        const orders = await Order.find({ user: userId })
            .populate('orderItems.productId', 'name image price')
            .sort({ createdAt: -1 });

        // Transform the data to match frontend expectations
        const transformedOrders = orders.map(order => ({
            ...order.toObject(),
            products: order.orderItems // Map orderItems to products for frontend compatibility
        }));

        return res.status(200).json({
            message: 'Orders fetched successfully',
            orders: transformedOrders
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        return res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
};

// Get a specific order by ID
const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.user.id;

        // Find the order and populate product details
        const order = await Order.findById(orderId)
            .populate('orderItems.productId', 'name image price');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if the order belongs to the requesting user
        if (order.user.toString() !== userId) {
            return res.status(403).json({ message: 'Not authorized to access this order' });
        }

        // Transform the data to match frontend expectations
        const transformedOrder = {
            ...order.toObject(),
            products: order.orderItems // Map orderItems to products for frontend compatibility
        };

        return res.status(200).json({
            message: 'Order fetched successfully',
            order: transformedOrder
        });
    } catch (error) {
        console.error('Error fetching order:', error);
        return res.status(500).json({ message: 'Error fetching order', error: error.message });
    }
};

// Create a COD order
const createCODOrder = async (req, res) => {
    try {
        const { cartItems, shippingAddress, totalAmount, shippingPrice, taxPrice } = req.body;
        const userId = req.user.id;

        if (!cartItems || !shippingAddress || !totalAmount) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Validate shipping address
        const requiredFields = ['name', 'street', 'city', 'state', 'pincode', 'phone'];
        for (const field of requiredFields) {
            if (!shippingAddress[field]) {
                return res.status(400).json({
                    message: `Missing required shipping field: ${field}`
                });
            }
        }

        // Validate phone number format
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(shippingAddress.phone)) {
            return res.status(400).json({
                message: "Invalid phone number format. Please enter a 10-digit number."
            });
        }

        // Validate pincode format
        const pincodeRegex = /^[0-9]{6}$/;
        if (!pincodeRegex.test(shippingAddress.pincode)) {
            return res.status(400).json({
                message: "Invalid pincode format. Please enter a 6-digit number."
            });
        }

        // Get user details
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create a unique order ID
        const orderId = generateOrderId();

        // Prepare order items
        const orderItems = [];
        for (const item of cartItems) {
            const product = await productModel.findById(item.productId);
            if (!product) {
                return res.status(404).json({ message: `Product with ID ${item.productId} not found` });
            }

            // Check if product is in stock
            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `Product ${product.name} is out of stock. Available: ${product.stock}` });
            }

            orderItems.push({
                productId: item.productId,
                quantity: item.quantity,
                price: product.price,
                size: item.size,
                color: item.color
            });
        }

        // Create a new order using the Order model
        const newOrder = new Order({
            user: userId,
            orderItems: orderItems,
            shippingAddress,
            totalAmount,
            shippingPrice: shippingPrice || 0,
            taxPrice: taxPrice || 0,
            paymentMethod: 'COD',
            paymentStatus: 'Pending',
            orderStatus: 'Processing',
            transactionId: orderId
        });

        // Save the order
        const savedOrder = await newOrder.save();

        // Add order reference to user's orders array
        await userModel.findByIdAndUpdate(userId, {
            $push: { orders: savedOrder._id },
            $set: { cart: [] }
        });

        // Update product stock
        for (const item of orderItems) {
            await productModel.findByIdAndUpdate(item.productId, {
                $inc: { stock: -item.quantity }
            });
        }

        // Send order confirmation email
        try {
            // Implement email sending logic here
            // COD order confirmation email sent
        } catch (emailError) {
            console.error(`Failed to send COD order confirmation email: ${emailError.message}`);
        }

        return res.status(200).json({
            message: 'COD order created successfully',
            order_id: orderId,
            order: savedOrder
        });
    } catch (error) {
        console.error('Error creating COD order:', error);
        return res.status(500).json({ message: 'Error creating COD order', error: error.message });
    }
};

// Cancel an order
const cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.user.id;

        // Find the order
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if the order belongs to the requesting user
        if (order.user.toString() !== userId) {
            return res.status(403).json({ message: 'Not authorized to cancel this order' });
        }

        // Check if the order can be cancelled
        if (['Shipped', 'Delivered', 'Cancelled'].includes(order.orderStatus)) {
            return res.status(400).json({ 
                message: `Order cannot be cancelled as it is already ${order.orderStatus}` 
            });
        }

        // Update order status to Cancelled
        order.orderStatus = 'Cancelled';
        await order.save();

        // Restore product stock
        for (const item of order.orderItems) {
            await productModel.findByIdAndUpdate(item.productId, {
                $inc: { stock: item.quantity }
            });
        }

        return res.status(200).json({
            message: 'Order cancelled successfully',
            order
        });

    } catch (error) {
        console.error('Error cancelling order:', error);
        return res.status(500).json({ message: 'Error cancelling order', error: error.message });
    }
};

module.exports = {
    createPaymentOrder,
    verifyPayment,
    handleWebhook,
    getUserOrders,
    getOrderById,
    createCODOrder,
    cancelOrder,
    generateOrderId,
    verifySignature
};