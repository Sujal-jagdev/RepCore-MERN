const express = require("express")
const productRouter = express.Router();
const upload = require("../Config/multerConfig");
const productModel = require("../Models/product");
const isOwner = require("../Middlewares/isOwner");
const { 
    createPost, 
    getAllProducts, 
    getWomensProducts, 
    deleteproduct, 
    GetOneProduct, 
    AddToCart, 
    RemoveCartProduct, 
    GetMensProducts, 
    GetAccessories,
    updateCartQuantity,
    getCart,
    clearCart,
    addToWishlist,
    removeFromWishlist,
    getWishlist,
    addReview,
    getProductReviews
} = require("../Controllers/Product");
const isLoggedIn = require("../Middlewares/isLoggedin");

// Product management routes
productRouter.post("/create", isOwner, createPost);
productRouter.get("/allproducts", getAllProducts);
productRouter.get("/womensproducts", getWomensProducts);
productRouter.get("/mensproducts", GetMensProducts);
productRouter.get("/accessories", GetAccessories);
productRouter.get("/getoneproduct/:id", GetOneProduct);
productRouter.delete("/deleteproduct/:id", isOwner, deleteproduct);

// Cart routes
productRouter.post("/addtocart/:id", isLoggedIn, AddToCart);
productRouter.post("/cart/remove/:id", isLoggedIn, RemoveCartProduct);
productRouter.put("/cart/update/:id", isLoggedIn, updateCartQuantity);
productRouter.get("/cart", isLoggedIn, getCart);
productRouter.delete("/cart/clear", isLoggedIn, clearCart);

// Wishlist routes
productRouter.post("/wishlist/add/:id", isLoggedIn, addToWishlist);
productRouter.delete("/wishlist/remove/:id", isLoggedIn, removeFromWishlist);
productRouter.get("/wishlist", isLoggedIn, getWishlist);

// Review routes
productRouter.post("/review/:id", isLoggedIn, addReview);
productRouter.get("/review/product/:id", getProductReviews);

module.exports = productRouter;