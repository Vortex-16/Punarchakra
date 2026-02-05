const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
    binId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bin',
        required: true
    },
    type: {
        type: String,
        enum: ['full', 'battery_low', 'sensor_error', 'maintenance', 'network_failure'],
        required: true
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        required: true
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['open', 'resolved', 'ignored'],
        default: 'open'
    },
    resolvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

module.exports = mongoose.model('Alert', alertSchema);
