const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    flight: {
      orderId: String,
      data: mongoose.Schema.Types.Mixed,
    },
    hotel: {
      orderId: String,
      data: mongoose.Schema.Types.Mixed,
    },
    trip: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "trip",
        required: true,
      },
    ],
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled"],
      default: "Pending",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
    totalPrice: {
      type: Number,
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
    },
    currency: {
      type: String,
      default: "EGP",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

module.exports =
  mongoose.models.Booking || mongoose.model("Booking", BookingSchema);
