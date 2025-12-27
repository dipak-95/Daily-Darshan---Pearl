const mongoose = require('mongoose');

const templeSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: false,
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Temple', templeSchema);
