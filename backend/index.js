import dotenv from "dotenv"
dotenv.config()
import express from "express"
import connectToMongoDB from "./DB/db.js"
import userRouter from "./routes//user.routes.js"
import cors from "cors"

const app = express()
const PORT = process.env.PORT || 8000

const corsOption = {
    origin:"http://localhost:5173",
    credentials:true
}

// All the middlewares
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors(corsOption))



// All the APIS
app.use("/api",userRouter)


app.listen(PORT,()=>{
    connectToMongoDB()
    console.log("server is running")
})