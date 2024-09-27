import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const dbURI = process.env.DB_URI;

const connectDB = async () => {
    try {
        if (!dbURI) {
            throw new Error("DB_URI is not defined in .env file");
        }

        await mongoose.connect(dbURI);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

export default connectDB;
