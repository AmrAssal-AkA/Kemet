const axios = require("axios");
require("dotenv").config();

const key = process.env.Flight_API_KEY;
if (!key) {
  console.error("Flight API key is missing");
  process.exit(1);
}

const onewayClient = axios.create({
  baseURL: `https://api.flightapi.io/onewaytrip/${key}`,
  timeout: 500000,
});

const roundtripClient = axios.create({
  baseURL: `https://api.flightapi.io/roundtrip/${key}`,
  timeout: 500000,
}); 

module.exports = { onewayClient, roundtripClient };
