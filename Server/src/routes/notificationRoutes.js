const express = require('express');
const router = express.Router();
const { subscribe, sendNotification, broadcastNotification } = require('../controllers/notificationController');

router.post('/subscribe', subscribe);
router.post('/send', sendNotification);
router.post('/broadcast', broadcastNotification);

module.exports = router;
