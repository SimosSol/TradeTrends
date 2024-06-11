const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 4,
        max: 255,
    },
    email: {
        type: String,
        required: true,
        min: 4,
        max: 255,
        lowercase:true,
    },
    password: {
        type: String,
        required: true,
        min: 2,
        max: 1024,
    },
    verified: {
        type: String,
        required: true
    },
    likedposts: {
        type: Array,
        default: [],
        required: true
    },
    followers: {
        type: Array,
        default: [],
        required: true
    },
    follows: {
        type: Array,
        default: [],
        required: true
    },
    img: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('User', userSchema);
 