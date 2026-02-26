const mongoose = require('mongoose');

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

// Ensure current occupancy doesn't exceed capacity
standSchema.pre('save', function(next) {
  if (this.currentOccupancy > this.capacity) {
    next(new Error('Current occupancy cannot exceed capacity'));
  }
  next();
});

module.exports = mongoose.model('Stand', standSchema);