const express = require("express")
const userRouter = express.Router();

userRouter.get("/",(req,res)=>{
    res.send("Welcome to user route");
})

module.exports = userRouter;