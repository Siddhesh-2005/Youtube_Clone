import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app=express()

//middlewares

//allowing frontend from another origin to communicate 
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

//informing server that we are accepting data in json  
app.use(express.json({
    limit:"16kb"
}))

//accepting data through url
app.use(express.urlencoded({
    extended:true,//extended means nested object
    limit:"16kb",             
}))

//allows to access the public files like img,favicon,etc
app.use(express.static("public"))

//to perform crud ops on cookies present on user's browser
app.use(cookieParser())

//Routes
import userRouter from "./routes/user.route.js"

app.use("/api/v1/users",userRouter)

export {app}