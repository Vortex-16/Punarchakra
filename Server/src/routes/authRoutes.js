const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    getMe,
    redeemReward,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.post('/redeem', protect, redeemReward);

module.exports = router;
