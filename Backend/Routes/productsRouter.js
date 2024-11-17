const express = require("express")
const productRouter = express.Router();
const upload = require("../Config/multerConfig");
const productModel = require("../Models/product");
const isOwner = require("../Middlewares/isOwner");
const { createPost, getAllProducts, getWomensProducts } = require("../Controllers/Product");

productRouter.post("/create", isOwner, upload.single("image"), createPost)

productRouter.get("/allproducts",isOwner, getAllProducts)
productRouter.get("/womensproducts", getWomensProducts)


module.exports = productRouter;