const mongoose = require('mongoose');

const darshanSchema = mongoose.Schema({
    temple: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Temple',
    },
    date: {
        type: Date, // We will store the date of the darshan (without time, or normalized to midnight)
        required: true,
    },
    images: [{
        type: String,
        required: true,
    }]
}, {
    timestamps: true,
});

// Index for easier querying by date
darshanSchema.index({ date: 1, temple: 1 });

module.exports = mongoose.model('Darshan', darshanSchema);
