const amadeusAPI = require("../../services/amadeus");

const SearchHotel = async (req, res) => {
  const { cityCode, checkInDate, checkOutDate, NumberOfGuests, NumberOfrooms } =
    req.body;
  if (
    !cityCode ||
    !checkInDate ||
    !checkOutDate ||
    !NumberOfGuests ||
    !NumberOfrooms
  ) {
    return res.status(400).json({
      error:
        "Missing required query parameters. Please provide cityCode, checkInDate, checkOutDate, NumberOfGuests, and NumberOfrooms.",
    });
  }
  try {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const now = new Date();

    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
      return res.status(400).json({
        error: "Invalid date format. Please use YYYY-MM-DD format.",
      });
    }

    if (checkIn < now) {
      return res.status(400).json({
        error: "Check-in date must be in the future.",
      });
    }

    if (checkOut <= checkIn) {
      return res.status(400).json({
        error: "Check-out date must be after check-in date.",
      });
    }
  } catch (error) {
    return res.status(400).json({
      error: "Invalid date format. Please use YYYY-MM-DD format.",
    });
  }

  try {
    console.log(`[SearchHotel] Searching hotels for cityCode: ${cityCode}`);
    const HotelResponse =
      await amadeusAPI.referenceData.locations.hotels.byCity.get({
        cityCode,
      });

    // HotelResponse is already the data from API, not wrapped in .data
    const hotelData = Array.isArray(HotelResponse)
      ? HotelResponse
      : HotelResponse?.data || [];

    if (!hotelData || hotelData.length === 0) {
      console.log(
        `[SearchHotel] No hotels found for cityCode: ${cityCode}`,
      );
      return res.status(404).json({
        error: `No hotels found for city code: ${cityCode}`,
      });
    }

    const egyptianHotels = hotelData.filter((hotel) => {
      return (
        hotel.iataCode === cityCode &&
        (hotel.address?.countryCode === "EG" ||
          hotel.address?.countryCode === "Egypt" ||
          !hotel.address?.countryCode)
      );
    });

    const hotelIds = egyptianHotels.slice(0, 20).map((hotel) => hotel.hotelId);
    if (!hotelIds.length) {
      return res.status(404).json({
        error: "No Egyptian hotels found for the specified city code.",
      });
    }

    console.log(
      `[SearchHotel] Found ${hotelIds.length} hotels, fetching offers...`,
    );
    const Response = await amadeusAPI.shopping.hotelOffersSearch.get({
      hotelIds: hotelIds.join(","),
      checkInDate,
      checkOutDate,
      roomQuantity: parseInt(NumberOfrooms) || 1,
      adults: parseInt(NumberOfGuests) || 1,
      currency: "EGP",
    });

    const hotelOffers = Array.isArray(Response)
      ? Response
      : Response?.data || [];

    if (!hotelOffers || hotelOffers.length === 0) {
      return res.status(404).json({
        error: "No hotel offers found for the specified criteria.",
      });
    }
    console.log(`[SearchHotel] Found ${hotelOffers.length} hotel offers`);
    res.status(201).json(hotelOffers);
  } catch (error) {
    console.error(
      "Error fetching hotels data:",
      error.response?.data || error.message,
    );
    res.status(500).json({
      error: "Failed to fetch hotels data from the server",
      details: error.response?.data?.errors || error.message,
    });
  }
};

const getHotelOffers = async (req, res) => {
  try {
    const { hotelId, checkInDate, checkOutDate, adults } = req.query;

    if (!hotelId || !checkInDate || !checkOutDate || !adults) {
      return res.status(400).json({
        error:
          "Missing required query parameters. Please provide hotelId, checkInDate, checkOutDate, and adults.",
      });
    }

    const response = await amadeusAPI.shopping.hotelOffersSearch.get({
      hotelIds: hotelId,
      checkInDate,
      checkOutDate,
      adults: parseInt(adults) || 1,
      currency: "EGP",
    });
    const hotelOffers = Array.isArray(response)
      ? response
      : response?.data || [];
    res.status(200).json(hotelOffers);
  } catch (error) {
    console.error(
      "Error fetching hotel offers:",
      error.response?.data || error.message,
    );
    res.status(500).json({
      error: "Failed to fetch hotel offers from the server",
      details: error.response?.data?.errors || error.message,
    });
  }
};

module.exports = {
  SearchHotel,
  getHotelOffers
};
