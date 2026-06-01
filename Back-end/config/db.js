const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const logger = require("../services/logger");

let isConnected = false;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      bufferTimeoutMS: 30000,
      maxPoolSize: 5,
      minPoolSize: 1,
      socketTimeoutMS: 45000,
      retryWrites: true,
      retryReads: true,
    });
    isConnected = true;
    logger.info("MongoDB connected successfully");
    return conn;
  } catch (err) {
    isConnected = false;
    logger.error("Error connecting to MongoDB:", err);
    throw err;
  }
};

const isDBConnected = () => {
  return isConnected && mongoose.connection.readyState === 1;
};

module.exports = { connectDB, isDBConnected };
