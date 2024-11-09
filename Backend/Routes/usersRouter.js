const express = require("express");
const userRouter = express.Router();
require('dotenv').config()
const { signup, login, logout } = require("../Controllers/Auth");

userRouter.post("/signup", signup)
userRouter.post("/login", login)
userRouter.post("/logout", logout)

module.exports = userRouter;