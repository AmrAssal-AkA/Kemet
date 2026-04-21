const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();

if (!process.env.Amadeus_API_KEY || !process.env.Amadeus_API_SECRET) {
  console.error(
    " Amadeus API credentials are missing in environment variables",
  );
  process.exit(1);
}

const isProduction = process.env.NODE_ENV === "production";
const baseURL = isProduction
  ? "https://api.amadeus.com"
  : "https://test.api.amadeus.com";

console.log(
  ` Initializing Amadeus client for ${isProduction ? "PRODUCTION" : "TEST"} environment`,
);

let accessToken = null;
let tokenExpiration = null;

const fetchAccessToken = async () => {
  try {
    const response = await axios.post(
      `${baseURL}/v1/security/oauth2/token`,
      {
        grant_type: "client_credentials",
        client_id: process.env.Amadeus_API_KEY,
        client_secret: process.env.Amadeus_API_SECRET,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );

    accessToken = response.data.access_token;
    const expiresIn = response.data.expires_in || 3600;
    tokenExpiration = Date.now() + expiresIn * 1000;

    console.log(" Amadeus access token fetched successfully");
    return accessToken;
  } catch (error) {
    console.error(
      " Failed to fetch Amadeus access token:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

const getAccessToken = async () => {
  if (!accessToken || !tokenExpiration || Date.now() >= tokenExpiration) {
    await fetchAccessToken();
  }
  return accessToken;
};

const makeAuthenticatedRequest = async (
  method,
  endpoint,
  params = {},
  data = null,
  retries = 0,
  maxRetries = 3,
) => {
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
    const response = await axios(config);
    return response;
  } catch (error) {
    console.error(`Amadeus API Error (${endpoint}):`, {
      status: error.response?.status,
      statusText: error.response?.statusText,
      errors: error.response?.data?.errors,
      message: error.message,
      params,
      attempt: retries + 1,
      maxRetries,
    });

    if (
      retries < maxRetries &&
      (error.response?.status >= 500 || error.code === "ECONNABORTED")
    ) {
      const delayMs = Math.pow(2, retries) * 1000; 
      console.log(
        `Retrying Amadeus API call (attempt ${retries + 2}/${maxRetries + 1}) after ${delayMs}ms...`,
      );
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      return makeAuthenticatedRequest(
        method,
        endpoint,
        params,
        data,
        retries + 1,
        maxRetries,
      );
    }

    throw error;
  }
};

const amadeus = {
  referenceData: {
    locations: {
      hotels: {
        byCity: {
          get: async (params) => {
            const response = await makeAuthenticatedRequest(
              "GET",
              "/v1/reference-data/locations/hotels/by-city",
              params,
            );
            return response.data;
          },
        },
      },
    },
  },
  shopping: {
    hotelOffersSearch: {
      get: async (params) => {
        const response = await makeAuthenticatedRequest(
          "GET",
          "/v3/shopping/hotel-offers",
          params,
        );
        return response.data;
      },
    },
    flightOffersSearch: {
      get: async (params) => {
        const response = await makeAuthenticatedRequest(
          "GET",
          "/v2/shopping/flight-offers",
          params,
        );
        return response.data;
      },
    },
  },
};

const testConnection = async () => {
  try {
    await getAccessToken();
    console.log("Amadeus API connection successful");
  } catch (error) {
    console.error(
      " Amadeus API connection failed:",
      error.response?.data || error.message,
    );
    if (error.response?.status === 401) {
      console.error(" Check your API credentials in the .env file");
    }
  }
};

if (process.env.NODE_ENV !== "test") {
  testConnection();
}

module.exports = amadeus;