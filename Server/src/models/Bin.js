const mongoose = require('mongoose');

const binSchema = new mongoose.Schema({
    location: {
        address: String,
        lat: Number,
        lng: Number
    },
    type: {
        type: [String], // Array of accepted waste types e.g. ['plastic', 'metal', 'organic']
        required: true
    },
    fillLevel: {
        type: Number, // Percentage 0-100
        default: 0
    },
    status: {
        type: String,
        enum: ['active', 'full', 'maintenance', 'offline'],
        default: 'active'
    },
    lastCollection: {
        type: Date
    }
}, { timestamps: true });

module.exports = mongoose.model('Bin', binSchema);
