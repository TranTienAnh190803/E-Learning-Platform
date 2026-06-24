import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL);
    console.log(`✅ [MONGODB] Connect DB Successfully: ${conn.connection.name}`);
  } catch (error) {
    console.log(`❌ [MONGODB] Connect MongoDB Failed: ${error.message}`);
    process.exit(1);
  }
};
