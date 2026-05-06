const Booking = require("../../model/BookingSchema");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const domain = process.env.DOMAIN;


const stripeCheckout = async (req, res, nxt) => {
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
            metadata: {BookingId: bookingId, Email: email},
            line_items: req.body.items.map(item => ({
                price_data: {
                    currency: booking.currency,
                    product_data: {
                        name: item.name,
                        description: item.description,
                        images: [item.image]
                    },
                    unit_amount: item.price * 100
                },
                quantity: item.quantity
            }))
        });
        return session;

    } catch (err) {
        nxt(err);
    }
};

const success = async (req, res, nxt) => {
    const {session_id} = req.query;

    try {
        const session = await stripe.checkout.sessions.retrieve(session_id);
        const customerEmail = session.customer_details.email;
        const { BookingId: bookingId } = session.metadata;
        const date = new Date();

        if(bookingId){
            await Booking.findByIdAndUpdate(bookingId, {
                status: "Confirmed",
                paymentStatus: "Paid",
                stripeSessionId: session.id,
                stripePaymentIntentId: session.payment_intent
            })
        }
        return res.redirect(`${domain}/checkout?payment=done`);

    } catch (err) {
        nxt(err);
    }
};


const refundPayment = async (bookingId , res, nxt) => {
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
}

module.exports = {stripeCheckout, success, refundPayment};