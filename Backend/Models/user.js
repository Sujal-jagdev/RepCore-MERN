const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cart: [],
    isAdmin: Boolean,
    orders: [],
    contact: Number,
    userPicture: String
})


const userModel = mongoose.model("user", userSchema)
module.exports = userModel;