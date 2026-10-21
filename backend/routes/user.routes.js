import express from "express"
import { generate, servePayload } from "../controllers/user.controller.js"

const userRouter = express.Router()

userRouter.post("/generate",generate)
userRouter.get('/mock/:endpointId', servePayload)

export default userRouter