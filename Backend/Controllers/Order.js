const Order = require('../Models/order');
const User = require('../Models/user');
const Product = require('../Models/product');
require('dotenv').config();

// Create a new order
const createOrder = async (req, res) => {
    try {
        const { orderItems, shippingAddress, paymentMethod, totalAmount, shippingPrice, taxPrice } = req.body;
        const userId = req.user.id;

        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        // Verify all products exist and are in stock
        for (const item of orderItems) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(404).json({ message: `Product with ID ${item.productId} not found` });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `Product ${product.name} is out of stock` });
            }
        }

        // Create order
        const order = new Order({
            user: userId,
            orderItems,
            shippingAddress,
            paymentMethod,
            totalAmount,
            shippingPrice: shippingPrice || 0,
            taxPrice: taxPrice || 0
        });

        // Save the order
        const createdOrder = await order.save();

        // Add order reference to user
        await User.findByIdAndUpdate(userId, {
            $push: { orders: createdOrder._id }
        });

        // Update product stock
        for (const item of orderItems) {
            await Product.findByIdAndUpdate(item.productId, {
                $inc: { stock: -item.quantity }
            });
        }

        // If payment method is COD, set order status to Processing
        if (paymentMethod === 'COD') {
            createdOrder.orderStatus = 'Processing';
            await createdOrder.save();
        }

        res.status(201).json({
            message: 'Order created successfully',
            order: createdOrder
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Error creating order', error: error.message });
    }
};

// Get all orders for admin
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('user', 'fullname email')
            .populate('orderItems.productId', 'name image price');

        res.status(200).json({
            count: orders.length,
            orders
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
};

// Get user orders
const getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const orders = await Order.find({ user: userId })
            .populate('orderItems.productId', 'name image price')
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: orders.length,
            orders
        });
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({ message: 'Error fetching user orders', error: error.message });
    }
};

// Get order by ID
const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id)
            .populate('user', 'fullname email')
            .populate('orderItems.productId', 'name image price');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if the order belongs to the requesting user or if the user is an admin
        if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to access this order' });
        }

        res.status(200).json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ message: 'Error fetching order', error: error.message });
    }
};

// Update order status (admin only)
const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { orderStatus } = req.body;

        if (!orderStatus) {
            return res.status(400).json({ message: 'Order status is required' });
        }

        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Update order status
        order.orderStatus = orderStatus;

        // If order is delivered, set deliveredAt
        if (orderStatus === 'Delivered') {
            order.deliveredAt = Date.now();
        }

        await order.save();

        res.status(200).json({
            message: 'Order status updated successfully',
            order
        });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Error updating order status', error: error.message });
    }
};

// Cancel order
const cancelOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if the order belongs to the requesting user
        if (order.user.toString() !== userId) {
            return res.status(403).json({ message: 'Not authorized to cancel this order' });
        }

        // Check if the order can be cancelled
        if (['Shipped', 'Delivered', 'Cancelled', 'Returned'].includes(order.orderStatus)) {
            return res.status(400).json({ 
                message: `Order cannot be cancelled in ${order.orderStatus} status` 
            });
        }

        // Update order status to Cancelled
        order.orderStatus = 'Cancelled';
        await order.save();

        // Restore product stock
        for (const item of order.orderItems) {
            await Product.findByIdAndUpdate(item.productId, {
                $inc: { stock: item.quantity }
            });
        }

        res.status(200).json({
            message: 'Order cancelled successfully',
            order
        });
    } catch (error) {
        console.error('Error cancelling order:', error);
        res.status(500).json({ message: 'Error cancelling order', error: error.message });
    }
};

// Process refund (admin only)
const processRefund = async (req, res) => {
    try {
        const { id } = req.params;
        const { refundAmount, refundReason } = req.body;

        if (!refundAmount) {
            return res.status(400).json({ message: 'Refund amount is required' });
        }

        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if order is eligible for refund
        if (order.paymentMethod === 'COD' && order.orderStatus !== 'Delivered') {
            return res.status(400).json({ message: 'COD orders can only be refunded after delivery' });
        }

        if (order.paymentMethod === 'Online' && order.paymentStatus !== 'Paid') {
            return res.status(400).json({ message: 'Only paid orders can be refunded' });
        }

        // Update order status
        order.orderStatus = 'Returned';
        order.refundDetails = {
            amount: refundAmount,
            reason: refundReason,
            processedAt: Date.now()
        };

        await order.save();

        // Restore product stock
        for (const item of order.orderItems) {
            await Product.findByIdAndUpdate(item.productId, {
                $inc: { stock: item.quantity }
            });
        }

        res.status(200).json({
            message: 'Refund processed successfully',
            order
        });
    } catch (error) {
        console.error('Error processing refund:', error);
        res.status(500).json({ message: 'Error processing refund', error: error.message });
    }
};

module.exports = {
    createOrder,
    getAllOrders,
    getUserOrders,
    getOrderById,
    updateOrderStatus,
    cancelOrder,
    processRefund
};