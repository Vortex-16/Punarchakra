const BinFillHistory = require('../models/BinFillHistory');
const Bin = require('../models/Bin');

/**
 * Utility to generate historical data for testing predictive analytics
 * This simulates different fill patterns for bins
 */

async function simulateHistoricalData(daysBack = 14) {
    try {
        console.log('Starting historical data simulation...');
        
        // Get all bins
        const bins = await Bin.find({});
        
        if (bins.length === 0) {
            console.log('No bins found. Please seed bins first.');
            return;
        }

        const now = Date.now();
        const msPerDay = 24 * 60 * 60 * 1000;
        const recordsCreated = [];

        for (const bin of bins) {
            // Choose a random pattern for this bin
            const patterns = ['steady', 'rapid', 'irregular', 'slow'];
            const pattern = patterns[Math.floor(Math.random() * patterns.length)];
            
            console.log(`Generating ${pattern} fill pattern for bin ${bin._id} (${bin.location.address})`);

            let currentFill = 10 + Math.random() * 20; // Start at 10-30%
            
            // Generate data points approximately every 12 hours
            const pointsPerDay = 2;
            const totalPoints = daysBack * pointsPerDay;

            for (let i = totalPoints; i >= 0; i--) {
                const timestamp = new Date(now - (i * msPerDay / pointsPerDay));
                
                // Update fill level based on pattern
                switch (pattern) {
                    case 'steady':
                        // Consistent fill rate: ~3-5% per day
                        currentFill += (3 + Math.random() * 2) / pointsPerDay;
                        break;
                    case 'rapid':
                        // Fast fill rate: ~7-10% per day
                        currentFill += (7 + Math.random() * 3) / pointsPerDay;
                        break;
                    case 'irregular':
                        // Random spikes and drops
                        const change = (Math.random() - 0.3) * 8;
                        currentFill += change / pointsPerDay;
                        break;
                    case 'slow':
                        // Slow fill rate: ~1-2% per day
                        currentFill += (1 + Math.random()) / pointsPerDay;
                        break;
                }

                // Add some noise
                currentFill += (Math.random() - 0.5) * 2;

                // Keep within bounds
                currentFill = Math.max(0, Math.min(100, currentFill));

                // Create history record
                const record = await BinFillHistory.create({
                    binId: bin._id,
                    fillLevel: Math.round(currentFill * 10) / 10,
                    timestamp: timestamp,
                    source: 'simulation'
                });

                recordsCreated.push(record);
            }

            // Update the bin's current fill level to match the last simulated point
            bin.fillLevel = Math.round(currentFill);
            if (bin.fillLevel >= 90) {
                bin.status = 'full';
            } else {
                bin.status = 'active';
            }
            await bin.save();
        }

        console.log(`✓ Created ${recordsCreated.length} historical records for ${bins.length} bins`);
        console.log('Historical data simulation complete!');
        
        return {
            recordsCreated: recordsCreated.length,
            binsUpdated: bins.length
        };

    } catch (error) {
        console.error('Error simulating historical data:', error);
        throw error;
    }
}

/**
 * Clear all historical data
 */
async function clearHistoricalData() {
    try {
        const result = await BinFillHistory.deleteMany({});
        console.log(`Deleted ${result.deletedCount} historical records`);
        return result;
    } catch (error) {
        console.error('Error clearing historical data:', error);
        throw error;
    }
}

module.exports = {
    simulateHistoricalData,
    clearHistoricalData
};

// If run directly from command line
if (require.main === module) {
    const mongoose = require('mongoose');
    const path = require('path');
    require('dotenv').config({ path: path.join(__dirname, '../../.env') });

    console.log('Connecting to MongoDB...');
    
    if (!process.env.MONGO_URI) {
        console.error('Error: MONGO_URI not found in .env file');
        process.exit(1);
    }

    mongoose.connect(process.env.MONGO_URI)
        .then(async () => {
            console.log('Connected to MongoDB');
            
            // Clear old data first
            await clearHistoricalData();
            
            // Generate new historical data
            await simulateHistoricalData(14);
            
            console.log('Done! Disconnecting...');
            await mongoose.disconnect();
            process.exit(0);
        })
        .catch(err => {
            console.error('MongoDB connection error:', err);
            process.exit(1);
        });
}
