const express = require("express")
const app = express()
require('dotenv').config()
const cors = require("cors")
const cookieParser = require("cookie-parser")
const userRouter = require("./Routes/usersRouter")
const productRouter = require("./Routes/productsRouter")
const ownerRouter = require("./Routes/ownersRouter")

app.use(express.json())
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(cookieParser())

app.use("/user", userRouter)
app.use("/product", productRouter)
app.use("/owner", ownerRouter)

app.listen(process.env.PORT || 3000, () => {
    console.log('Server Started Successfully')
})