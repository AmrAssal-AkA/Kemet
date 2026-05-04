const { hotelClient } = require("../../config/hotelApi");

const getMakCorpsCityId = async (cityNameOrCode) => {
  try {
    const queryName = iataToCityName[cityNameOrCode] || cityNameOrCode;
    
    const response = await hotelClient.get("/mapping", {
      params: { name: queryName },
    });

    const data = response.data || [];
    

    const geoResult = data.find((item) => item.type === "GEO");
    
    if (geoResult && geoResult.document_id) {
      return geoResult.document_id;
    }
    

    if (data.length > 0 && data[0].document_id) {
      return data[0].document_id;
    }
    
    return null;
  } catch (error) {
    console.error(`[MakCorps] Failed to map city ${cityNameOrCode}:`, error.message);
    return null;
  }
};

exports.search = async (params) => {
  const { cityCode, checkInDate, checkOutDate, adults = 1, rooms = 1 } = params;

  const cityId = await getMakCorpsCityId(cityCode);
  
  if (!cityId) {
    console.warn(`[MakCorps] Could not resolve city ID for ${cityCode}`);
    return [];
  }

  console.log(`[MakCorps] Searching hotels for cityId: ${cityId}`);

  try {
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
  
    const hotels = data.filter((item) => item.hotelId);


    return hotels.map((hotel) => {
      let bestPriceStr = hotel.price1 || "$0";
      let bestPrice = parseFloat(bestPriceStr.replace(/[^0-9.]/g, ""));
      
      return {
        id: hotel.hotelId.toString(),
        source: "makcorps",
        name: hotel.name,
        geocode: hotel.geocode,
        rating: hotel.reviews?.rating || null,
        price: {
          total: bestPrice,
          currency: "EGP",
        },
        vendors: [
          { name: hotel.vendor1, price: hotel.price1 },
          { name: hotel.vendor2, price: hotel.price2 },
          { name: hotel.vendor3, price: hotel.price3 },
        ].filter(v => v.name && v.price),
        rawData: hotel,
      };
    });
  } catch (error) {
    console.error("[MakCorps] Search error:", error.response?.data || error.message);
    throw error;
  }
};
