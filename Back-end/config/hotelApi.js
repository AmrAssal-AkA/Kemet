const axios = require("axios");
require("dotenv").config();

const apiKey = process.env.HOTEL_MAKCORPS_KEY;
if (!apiKey) {
  console.error("MakCorps Hotel API key is missing");
  process.exit(1);
}

const hotelClient = axios.create({
  baseURL: "https://api.makcorps.com",
  timeout: 15000,
  params: { api_key: apiKey },
});

module.exports = { hotelClient };