const mongoose = require('mongoose');
const dotenv = require('dotenv');
const dns = require('dns');
dotenv.config();

dns.setServers(['8.8.8.8', '8.8.4.8']);

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI, {
            family: 4,
            serverSelectionTimeoutMS: 5000,
        });
        console.log("MongoDB connected successfully");
    }catch(err){
        console.log(err.message);
    }
}

module.exports = connectDB;