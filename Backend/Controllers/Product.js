const express = require("express")
const productModel = require("../Models/product");
const userModel = require("../Models/user");

module.exports.createPost = async (req, res) => {
    const { image, name, price, discount, category, bgColor, panelColor, textColor, subcategory } = req.body;
    try {
        await productModel.create({
            image,
            name,
            price,
            discount,
            category,
            subcategory,
            bgColor,
            panelColor,
            textColor
        })

        return res.status(200).json({ message: "Product Add Successfully" })
    } catch (error) {
        return res.status(400).json({ message: "Something Went Wrong", error })
    }
}

module.exports.getAllProducts = async (req, res) => {
    try {
        let products = await productModel.find()
        return res.status(200).json({ message: "Products Get Sucessfully!!", products })
    } catch (error) {
        return res.status(400).json({ message: "Something Went Wrong", error })
    }
}

module.exports.GetMensProducts = async (req, res) => {
    try {
        let products = await productModel.find({ $or: [{ category: 'Men' }] })
        console.log(products)
        return res.status(200).json({ message: "Products Get Sucessfully!!", products })
    } catch (error) {
        return res.status(400).json({ message: "Something Went Wrong", error })
    }
}

module.exports.getWomensProducts = async (req, res) => {
    try {
        let products = await productModel.find({ $or: [{ category: 'Women' }, { category: 'women scroll' }] })
        return res.status(200).json({ message: "Products Get Sucessfully!!", products })
    } catch (error) {
        return res.status(400).json({ message: "Something Went Wrong", error })
    }
}

module.exports.deleteproduct = async (req, res) => {
    try {
        let id = req.params.id;

        let me = await productModel.findOneAndDelete({ _id: id })
        return res.status(200).json({ message: "Products Deleted Sucessfully!!" })
    } catch (error) {
        return res.status(400).json({ message: "Something Went Wrong", error })
    }
}

module.exports.GetOneProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const isProduct = await productModel.findById({ _id: id })
        if (!isProduct) {
            return res.status(400).json({ message: "Product Not Found" })
        }
        return res.status(200).json({ message: "Product Get Successfully", isProduct })
    } catch (error) {
        return res.status(400).json({ message: "Something Went Wrong", error })
    }
}

module.exports.AddToCart = async (req, res) => {
    const { id } = req.params;
    const userID = req.user.id;

    try {
        const isProduct = await productModel.findById(id);
        if (!userID) {
            return res.status(400).json({ meesage: "After Login You Can Use Add To Cart Feature.!!" })
        }
        if (!isProduct) {
            return res.status(400).json({ message: "Product Not Found" })
        }
        await userModel.findByIdAndUpdate({ _id: userID }, { $push: { cart: isProduct._id } }, { new: true })
        return res.status(200).json({ message: "Product Added To Cart SucessFully" })
    } catch (error) {
        return res.status(400).json({ message: "Something Went Wrong", error })
    }
}

module.exports.RemoveCartProduct = async (req, res) => {
    const userID = req.user.id;
    const { id } = req.params;
    if (!userID) {
        return res.status(404).json({ message: "User Not Found!!" });
    }
    if (!id) {
        return res.status(404).json({ message: "Product Not Found!!" });
    }
    try {
        await userModel.findByIdAndUpdate({ _id: userID }, { $pull: { cart: id } }, { new: true })
        return res.status(200).json({ message: "Product Removed From Cart SucessFully" })
    } catch (error) {
        return res.status(400).json({ message: "Something Went Wrong", error })
    }
}