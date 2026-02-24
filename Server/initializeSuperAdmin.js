const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

// Load env vars
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Create super admin
const createSuperAdmin = async () => {
  try {
    await connectDB();

    // Check if super admin already exists
    const existingAdmin = await User.findOne({ email: process.env.SUPERADMIN_EMAIL });
    
    if (existingAdmin) {
      console.log('Super Admin already exists');
      process.exit(0);
    }

    // Create super admin (password will be hashed automatically by the pre-save hook)
    const superAdmin = await User.create({
      name: 'Super Admin',
      email: process.env.SUPERADMIN_EMAIL,
      password: process.env.SUPERADMIN_PASSWORD,
      role: 'super_admin',
      isActive: true
    });

    console.log('Super Admin created successfully:');
    console.log(`Email: ${process.env.SUPERADMIN_EMAIL}`);
    console.log(`Password: ${process.env.SUPERADMIN_PASSWORD}`);

    process.exit(0);
  } catch (error) {
    console.error('Error creating super admin:', error.message);
    process.exit(1);
  }
};

// Run the function
createSuperAdmin();