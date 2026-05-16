const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();

if (!process.env.Amadeus_API_KEY || !process.env.Amadeus_API_SECRET) {
  process.exit(1);
}

const baseURL = "https://test.api.amadeus.com";

let accessToken = null;
let tokenExpiration = null;

const fetchAccessToken = async () => {
  const response = await axios.post(
    `${baseURL}/v1/security/oauth2/token`,
    {
      grant_type: "client_credentials",
      client_id: process.env.Amadeus_API_KEY,
      client_secret: process.env.Amadeus_API_SECRET,
    },
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } },
  );

  accessToken = response.data.access_token;
  tokenExpiration = Date.now() + (response.data.expires_in || 3600) * 1000 - 60000;
  return accessToken;
};

const getAccessToken = async () => {
  if (!accessToken || Date.now() >= tokenExpiration) {
    await fetchAccessToken();
  }
  return accessToken;
};

const request = async (method, endpoint, params = {}, data = null) => {
  const token = await getAccessToken();

  const config = {
    method,
    url: `${baseURL}${endpoint}`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  if (method === "GET" && Object.keys(params).length > 0) {
    config.params = params;
  } else if (data) {
    config.data = data;
  }

  try {
    return await axios(config);
  } catch (error) {
    if (error.response?.status >= 500 || error.code === "ECONNABORTED") {
      await new Promise((r) => setTimeout(r, 1000));
      return await axios(config);
    }
    throw error;
  }
};

const amadeus = {
  referenceData: {
    locations: {
      hotels: {
        byCity: {
          get: async (params) => (await request("GET", "/v1/reference-data/locations/hotels/by-city", params)).data,
        },
      },
    },
  },
  shopping: {
    hotelOffersSearch: {
      get: async (params) => (await request("GET", "/v3/shopping/hotel-offers", params)).data,
    },
    flightOffersSearch: {
      get: async (params) => (await request("GET", "/v2/shopping/flight-offers", params)).data,
      post: async (data) => (await request("POST", "/v2/shopping/flight-offers", {}, data)).data,
    },
    flightOffersPrice: {
      post: async (data) => (await request("POST", "/v1/shopping/flight-offers/pricing", {}, data)).data,
    },
  },
  booking: {
    flightOrders: {
      post: async (data) => (await request("POST", "/v1/booking/flight-orders", {}, data)).data,
    },
  },
  testConnection: async () => {
    await getAccessToken();
    return { ok: true };
  },
};

module.exports = amadeus;
