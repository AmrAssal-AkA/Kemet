const amadeusAPI = require("../services/amadeus");


exports.SearchHotel = async (req, res) => {
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
    const HotelResponse =
      await amadeusAPI.referenceData.locations.hotels.byCity.get({
        cityCode,
      });

    const egyptianHotels = HotelResponse.data.filter((hotel) => {
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

    const Response = await amadeusAPI.shopping.hotelOffersSearch.get({
      hotelIds: hotelIds.join(","),
      checkInDate,
      checkOutDate,
      roomQuantity: parseInt(NumberOfrooms) || 1,
      adults: parseInt(NumberOfGuests) || 1,
      currency: "EGP",
    });

    if (!Response.data || Response.data.length === 0) {
      return res.status(404).json({
        error: "No hotel offers found for the specified criteria.",
      });
    }
    res.status(201).json(Response.data);
  } catch (error) {
    console.error("Error fetching hotels data:", error);
    res
      .status(500)
      .json({ error: "failed to fetch hotels data from the server" });
  }
};

exports.getHotelOffers = async (req, res) => {
  try {
    const { hotelId, checkInDate, checkOutDate, adults } = req.query;

    if(!hotelId || !checkInDate || !checkOutDate || !adults) {
      return res.status(400).json({
        error: "Missing required query parameters. Please provide hotelId, checkInDate, checkOutDate, and adults.",
      });
    }

    const response = await amadeusAPI.shopping.hotelOffersSearch.get({
      hotelIds: hotelId,
      checkInDate,
      checkOutDate,
      adults: parseInt(adults) || 1,
      currency: "EGP",
    });
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching hotel offers:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch hotel offers from the server" });
  }
}





