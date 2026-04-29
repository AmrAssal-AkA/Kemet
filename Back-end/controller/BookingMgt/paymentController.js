const { booking } = require("../../config/amadeus");
const { checkout } = require("../../routes/AddTripRoutes");
const Booking = require("../../model/BookingSchema");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const domain = process.env.DOMAIN;


const stripeCheckout = async (req) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            success_url: `${domain}/api/payments/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${domain}/api/payments/cancel?payment_fail=true`,
            metadata: {BookingId: req.body.bookingId},
            line_items: req.body.items.map(item => ({
                price_data: {
                    currency: "egp",
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
        console.error("Stripe checkout error:", err.message);
        res.status(500).json({error: err.message});
    }
};

const success = async (req, res) => {
    const {session_id} = req.query;

    try {
        const session = await stripe.checkout.sessions.retrieve(session_id);
        const customerEmail = session.customer_details.email;
        const {bookingId} = session.metadata;
        const date = new Date();

        if(bookingId){
            await Booking.findByIdAndUpdate(bookingId, {
                status: "Confirmed",
                paymentStatus: "Paid",
                stripeSessionId: session.id,
                stripePaymentIntentId: session.payment_intent
            })
        }
        res.redirect(`${domain}/checkout?payment=done`);

    } catch (err) {
        console.log(err);
        res.status(400).json({error: "Failed to retrieve payment session"});
    }
};


const refundPayment = async (bookingId) => {
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
        console.error("Refund error:", error.message);
        return { success: false, message: error.message };
    }
}

module.exports = {stripeCheckout, success, refundPayment};