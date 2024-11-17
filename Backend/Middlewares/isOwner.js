const jwt = require("jsonwebtoken");
require('dotenv').config()

const isOwner = (req, res, next) => {
    const { adminToken } = req.cookies;

    if (!adminToken) {
        return res.status(401).json({ message: "You Are Not Admin!!" })
    }

    try {
        jwt.verify(adminToken, process.env.JWT_KEY, (err, decoded) => {
            if (err) return res.status(200).json({ message: "Verified!! " })
            req.user = decoded;
            next()
        })
    } catch (error) {
        res.status(400).json({ message: "SomeThing Went Wrong!!" })
    }
}

module.exports = isOwner