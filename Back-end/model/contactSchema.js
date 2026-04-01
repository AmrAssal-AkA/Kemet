const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    id: {
        type: Date,
        default: Date.now,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
});

const contact =  mongoose.model("contact", contactSchema);
module.exports = contact;