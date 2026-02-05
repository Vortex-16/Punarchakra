const webpush = require('web-push');
const User = require('../models/User');

webpush.setVapidDetails(
    process.env.VAPID_SUBJECT,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

// Subscribe User
exports.subscribe = async (req, res) => {
    try {
        const { email, subscription } = req.body;

        if (!email || !subscription) {
            return res.status(400).json({ msg: 'Missing email or subscription data' });
        }

        const user = await User.findOneAndUpdate(
            { email },
            { pushSubscription: subscription },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.status(201).json({ msg: 'Subscription added successfully', user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
};

// Send Notification (Admin/Internal use)
exports.sendNotification = async (req, res) => {
    try {
        const { email, title, message, url } = req.body;

        if (!email || !title || !message) {
            return res.status(400).json({ msg: 'Please provide email, title, and message' });
        }

        const user = await User.findOne({ email });

        if (!user || !user.pushSubscription) {
            return res.status(404).json({ msg: 'User not found or not subscribed to notifications' });
        }

        const payload = JSON.stringify({
            title,
            body: message,
            url: url || '/',
            icon: '/icon-192x192.png' // Default icon
        });

        await webpush.sendNotification(user.pushSubscription, payload);

        res.status(200).json({ msg: 'Notification sent successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Failed to send notification', error: err.message });
    }
};

// Broadcast Notification (Admin use)
exports.broadcastNotification = async (req, res) => {
    try {
        const { title, message, url } = req.body;
        
        const users = await User.find({ pushSubscription: { $ne: null } });

        const payload = JSON.stringify({
            title,
            body: message,
            url: url || '/',
            icon: '/icon-192x192.png'
        });

        const promises = users.map(user => 
            webpush.sendNotification(user.pushSubscription, payload)
                .catch(err => console.error(`Failed to send to ${user.email}:`, err))
        );

        await Promise.all(promises);

        res.status(200).json({ msg: `Broadcasted to ${users.length} users` });
    } catch (err) {
         console.error(err);
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
};
