const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/parking-management', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB');

  // Test the Stand schema
  const standSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'Stand name is required'],
      unique: true,
      trim: true,
      maxlength: [100, 'Stand name cannot exceed 100 characters']
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true
    },
    capacity: {
      type: Number,
      required: [true, 'Capacity is required'],
      min: [1, 'Capacity must be at least 1']
    },
    hourlyRate: {
      type: Number,
      required: [true, 'Hourly rate is required'],
      min: [0, 'Hourly rate cannot be negative']
    },
    currency: {
      type: String,
      required: [true, 'Currency is required'],
      enum: ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'SGD'],
      default: 'USD'
    },
    currentOccupancy: {
      type: Number,
      default: 0,
      min: [0, 'Occupancy cannot be negative']
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'maintenance'],
      default: 'active'
    },
    description: {
      type: String,
      trim: true
    }
  }, {
    timestamps: true
  });

  const Stand = mongoose.model('Stand', standSchema);

  // Test creating a stand with currency
  try {
    const testStand = new Stand({
      name: 'Test Currency Stand',
      location: 'Test Location',
      capacity: 50,
      hourlyRate: 10.50,
      currency: 'EUR',
      description: 'Test stand for currency validation'
    });

    const savedStand = await testStand.save();
    console.log('✅ Successfully created test stand with currency:', {
      name: savedStand.name,
      currency: savedStand.currency,
      hourlyRate: savedStand.hourlyRate,
      location: savedStand.location
    });

    // Test validation with invalid currency
    try {
      const invalidStand = new Stand({
        name: 'Invalid Currency Stand',
        location: 'Invalid Location',
        capacity: 30,
        hourlyRate: 5.00,
        currency: 'XYZ' // Invalid currency
      });
      
      await invalidStand.save();
      console.log('❌ Invalid currency was accepted (this should not happen)');
    } catch (error) {
      console.log('✅ Correctly rejected invalid currency:', error.message);
    }

    // Clean up test data
    await Stand.deleteOne({ name: 'Test Currency Stand' });
    console.log('✅ Test data cleaned up');

  } catch (error) {
    console.error('❌ Error testing database structure:', error.message);
  }

  // Close connection
  mongoose.connection.close();
  console.log('Database connection closed');
});