const mongoose = require("mongoose")

const ownerSchema = new mongoose.Schema({
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
    products: [],
    userPicture: String
})


const ownerModel = mongoose.model("owner", ownerSchema)
module.exports = ownerModel;