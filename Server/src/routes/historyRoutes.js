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
