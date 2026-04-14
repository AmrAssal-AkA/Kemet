const mongoose = require('mongoose');

const hiddenGemSchema = new mongoose.Schema({
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
    location: {
        type: {
            type: String, 
            enum: ['Point'],
            default: 'Point',
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        },
        formattedAddress: String
    },
    reviews: {
        type: String,
        required: true
    }
});

hiddenGemSchema.index({ location: "2dsphere" });

module.exports = mongoose.models.hiddenGem || mongoose.model("hiddenGem", hiddenGemSchema);