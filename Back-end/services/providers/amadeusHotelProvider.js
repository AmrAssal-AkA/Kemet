const amadeusAPI = require("../../config/amadeus");

exports.search = async (params) => {
  const { cityCode, checkInDate, checkOutDate, adults = 1, rooms = 1 } = params;

  try {
    console.log(`[Amadeus] Fetching hotels for cityCode: ${cityCode}`);


    const hotelListResponse = await amadeusAPI.referenceData.locations.hotels.byCity.get({
      cityCode: cityCode.toUpperCase(),
    });

    const hotelData = Array.isArray(hotelListResponse)
      ? hotelListResponse
      : hotelListResponse?.data || [];

    if (hotelData.length === 0) {
      return [];
    }


    const hotelIds = hotelData
      .slice(0, 20)
      .map((hotel) => hotel.hotelId)
      .filter(Boolean);

    if (hotelIds.length === 0) {
      return [];
    }

    console.log(`[Amadeus] Fetching offers for ${hotelIds.length} hotels...`);


    const offersResponse = await amadeusAPI.shopping.hotelOffersSearch.get({
      hotelIds: hotelIds.join(","),
      checkInDate,
      checkOutDate,
      roomQuantity: parseInt(rooms) || 1,
      adults: parseInt(adults) || 1,
      currency: "EGP",
      bestRateOnly: true,
    });

    const hotelOffers = Array.isArray(offersResponse)
      ? offersResponse
      : offersResponse?.data || [];

    return hotelOffers.map((offer) => {
      const meta = hotelData.find((h) => h.hotelId === offer.hotel?.hotelId) || {};
      
      const price = offer.offers?.[0]?.price?.total || 0;
      
      return {
        id: offer.hotel?.hotelId,
        source: "amadeus",
        name: offer.hotel?.name || meta.name,
        geocode: {
          latitude: offer.hotel?.latitude || meta.geoCode?.latitude,
          longitude: offer.hotel?.longitude || meta.geoCode?.longitude,
        },
        rating: offer.hotel?.rating || meta.rating || null,
        price: {
          total: parseFloat(price),
          currency: offer.offers?.[0]?.price?.currency || "EGP",
        },
        vendors: [
          { name: "Amadeus Network", price: price }
        ],
        rawData: offer,
      };
    });
  } catch (error) {
    const amadeusErrors = error.response?.data?.errors;
    console.error("[Amadeus] Search error:", amadeusErrors || error.message);
    throw error;
  }
};
