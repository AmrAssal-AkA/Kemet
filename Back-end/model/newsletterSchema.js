const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
})

const newsletter = mongoose.model("newsletter", newsletterSchema);
module.exports = newsletter;