const Booking = require("../../model/BookingSchema");
const {
  sendEmail,
  BookingConfirmationTemplate,
} = require("../../services/miling");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const backendUrl = process.env.BACKEND_URL || "http://localhost:8000";
const frontendUrl = process.env.DOMAIN || "http://localhost:3000";

function getBookingIdFromSession(session) {
  return session?.metadata?.BookingId || session?.metadata?.bookingId;
}

function isPaidCheckoutSession(session) {
  return session?.payment_status === "paid" || session?.status === "complete";
}

async function markBookingPaidFromSession(session) {
  const bookingId = getBookingIdFromSession(session);
  if (!bookingId || !isPaidCheckoutSession(session)) return null;

  return Booking.findByIdAndUpdate(
    bookingId,
    {
      paymentStatus: "Paid",
      stripeSessionId: session.id,
      stripePaymentIntentId: session.payment_intent,
      paymentDate: new Date(),
    },
    { new: true, runValidators: true, context: "query" },
  );
}

const stripeCheckout = async (req, res, next) => {
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

    let items = req.body.items;
    if (!Array.isArray(items)) {
      items = [];
    }
    if (items.length === 0) {
      throw new Error("Booking must have at least one item for checkout");
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: email,
      success_url: `${backendUrl}/api/payments/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/api/payments/cancel?payment_fail=true`,
      metadata: { BookingId: bookingId, Email: email },
      line_items: items.map((item) => ({
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
    throw err;
  }
};

const success = async (req, res, nxt) => {
  try {
    const sessionId = req.query.session_id;
    let bookingStatus = "Pending";
    let paymentStatus = "Pending";

    if (sessionId) {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      const paidBooking = await markBookingPaidFromSession(session);

      if (paidBooking) {
        bookingStatus = paidBooking.status;
        paymentStatus = paidBooking.paymentStatus;
      }
    }

    const params = new URLSearchParams({
      paymentStatus,
      bookingStatus,
    });

    if (sessionId) {
      params.set("session_id", sessionId);
    }

    return res.redirect(`${frontendUrl}/booking-status?${params.toString()}`);
  } catch (err) {
    nxt(err);
  }
};

const webhook = async (req, res) => {
  const signature = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch {
    res.status(400).json({ message: "Webhook signature verification failed" });
    return;
  }
  let updateBooking = null;
  let email = "";

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    email = session.metadata?.Email || session.metadata?.email || "";

    updateBooking = await markBookingPaidFromSession(session);
    if (updateBooking && session.payment_intent) {
      try {
        const paymentIntent = await stripe.paymentIntents.retrieve(
          session.payment_intent,
        );
        const charge = paymentIntent.charges?.data?.[0];

        if (charge?.payment_method) {
          const paymentMethod = await stripe.paymentMethods.retrieve(
            charge.payment_method,
          );
          const cardDetails = paymentMethod.card;

          if (cardDetails) {
            updateBooking.paymentCard = {
              brand: cardDetails.brand,
              last4: cardDetails.last4,
              expMonth: cardDetails.exp_month,
              expYear: cardDetails.exp_year,
            };
            await updateBooking.save();
          }
        }
      } catch {
        console.warn("Booking payment saved, but card details could not be stored.");
      }
    }
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
