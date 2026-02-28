const amadeusAPI = require("../services/amadeus");
const validateFlightSearch = require("../middleware/FlightDestinationMW");

const searchFlights = async (req, res) => {
  const {
    origin,
    destination,
    departureDate,
    returnDate,
    adults,
    children = 0,
    infants = 0,
    travelClass = "ECONOMY",
  } = req.body;


  try {

    if (!origin || !destination || !departureDate || !adults) {
      return res.status(400).json({
        error: "Missing required parameters",
        required: ["origin", "destination", "departureDate", "adults"],
        received: { origin, destination, departureDate, adults },
      });
    }

    const searchParams = {
      originLocationCode: origin.toUpperCase(),
      destinationLocationCode: destination.toUpperCase(),
      departureDate: departureDate,
      adults: parseInt(adults),
      currencyCode: "EGP",
    };

    if (returnDate) searchParams.returnDate = returnDate;
    if (children > 0) searchParams.children = parseInt(children);
    if (infants > 0) searchParams.infants = parseInt(infants);
    if (travelClass && travelClass !== "ECONOMY")
      searchParams.travelClass = travelClass;

    console.log("Search parameters:", JSON.stringify(searchParams, null, 2));

    const response = await amadeusAPI.shopping.flightOffersSearch.get(searchParams);

    console.log(` API Response received. Status: ${response.status}`);
    console.log(`Found ${response.data?.length || 0} flight offers`);

    if (response.data && response.data.length > 0) {
      console.log(
        ` First flight: ${response.data[0].itineraries[0].segments[0].departure.iataCode} → ${response.data[0].itineraries[0].segments[0].arrival.iataCode}`,
      );
      console.log(
        ` Price: ${response.data[0].price.total} ${response.data[0].price.currency}`,
      );
    } else {
      console.log(" No flights found - empty response.data array");
    }

    res.status(201).json({
      success: true,
      data: response.data || [],
      meta: {
        count: response.data?.length || 0,
        searchParams: {
          route: `${origin} → ${destination}`,
          date: returnDate ? `${departureDate} → ${returnDate}` : departureDate,
          passengers: {
            adults: parseInt(adults),
            children: parseInt(children),
            infants: parseInt(infants),
          },
          flight:
            response.data?.length > 0
              ? response.data[0].itineraries[0].segments[0].carrierCode
              : "N/A",
          class: travelClass,
        },
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error(
      "Flight search error:",
      error.response?.data || error.message,
    );
    
    const errorMessage =
      error.response?.data?.errors?.[0]?.detail ||
      error.response?.data?.error_description ||
      error.message ||
      "An error occurred while searching for flights";

    const statusCode = error.response?.status || 500;

    res.status(statusCode).json({
      success: false,
      error: errorMessage,
      details: error.response?.data?.errors || null,
      searchParams: req.body,
      timestamp: new Date().toISOString(),
    });
  }
};

const flightOfferPricing = async (req, res) => {
  const { flightOffers } = req.body;

  if (!flightOffers) {
    return res.status(400).json({
      error: "flightOffers is required in request body",
      example: {
        flightOffers: ["<flight-offer-object-from-search>"],
      },
    });
  }

  if (!Array.isArray(flightOffers) || flightOffers.length === 0) {
    return res.status(400).json({
      error: "flightOffers must be a non-empty array",
      received: typeof flightOffers,
    });
  }

  // Validate flightOffer structure
  for (let i = 0; i < flightOffers.length; i++) {
    const offer = flightOffers[i];
    if (!offer.id || !offer.itineraries || !offer.price) {
      return res.status(400).json({
        error: `Invalid flight offer structure at index ${i}`,
        required: ["id", "itineraries", "price"],
      });
    }
  }

  console.log(` Processing pricing for ${flightOffers.length} flight offer(s)`);

  try {
    const response = await amadeusAPI.shopping.flightOffers.pricing.post({
      data: {
        type: "flight-offers-pricing",
        flightOffers: flightOffers,
      },
    });

    console.log(
      ` Pricing confirmed for ${response.data.flightOffers?.length || 0} offers`,
    );

    res.status(200).json({
      ...response.data,
      meta: {
        pricingTimestamp: new Date().toISOString(),
        offersProcessed: flightOffers.length,
        currency: response.data.flightOffers?.[0]?.price?.currency || "EGP",
      },
    });
  } catch (error) {
    console.error(
      " Flight pricing error:",
      error.response?.data || error.message,
    );

    const errorMessage =
      error.response?.data?.errors?.[0]?.detail ||
      error.response?.data?.error_description ||
      error.message ||
      "An error occurred while confirming flight pricing";

    const statusCode = error.response?.status || 500;

    res.status(statusCode).json({
      error: errorMessage,
      details: error.response?.data?.errors || null,
      timestamp: new Date().toISOString(),
      troubleshooting: {
        hint:
          statusCode === 400
            ? "Check that flight offers are from recent search results"
            : "Check API credentials and network connectivity",
      },
    });
  }
};

const createFlightOrder = async (req, res) => {
  const { flightOffers, travelers, contacts } = req.body;

  console.log(
    ` Creating flight order for ${travelers?.length || 0} traveler(s)`,
  );

  if (!flightOffers || !travelers || !contacts) {
    return res.status(400).json({
      error: "flightOffers, travelers, and contacts are required",
      required: {
        flightOffers: "Array of flight offers from pricing",
        travelers: "Array of traveler details",
        contacts: "Contact information object",
      },
    });
  }

  try {
    const response = await amadeusAPI.booking.flightOrders.post({
      data: {
        type: "flight-order",
        flightOffers: flightOffers,
        travelers: travelers,
        contacts: contacts,
      },
    });

    console.log(` Flight order created: ${response.data.id}`);

    res.status(201).json({
      ...response.data,
      meta: {
        bookingTimestamp: new Date().toISOString(),
        orderReference: response.data.id,
        status: "confirmed",
      },
    });
  } catch (error) {
    console.error(
      " Flight booking error:",
      error.response?.data || error.message,
    );

    const errorMessage =
      error.response?.data?.errors?.[0]?.detail ||
      error.response?.data?.error_description ||
      error.message ||
      "An error occurred while creating the flight order";

    const statusCode = error.response?.status || 500;

    res.status(statusCode).json({
      error: errorMessage,
      details: error.response?.data?.errors || null,
      timestamp: new Date().toISOString(),
    });
  }
};

module.exports = {
  searchFlights,
  flightOfferPricing,
  createFlightOrder,
  validateFlightSearch,
};
