const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  id: {
    type: Date,
    default: Date.now,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: (v) => {
        return /^[a-zA-Z\s]+$/.test(v);
      },
      message: "Name must contain only letters and spaces.",
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => {
        return /^[a-z0-9_]*[A-Z][a-z0-9_]*@[a-z0-9]+\.[a-z]{2,}$/.test(v);
      },
      message:
        "email must be valid and contain at least one uppercase letter and only _ and @ special characters.",
    },
  },
  subject: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: (v) => {
        return /^[a-zA-Z\s]+$/.test(v);
      },
      message: "Subject must contain only letters and spaces.",
    },
  },
  message: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: (v) => {
        return /^[a-zA-Z\s]+$/.test(v);
      },
      message: "Message must contain only letters and spaces.",
    },
  },
});

const contact = mongoose.model("contact", contactSchema);
module.exports = contact;
