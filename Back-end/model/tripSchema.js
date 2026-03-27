const mongoose = require('mongoose');


const tripSchema = new mongoose.Schema({
    id : {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString(),
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    city: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    }
});


module.exports = mongoose.models.trips || mongoose.model("trips", tripSchema);
