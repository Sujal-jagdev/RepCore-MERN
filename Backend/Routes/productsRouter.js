const express = require("express")
const productRouter = express.Router();
const multer = require("multer");
const upload = require("../Config/multerConfig");
const productModel = require("../Models/product");
const isOwner = require("../Middlewares/isOwner");

productRouter.post("/create", isOwner, upload.single("image"), async (req, res) => {
    const { name, price, discount, category, bgColor, panelColor, textColor } = req.body;
    try {
        let product = await productModel.create({
            image: req.file.buffer,
            name,
            price,
            discount,
            category,
            bgColor,
            panelColor,
            textColor
        })

        res.status(200).json({ message: "Product Add Successfully" })
    } catch (error) {
        res.status(400).json({ message: "Something Went Wrong", error })
    }
})

module.exports = productRouter;