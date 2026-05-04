const amadeusProvider = require("./providers/amadeusHotelProvider");
const makcorpsProvider = require("./providers/HotelApiProvider");

const VALID_PROVIDERS = ["all", "amadeus", "makcorps"];

exports.SearchCity = async (params) => {
  const { provider = "all" } = params;

  if (!VALID_PROVIDERS.includes(provider)) {
    throw {
      status: 400,
      message: `Invalid provider "${provider}". Must be one of: ${VALID_PROVIDERS.join(", ")}`,
    };
  }

  const searchParams = {
    cityCode: params.cityCode,
    checkInDate: params.checkInDate,
    checkOutDate: params.checkOutDate,
    adults: params.NumberOfGuests || 1,
    rooms: params.NumberOfrooms || 1,
  };

  console.log(`🏨 Hotel Search: ${searchParams.cityCode} | ${searchParams.checkInDate} to ${searchParams.checkOutDate} | Provider: ${provider}`);

  const providerResults = {
    amadeus: { offers: [], error: null, responseTime: 0 },
    makcorps: { offers: [], error: null, responseTime: 0 },
  };

  const promises = [];

  if (provider === "all" || provider === "amadeus") {
    promises.push(queryProvider("amadeus", amadeusProvider, searchParams, providerResults));
  }

  if (provider === "all" || provider === "makcorps") {
    promises.push(queryProvider("makcorps", makcorpsProvider, searchParams, providerResults));
  }


  await Promise.allSettled(promises);


  const allOffers = [
    ...providerResults.amadeus.offers,
    ...providerResults.makcorps.offers,
  ].sort((a, b) => a.price.total - b.price.total); 

  return {
    success: true,
    totalOffers: allOffers.length,
    offers: allOffers,
    providers: {
      amadeus: {
        count: providerResults.amadeus.offers.length,
        responseTime: providerResults.amadeus.responseTime,
        error: providerResults.amadeus.error,
      },
      makcorps: {
        count: providerResults.makcorps.offers.length,
        responseTime: providerResults.makcorps.responseTime,
        error: providerResults.makcorps.error,
      },
    },
    searchParams,
  };
};

async function queryProvider(name, providerModule, searchParams, results) {
  const start = Date.now();
  try {
    const offers = await providerModule.search(searchParams);
    results[name].offers = Array.isArray(offers) ? offers : [];
    results[name].responseTime = Date.now() - start;
    console.log(`✅ ${name} hotels: ${results[name].offers.length} offers in ${results[name].responseTime}ms`);
  } catch (error) {
    results[name].responseTime = Date.now() - start;
    results[name].error = extractErrorMessage(name, error);
    console.error(`❌ ${name} failed (${results[name].responseTime}ms):`, results[name].error);
  }
}

function extractErrorMessage(providerName, error) {
  if (error.response?.data?.errors) {
    return `${providerName}: ${JSON.stringify(error.response.data.errors)}`;
  }
  if (error.response?.data?.message) {
    return `${providerName}: ${error.response.data.message}`;
  }
  return `${providerName}: ${error.message || "Unknown error"}`;
}