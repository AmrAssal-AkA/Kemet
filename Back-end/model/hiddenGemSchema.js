const mongoose = require('mongoose');

const hiddenGemSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true
    }
});

module.exports = mongoose.models.hiddenGemSchema || mongoose.model("hiddenGem", hiddenGemSchema);