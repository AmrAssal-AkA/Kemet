const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const logger = require("../services/logger");


const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    logger.info("MongoDB connected successfully")
    return conn;
  } catch (err) {
    logger.error("Error connecting to MongoDB:", err.message);
    throw err;
  }
};



module.exports = connectDB;
