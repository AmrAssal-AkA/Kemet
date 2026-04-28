const amadeusProvider = require("./providers/amadeusFlightProvider");
const flightApiProvider = require("./providers/flightApiProvider");

const VALID_PROVIDERS = ["all", "amadeus", "flightapi"];

/**
 * @param {Object} params 
 * @param {string} params.origin 
 * @param {string} params.destination 
 * @param {string} params.departureDate 
 * @param {string} [params.returnDate] 
 * @param {number} [params.adults=1] 
 * @param {number} [params.children=0] 
 * @param {number} [params.infants=0]   
 * @param {string} [params.cabinClass="Economy"]
 * @param {string} [params.currency="EGP"] 
 * @returns {Promise<Object>}
 */
exports.searchFlights = async (params) => {
  const { provider = "all" } = params;

  if (!VALID_PROVIDERS.includes(provider)) {
    throw {
      status: 400,
      message: `Invalid provider "${provider}". Must be one of: ${VALID_PROVIDERS.join(", ")}`,
    };
  }

  const searchParams = {
    origin: params.origin,
    destination: params.destination,
    departureDate: params.departureDate,
    returnDate: params.returnDate || null,
    adults: params.adults || 1,
    children: params.children || 0,
    infants: params.infants || 0,
    cabinClass: params.cabinClass || "Economy",
    currency: params.currency || "USD",
  };

  console.log(
    `✈️  Flight search: ${searchParams.origin} → ${searchParams.destination} | ${searchParams.departureDate}${searchParams.returnDate ? ` ↔ ${searchParams.returnDate}` : ""} | Provider: ${provider}`,
  );

  const providerResults = {
    amadeus: { offers: [], error: null, responseTime: 0 },
    flightapi: { offers: [], error: null, responseTime: 0 },
  };

  // Determine which providers to query
  const promises = [];

  if (provider === "all" || provider === "amadeus") {
    promises.push(queryProvider("amadeus", amadeusProvider, searchParams, providerResults));
  }

  if (provider === "all" || provider === "flightapi") {
    promises.push(queryProvider("flightapi", flightApiProvider, searchParams, providerResults));
  }

  await Promise.allSettled(promises);

  const allOffers = [
    ...providerResults.amadeus.offers,
    ...providerResults.flightapi.offers,
  ].sort((a, b) => a.price.total - b.price.total);

  const type = searchParams.returnDate ? "roundtrip" : "oneway";

  return {
    type,
    totalOffers: allOffers.length,
    offers: allOffers,
    providers: {
      amadeus: {
        count: providerResults.amadeus.offers.length,
        responseTime: providerResults.amadeus.responseTime,
        error: providerResults.amadeus.error,
      },
      flightapi: {
        count: providerResults.flightapi.offers.length,
        responseTime: providerResults.flightapi.responseTime,
        error: providerResults.flightapi.error,
      },
    },
    searchParams: {
      origin: searchParams.origin,
      destination: searchParams.destination,
      departureDate: searchParams.departureDate,
      returnDate: searchParams.returnDate,
      adults: searchParams.adults,
      children: searchParams.children,
      infants: searchParams.infants,
      cabinClass: searchParams.cabinClass,
      currency: searchParams.currency,
    },
  };
};

async function queryProvider(name, providerModule, searchParams, results) {
  const start = Date.now();
  try {
    const offers = await providerModule.search(searchParams);
    results[name].offers = Array.isArray(offers) ? offers : [];
    results[name].responseTime = Date.now() - start;
    console.log(
      `${name}: ${results[name].offers.length} offers in ${results[name].responseTime}ms`,
    );
  } catch (error) {
    results[name].responseTime = Date.now() - start;
    results[name].error = extractErrorMessage(name, error);
    console.error(`${name} failed (${results[name].responseTime}ms):`, results[name].error);
  }
}

/**
 * @param {Object} flightOffer
 * @returns {Promise<Object>}
 */
exports.getFlightDetails = async (flightOffer) => {
  try {
    const priced = await amadeusProvider.priceOffer(flightOffer);
    return {
      source: "amadeus",
      pricingConfirmed: true,
      data: priced,
    };
  } catch (error) {
    console.error("Flight details error:", error.message);
    throw {
      status: error.response?.status || 500,
      message: "Failed to get flight details from Amadeus",
      data: error.response?.data || null,
    };
  }
};

/**
 * @param {Object} flightOffer
 * @returns {Promise<Object>}
 */
exports.priceFlightOffer = async (flightOffer) => {
  try {
    const pricedResult = await amadeusProvider.priceOffer(flightOffer);
    return {
      source: "amadeus",
      pricingConfirmed: true,
      data: pricedResult,
    };
  } catch (error) {
    console.error("Flight pricing error:", error.message);
    throw {
      status: error.response?.status || 500,
      message: "Failed to confirm flight pricing",
      data: error.response?.data || null,
    };
  }
};

/**
 * @param {Object} pricedOffer
 * @param {Object[]} travelers
 * @returns {Promise<Object>}
 */
exports.createFlightOrder = async (pricedOffer, travelers) => {
  try {
    const order = await amadeusProvider.createOrder(pricedOffer, travelers);
    return {
      source: "amadeus",
      booked: true,
      data: order,
    };
  } catch (error) {
    console.error("Flight booking error:", error.message);
    throw {
      status: error.response?.status || 500,
      message: "Failed to create flight booking order",
      data: error.response?.data || null,
    };
  }
};

function extractErrorMessage(providerName, error) {
  if (error.response?.data?.errors) {
    return `${providerName}: ${JSON.stringify(error.response.data.errors)}`;
  }
  if (error.response?.data?.message) {
    return `${providerName}: ${error.response.data.message}`;
  }
  if (error.response?.statusText) {
    return `${providerName}: ${error.response.status} ${error.response.statusText}`;
  }
  return `${providerName}: ${error.message || "Unknown error"}`;
}
