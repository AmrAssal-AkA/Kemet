const amadeus = require("../../config/amadeus");


const CABIN_CLASS_MAP = {
  Economy: "ECONOMY",
  Premium_Economy: "PREMIUM_ECONOMY",
  Business: "BUSINESS",
  First: "FIRST",
};

/**
 * @param {Object} params 
 * @returns {Promise<Object[]>} 
 */
exports.search = async (params) => {
  const {
    origin,
    destination,
    departureDate,
    returnDate,
    adults = 1,
    children = 0,
    infants = 0,
    cabinClass = "Economy",
    currency = "USD",
    maxResults = 50,
  } = params;

  const queryParams = {
    originLocationCode: origin.toUpperCase(),
    destinationLocationCode: destination.toUpperCase(),
    departureDate,
    adults,
    currencyCode: currency.toUpperCase(),
    max: maxResults,
  };

  if (returnDate) {
    queryParams.returnDate = returnDate;
  }

  if (children > 0) {
    queryParams.children = children;
  }

  if (infants > 0) {
    queryParams.infants = infants;
  }

  const travelClass = CABIN_CLASS_MAP[cabinClass];
  if (travelClass) {
    queryParams.travelClass = travelClass;
  }

  console.log(" Amadeus search params:", queryParams);

  const response = await amadeus.shopping.flightOffersSearch.get(queryParams);
  const offers = response.data || [];
  const dictionaries = response.dictionaries || {};

  return offers.map((offer) => normalizeAmadeusOffer(offer, dictionaries));
};

/**
 * @param {Object} flightOffer
 * @returns {Promise<Object>}
 */
exports.priceOffer = async (flightOffer) => {
  if (!flightOffer || !flightOffer.id) {
    throw new Error("priceOffer: a valid flightOffer object with an id is required");
  }

  try {
    const response = await amadeus.shopping.flightOffersPrice.post({
      data: {
        type: "flight-offers-pricing",
        flightOffers: [flightOffer],
      },
    });
    return response.data;
  } catch (error) {
    const amadeusErrors = error.response?.data?.errors;
    if (amadeusErrors) {
      console.error("[amadeusFlightProvider] priceOffer - Amadeus errors:", JSON.stringify(amadeusErrors, null, 2));
      const first = amadeusErrors[0];
      throw Object.assign(new Error(first?.detail || first?.title || "Amadeus pricing error"), {
        amadeusCode: first?.code,
        amadeusStatus: first?.status,
        amadeusErrors,
      });
    }
    throw error;
  }
};

/**
 * @param {Object} pricedOffer
 * @param {Object[]} travelers
 * @returns {Promise<Object>}
 */
exports.createOrder = async (pricedOffer, travelers) => {
  if (!pricedOffer || !travelers?.length) {
    throw new Error("createOrder: pricedOffer and at least one traveler are required");
  }

  try {
    const response = await amadeus.booking.flightOrders.post({
      data: {
        type: "flight-order",
        flightOffers: [pricedOffer],
        travelers,
      },
    });
    return response.data;
  } catch (error) {
    const amadeusErrors = error.response?.data?.errors;
    if (amadeusErrors) {
      console.error("[amadeusFlightProvider] createOrder - Amadeus errors:", JSON.stringify(amadeusErrors, null, 2));
      const first = amadeusErrors[0];
      throw Object.assign(new Error(first?.detail || first?.title || "Amadeus booking error"), {
        amadeusCode: first?.code,
        amadeusStatus: first?.status,
        amadeusErrors,
      });
    }
    throw error;
  }
};

/**
 * @param {Object} offer 
 * @param {Object} dictionaries 
 * @returns {Object}
 */
function normalizeAmadeusOffer(offer, dictionaries) {
  const carriers = dictionaries.carriers || {};

  const itineraries = (offer.itineraries || []).map((itin, index) => {
    const segments = (itin.segments || []).map((seg) => ({
      departure: {
        airport: seg.departure.iataCode,
        terminal: seg.departure.terminal || null,
        dateTime: seg.departure.at,
      },
      arrival: {
        airport: seg.arrival.iataCode,
        terminal: seg.arrival.terminal || null,
        dateTime: seg.arrival.at,
      },
      airline: {
        code: seg.carrierCode,
        name: carriers[seg.carrierCode] || seg.carrierCode,
        flightNumber: `${seg.carrierCode}${seg.number}`,
        operatingCarrier: seg.operating?.carrierCode || seg.carrierCode,
      },
      duration: seg.duration || null,
      cabin:
        offer.travelerPricings?.[0]?.fareDetailsBySegment?.find(
          (f) => f.segmentId === seg.id,
        )?.cabin || null,
      stops: seg.numberOfStops || 0,
      aircraft: dictionaries.aircraft?.[seg.aircraft?.code] || seg.aircraft?.code || null,
    }));

    return {
      direction: index === 0 ? "outbound" : "return",
      duration: itin.duration || null,
      segments,
    };
  });

  return {
    id: offer.id,
    source: "amadeus",
    type: offer.itineraries?.length > 1 ? "roundtrip" : "oneway",
    price: {
      total: parseFloat(offer.price.total),
      currency: offer.price.currency,
      base: parseFloat(offer.price.base) || null,
      perAdult:
        parseFloat(
          offer.travelerPricings?.find((tp) => tp.travelerType === "ADULT")
            ?.price?.total,
        ) || null,
      fees: offer.price.fees || [],
    },
    itineraries,
    validatingAirline: offer.validatingAirlineCodes?.[0] || null,
    bookableSeats: offer.numberOfBookableSeats || null,
    lastTicketingDate: offer.lastTicketingDate || null,
    bookingLinks: [],
    rawData: offer,
  };
}
