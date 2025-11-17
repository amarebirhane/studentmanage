const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const connectDB = require('../config/db');

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const adminExists = await User.findOne({ email: 'admin@example.com' });

    if (adminExists) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
    });

    console.log('Admin user created:', {
      email: admin.email,
      password: 'admin123',
      role: admin.role,
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();

