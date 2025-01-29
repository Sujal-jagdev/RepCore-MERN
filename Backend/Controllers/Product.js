const express = require("express")
const productModel = require("../Models/product");

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

        res.status(200).json({ message: "Product Add Successfully" })
    } catch (error) {
        res.status(400).json({ message: "Something Went Wrong", error })
    }
}

module.exports.getAllProducts = async (req, res) => {
    try {
        let products = await productModel.find()
        res.status(200).json({ message: "Products Get Sucessfully!!", products })
    } catch (error) {
        res.status(400).json({ message: "Something Went Wrong", error })
    }
}

module.exports.getWomensProducts = async (req, res) => {
    try {
        let products = await productModel.find({ $or: [{ category: 'Women' }, { category: 'women scroll' }] })
        res.status(200).json({ message: "Products Get Sucessfully!!", products })
    } catch (error) {
        res.status(400).json({ message: "Something Went Wrong", error })
    }
}

module.exports.deleteproduct = async (req, res) => {
    try {
        let id = req.params.id;

        let me = await productModel.findOneAndDelete({ _id: id })
        res.status(200).json({ message: "Products Deleted Sucessfully!!" })
    } catch (error) {
        res.status(400).json({ message: "Something Went Wrong", error })
    }
}