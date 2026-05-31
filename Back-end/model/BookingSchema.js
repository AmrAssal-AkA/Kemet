const mongoose = require("mongoose");
const guestSchema = require("./guestSchema");

function isTodayOrFuture(value) {
  if (!value) return false;

  const selectedDate = new Date(value);
  if (Number.isNaN(selectedDate.getTime())) return false;

  const today = new Date();
  selectedDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  return selectedDate >= today;
}

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
    tripDate: {
      type: Date,
      required: function () {
        return this.isNew;
      },
      validate: {
        validator: isTodayOrFuture,
        message: "Trip Date cannot be in the past",
      },
    },
    tripDurationDays: {
      type: Number,
      min: 1,
      required: function () {
        return this.isNew && Array.isArray(this.trip) && this.trip.length > 0;
      },
    },
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
    guideIncluded: {
      type: Boolean,
      default: false,
    },
    guideFee: {
      type: Number,
      default: 0,
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
