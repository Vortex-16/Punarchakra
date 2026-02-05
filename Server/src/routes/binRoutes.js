const express = require('express');
const router = express.Router();
const {
    getBins,
    getBinById,
    createBin,
    updateBin,
    deleteBin,
    getBinStats,
    depositItem,
    getBinAnalytics,
    getBinPredictions,
    getCollectionSchedule,
    recordFillLevel
} = require('../controllers/binController');
const { protect } = require('../middleware/authMiddleware');

// Stats and analytics routes (must be before /:id to avoid conflict)
router.get('/stats', getBinStats);
router.get('/analytics', getBinAnalytics);
router.get('/predictions', getBinPredictions); // Get all predictions
router.get('/collection-schedule', getCollectionSchedule);

// Public routes
router.get('/', getBins);
router.get('/:id', getBinById);
router.get('/predictions/:id', getBinPredictions); // Get prediction for specific bin

// Protected routes (Admin)
router.post('/', protect, createBin);
router.put('/:id', protect, updateBin);
router.delete('/:id', protect, deleteBin);
router.post('/deposit', protect, depositItem);
router.post('/record-fill', protect, recordFillLevel);

module.exports = router;

