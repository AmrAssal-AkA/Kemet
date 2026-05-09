const mongoose = require("mongoose");
const dotenv = require("dotenv");
const logger = require("../services/logger");
dotenv.config();


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      family: 4,
      serverSelectionTimeoutMS: 5000,
    });
    logger.info("MongoDB connected successfully");
  } catch (err) {
    logger.error("Error connecting to MongoDB:", err);
  }
};

module.exports = connectDB;
