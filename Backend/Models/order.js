const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
    productId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'product',
        required: true 
    },
    quantity: { 
        type: Number, 
        required: true,
        min: 1 
    },
    price: { 
        type: Number, 
        required: true 
    },
    size: { 
        type: String 
    },
    color: { 
        type: String 
    }
});

const addressSchema = new mongoose.Schema({
    name: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, default: 'India' },
    phone: { type: String, required: true }
});

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    orderItems: [orderItemSchema],
    shippingAddress: {
        type: addressSchema,
        required: true
    },
    totalAmount: { 
        type: Number, 
        required: true 
    },
    paymentMethod: { 
        type: String, 
        enum: ['COD', 'Online'], 
        required: true 
    },
    paymentStatus: { 
        type: String, 
        enum: ['Pending', 'Paid', 'Failed'], 
        default: 'Pending' 
    },
    orderStatus: { 
        type: String, 
        enum: ['Created', 'Paid', 'Processing', 'Packed', 'Shipped', 'Delivered', 'Cancelled', 'Returned'], 
        default: 'Created' 
    },
    transactionId: { 
        type: String 
    },
    paymentResult: {
        id: { type: String },
        status: { type: String },
        update_time: { type: String },
        email_address: { type: String },
        payment_method: { type: String },
        payment_group: { type: String },
        payment_time: { type: String },
        cf_payment_id: { type: String },
        cf_order_id: { type: String },
        order_amount: { type: Number },
        order_currency: { type: String },
        customer_details: {
            customer_id: { type: String },
            customer_name: { type: String },
            customer_email: { type: String },
            customer_phone: { type: String }
        }
    },
    shippingPrice: {
        type: Number,
        default: 0
    },
    taxPrice: {
        type: Number,
        default: 0
    },
    deliveredAt: {
        type: Date
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    refundDetails: {
        amount: { type: Number },
        reason: { type: String },
        processedAt: { type: Date }
    }
});

// Update the updatedAt field before saving
orderSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Order = mongoose.model("order", orderSchema);
module.exports = Order;