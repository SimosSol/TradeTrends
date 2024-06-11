const mongoose = require('mongoose');
const postSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    imgURL: {
        type: String,
        required: true
    },
    verified: {
        type: String,
        required: true
    },
    likes: {
        type: String,
        required: true
    },
    reposts: {
        type: String,
        required: true
    },
    sentiment: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    postid: {
        type: String,
        required: true
    },
    date: {
        type: Date
    }
});

module.exports = mongoose.model('Post', postSchema);
 