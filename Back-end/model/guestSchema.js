const mongoose = require("mongoose");
const passport = require("passport");

const passportRegex = /^[A-Z0-9]{6,9}$/;

const guestSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["adult", "child", "infant"],
    },

    firstName: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    passportNumber: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      validate: {
        validator: (v) => passportRegex.test(v),
        message: "Invalid passport number (6-9 A-Z0-9)",
      },
    },

    nationality: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      enum: ["USA", "EG", "EURO"],
      minlength: 2,
      maxlength: 4,
    },

    dateOfBirth: {
      type: Date,
      required: true,
    },

    expiryDate: {
      type: Date,
      required: true,
    },
  },
  { _id: false },
);



module.exports = guestSchema;
