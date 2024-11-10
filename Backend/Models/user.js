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
    cart: [],
    orders: [],
    contact: Number,
    userpicture: String
})


const userModel = mongoose.model("user", userSchema)
module.exports = userModel;