const amadeusProvider = require("./providers/amadeusHotelProvider");
const makcorpsProvider = require("./providers/HotelApiProvider");

exports.SearchCity = async (params) => {
  const { provider = "all" } = params;

  if (!["all", "amadeus", "makcorps"].includes(provider)) {
    throw { status: 400, message: `Invalid provider "${provider}". Use: all, amadeus, makcorps` };
  }

  const searchParams = {
    cityCode: params.cityCode,
    cityId: params.cityId,
    checkInDate: params.checkInDate,
    checkOutDate: params.checkOutDate,
    adults: params.NumberOfGuests || 1,
    rooms: params.NumberOfrooms || 1,
  };

  const results = { amadeus: null, makcorps: null };

  const promises = [];

  if (provider === "all" || provider === "amadeus") {
    promises.push(
      queryProvider("amadeus", () => amadeusProvider.search(searchParams))
        .then((r) => (results.amadeus = r))
    );
  }

  if (provider === "all" || provider === "makcorps") {
    promises.push(
      queryProvider("makcorps", () => makcorpsProvider.search(searchParams))
        .then((r) => (results.makcorps = r))
    );
  }

  await Promise.allSettled(promises);


  const allOffers = [
    ...(results.amadeus?.offers || []),
    ...(results.makcorps?.offers || []),
  ].sort((a, b) => a.price.total - b.price.total);

  return {
    success: true,
    totalOffers: allOffers.length,
    offers: allOffers,
    providers: {
      amadeus: results.amadeus ? { count: results.amadeus.offers.length, responseTime: results.amadeus.responseTime, error: results.amadeus.error } : undefined,
      makcorps: results.makcorps ? { count: results.makcorps.offers.length, responseTime: results.makcorps.responseTime, error: results.makcorps.error } : undefined,
    },
    searchParams,
  };
};

async function queryProvider(name, searchFn) {
  const start = Date.now();
  try {
    const offers = await searchFn();
    return { offers: Array.isArray(offers) ? offers : [], responseTime: Date.now() - start, error: null };
  } catch (error) {
    const msg = error.response?.data?.errors
      ? JSON.stringify(error.response.data.errors)
      : error.message || "Unknown error";
    return { offers: [], responseTime: Date.now() - start, error: `${name}: ${msg}` };
  }
}