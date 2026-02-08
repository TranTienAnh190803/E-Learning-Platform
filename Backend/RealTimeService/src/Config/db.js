import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL);
    console.log(`Connect MongoDB Successfully: ${conn.connection.name}`);
  } catch (error) {
    console.log(`Connect MongoDB Failed: ${error.message}`);
    process.exit(1);
  }
};
