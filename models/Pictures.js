const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const picturesSchema = new Schema({
    pictures: {
        type: Map,
        of: String 
    }
});

module.exports = mongoose.model('Pictures', picturesSchema);