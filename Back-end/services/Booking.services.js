const Booking = require("../model/BookingSchema");
const Trip = require("../model/tripSchema");

const flightServices = require("./flight.services");
const hotelServices = require("./Hotel.services");

exports.createUnifiedBooking = async (data, userId) => {
  try {
    let totalPrice = 0;
    let currency = "EGP";

    let flightData = null;
    let hotelData = null;
    let trips = [];

    // Flight Booking
    if (data.flightOffer) {
      const pricedFlight = await flightServices.priceFlightOffers(
        data.flightOffer,
      );
      const flightOrder = await flightServices.createFlightOrder(
        pricedFlight.data[0],
        data.travelers,
      );
      flightData = flightOrder;
      totalPrice += Number(pricedFlight.data[0].price.total);
      currency = flightOrder.flightOffers[0].price.currency;
    }

    // Hotel Booking
    if (data.hotelOffer) {
      const hotelOrder = await hotelServices.createHotelBooking(
        data.hotelOffer.id,
        data.guests,
        data.payments,
      );
      hotelData = hotelOrder;
      totalPrice += Number(hotelOrder.price.total);
    }

    //  Trips
    if (data.tripIds?.length) {
      trips = await Trip.find({ id: { $in: data.tripIds } });

      trips.forEach((trip) => {
        totalPrice += Number(trip.price);
      });
    }

    let bookingType = "trips"; 
    if (data.flightOffer && data.hotelOffer) {
      bookingType = "Flight";
    } else if (data.flightOffer) {
      bookingType = "Flight";
    } else if (data.hotelOffer) {
      bookingType = "Hotel";
    }

    // save booking

    return await Booking.create({
      user: userId,
      BookingType: bookingType,
      flight: flightData ? { orderId: flightData.id, data: flightData } : null,
      hotel: hotelData ? { orderId: hotelData.id, data: hotelData } : null,
      trip: trips.map((trip) => trip._id),
      totalPrice,
      currency,
      status: "Confirmed",
    });
  } catch (error) {
    console.error("Error creating unified booking:", error);
    throw new Error("Failed to create booking. Please try again later.", { cause: error });
  }
};
