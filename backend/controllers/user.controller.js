import { userModel } from "../models/user.schema.js"
import crypto from "node:crypto"

// generate the json api
export const generate = async(req,res) => {
    try {
        const jsonData = req.body

        if(!jsonData || typeof jsonData !== "object"){
            return res.status(400).json({
                message:"Invalid payload must provide a valid JSON"
            })
        }

        const endpointId = crypto.randomBytes(3).toString('hex')

        const user = new userModel({
            endpointId,
            payload:jsonData
        })

        await user.save()

        res.status(201).json({
            success:true,
            endpointId,
            userURL : `http://localhost:${process.env.PORT || 5000}/api/mock/${endpointId}`
        })

    } catch (error) {
        console.log(`upload error : ${error}`)
    }
}

// serve payload controller 
export const servePayload = async(req,res) => {
    try {
        const endpointId = req.params.endpointId

        const mockData = await userModel.findOne({endpointId})

        if(!mockData){
            return status(404).json({
                message:"Mock endpoint not found"
            })
        }

        res.status(200).json(mockData)

    } catch (error) {
        return res.status(500).json({
            message:"Serve error retriving the Mock API"
        })
    }
}
