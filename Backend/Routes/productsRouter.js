const express = require("express")
const productRouter = express.Router();
const upload = require("../Config/multerConfig");
const productModel = require("../Models/product");
const isOwner = require("../Middlewares/isOwner");
const { createPost, getAllProducts, getWomensProducts, deleteproduct, GetOneProduct, AddToCart } = require("../Controllers/Product");
const isLoggedIn = require("../Middlewares/isLoggedin");

productRouter.post("/create", isOwner, createPost)

productRouter.get("/allproducts", getAllProducts)
productRouter.get("/womensproducts", getWomensProducts)
productRouter.get("/getoneproduct/:id", GetOneProduct)
productRouter.delete("/deleteproduct/:id", isOwner, deleteproduct)
productRouter.post("/addtocart/:id", isLoggedIn, AddToCart)

module.exports = productRouter;