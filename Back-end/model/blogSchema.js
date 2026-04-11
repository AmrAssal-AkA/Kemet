const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    blogId: {
        type: mongoose.Schema.Types.ObjectId,
        default: new mongoose.Types.ObjectId(),
        required: true,
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

}, { timestamps: true }
);


const blog =  mongoose.model("blog", blogSchema);
module.exports = blog;