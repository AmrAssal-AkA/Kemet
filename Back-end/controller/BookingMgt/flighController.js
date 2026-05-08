const FlightServices = require("../../services/flightServices");

exports.searchFlights = async (req, res, nxt) => {
  try {
    const provider = req.query.provider || "all";
    const searchParams = { ...req.body, provider };

    const searchResults = await FlightServices.searchFlights(searchParams);

    res.status(200).json({
      success: true,
      ...searchResults,
    });
  } catch (error) {
    nxt(error);
  }
};

exports.getFlightDetails = async (req, res, nxt) => {
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
    nxt(error);
  }
};

exports.priceFlightOffer = async (req, res, nxt) => {
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
    nxt(error);
  }
};

exports.createFlightOrder = async (req, res, nxt) => {
  try {
    const { pricedOffer, travelers } = req.body;

    if (!pricedOffer || !travelers?.length) {
      return res.status(400).json({
        success: false,
        message: "pricedOffer and at least one traveler are required",
      });
    }

    const order = await FlightServices.createFlightOrder(pricedOffer, travelers);

    res.status(201).json({
      success: true,
      ...order,
    });
  } catch (error) {
    nxt(error);
  }
};
