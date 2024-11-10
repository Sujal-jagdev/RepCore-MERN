const express = require("express")
const productRouter = express.Router();
const multer = require("multer");
const upload = require("../Config/multerConfig");

productRouter.get("/create", upload.single('image'), (req, res) => {

    res.send("Welcome to Product route");
})

module.exports = productRouter;