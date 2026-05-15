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
    trim: true,
    validate: {
      validator: function (v) {
        if(this.googleId){
          return true;
        }
        return /^[a-z0-9_]*[A-Z][a-z0-9_]*@[a-z0-9]+\.[a-z]{2,}$/.test(v);
      },
      message: "email must be valid and contain at least one uppercase letter and only _ and @ special characters.",
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
      validator: function (v) {
         return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(v);
      },
      message: "Password must contain at least one uppercase letter, one lowercase letter, one digit, and be at least 8 characters long.",
    },
  },
  role: {
    type: String,
    enum: ["user", "admin", "guide"],
    default: "user",
  },
  Nationality: {
    type: String,
    trim: true,
    enum: ["EG", "USA", "UK", "FR", "DE", "IT", "ES", "CN", "JP", "IN", "BR", "RU", "CA", "AU", "MX", "KR", "SA", "ZA", "NG", "AR", "CL" , "EUR"],
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
}, { timestamps: true });

userSchema.virtual('Bookings', {
  rel: 'Booking',
  localField: 'userId',
  foreignField: 'userId',
});

userSchema.pre("/validate", {document: true}, function (next) {
  if(!this.googleId && !this.password){
    return next(new Error("Password is required if not using Google authentication."));
  }
  next();
});


module.exports = mongoose.model("User", userSchema);
