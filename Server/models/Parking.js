const mongoose = require('mongoose');

const parkingSchema = new mongoose.Schema({
  tokenId: {
    type: String,
    required: [true, 'Token ID is required'],
    unique: true,
    trim: true
  },
  vehicleNumber: {
    type: String,
    required: [true, 'Vehicle number is required'],
    trim: true,
    uppercase: true
  },
  vehicleType: {
    type: String,
    required: [true, 'Vehicle type is required'],
    enum: ['bike', 'cycle', 'car'],
    lowercase: true
  },
  inTime: {
    type: Date,
    required: [true, 'In time is required'],
    default: Date.now
  },
  outTime: {
    type: Date,
    default: null
  },
  amount: {
    type: Number,
    default: 0,
    min: [0, 'Amount cannot be negative']
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  stand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stand',
    required: [true, 'Stand is required']
  },
  staff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Staff is required']
  },
  duration: {
    type: Number, // in minutes
    default: 0
  },
  paymentMethod: {
    type: String,
    enum: {
      values: ['cash', 'upi', 'whatsapp', null],
      message: '{VALUE} is not a valid payment method'
    },
    default: null
  },
  paymentDetails: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  customerName: {
    type: String,
    trim: true
  },
  customerPhone: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Calculate duration and amount before saving
parkingSchema.pre('save', function(next) {
  if (this.outTime && this.inTime) {
    // Calculate duration in minutes
    this.duration = Math.ceil((this.outTime - this.inTime) / (1000 * 60));
  }
  next();
});

// Index for better query performance
parkingSchema.index({ stand: 1, status: 1 });
parkingSchema.index({ tokenId: 1 });
parkingSchema.index({ vehicleNumber: 1 });
parkingSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Parking', parkingSchema);