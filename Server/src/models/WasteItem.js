const mongoose = require('mongoose');

const wasteItemSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    estimatedValue: {
        type: Number,
        required: true
    },
    detectedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    binId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bin'
    },
    confidence: {
        type: Number
    },
    imageUrl: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('WasteItem', wasteItemSchema);
