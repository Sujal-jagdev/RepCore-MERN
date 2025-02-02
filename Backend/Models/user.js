const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    fullname: {
        type: String
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
    cart: [{ type: mongoose.Schema.Types.ObjectId, ref: 'productModel'}],
    orders: [],
    contact: Number,
    userpicture: Buffer
})


const userModel = mongoose.model("user", userSchema)
module.exports = userModel;