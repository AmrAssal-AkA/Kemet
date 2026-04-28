const axios = require("axios");
require("dotenv").config();

const flightApiKey = process.env.Flight_API_KEY;

if (!flightApiKey) {
  console.error("Flight API key is missing in environment variables");
  process.exit(1);
}

// FlightAPI.io — One-way trip client
const onewayClient = axios.create({
  baseURL: `https://api.flightapi.io/onewaytrip/${flightApiKey}`,
  timeout: 30000,
});

// FlightAPI.io — Round-trip client
const roundtripClient = axios.create({
  baseURL: `https://api.flightapi.io/roundtrip/${flightApiKey}`,
  timeout: 30000,
});

module.exports = { onewayClient, roundtripClient };
