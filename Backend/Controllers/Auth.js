const express = require("express");
const userModel = require("../Models/user");
const bcrypt = require("bcrypt")
require('dotenv').config()
const jwt = require("jsonwebtoken");
const GenrateToken = require("../Utils/tokenGenrater");
const multer = require("multer");

// Create User
module.exports.signup = (req, res) => {
    const { fullname, email, password, contact } = req.body;

    try {
        //Hash Password Befor Creating User
        bcrypt.hash(password, 5, async (err, hash) => {
            if (err) return res.status(400).json({ message: "Something Went Wrong!!" })

            let user = await userModel.create({
                fullname, email, password: hash, contact, userpicture: req.file.buffer
            })
            //Set Token In Cookies
            let token = GenrateToken(user)
            res.cookie("token", token).status(200).json({ message: "Welcome To RepCore...",user })
        })
    } catch (error) {
        res.status(400).json({ message: "Something Went Wrong!!", error })
    }
}

// Login User
module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = await userModel.findOne({ email })

        if (!user) {
            return res.status(400).json({ message: "Invalid Email Or Password!!" })
        }

        bcrypt.compare(password, user.password, (err, result) => {
            if (err) return res.status(400).json({ message: "SomeThign Went Wrong" })

            if (result) {
                let token = GenrateToken(user)
                res.cookie("token", token).status(200).json({ message: "Welcome To RepCore...", user })
            } else {
                return res.status(400).json({ message: "Invalid Email Or Password!!" })
            }

        })
    } catch (error) {
        res.status(400).json({ message: "Something Went Wrong!!", error })
    }
}

// Logout User
module.exports.logout = (req, res) => {
    res.cookie("token", "").status(200).json({ message: "You Are Logout" })
}

module.exports.profile = async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email })
    if (!user) {
        return res.status(401).json({ message: "User Not Found!!" })
    }
    res.status(200).json({ message: "Your Profile Details", user })
}