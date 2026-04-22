const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString(),
    unique: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  profilePictureURL: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: "Invalid email format",
    },
  },
  password: {
    type: String,
    required: function () {
      return !this.googleId;
    },
    minlength: 7,
    select: false,
    validate: {
      validator: (v) => !v.toLowerCase().includes("password"),
      message: "Password should not contain 'password'",
    },
  },
  role: {
    type: String,
    enum: ["user", "admin", "guide"],
    default: "user",
  },
  bookings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },
  ],
  isVerified: {
    type: Boolean,
    default: function () {
      return !!this.googleId;
    },
  },
  googleId: {
    type: String,
    sparse: true,
    unique: true,
  },
  emailVerificationToken: {
    type: String,
    select: false,
  },
  emailVerificationTokenExpires: {
    type: Date,
    select: false,
  },
  savedTrips: [
    {
      trips: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Trip",
      },
      savedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
