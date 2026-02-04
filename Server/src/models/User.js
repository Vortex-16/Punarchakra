const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    points: {
        type: Number,
        default: 0
    },
    history: [{
        itemType: String,
        pointsEarned: Number,
        date: {
            type: Date,
            default: Date.now
        },
        binId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Bin'
        }
    }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
