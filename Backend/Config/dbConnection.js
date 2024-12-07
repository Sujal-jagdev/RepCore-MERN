const mongoose = require("mongoose")
require("dotenv").config()

mongoose.connect(`${process.env.MONOSE_CONNECTTION}/RepCore`)
    .then(() => console.log('Data Base Connected Succesfully'))
    .catch((err) => console.log(err))

module.exports = mongoose.connection;