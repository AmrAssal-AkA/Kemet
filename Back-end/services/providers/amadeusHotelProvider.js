const amadeusAPI = require("../../config/amadeus");

exports.search = async (params) => {
  const { cityCode, checkInDate, checkOutDate, adults = 1, rooms = 1 } = params;


  const hotelListRes = await amadeusAPI.referenceData.locations.hotels.byCity.get({
    cityCode: cityCode.toUpperCase(),
  });

  const hotelData = Array.isArray(hotelListRes) ? hotelListRes : hotelListRes?.data || [];
  if (hotelData.length === 0) return [];

  const hotelIds = hotelData.slice(0, 20).map((h) => h.hotelId).filter(Boolean);
  if (hotelIds.length === 0) return [];

  // Get offers
  const offersRes = await amadeusAPI.shopping.hotelOffersSearch.get({
    hotelIds: hotelIds.join(","),
    checkInDate,
    checkOutDate,
    roomQuantity: parseInt(rooms) || 1,
    adults: parseInt(adults) || 1,
    currency: "EGP",
    bestRateOnly: true,
  });

  const hotelOffers = Array.isArray(offersRes) ? offersRes : offersRes?.data || [];

  // Index hotel metadata for quick lookup
  const metaById = {};
  for (const h of hotelData) {
    if (h.hotelId) metaById[h.hotelId] = h;
  }

  return hotelOffers.map((offer) => {
    const meta = metaById[offer.hotel?.hotelId] || {};
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
      vendors: [{ name: "Amadeus Network", price }],
      rawData: offer,
    };
  });
};
