const amadeus = require("../../config/amadeus");

const CABIN_MAP = {
  Economy: "ECONOMY",
  Premium_Economy: "PREMIUM_ECONOMY",
  Business: "BUSINESS",
  First: "FIRST",
};

exports.search = async (params) => {
  const { origin, destination, departureDate, returnDate, adults = 1, children = 0, infants = 0, cabinClass = "Economy", currency = "EGP", maxResults = 50 } = params;

  const query = {
    originLocationCode: origin.toUpperCase(),
    destinationLocationCode: destination.toUpperCase(),
    departureDate,
    adults,
    currencyCode: currency.toUpperCase(),
    max: maxResults,
  };

  if (returnDate) query.returnDate = returnDate;
  if (children > 0) query.children = children;
  if (infants > 0) query.infants = infants;
  if (CABIN_MAP[cabinClass]) query.travelClass = CABIN_MAP[cabinClass];

  const response = await amadeus.shopping.flightOffersSearch.get(query);
  const offers = response.data || [];
  const dict = response.dictionaries || {};

  return offers.map((offer) => {
    const carriers = dict.carriers || {};


    const fareMap = {};
    for (const fd of offer.travelerPricings?.[0]?.fareDetailsBySegment || []) {
      fareMap[fd.segmentId] = fd;
    }

    const itineraries = (offer.itineraries || []).map((itin, i) => ({
      direction: i === 0 ? "outbound" : "return",
      duration: itin.duration || null,
      segments: (itin.segments || []).map((seg) => ({
        departure: { airport: seg.departure.iataCode, terminal: seg.departure.terminal || null, dateTime: seg.departure.at },
        arrival: { airport: seg.arrival.iataCode, terminal: seg.arrival.terminal || null, dateTime: seg.arrival.at },
        airline: {
          code: seg.carrierCode,
          name: carriers[seg.carrierCode] || seg.carrierCode,
          flightNumber: `${seg.carrierCode}${seg.number}`,
          operatingCarrier: seg.operating?.carrierCode || seg.carrierCode,
        },
        duration: seg.duration || null,
        cabin: fareMap[seg.id]?.cabin || null,
        stops: seg.numberOfStops || 0,
        aircraft: dict.aircraft?.[seg.aircraft?.code] || seg.aircraft?.code || null,
      })),
    }));

    const adultPricing = offer.travelerPricings?.find((tp) => tp.travelerType === "ADULT");

    return {
      id: offer.id,
      source: "amadeus",
      type: offer.itineraries?.length > 1 ? "roundtrip" : "oneway",
      price: {
        total: parseFloat(offer.price.total),
        currency: offer.price.currency,
        base: parseFloat(offer.price.base) || null,
        perAdult: adultPricing ? parseFloat(adultPricing.price?.total) : null,
        fees: offer.price.fees || [],
      },
      itineraries,
      validatingAirline: offer.validatingAirlineCodes?.[0] || null,
      bookableSeats: offer.numberOfBookableSeats || null,
      lastTicketingDate: offer.lastTicketingDate || null,
      bookingLinks: [],
      rawData: offer,
    };
  });
};

exports.priceOffer = async (flightOffer) => {
  if (!flightOffer?.id) throw new Error("priceOffer needs a valid flightOffer with an id");

  const response = await amadeus.shopping.flightOffersPrice.post({
    data: { type: "flight-offers-pricing", flightOffers: [flightOffer] },
  });
  return response.data;
};

exports.createOrder = async (pricedOffer, travelers) => {
  if (!pricedOffer || !travelers?.length) throw new Error("createOrder needs pricedOffer and travelers");

  const response = await amadeus.booking.flightOrders.post({
    data: { type: "flight-order", flightOffers: [pricedOffer], travelers },
  });
  return response.data;
};
