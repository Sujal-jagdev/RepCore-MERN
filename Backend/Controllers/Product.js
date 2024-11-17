const express = require("express")
const productModel = require("../Models/product");

module.exports.createPost = async (req, res) => {
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
}

module.exports.getAllProducts = async (req, res) => {
    try {
        let products = await productModel.find()
        res.status(200).json({ message: "Products Get Sucessfully!!", products })
    } catch (error) {
        res.status(400).json({ message: "Something Went Wrong", error })
    }
}

module.exports.getWomensProducts = async (req,res)=>{
    try {
        let products = await productModel.find({category: 'Acessories'})
        res.status(200).json({ message: "Products Get Sucessfully!!", products })
    } catch (error) {
        res.status(400).json({ message: "Something Went Wrong", error })
    }
}