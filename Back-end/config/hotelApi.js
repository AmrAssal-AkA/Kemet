const axios = require("axios");
require("dotenv").config();

const apiKey = process.env.HOTEL_MAKCORPS_KEY;



const hotelClient = axios.create({
  baseURL: "https://api.makcorps.com",
  timeout: 15000,
  params: {
    api_key: apiKey,
  },
});

module.exports = { hotelClient };