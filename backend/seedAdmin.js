require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    const adminEmail = 'admin@example.com';
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = new User({
      firstName: 'Admin',
      lastName: 'User',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin'
    });
    await adminUser.save();
    console.log('Admin user seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin user:', error);
    process.exit(1);
  }
}

seedAdmin();
