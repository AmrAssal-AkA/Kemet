const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Payment = require("../model/paymentSchema");

// Create payment 
exports.createPayment = async ({ userId, bookingId, amount, currency = "egp", metadata = {} }) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount,        
    currency,
    metadata: { userId: userId.toString(), bookingId: bookingId.toString(), ...metadata },
  });

  const payment = await Payment.create({
    userId,
    bookingId,
    stripePaymentId: paymentIntent.id,
    amount,
    currency,
    status: "pending",
    metadata,
  });

  return {clientSecret: paymentIntent.client_secret, payment};
};

// Confirm payment 
exports.confirmPayment = async (paymentId) => {
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentId);

  const payment = await Payment.findOneAndUpdate(
    { stripePaymentId: paymentId },
    {
      status: paymentIntent.status === "succeeded" ? "succeeded" : "failed",
      paymentMethod: paymentIntent.payment_method_types?.[0] || null,
      receiptUrl: paymentIntent.latest_charge
        ? (await stripe.charges.retrieve(paymentIntent.latest_charge)).receipt_url
        : null,
    },
    {new: true}
  );
  return payment;
};

// Refund payment
exports.refundPayment = async (paymentId, amount = null) => {
  const payment = await Payment.findOne({ stripePaymentId: paymentId });
  if (!payment) throw new Error("Payment record not found");
  if (payment.status !== "succeeded") throw new Error("Only succeeded payments can be refunded");

  const refundOptions = {payment_intent: paymentId};
  if (amount) refundOptions.amount = amount;

  const refund = await stripe.refunds.create(refundOptions);

  const updated = await Payment.findOneAndUpdate(
    {stripePaymentId: paymentId},
    {status: "refunded", refundId: refund.id},
    {new: true}
  );

  return updated;
};

// Get all payments
exports.getUserPayments = async (userId) => {
  return await Payment.find({userId}).populate("bookingId").sort({createdAt: -1});
};

// Get a single payment Id
exports.getPaymentById = async (paymentId) => {
  return await Payment.findOne({stripePaymentId: paymentId}).populate("bookingId");
};