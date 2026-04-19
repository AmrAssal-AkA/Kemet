const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    stripePaymentId: {
      type: String,
      required: true,
      unique: true,
    },
    stripeCustomerId: {
      type: String,
      default: null,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "egp",
    },
    status: {
      type: String,
      enum: ["pending", "succeeded", "failed", "refunded", "canceled"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      default: null,
    },
    receiptUrl: {
      type: String,
      default: null,
    },
    refundId: {
      type: String,
      default: null,
    },
    metadata: {
      type: Object,
      default: {},
    },
  },
  {timestamps: true}
);

module.exports = mongoose.model("Payment", paymentSchema);