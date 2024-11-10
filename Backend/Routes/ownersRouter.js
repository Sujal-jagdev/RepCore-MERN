const express = require("express");
const ownerModel = require("../Models/owner");
const ownerRouter = express.Router();
require('dotenv').config()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const GenrateToken = require("../Utils/tokenGenrater");

if (process.env.NODE_ENV == "development") {
    ownerRouter.post("/create", async (req, res) => {
        let owners = await ownerModel.find({})

        if (owners.length > 0) {
            return res.status(503).json({ message: "You Don't Have Permission To Create New Owners" })
        }
        try {
            const { fullname, email, password } = req.body;
            bcrypt.hash(password, 5, async (err, hash) => {
                if (err) {
                    return res.status(400).json({ message: "SomeThing Went Wrong", err })
                }
                await ownerModel.create({
                    fullname,
                    email,
                    password: hash,
                })
                let user = owners;
                let adminToken = GenrateToken(user)
                res.cookie("adminToken", adminToken).status(200).json({ message: "You Are a Owner Of This Website" })
            })
        } catch (error) {
            res.status(400).json({ message: "Somthing Went Wrong" })
        }

    })
}

ownerRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = await ownerModel.findOne({ email })

        if (!email) {
            return res.status(401).json({ message: "Something Went Wrong1" })
        }

        bcrypt.compare(password, user.password, (err, result) => {
            if (err) return res.status(400).json({ message: "SomeThing Went Wrong!!2" })
            if (result) {
                let adminToken = GenrateToken(user)
                res.cookie("adminToken", adminToken).status(200).json({ message: "You are the owner of this website" });
            } else {
                res.status(401).json({ message: "Incorrect password" });
            }
        })

    } catch (error) {
        res.status(400).json({ message: "Some Thing Went Wrong!!3" })
    }
})

module.exports = ownerRouter;