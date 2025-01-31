const express = require("express")
const productRouter = express.Router();
const upload = require("../Config/multerConfig");
const productModel = require("../Models/product");
const isOwner = require("../Middlewares/isOwner");
const { createPost, getAllProducts, getWomensProducts, deleteproduct, GetOneProduct } = require("../Controllers/Product");

productRouter.post("/create", isOwner, createPost)

productRouter.get("/allproducts", getAllProducts)
productRouter.get("/womensproducts", getWomensProducts)
productRouter.get("/getoneproduct/:id", GetOneProduct)
productRouter.delete("/deleteproduct/:id", isOwner, deleteproduct)

module.exports = productRouter;