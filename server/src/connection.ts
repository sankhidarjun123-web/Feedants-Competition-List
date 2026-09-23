import mongoose from "mongoose";

const connectDB = async () => {
    try {
        // Replace with your local MongoDB URI or MongoDB Atlas connection string
        const dbURI = process.env.MONGODB_URI as string;

        console.log("Connecting with MongoDB....")
        const conn = await mongoose.connect(dbURI);

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {

        if (error instanceof Error) {
            console.error(`Database connection error: ${error.message}`);
            process.exit(1); // Exit process with failure
        }
    }
};

export default connectDB;
