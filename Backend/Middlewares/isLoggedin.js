const jwt = require("jsonwebtoken");
require('dotenv').config()

const isLoggedIn = (req, res, next) => {
    // Check for token in cookies or Authorization header
    const cookieToken = req.cookies.token;
    const headerToken = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
    const token = cookieToken || headerToken;

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
        res.status(400).json({ message: "SomeThing Went Wrong while Authenticate User",error })
    }
}

module.exports = isLoggedIn