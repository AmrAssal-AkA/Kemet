const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const logger = require("../services/logger");

let isConnected = false;

const connectDB = async () => {
  // Return if already connected
  if (isConnected && mongoose.connection.readyState === 1) {
    logger.info("Using existing MongoDB connection");
    return mongoose.connection;
  }

  try {
    logger.info("Attempting MongoDB connection...");
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      bufferTimeoutMS: 30000,
      maxPoolSize: 5,
      minPoolSize: 1,
      socketTimeoutMS: 45000,
      retryWrites: true,
      retryReads: true,
      maxConnecting: 2,
    });
    isConnected = true;
    logger.info("MongoDB connected successfully");

    // Listen for connection events
    mongoose.connection.on("disconnected", () => {
      logger.warn("MongoDB disconnected");
      isConnected = false;
    });

    mongoose.connection.on("error", (err) => {
      logger.error("MongoDB connection error:", err.message);
      isConnected = false;
    });

    return conn;
  } catch (err) {
    isConnected = false;
    logger.error("Error connecting to MongoDB:", err.message);
    throw err;
  }
};

const isDBConnected = () => {
  const connected = isConnected && mongoose.connection.readyState === 1;
  if (!connected) {
    logger.debug(
      `DB connection status - isConnected: ${isConnected}, readyState: ${mongoose.connection.readyState}`,
    );
  }
  return connected;
};

module.exports = { connectDB, isDBConnected };
