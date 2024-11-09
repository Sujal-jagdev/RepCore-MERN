const express = require("express");
const ownerModel = require("../Models/owner");
const ownerRouter = express.Router();
require('dotenv').config()

if (process.env.NODE_ENV == "development") {
    ownerRouter.post("/create", async (req, res) => {
        let owners = await ownerModel.find({})

        if (owners.length > 0) {
            return res.status(503).json({ message: "You Don't Have Permission To Create New Owners" })
        }
        try {
            const { fullname, email, password } = req.body;

            await ownerModel.create({
                fullname,
                email,
                password,
            })

            res.status(200).json({ message: "You Are a Owner Of This Website" })
        } catch (error) {
            res.status(400).json({ message: "Somthing Went Wrong" })
        }

    })
}

module.exports = ownerRouter;