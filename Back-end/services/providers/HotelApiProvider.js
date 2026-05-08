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
  const { cityCode, checkInDate, checkOutDate, adults = 1, rooms = 1 } = params;

 
  const cityName = iataToCityName[cityCode] || cityCode;
  const mappingRes = await hotelClient.get("/mapping", { params: { name: cityName } });
  const mappingData = mappingRes.data || [];

  const geoResult = mappingData.find((item) => item.type === "GEO");
  const cityId = geoResult?.document_id || mappingData[0]?.document_id || null;
  if (!cityId) return [];


  const response = await hotelClient.get("/city", {
    params: {
      cityid: cityId,
      pagination: 0,
      cur: "EGP",
      rooms: parseInt(rooms) || 1,
      adults: parseInt(adults) || 1,
      checkin: checkInDate,
      checkout: checkOutDate,
    },
  });

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
        total: parseFloat((hotel.price1 || "$0").replace(/[^0-9.]/g, "")),
        currency: "EGP",
      },
      vendors: [
        { name: hotel.vendor1, price: hotel.price1 },
        { name: hotel.vendor2, price: hotel.price2 },
        { name: hotel.vendor3, price: hotel.price3 },
      ].filter((v) => v.name && v.price),
      rawData: hotel,
    }));
};
