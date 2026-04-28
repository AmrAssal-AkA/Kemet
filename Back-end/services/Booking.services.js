const Booking = require("../model/BookingSchema");
const Trip = require("../model/tripSchema");
const flightServices = require("./flightServices");
const hotelServices = require("./HotelServices");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const DOMAIN = process.env.DOMAIN || "http://localhost:3000";

exports.createUnifiedBooking = async (data, userId) => {
  if (!userId) throw new Error("User must be logged in to complete booking.");
  if (!data || typeof data !== "object") throw new Error("Valid booking data is required");
  if (!data.flightOffer && !data.hotelOffer && !data.tripIds?.length) {
    throw new Error("At least one of flight, hotel, or trip must be provided");
  }

  let totalPrice = 0;   
  let currency = "EGP";
  let flightData = null;
  let hotelData = null;
  let trips = [];
  const lineItems = [];

  // ── Flight 
  if (data.flightOffer) {
    const pricingResult = await flightServices.priceFlightOffer(data.flightOffer);
    const pricedOffer = pricingResult?.data;

    if (!pricedOffer) throw new Error("Invalid flight pricing response from Amadeus");

    if (!data.travelers?.length) throw new Error("Traveler info is required for flight booking");
    const flightOrder = await flightServices.createFlightOrder(pricedOffer, data.travelers);
    flightData = flightOrder?.data;

    const flightPrice = Number(pricedOffer.price?.total || 0);
    totalPrice += flightPrice;
    currency = pricedOffer.price?.currency || currency;

    lineItems.push({
      price_data: {
        currency: currency.toLowerCase(),
        product_data: {
          name: `Flight: ${data.flightOffer.itineraries?.[0]?.segments?.[0]?.departure?.iataCode || "?"} → ${
            data.flightOffer.itineraries?.[0]?.segments?.at(-1)?.arrival?.iataCode || "?"
          }`,
          description: `${data.travelers?.length || 1} passenger(s)`,
        },
        unit_amount: Math.round(flightPrice * 100),
      },
      quantity: 1,
    });
  }

  // ── Hotel 
  if (data.hotelOffer) {
    if (!data.hotelOffer.id || !data.guests || !data.payments) {
      throw new Error("Hotel booking requires hotelOffer.id, guests, and payments");
    }

    if (typeof hotelServices.createHotelBooking === "function") {
      const hotelOrder = await hotelServices.createHotelBooking(
        data.hotelOffer.id,
        data.guests,
        data.payments,
      );
      if (!hotelOrder?.price?.total) throw new Error("Invalid hotel booking response");
      hotelData = hotelOrder;
      totalPrice += Number(hotelOrder.price.total);

      lineItems.push({
        price_data: {
          currency: currency.toLowerCase(),
          product_data: {
            name: `Hotel: ${data.hotelOffer.name || data.hotelOffer.id}`,
            description: `${data.guests?.length || 1} guest(s)`,
          },
          unit_amount: Math.round(Number(hotelOrder.price.total) * 100),
        },
        quantity: 1,
      });
    }
  }

  // ── Trips 
  if (data.tripIds?.length) {
    trips = await Trip.find({ _id: { $in: data.tripIds } });
    if (!trips.length) throw new Error("No trips found for the provided IDs");

    trips.forEach((trip) => {
      const tripPrice = Number(trip.price);
      totalPrice += tripPrice;
      lineItems.push({
        price_data: {
          currency: currency.toLowerCase(),
          product_data: {
            name: `Trip: ${trip.name}`,
            description: trip.description?.slice(0, 120) || "",
          },
          unit_amount: Math.round(tripPrice * 100),
        },
        quantity: 1,
      });
    });
  }

  // ── Booking type
  let bookingType = "Trip";
  if (data.flightOffer && data.hotelOffer) bookingType = "FlightAndHotel";
  else if (data.flightOffer && data.tripIds?.length) bookingType = "Mixed";
  else if (data.flightOffer) bookingType = "Flight";
  else if (data.hotelOffer) bookingType = "Hotel";

  // ── Save pending booking 
  const booking = await Booking.create({
    userId,
    flight: flightData ? { orderId: flightData.id, data: flightData } : undefined,
    hotel: hotelData ? { orderId: hotelData.id, data: hotelData } : undefined,
    trip: trips.map((t) => t._id),
    totalPrice,
    currency,
    status: "Pending",
    paymentStatus: "Pending",
    details: { bookingType },
  });

  // ── Stripe Checkout Session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    success_url: `${DOMAIN}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${DOMAIN}/payment/cancel?booking_id=${booking._id}`,
    metadata: { bookingId: booking._id.toString(), userId: userId.toString() },
    line_items: lineItems,
  });

  // Attach stripe session to booking
  booking.stripeSessionId = session.id;
  await booking.save();

  return {
    bookingId: booking._id,
    checkoutUrl: session.url,
    totalPrice,
    currency,
    status: "Pending",
    paymentStatus: "Pending",
  };
};

exports.confirmPayment = async (sessionId) => {
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== "paid") {
    throw new Error(`Payment not completed. Stripe status: ${session.payment_status}`);
  }

  const { bookingId } = session.metadata;
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new Error("Booking not found");

  booking.paymentStatus = "Paid";
  booking.status = "Confirmed";
  booking.stripePaymentIntentId = session.payment_intent;
  await booking.save();

  return booking;
};


exports.getBookingById = async (bookingId, userId) => {
  const booking = await Booking.findOne({ _id: bookingId, userId })
    .populate("trip")
    .lean();
  if (!booking) throw new Error("Booking not found");
  return booking;
};


exports.getUserBookings = async (userId) => {
  return Booking.find({ userId }).populate("trip").sort({ createdAt: -1 }).lean();
};


exports.cancelBooking = async (bookingId, userId) => {
  const booking = await Booking.findOne({ _id: bookingId, userId });
  if (!booking) throw new Error("Booking not found");
  if (booking.status === "Cancelled") throw new Error("Booking is already cancelled");

  booking.status = "Cancelled";
  await booking.save();
  return booking;
};
