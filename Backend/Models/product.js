const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    image: {
        type: Buffer,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: { 
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        default: 0
    },
    discription: String,
    bgColor: String,
    panelColor: String,
    textColor: String
})


const productModel = mongoose.model("product", productSchema)
module.exports = productModel;