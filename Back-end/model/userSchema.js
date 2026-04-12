const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString(),
    unique: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  profilePictureURL: {
    type: String
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
    required: function () { return !this.googleId; }, 
    minlength: 7,
    select: false,
    validate: {
      validator: (v) => !v.toLowerCase().includes("password"),
      message: "Password should not contain 'password'",
    },
  },
  role: {
    type: String,
    enum: ["user", "admin", "LocalGuide"],
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
    default: false,
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
  }
});

userSchema.method("generateAuthToken", function () {
  const jwtToken = jwt.sign(
    { userId: this.userId, role: this.role }, process.env.JWT_SECRET || "YourSecretKeyForJWT"
  );
  return jwtToken;
});

module.exports = mongoose.model("User", userSchema);
