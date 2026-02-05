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
        required: false // Optional for Google Auth users
    },
    googleId: {
        type: String, // Store Google ID for social login
        unique: true,
        sparse: true  // Allows null/undefined values to not conflict
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
    }],
    pushSubscription: {
        type: Object, // Stores endpoint, keys (p256dh, auth)
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
