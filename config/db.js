// config/db.js
import mongoose from 'mongoose';
import config from './config.js'; // Import MongoDB URL from config file

// Create and export a function to connect to the database
const connectDB = async () => {
    try {
        await mongoose.connect(config.mongodb_url);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1); // Exit the application if there's a connection error
    }
};

export default connectDB;