const mongoose = require("mongoose")

const reviewSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

const productSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    gallery: [{
        type: String
    }],
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: { 
        type: Number,
        required: true
    },
    mrp: {
        type: Number
    },
    discount: {
        type: Number,
        default: 0
    },
    category: {
        type: String,
        enum: ['Men', 'Women', 'Accessories'],
        required: true
    },
    subcategory: {
        type: String
    },
    colors: [{
        type: String
    }],
    sizes: [{
        type: String
    }],
    stock: {
        type: Number,
        default: 0
    },
    reviews: [reviewSchema],
    bgColor: String,
    panelColor: String,
    textColor: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    // Enable automatic createdAt/updatedAt maintenance
    timestamps: true
});

// Prevent duplicate products with the same name within a category/subcategory
// This helps guard against accidental double submissions creating duplicates
productSchema.index(
    { name: 1, category: 1, subcategory: 1 },
    { unique: true, name: "unique_product_name_per_category" }
);

const productModel = mongoose.model("product", productSchema)
module.exports = productModel;