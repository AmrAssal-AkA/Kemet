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
    placeName:{
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});



module.exports = mongoose.models.hiddenGem || mongoose.model("hiddenGem", hiddenGemSchema);