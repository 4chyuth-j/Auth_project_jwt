import mongoose from "mongoose";

export const connectDB = async()=>{
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB connected:${connect.connection.host}✅✅`)
    } catch (error) {
        console.log("Error in connecting to MongoDB❌❌:",error);
        process.exit(1); // 1 this means failure. If the code was 0, it means success
    }
}