const mongoose = require('mongoose');
require('dotenv').config();

const Alert = require('./src/models/Alert');
const Bin = require('./src/models/Bin');

async function seedAlerts() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        // Fetch existing bins to link alerts to
        const bins = await Bin.find({});
        if (bins.length === 0) {
            console.log('No bins found! Please run seed.js first.');
            process.exit(1);
        }

        const alertTypes = ['full', 'battery_low', 'sensor_error', 'maintenance', 'network_failure'];
        const priorities = ['low', 'medium', 'high', 'critical'];
        const statuses = ['open', 'resolved', 'ignored'];
        const messages = [
            "Bin is 95% full, needs immediate pickup",
            "Battery level critical (10%)",
            "Sensor reading inconsistent values",
            "Scheduled maintenance overdue",
            "Network connectivity lost since 2 hours",
            "Overflow sensor triggered",
            "Temperature sensor warning",
            "Vandalism detected - tampering alert",
            "Lid malfunction reported",
            "Fire hazard detected - high temperature"
        ];

        const sampleAlerts = [];

        // Generate 20 random alerts
        for (let i = 0; i < 20; i++) {
            const randomBin = bins[Math.floor(Math.random() * bins.length)];
            const randomType = alertTypes[Math.floor(Math.random() * alertTypes.length)];
            const randomPriority = priorities[Math.floor(Math.random() * priorities.length)];
            const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];

            // Create dates within the last 7 days
            const createdAt = new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000));

            sampleAlerts.push({
                binId: randomBin._id,
                type: randomType,
                priority: randomPriority,
                message: randomMessage,
                status: randomStatus,
                createdAt: createdAt
            });
        }

        // Clear existing alerts
        await Alert.deleteMany({});
        console.log('Cleared existing alerts');

        // Insert new alerts
        const result = await Alert.insertMany(sampleAlerts);
        console.log(`Inserted ${result.length} alerts`);

        console.log('Database seeded with alerts successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding alerts:', error);
        process.exit(1);
    }
}

seedAlerts();
