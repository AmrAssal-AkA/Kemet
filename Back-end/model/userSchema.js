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
  profilePictureURL: [
    {
      imageUrl: {
        type: String,
      },
      cloudinaryId: {
        type: String,
      },
    },
  ],
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: (v) => {
        return /^(?=(?:[^A-Z]*[A-Z]){1}[^A-Z]*$)[a-zA-Z0-9_]+@[a-zA-Z0-9_]+$/.test(v);
      },
      message: "Email must contain exactly one uppercase letter and only letters, numbers, '_' and '@', with no spaces, and must end with a valid domain.",
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
      validator: (v) => {
         return /^(?=(?:[^A-Z]*[A-Z]){1}[^A-Z]*$)(?=.*[a-z])(?=.*\d)[a-zA-Z0-9_]{8,}$/.test(v);
      },
      message: "Password must contain exactly one uppercase letter, one lowercase letter, one digit, and be at least 8 characters long.",
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
  passwordResetToken: {
    type: String,
    select: false,
  },
  passwordResetExpires: {
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
