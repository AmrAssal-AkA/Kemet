const { hotelClient } = require("../../config/hotelApi");

const iataToCityName = {
  CAI: "Cairo",
  HRG: "Hurghada",
  SSH: "Sharm El Sheikh",
  LXR: "Luxor",
  ASW: "Aswan",
  ALY: "Alexandria",
  DXB: "Dubai",
  RUH: "Riyadh",
  JED: "Jeddah",
  IST: "Istanbul",
  LHR: "London",
  CDG: "Paris",
  JFK: "New York",
};

exports.search = async (params) => {
  const { cityCode, cityId: directCityId, checkInDate, checkOutDate, adults = 1, rooms = 1 } = params;

  let cityId = directCityId || null;

  // Resolve city ID via /mapping only if not provided directly
  if (!cityId) {
    const cityName = iataToCityName[cityCode] || cityCode;
    try {
      const mappingRes = await hotelClient.get("/mapping", {
        params: { api_key: process.env.HOTEL_MAKCORPS_KEY, name: cityName },
      });
      const mappingData = Array.isArray(mappingRes.data) ? mappingRes.data : [];
      const geoResult = mappingData.find((item) => item.type === "GEO");
      cityId = geoResult?.document_id || mappingData[0]?.document_id || null;

      if (!cityId) {
        console.warn(`[MakCorps] /mapping returned no city ID for "${cityName}". Raw:`, mappingData);
        return [];
      }
    } catch (err) {
      console.error(
        `[MakCorps] /mapping failed for "${cityName}":`,
        err.response?.status,
        JSON.stringify(err.response?.data),
      );
      return [];
    }
  }

  // Search hotels by city ID
  const searchParams = {
    api_key: process.env.HOTEL_MAKCORPS_KEY,
    cityid: cityId,
    pagination: "0",
    cur: "USD",
    rooms: String(parseInt(rooms) || 1),
    adults: String(parseInt(adults) || 1),
    checkin: checkInDate,
    checkout: checkOutDate,
  };

  console.log(`[MakCorps] Searching cityId=${cityId}`, searchParams);

  const response = await hotelClient.get("/city", { params: searchParams });
  const data = Array.isArray(response.data) ? response.data : [];

  return data
    .filter((item) => item.hotelId)
    .map((hotel) => ({
      id: hotel.hotelId.toString(),
      source: "makcorps",
      name: hotel.name,
      geocode: hotel.geocode,
      rating: hotel.reviews?.rating || null,
      price: {
        total: parseFloat((hotel.price1 || "0").replace(/[^0-9.]/g, "")) || 0,
        currency: "USD",
      },
      vendors: [
        { name: hotel.vendor1, price: hotel.price1 },
        { name: hotel.vendor2, price: hotel.price2 },
        { name: hotel.vendor3, price: hotel.price3 },
      ].filter((v) => v.name && v.price),
      rawData: hotel,
    }));
};
