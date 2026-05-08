const mongoose = require('mongoose');
const { validate } = require('./tripSchema');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: (v) => {
                return /^[a-zA-Z\s]+$/.test(v);
            },
            message: "Title must contain only letters and spaces."
        }
    },
    content: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: (v) => {
                return /^[a-zA-Z\s]+$/.test(v);
            },
            message: "Content must contain only letters and spaces."
        }
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
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reviews: [{
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: (v) => {
                return /^[a-zA-Z\s]+$/.test(v);
            },
            message: "Review must contain only letters and spaces."
        }
    }]

}, { timestamps: true }
);


const blog =  mongoose.model("blog", blogSchema);
module.exports = blog;