const mongoose = require('mongoose');

const hasText = (value) => typeof value === "string" && value.trim().length > 0;

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: hasText,
            message: "Title cannot be empty."
        }
    },
    content: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: hasText,
            message: "Content cannot be empty."
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
    comments: [{
       user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
       },
         comment: {
            type: String,
            required: true,
            trim: true,
            validate: {
                validator: (v) => {
                    return /^[a-zA-Z\s]+$/.test(v);
                },
                message: "Comment must contain only letters and spaces."
            }
         },
         createdAt: {
            type: Date,
            default: Date.now
         }
    }]

}, { timestamps: true }
);


const blog =  mongoose.model("blog", blogSchema);
module.exports = blog;
