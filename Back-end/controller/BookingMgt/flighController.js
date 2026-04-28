const FlightServices = require("../../services/flightServices");


exports.searchFlights = async (req, res) => {
  try {
    const provider = req.query.provider || "all";
    const searchParams = { ...req.body, provider };


    const searchResults = await FlightServices.searchFlights(searchParams);

    res.status(200).json({
      success: true,
      ...searchResults,
    });
  } catch (error) {
    console.error("Flight Search Error:", error);
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "An error occurred while searching for flights",
      data: error.data || null,
    });
  }
};


exports.getFlightDetails = async (req, res) => {
  try {
    const { flightOffer } = req.body;

    if (!flightOffer) {
      return res.status(400).json({
        success: false,
        message: "flightOffer object is required in the request body",
      });
    }

    const details = await FlightServices.getFlightDetails(flightOffer);

    res.status(200).json({
      success: true,
      ...details,
    });
  } catch (error) {
    console.error("Flight Details Error:", error);
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Failed to get flight details",
      data: error.data || null,
    });
  }
};


exports.priceFlightOffer = async (req, res) => {
  try {
    const { flightOffer } = req.body;

    if (!flightOffer) {
      return res.status(400).json({
        success: false,
        message: "flightOffer object is required in the request body",
      });
    }

    const pricingResult = await FlightServices.priceFlightOffer(flightOffer);

    res.status(200).json({
      success: true,
      ...pricingResult,
    });
  } catch (error) {
    console.error("Flight Pricing Error:", error);
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Failed to confirm flight pricing",
      data: error.data || null,
    });
  }
};
