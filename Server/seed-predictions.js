const mongoose = require('mongoose');
require('dotenv').config();

const BinFillHistory = require('./src/models/BinFillHistory');
const Bin = require('./src/models/Bin');

/**
 * Seed script to generate historical fill data for predictive analytics
 */

async function seedHistoricalData() {
    try {
        console.log('📊 Starting historical data generation...');
        
        // Get all bins
        const bins = await Bin.find({});
        
        if (bins.length === 0) {
            console.log('❌ No bins found. Please run the bin seed script first.');
            console.log('   Run: npm run seed');
            return;
        }

        console.log(`Found ${bins.length} bins`);

        // Clear existing historical data
        const deleteResult = await BinFillHistory.deleteMany({});
        console.log(`Cleared ${deleteResult.deletedCount} existing historical records`);

        const now = Date.now();
        const msPerDay = 24 * 60 * 60 * 1000;
        const daysBack = 14;
        let totalRecords = 0;

        // Simulate different patterns for each bin
        const patterns = ['steady', 'rapid', 'irregular', 'slow'];

        for (const bin of bins) {
            const pattern = patterns[Math.floor(Math.random() * patterns.length)];
            console.log(`  Generating ${pattern} pattern for bin at ${bin.location.address}`);

            let currentFill = 10 + Math.random() * 20; // Start at 10-30%
            
            // Generate data points approximately every 12 hours
            const pointsPerDay = 2;
            const totalPoints = daysBack * pointsPerDay;

            for (let i = totalPoints; i >= 0; i--) {
                const timestamp = new Date(now - (i * msPerDay / pointsPerDay));
                
                // Update fill level based on pattern
                switch (pattern) {
                    case 'steady':
                        currentFill += (3 + Math.random() * 2) / pointsPerDay;
                        break;
                    case 'rapid':
                        currentFill += (7 + Math.random() * 3) / pointsPerDay;
                        break;
                    case 'irregular':
                        const change = (Math.random() - 0.3) * 8;
                        currentFill += change / pointsPerDay;
                        break;
                    case 'slow':
                        currentFill += (1 + Math.random()) / pointsPerDay;
                        break;
                }

                // Add some noise
                currentFill += (Math.random() - 0.5) * 2;
                currentFill = Math.max(0, Math.min(100, currentFill));

                await BinFillHistory.create({
                    binId: bin._id,
                    fillLevel: Math.round(currentFill * 10) / 10,
                    timestamp: timestamp,
                    source: 'simulation'
                });

                totalRecords++;
            }

            // Update the bin's current fill level
            bin.fillLevel = Math.round(currentFill);
            if (bin.fillLevel >= 90) {
                bin.status = 'full';
            } else {
                bin.status = 'active';
            }
            await bin.save();
        }

        console.log(`✅ Created ${totalRecords} historical records for ${bins.length} bins`);
        console.log('🎉 Historical data generation complete!');
        console.log('\nYou can now view predictions at: http://localhost:3000/analytics');

    } catch (error) {
        console.error('❌ Error seeding historical data:', error);
        throw error;
    }
}

// Connect to MongoDB and run seed
mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('✅ Connected to MongoDB');
        await seedHistoricalData();
        await mongoose.disconnect();
        console.log('✅ Disconnected from MongoDB');
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1);
    });
