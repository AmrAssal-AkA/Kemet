const Booking = require("../model/BookingSchema");
const trip = require("../model/TripSchema");

const flightServices = require("./flight.services");
const hotelServices = require("./Hotel.services");

exports.createunifiedBooking = async (data, userId) => {
    let totalPrice =0;
    let currency = "EGP";

    let flightData = null;
    let hotelData = null;
    let trips = [];

    // Flight Booking
    if (data,flighOffer){
        const pricedFlight = await flightServices.priceFlightOffers(data.flighOffer);
        const flightOrder  = await flightServices.createFlightOrder(pricedFlight.data[0], data.travelers);
        flightData= flightOrder;
        totalPrice += Number(pricedFlight.data[0].price.total);
        currency = flightOrder.flighOffers[0].price.currency;
    }

    // Hotel Booking
    if (data.hotelOffer){
        const hotelOrder = await hotelServices.createHotelBooking(data.hotelOffer.id, data.guests, data.payments);
        hotelData = hotelOrder;
        totalPrice += Number(hotelOrder.price.total);
    }

    //  Trips
    if (data.tripIds?.length){
        trips = await trip.find({id: {$in: data.tripIds}});

        trips.forEach((trip)=> {
            totalPrice += Number(trip.price);
        })
    }

    // save booking

    return await Booking.create({
        userId,
        flight: flightData
        ? {orderId : flightData.id, data: flightData}
        : null,
        hotel: hotelData
        ? {orderId : hotelData.id, data: hotelData}
        : null,
        trips: trip.map((trip) => trip.id),
        totalPrice,
        currency,
        status: "confirmed"
    })
}