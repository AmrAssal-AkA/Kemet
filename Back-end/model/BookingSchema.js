const mongoose = require("mongoose");
const guestSchema = require("./guestSchema");

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    guests: {
      type: [guestSchema],
      required: true,
    },
    flight: {
      orderId: String,
      data: {
        from: String,
        to: String,
        departureDate: Date,
        returnDate: Date,
        airline: String,
        flightNumber: String,
      },
    },
    hotel: {
      orderId: String,
      data: {
        name: String,
        location: String,
        checkInDate: Date,
        checkOutDate: Date,
      },
    },
    trip: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Trip",
      },
    ],
    tripSchedule: {
      date: Date,
      startTime: String,
      endTime: String,
      dayofweek: String,
    },
    assignedGuide: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Guide",
      default: null,
    },
    PassportNumber: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^[A-Z0-9]{5,9}$/.test(v);
        },
      },
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled"],
      default: "Pending",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Refunded", "PartiallyRefunded"],
      default: "Pending",
    },
    paymentDate: Date,
    stripeSessionId: String,
    stripePaymentIntentId: String,
    refundedAmount: {
      type: Number,
      default: 0,
    },
    refunds: [
      {
        refundId: String,
        amount: Number,
        date: Date,
        reason: String,
      },
    ],
    paymentError: {
      code: String,
      message: String,
      timestamp: Date,
    },
    stripeSessionId: {
      type: String,
      default: null,
    },
    stripePaymentIntentId: {
      type: String,
      default: null,
    },
    paymentCard:{
      brand: String,
      last4: String,
      expMonth: Number,
      expYear: Number,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "EGP",
    },
    details: {
      bookingType: {
        type: String,
        enum: ["Flight", "Hotel", "Trip", "FlightAndHotel", "Mixed"],
        default: "Trip",
      },
    },
    passportImages: [
      {
        url: String,
        cloudinaryId: String,
      },
    ],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Booking", bookingSchema);
