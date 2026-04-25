const mongoose = require("mongoose");

const guideSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    role: {
        type: mongoose.Schema.Types.String,
        rel: "User",
        default: "guide",
    },
    AvailabilityTime: [{
        dayofweek: {type: String, required: true},
        startTime: {type: String, required: true},
        endTime: {type: String, required: true},
    }]
})


module.exports = mongoose.model("Guide", guideSchema);