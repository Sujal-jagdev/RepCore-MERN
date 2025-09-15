const express = require("express")
const app = express()
require('dotenv').config()
const cors = require("cors")
const cookieParser = require("cookie-parser")
const dbConect = require("./Config/dbConnection")
const userRouter = require("./Routes/usersRouter")
const productRouter = require("./Routes/productsRouter")
const ownerRouter = require("./Routes/ownersRouter")
const paymentRouter = require("./Routes/paymentRouter")
const orderRouter = require("./Routes/orderRouter")
const isLoggedIn = require("./Middlewares/isLoggedin")

app.use(express.json())
app.use(cors({ 
    origin: process.env.FRONTEND_URL, 
    credentials: true 
}));
app.use(cookieParser())

app.use("/user", userRouter)
app.use("/product", productRouter)
app.use("/owner", ownerRouter)
app.use("/payment", paymentRouter)
app.use("/order", orderRouter)

app.listen(process.env.PORT, () => {
    console.log('Server Started Successfully')
})