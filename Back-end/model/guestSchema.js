// models/Guest.js
const mongoose = require("mongoose");

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


guestSchema.pre("validate", async function () {

  this.firstName = this.firstName?.trim().toUpperCase();
  this.lastName = this.lastName?.trim().toUpperCase();
  this.passportNumber = this.passportNumber?.trim().toUpperCase();


  const minDate = new Date();
  minDate.setMonth(minDate.getMonth() + 6);

  if (this.expiryDate < minDate) {
    return next(new Error("Passport must be valid for at least 6 months"));
  }

  const age =
    (new Date() - new Date(this.dateOfBirth)) /
     (1000 * 60 * 60 * 24 * 365.25);

  if (this.type === "adult" && age < 12) {
    return next(new Error("Adult must be at least 12 years old"));
  }

  if (this.type === "child" && (age < 2 || age >= 12)) {
    return next(new Error("Child age must be between 2 and 12"));
  }

  if (this.type === "infant" && age >= 2) {
    return next(new Error("Infant must be under 2 years old"));
  }
});




module.exports = guestSchema;
