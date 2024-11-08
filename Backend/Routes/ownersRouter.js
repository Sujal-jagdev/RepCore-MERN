const express = require("express")
const ownerRouter = express.Router();

ownerRouter.get("/",(req,res)=>{
    res.send("Welcome to Owner route");
})

module.exports = ownerRouter;