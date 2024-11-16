const jwt = require("jsonwebtoken");
require('dotenv').config()

const isLoggedIn = (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return res.status(401).json({ message: "You Must Be Login First!!" })
    }

    try {
        jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
            if (err) return res.status(400).json({ message: "SomeThing Went Wrong!!" })
            req.user = decoded;
            next()
        })
    } catch (error) {
        res.status(400).json({ message: "SomeThing Went Wrong!!" })
    }
}

module.exports = isLoggedIn