const mongoose = require("mongoose");


const HotelOfferSchema = new mongoose.Schema({
    hotelId: {
        type: String,
        required: true,
    },
    offerId: {
        type: String,
        required: true,
    },
    checkInDate: {
        type: Date,
        required: true,
    },
    checkOutDate: {
        type: Date,
        required: true,
    },
    roomQuantity: {
        type: Number,
        required: true,
    },
    adults: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
});

const flightOfferSchema = new mongoose.Schema({
    offerId: {
        type: String,
        required: true,
    },
    origin: {
        type: String,
        required: true,
    },
    destination: {
        type: String,
        required: true,
    },
    departureDate: {
        type: Date,
        required: true,
    },
    returnDate: {
        type: Date,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
});


const BookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    BookingType: {
        type: String,
        enum: ["trip", "Hotel", "Flight"],
        required: true,
    },
    trip: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "trip",
    },
    status: {
        type: String,
        enum: ["Pending", "Confirmed", "Cancelled"],
        default: "Pending",
    },
    paymentStatus: {
        type: String,
        enum: ["Pending", "Paid", "Failed"],
        default: "Pending",
    },
    totalPrice: {
        type: Number,
        currency: "EGP",
    },
    details: {
        flightOffer: flightOfferSchema,
        hotelOffer: HotelOfferSchema,
        type: mongoose.Schema.Types.Mixed,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
    
})


module.exports = mongoose.model("Booking" , BookingSchema);
