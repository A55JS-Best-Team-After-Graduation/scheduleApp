import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Ensure that MONGODB_URI is defined
const mongoURI: string = process.env.MONGODB_URI || '';

const connectDB = async (): Promise<void> => {
  try {
    // Connect to MongoDB with current Mongoose options
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully.');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;
