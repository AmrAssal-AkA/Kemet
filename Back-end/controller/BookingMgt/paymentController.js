const Booking = require("../../model/BookingSchema");
const {
  sendEmail,
  BookingConfirmationTemplate,
} = require("../../services/miling");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const domain = process.env.DOMAIN;

const stripeCheckout = async (req, nxt) => {
  try {
    const bookingId = req.body.bookingId;
    const email = req.body.email;
    if (!bookingId) {
      throw new Error("Missing booking ID for payment session");
    }
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      throw new Error("Booking not found for payment session");
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: email,
      success_url: `${domain}/api/payments/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${domain}/api/payments/cancel?payment_fail=true`,
      metadata: { BookingId: bookingId, Email: email },
      line_items: req.body.items.map((item) => ({
        price_data: {
          currency: booking.currency,
          product_data: {
            name: item.name,
            description: item.description,
            images: [item.image],
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      })),
    });
    return session;
  } catch (err) {
    nxt(err);
  }
};

const success = async (req, res, nxt) => {
  try {
    return res.redirect(`${domain}/checkout?payment=done`);
  } catch (err) {
    nxt(err);
  }
};

const webhook = async (req, res, nxt) => {
  const signature = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    res.status(400).json({ message: "Webhook signature verification failed" });
    return;
  }
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const bookingId = session.metadata.BookingId;
    const email = session.metadata.Email;
    const paymentIntent = await stripe.paymentIntents.retrieve(
      session.payment_intent,
    );
    const charge = paymentIntent.charges.data[0];
    const paymentMethod = await stripe.paymentMethods.retrieve(
      charge.payment_method,
    );
    const cardDetails = paymentMethod.card;

    const updateBooking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        status: "Confirmed",
        paymentStatus: "Paid",
        stripeSessionId: session.id,
        stripePaymentIntentId: session.payment_intent,
        paymentCard: {
          brand: cardDetails.brand,
          last4: cardDetails.last4,
          expMonth: cardDetails.exp_month,
          expYear: cardDetails.exp_year,
        },
      },
      { new: true },
    );
  }
  if (updateBooking && email) {
    const BookingDetails = {
      bookingId: updateBooking._id,
      destination:
        updateBooking.flight?.data?.to ||
        updateBooking.hotel?.data?.location ||
        updateBooking.trip?.[0]?.destination ||
        "N/A",
      flight: updateBooking.flight?.data
        ? `${updateBooking.flight.data.airline} (${updateBooking.flight.data.flightNumber})`
        : "N/A",
      hotel: updateBooking.hotel?.data?.name || "N/A",
      travelDates:
        updateBooking.flight?.data?.departureDate &&
        updateBooking.flight?.data?.returnDate
          ? `${updateBooking.flight.data.departureDate} to ${updateBooking.flight.data.returnDate}`
          : updateBooking.hotel?.data?.checkInDate &&
              updateBooking.hotel?.data?.checkOutDate
            ? `${updateBooking.hotel.data.checkInDate} to ${updateBooking.hotel.data.checkOutDate}`
            : "N/A",
      travelers: updateBooking.guests?.length || 1,
      totalPrice: `${updateBooking.totalPrice} ${updateBooking.currency}`,
    };

    const BookingConfirmationEmail = BookingConfirmationTemplate(
      updateBooking.userName,
      BookingDetails,
    );
    await sendEmail(
      {
        to: email,
        subject: "Your Booking Confirmation - Kemet Travel",
        html: BookingConfirmationEmail,
      },
      res,
    );
  }
  res.status(200).json({ received: true });
};

const refundPayment = async (req, res, nxt) => {
  const { bookingId } = req.body;
  try {
    const booking = await Booking.findById(bookingId);
    if (!booking || !booking.stripePaymentIntentId) {
      throw new Error("Booking not found or missing payment intent ID");
    }

    const refund = await stripe.refunds.create({
      payment_intent: booking.stripePaymentIntentId,
    });

    if (refund.status === "succeeded") {
      booking.paymentStatus = "Refunded";
      await booking.save();
      return { success: true, message: "Payment refunded successfully" };
    } else {
      return { success: false, message: "Failed to process refund" };
    }
  } catch (error) {
    nxt(error);
    return { success: false, message: error.message };
  }
};

module.exports = { stripeCheckout, success, webhook, refundPayment };
