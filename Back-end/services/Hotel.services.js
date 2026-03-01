const amadeus = require("./amadeus");


exports.createHotelBooking = async (offerId, guests, payments) => {
    const response = await amadeus.shopping.hotelOrders.post({
        data: {
            offerId,
            guests,
            payments
        }
    });
    return response.data;
}