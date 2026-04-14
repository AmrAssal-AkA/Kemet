const mongoose = require('mongoose');

const offeringSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    images : [{
        imageUrl: {
            type: String,
            required: true
    },
        cloudinaryId: {
            type: String,
            required: true
        }
    }],
    description: {
        type: String,
        required: true
    },
    reviews: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.models.offering || mongoose.model("offering", offeringSchema);