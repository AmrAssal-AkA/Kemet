const amadeus = require('./amadeus');

exports.priceFlightOffers = async (flightOffer) => {
    const response = await amadeus.shopping.flightOffers.pricing.post({
      data: {
        type: "flight-offers-pricing",
        flightOffers: [flightOffer],
      },
    });
    return response.data;
};

exports.createFlightOrder = async (flightOffers, travelers)=> {
    const response = await amadeus.booking.flightOrders.post({
      data: {
        type: "flight-order",
        flightOffers: [flightOffers],
        travelers,
      },
    });
    return response.data;
}
