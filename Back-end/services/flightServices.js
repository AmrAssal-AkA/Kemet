const amadeusProvider = require("./providers/amadeusFlightProvider");
const flightApiProvider = require("./providers/flightApiProvider");

exports.searchFlights = async (params) => {
  const { provider = "all" } = params;

  if (!["all", "amadeus", "flightapi"].includes(provider)) {
    throw { status: 400, message: `Invalid provider "${provider}". Use: all, amadeus, flightapi` };
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
    currency: params.currency || "EGP",
  };

  const results = { amadeus: null, flightapi: null };


  const promises = [];

  if (provider === "all" || provider === "amadeus") {
    promises.push(
      queryProvider("amadeus", () => amadeusProvider.search(searchParams))
        .then((r) => (results.amadeus = r))
    );
  }

  if (provider === "all" || provider === "flightapi") {
    promises.push(
      queryProvider("flightapi", () => flightApiProvider.search(searchParams))
        .then((r) => (results.flightapi = r))
    );
  }

  await Promise.allSettled(promises);

  // Merge and sort by price
  const allOffers = [
    ...(results.amadeus?.offers || []),
    ...(results.flightapi?.offers || []),
  ].sort((a, b) => a.price.total - b.price.total);

  return {
    type: searchParams.returnDate ? "roundtrip" : "oneway",
    totalOffers: allOffers.length,
    offers: allOffers,
    providers: {
      amadeus: results.amadeus ? { count: results.amadeus.offers.length, responseTime: results.amadeus.responseTime, error: results.amadeus.error } : undefined,
      flightapi: results.flightapi ? { count: results.flightapi.offers.length, responseTime: results.flightapi.responseTime, error: results.flightapi.error } : undefined,
    },
    searchParams,
  };
};

exports.getFlightDetails = async (flightOffer) => {
  const priced = await amadeusProvider.priceOffer(flightOffer);
  return { source: "amadeus", pricingConfirmed: true, data: priced };
};

exports.priceFlightOffer = async (flightOffer) => {
  const result = await amadeusProvider.priceOffer(flightOffer);
  return { source: "amadeus", pricingConfirmed: true, data: result };
};

exports.createFlightOrder = async (pricedOffer, travelers) => {
  const order = await amadeusProvider.createOrder(pricedOffer, travelers);
  return { source: "amadeus", booked: true, data: order };
};

// Wraps a provider call with timing and error handling
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
