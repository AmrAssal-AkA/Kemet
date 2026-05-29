const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const logger = require("../services/logger");

const connectDB = async () => {
  try {
      const conn = await mongoose.connect(process.env.MONGO_URI);
      logger.info("MongoDB connected successfully");
    return conn;
  } catch (err) {
    logger.error("Error connecting to MongoDB:", err);
    process.exit(1);
    throw err;
  }
};


module.exports = connectDB;
