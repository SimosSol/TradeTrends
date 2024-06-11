const mongoose = require('mongoose');
const notificationSchema = mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    postid: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    date: {
        type: Date
    }
});

module.exports = mongoose.model('Notification', notificationSchema);
 