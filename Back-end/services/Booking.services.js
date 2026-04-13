const Booking = require("../model/BookingSchema");
const Trip = require("../model/tripSchema");

const flightServices = require("./flight.services");
const hotelServices = require("./Hotel.services");

exports.createUnifiedBooking = async (data, userId) => {
  try {
    // Validate required inputs
    if (!userId) {
      throw new Error("User ID is required for booking");
    }

    if (!data || typeof data !== "object") {
      throw new Error("Valid booking data is required");
    }


    if (!data.flightOffer && !data.hotelOffer && !data.tripIds?.length) {
      throw new Error(
        "At least one of flight, hotel, or trip must be provided",
      );
    }

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

      if (!pricedFlight?.data?.[0]) {
        throw new Error("Invalid flight pricing response");
      }

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
      if (!data.hotelOffer.id || !data.guests || !data.payments) {
        throw new Error("Hotel booking requires id, guests, and payments");
      }

      const hotelOrder = await hotelServices.createHotelBooking(
        data.hotelOffer.id,
        data.guests,
        data.payments,
      );

      if (!hotelOrder?.price?.total) {
        throw new Error("Invalid hotel booking response");
      }

      hotelData = hotelOrder;
      totalPrice += Number(hotelOrder.price.total);
    }

    //  Trips
    if (data.tripIds?.length) {
      trips = await Trip.find({ _id: { $in: data.tripIds } });

      trips.forEach((trip) => {
        totalPrice += Number(trip.price);
      });
    }

    // Determine booking type
    let bookingType = "trips";
    if (data.flightOffer && data.hotelOffer) {
      bookingType = "FlightAndHotel";
    } else if (data.flightOffer) {
      bookingType = "Flight";
    } else if (data.hotelOffer) {
      bookingType = "Hotel";
    }

    // Save booking
    const booking = await Booking.create({
      user: userId,
      flight: flightData ? { orderId: flightData.id, data: flightData } : null,
      hotel: hotelData ? { orderId: hotelData.id, data: hotelData } : null,
      trip: trips.map((trip) => trip._id),
      totalPrice,
      currency,
      status: "Confirmed",
      details: { bookingType },
    });

    return booking;
  } catch (error) {
    console.error("Error creating unified booking:", error);
    throw error;
  }
};
