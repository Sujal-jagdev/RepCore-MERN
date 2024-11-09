const express = require("express")
const app = express()
require('dotenv').config()
const cors = require("cors")
const cookieParser = require("cookie-parser")
const dbConect = require("./Config/dbConnection")
const userRouter = require("./Routes/usersRouter")
const productRouter = require("./Routes/productsRouter")
const ownerRouter = require("./Routes/ownersRouter")
const isLoggedIn = require("./Middlewares/isLoggedin")

app.use(express.json())
app.use(cookieParser())
app.use(cors())

app.use("/user", userRouter)
app.use("/product", productRouter)
app.use("/owner", ownerRouter)

app.get("/shop", isLoggedIn, (req, res) => {
    res.send("Welcome to the shop")
})

app.listen(process.env.PORT, () => {
    console.log('Server Started Successfully')
})