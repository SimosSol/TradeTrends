const mongoose = require('mongoose');
const watchlistSchema = mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    tickers: {
        type: Array,
        default: []
    }
});

module.exports = mongoose.model('Watchlist', watchlistSchema);
 