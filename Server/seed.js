require('dotenv').config();
const mongoose = require('mongoose');
const Bin = require('./src/models/Bin');

// Sample bin data for Indian cities
const sampleBins = [
    {
        location: {
            address: "MG Road, Bengaluru",
            lat: 12.9716,
            lng: 77.5946
        },
        type: ["Battery", "Phone", "Laptop", "Cable"],
        fillLevel: 45,
        status: "active"
    },
    {
        location: {
            address: "Koramangala, Bengaluru",
            lat: 12.9352,
            lng: 77.6245
        },
        type: ["Battery", "Phone", "Cable"],
        fillLevel: 72,
        status: "active"
    },
    {
        location: {
            address: "Indiranagar, Bengaluru",
            lat: 12.9784,
            lng: 77.6408
        },
        type: ["Phone", "Laptop", "Monitor"],
        fillLevel: 95,
        status: "full"
    },
    {
        location: {
            address: "Whitefield, Bengaluru",
            lat: 12.9698,
            lng: 77.7500
        },
        type: ["Battery", "Cable", "Printer"],
        fillLevel: 30,
        status: "active"
    },
    {
        location: {
            address: "Electronic City, Bengaluru",
            lat: 12.8440,
            lng: 77.6720
        },
        type: ["Phone", "Laptop", "Monitor", "Printer"],
        fillLevel: 60,
        status: "active"
    },
    {
        location: {
            address: "Jayanagar, Bengaluru",
            lat: 12.9250,
            lng: 77.5938
        },
        type: ["Battery", "Phone", "Cable"],
        fillLevel: 88,
        status: "active"
    },
    {
        location: {
            address: "Malleshwaram, Bengaluru",
            lat: 13.0035,
            lng: 77.5647
        },
        type: ["Laptop", "Monitor"],
        fillLevel: 15,
        status: "active"
    },
    {
        location: {
            address: "HSR Layout, Bengaluru",
            lat: 12.9116,
            lng: 77.6389
        },
        type: ["Battery", "Phone", "Laptop", "Cable", "Monitor"],
        fillLevel: 50,
        status: "active"
    },
    {
        location: {
            address: "BTM Layout, Bengaluru",
            lat: 12.9166,
            lng: 77.6101
        },
        type: ["Phone", "Cable"],
        fillLevel: 0,
        status: "maintenance"
    },
    {
        location: {
            address: "Marathahalli, Bengaluru",
            lat: 12.9591,
            lng: 77.6974
        },
        type: ["Battery", "Phone", "Laptop"],
        fillLevel: 78,
        status: "active"
    }
];

async function seedDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        // Clear existing bins
        await Bin.deleteMany({});
        console.log('Cleared existing bins');

        // Insert sample bins
        const result = await Bin.insertMany(sampleBins);
        console.log(`Inserted ${result.length} bins`);

        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();
