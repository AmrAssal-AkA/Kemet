const amadeus = require("../../services/amadeus");
const FlightService = require("../../services/flight.services");

// search for flights
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

    const response = await amadeus.shopping.flightOffersSearch.get(searchParams);

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

// price a flight offer

const priceFlight = async (req, res) => {
  try {
    const flightOffer = req.body.flightOffer || req.body.flightOffers;
    if (!flightOffer) {
      return res.status(400).json({ 
        success: false, 
        error: "Missing flightOffer in request body" 
      });
    }

    const pricedFlight = await FlightService.priceFlightOffers(flightOffer);
    
    // 3. Return success
    res.status(200).json({
      success: true,
      data: pricedFlight,
    });
  } catch (error) {
    console.error("Error pricing flight offer:", error.response?.data || error.message);

    const errorMessage =
      error.response?.data?.errors?.[0]?.detail ||
      error.message ||
      "An error occurred while pricing the flight offer.";

    const statusCode = error.response?.status || 500;

    res.status(statusCode).json({ 
      success: false,
      error: errorMessage,
      details: error.response?.data?.errors || null
    });
  }
};

module.exports = {
  searchFlights,
  priceFlight,
};