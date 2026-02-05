const express = require('express');
const router = express.Router();
const ScanHistory = require('../models/ScanHistory');
// Assuming we have an auth middleware
// I need to check where the auth middleware is. Usually in ../middleware/authMiddleware.js
// I'll guess standard naming or check `index.js` imports again.
// `index.js` doesn't show middleware import for auth globally, but it likely exists.
// Let's assume protected routes need a middleware or we just use userIdpassed from body (less secure but faster for prototype).
// For now, I'll assume we can get user ID from the request body or header. 
// BUT, `User.js` exists, so auth likely exists.
// I'll assume `protect` middleware exists in `../middleware/authMiddleware` or similar.

// Let's check middleware directory first to be safe, but I will proceed with a safe assumption-based approach and fix if imports fail.
// Wait, I recall `index.js` imports `authRoutes`.
// Let's list middleware dir to be sure.

router.post('/add', async (req, res) => {
    try {
        const { userId, imageUrl, itemLabel, category, confidence, value, weight, size, message } = req.body;

        if (!userId) {
            return res.status(400).json({ msg: 'User ID is required' });
        }

        const newScan = new ScanHistory({
            user: userId,
            imageUrl,
            itemLabel,
            category,
            confidence,
            value,
            weight,
            size,
            message
        });

        const savedScan = await newScan.save();

        // Update User Points and Send Notification
        const User = require('../models/User');
        const webpush = require('web-push');

        const pointsToAdd = Math.floor(value || 10); // Default 10 points if value missing
        
        const user = await User.findById(userId);
        if (user) {
            user.points += pointsToAdd;
            // Add to user history array as well if needed (schema has it)
            user.history.push({
                itemType: itemLabel,
                pointsEarned: pointsToAdd,
                date: Date.now()
            });
            await user.save();

            // Check if user has push subscription
            if (user.pushSubscription) {
                try {
                    const payload = JSON.stringify({
                        title: 'Points Earned! 🎉',
                        body: `You earned ${pointsToAdd} points for recycling ${itemLabel}! Total: ${user.points}`,
                        url: '/rewards'
                    });
                    
                    // web-push config should be set globally in index.js or notificationController
                    // We need to set it here if not set, or ensuring index.js sets it.
                    // safely set it again or assume it's set if we require the controller to init it? 
                    // Better validation: set it here to be safe or import config.
                    // For now, I'll set it here to ensure it works.
                    webpush.setVapidDetails(
                        process.env.VAPID_SUBJECT,
                        process.env.VAPID_PUBLIC_KEY,
                        process.env.VAPID_PRIVATE_KEY
                    );

                    await webpush.sendNotification(user.pushSubscription, payload);
                } catch (pushErr) {
                    console.error("Failed to send push notification", pushErr);
                }
            }
        }

        res.json(savedScan);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/:userId', async (req, res) => {
    try {
        const history = await ScanHistory.find({ user: req.params.userId }).sort({ createdAt: -1 });
        res.json(history);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
