const express = require('express');
const router = express.Router();
const {
    getBins,
    getBinById,
    createBin,
    updateBin,
    deleteBin,
    getBinStats
} = require('../controllers/binController');
const { protect } = require('../middleware/authMiddleware');

// Stats route (must be before /:id to avoid conflict)
router.get('/stats', getBinStats);

// Public routes
router.get('/', getBins);
router.get('/:id', getBinById);

// Protected routes (Admin)
router.post('/', protect, createBin);
router.put('/:id', protect, updateBin);
router.delete('/:id', protect, deleteBin);

module.exports = router;
