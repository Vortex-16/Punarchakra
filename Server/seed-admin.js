require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');

async function seedAdmin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@ewaste.com' });
        if (existingAdmin) {
            console.log('Admin user already exists!');
            console.log('Email: admin@ewaste.com');
            console.log('Password: admin123');
            process.exit(0);
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        // Create admin user
        const admin = await User.create({
            name: 'Admin',
            email: 'admin@ewaste.com',
            password: hashedPassword,
            role: 'admin',
            points: 1000
        });

        console.log('Admin user created successfully!');
        console.log('================================');
        console.log('Email: admin@ewaste.com');
        console.log('Password: admin123');
        console.log('================================');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
}

seedAdmin();
