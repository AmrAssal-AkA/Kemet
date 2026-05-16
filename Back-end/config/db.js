const mongoose = require("mongoose");
const dotenv = require("dotenv");
const logger = require("../services/logger");

dotenv.config();


if(!global.mongoose){
  global.mongoose = { conn: null, promise: null };
}
const cached = global.mongoose;

const connectDB = async () => {
  if (cached.conn) {
    logger.info("Using cached MongoDB connection");
    return cached.conn;
  }
    if(!cached.promise){
      logger.info("Creating new MongoDB connection");
      cached.promise = mongoose.connect(process.env.MONGO_URI, {
        family: 4,
        serverSelectionTimeoutMS: 5000,
        bufferCommands: false,
      });
    }
    try{
      cached.conn = await cached.promise;
      logger.info("MongoDB connected successfully");
    }
   catch (err) {
    logger.error("Error connecting to MongoDB:", err);
    cached.promise = null;
    throw err;
  }

  cached.conn = await cached.promise;
  return cached.conn;
};


module.exports = connectDB;
