const mongoose = require('mongoose');

const scanHistorySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    imageUrl: {
        type: String, // Store base64 or URL if uploaded (currently using base64 mostly, but heavy for DB)
        // Ideally we shouldn't store large base64 strings in Mongo, but for this prototype it might be okay.
        // We'll trust the plan to just save what we have. 
        required: true
    },
    itemLabel: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['electronic', 'battery', 'plastic', 'other'],
        required: true
    },
    confidence: {
        type: Number,
        required: true
    },
    value: {
        type: Number,
        default: 0
    },
    weight: {
        type: String, // Stored as string to allow "0.5kg" or just numbers
        default: null
    },
    size: {
        type: String,
        default: null
    },
    message: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ScanHistory', scanHistorySchema);
