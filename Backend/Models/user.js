const mongoose = require("mongoose")

const addressSchema = new mongoose.Schema({
    name: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, default: 'India' },
    phone: { type: String, required: true },
    isDefault: { type: Boolean, default: false }
});

// Order schema moved to separate model file

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationOTP: {
        code: { type: String },
        expiresAt: { type: Date }
    },
    cart: [{ 
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product'},
        quantity: { type: Number, default: 1 },
        size: { type: String },
        color: { type: String }
    }],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'product' }],
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'order' }],
    addresses: [addressSchema],
    // Simple address for profile page
    address: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        pincode: { type: String },
        country: { type: String, default: 'India' }
    },
    contact: { type: String },
    userpicture: { type: Buffer },
    createdAt: { type: Date, default: Date.now },
    lastLogin: { type: Date }
})


const userModel = mongoose.model("user", userSchema)
module.exports = userModel;