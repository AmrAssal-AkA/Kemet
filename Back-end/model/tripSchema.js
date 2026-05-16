const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
  tripId: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString(),
    index: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  city: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  basePrice: {
    type: Number,
    required: true,
  },
  finalPrice: {
    type: Number,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  guideAvailable: {
    type: Boolean,
    default: false,
  },
  guidefees: {
    type: Number,
    default: 0,
  },
    guestCapacity: {
    type: Number,
    default: 0,
  },
  image: [
    {
      imageUrl: {
        type: String,
        required: true,
      },
      cloudinaryId: {
        type: String,
        required: true,
      },
    },
  ],
}, { timestamps: true});


module.exports = mongoose.models.trips || mongoose.model("trips", tripSchema);
