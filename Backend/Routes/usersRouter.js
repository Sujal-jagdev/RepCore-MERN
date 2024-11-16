const express = require("express");
const userRouter = express.Router();
require('dotenv').config()
const { signup, login, logout, profile } = require("../Controllers/Auth");
const isLoggedIn = require("../Middlewares/isLoggedin");

userRouter.post("/signup", signup)
userRouter.post("/login", login)
userRouter.get("/logout", logout)

userRouter.get("/profile", isLoggedIn, profile)

module.exports = userRouter;