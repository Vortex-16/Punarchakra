const mongoose = require('mongoose');

const binFillHistorySchema = new mongoose.Schema({
    binId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bin',
        required: true,
        index: true
    },
    fillLevel: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true
    },
    source: {
        type: String,
        enum: ['manual', 'deposit', 'sensor', 'simulation'],
        default: 'manual'
    }
}, { timestamps: true });

// Compound index for efficient querying of bin history over time
binFillHistorySchema.index({ binId: 1, timestamp: -1 });

module.exports = mongoose.model('BinFillHistory', binFillHistorySchema);
