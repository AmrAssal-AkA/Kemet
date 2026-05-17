const HotelServices = require("../../services/HotelServices");
const amadeusAPI = require("../../config/amadeus");

const SearchHotel = async (req, res, nxt) => {
  const {
    cityCode,
    cityId,
    checkInDate,
    checkOutDate,
    NumberOfGuests,
    NumberOfrooms,
    provider = "all",
  } = req.body;

  if (!cityCode && !cityId) {
    return res.status(400).json({
      error:
        "Missing required fields. Please provide cityCode or cityId.",
    });
  }
  if (!checkInDate || !checkOutDate || !NumberOfGuests || !NumberOfrooms) {
    return res.status(400).json({
      error:
        "Missing required fields. Please provide cityCode, checkInDate, checkOutDate, NumberOfGuests, and NumberOfrooms.",
    });
  }

  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
    return res.status(400).json({ error: "Invalid date format. Use YYYY-MM-DD." });
  }
  if (checkIn < today) {
    return res.status(400).json({ error: "Check-in date must be today or in the future." });
  }
  if (checkOut <= checkIn) {
    return res.status(400).json({ error: "Check-out date must be after check-in date." });
  }

  try {
    const searchResults = await HotelServices.SearchCity({
      cityCode,
      cityId,
      checkInDate,
      checkOutDate,
      NumberOfGuests,
      NumberOfrooms,
      provider,
    });

    return res.status(200).json(searchResults);
  } catch (error) {
    nxt(error);
  }
};

const getHotelOffers = async (req, res, nxt) => {
  const { hotelId, checkInDate, checkOutDate, adults } = req.query;

  if (!hotelId || !checkInDate || !checkOutDate || !adults) {
    return res.status(400).json({
      error:
        "Missing required query parameters: hotelId, checkInDate, checkOutDate, adults.",
    });
  }

  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
    return res.status(400).json({ error: "Invalid date format. Use YYYY-MM-DD." });
  }
  if (checkIn < today) {
    return res.status(400).json({ error: "Check-in date must be today or in the future." });
  }
  if (checkOut <= checkIn) {
    return res.status(400).json({ error: "Check-out date must be after check-in date." });
  }

  try {
    const response = await amadeusAPI.shopping.hotelOffersSearch.get({
      hotelIds: hotelId,
      checkInDate,
      checkOutDate,
      adults: parseInt(adults) || 1,
      currency: "EGP",
    });

    const hotelOffers = Array.isArray(response) ? response : response?.data || [];

    if (hotelOffers.length === 0) {
      return res.status(404).json({ error: "No offers found for this hotel." });
    }

    return res.status(200).json({
      success: true,
      count: hotelOffers.length,
      offers: hotelOffers,
    });
  } catch (error) {
    nxt(error);
  }
};

module.exports = { SearchHotel, getHotelOffers };