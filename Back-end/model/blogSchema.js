const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    id: {
        type: Date,
        default: Date.now,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
    },
});

const blog =  mongoose.model("blog", blogSchema);
module.exports = blog;