const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    id: {
        type: String,
        default: () => new mongoose.Types.ObjectId().toString()
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
        required: true
    },
});

const blog =  mongoose.model("blog", blogSchema);
module.exports = blog;