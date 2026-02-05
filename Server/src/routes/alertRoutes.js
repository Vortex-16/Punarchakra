const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');
const { protect } = require('../middleware/authMiddleware');

// Get all alerts
router.get('/', protect, async (req, res) => {
    try {
        const { status } = req.query;
        let query = {};

        if (status && status !== 'all') {
            query.status = status;
        }

        const alerts = await Alert.find(query)
            .populate('binId', 'location')
            .populate('resolvedBy', 'name')
            .sort({ createdAt: -1 });

        res.json(alerts);
    } catch (error) {
        console.error('Error fetching alerts:', error);
        res.status(500).json({ message: 'Server error fetching alerts' });
    }
});

// Resolve alert
router.put('/:id/resolve', protect, async (req, res) => {
    try {
        const alert = await Alert.findById(req.params.id);

        if (!alert) {
            return res.status(404).json({ message: 'Alert not found' });
        }

        alert.status = 'resolved';
        alert.resolvedBy = req.user._id;
        await alert.save();

        res.json(alert);
    } catch (error) {
        console.error('Error resolving alert:', error);
        res.status(500).json({ message: 'Server error resolving alert' });
    }
});

module.exports = router;
