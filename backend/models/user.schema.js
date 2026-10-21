import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    endpointId:{
        type:String,
        required:true,
        unique:true,
        index:true
    },
    payload:{
        type:mongoose.Schema.Types.Mixed,
        required:true
    },
},{timestamps:true})

export const userModel = mongoose.model("userModel",userSchema)