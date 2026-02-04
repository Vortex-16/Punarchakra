const Bin = require('../models/Bin');
const User = require('../models/User');

// @desc    Get all bins
// @route   GET /api/bins
// @access  Public
const getBins = async (req, res) => {
    try {
        const { status, type } = req.query;
        let filter = {};

        if (status) {
            filter.status = status;
        }
        if (type) {
            filter.type = { $in: [type] };
        }

        const bins = await Bin.find(filter);
        res.status(200).json(bins);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single bin
// @route   GET /api/bins/:id
// @access  Public
const getBinById = async (req, res) => {
    try {
        const bin = await Bin.findById(req.params.id);
        if (!bin) {
            return res.status(404).json({ message: 'Bin not found' });
        }
        res.status(200).json(bin);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a bin
// @route   POST /api/bins
// @access  Private (Admin)
const createBin = async (req, res) => {
    const { location, type, fillLevel, status } = req.body;

    if (!location || !type) {
        return res.status(400).json({ message: 'Please add all required fields' });
    }

    try {
        const bin = await Bin.create({
            location,
            type,
            fillLevel,
            status
        });
        res.status(201).json(bin);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update bin
// @route   PUT /api/bins/:id
// @access  Private (Admin)
const updateBin = async (req, res) => {
    try {
        const bin = await Bin.findById(req.params.id);
        if (!bin) {
            return res.status(404).json({ message: 'Bin not found' });
        }

        const updatedBin = await Bin.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json(updatedBin);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete bin
// @route   DELETE /api/bins/:id
// @access  Private (Admin)
const deleteBin = async (req, res) => {
    try {
        const bin = await Bin.findById(req.params.id);
        if (!bin) {
            return res.status(404).json({ message: 'Bin not found' });
        }

        await bin.deleteOne();
        res.status(200).json({ message: 'Bin removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get bin stats for dashboard
// @route   GET /api/bins/stats
// @access  Public
const getBinStats = async (req, res) => {
    try {
        const totalBins = await Bin.countDocuments();
        const activeBins = await Bin.countDocuments({ status: 'active' });
        const fullBins = await Bin.countDocuments({ status: 'full' });
        const maintenanceBins = await Bin.countDocuments({ status: 'maintenance' });

        // Get bins that need collection (fillLevel > 80%)
        const criticalBins = await Bin.find({ fillLevel: { $gte: 80 } })
            .sort({ fillLevel: -1 })
            .limit(5);

        // Calculate average fill level
        const avgFillResult = await Bin.aggregate([
            { $group: { _id: null, avgFill: { $avg: "$fillLevel" } } }
        ]);
        const avgFillLevel = avgFillResult.length > 0 ? Math.round(avgFillResult[0].avgFill) : 0;

        res.status(200).json({
            totalBins,
            activeBins,
            fullBins,
            maintenanceBins,
            avgFillLevel,
            criticalBins
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Deposit item into bin
// @route   POST /api/bins/deposit
// @access  Private
const depositItem = async (req, res) => {
    const { binId, itemType, points, sustainabilityScore } = req.body;

    if (!itemType || !points) {
        return res.status(400).json({ message: 'Missing deposit details' });
    }

    try {
        // 1. Update User Points
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.points += points;
        user.history.unshift({
            itemType: `Recycled: ${itemType}`,
            pointsEarned: points,
            date: Date.now()
        });
        await user.save();

        // 2. Update Bin Fill Level
        // If no binId provided, find the first active bin (Simulation Mode)
        let bin;
        if (binId) {
            bin = await Bin.findById(binId);
        } else {
            bin = await Bin.findOne({ status: 'active' });
        }

        if (bin) {
            // Simulate volume based on item type or fixed increment
            const fillIncrement = 5; // Fixed 5% per item for demo
            bin.fillLevel = Math.min(bin.fillLevel + fillIncrement, 100);

            if (bin.fillLevel >= 90) {
                bin.status = 'full';
            }

            await bin.save();
        }

        res.status(200).json({
            message: 'Deposit successful',
            pointsAdded: points,
            totalPoints: user.points,
            binFillLevel: bin ? bin.fillLevel : null
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Transaction failed' });
    }
};

module.exports = {
    getBins,
    getBinById,
    createBin,
    updateBin,
    deleteBin,
    getBinStats,
    depositItem
};
