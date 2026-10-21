import mongoose, { mongo } from 'mongoose';

const connectDb = async() =>{
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Mongo DB connection successfully")
    }catch(err){
        console.log("Mongo connection error :",err)
    }
}

export default connectDb

