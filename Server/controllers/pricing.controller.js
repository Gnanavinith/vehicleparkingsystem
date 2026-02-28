const fs = require('fs');
const path = require('path');

// Pricing data file path
const PRICING_FILE = path.join(__dirname, '../../data/pricing.json');

// Default pricing data
const DEFAULT_PRICING = {
  cycle: {
    firstHourRate: 5.00,
    additionalHourRate: 3.00,
  },
  bike: {
    firstHourRate: 10.00,
    additionalHourRate: 5.00,
  },
  car: {
    firstHourRate: 20.00,
    additionalHourRate: 10.00,
  },
  gracePeriod: 15,
  currency: 'INR',
  taxRate: 0,
};

// Ensure data directory exists
const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize pricing file with default data if it doesn't exist
const initializePricingFile = () => {
  if (!fs.existsSync(PRICING_FILE)) {
    fs.writeFileSync(PRICING_FILE, JSON.stringify(DEFAULT_PRICING, null, 2));
  }
};

initializePricingFile();

// @desc    Get all pricing data
// @route   GET /api/pricing
// @access  Private (Super Admin only)
const getPricing = async (req, res, next) => {
  try {
    const pricingData = JSON.parse(fs.readFileSync(PRICING_FILE, 'utf8'));
    
    res.status(200).json({
      success: true,
      data: pricingData
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update pricing data
// @route   PUT /api/pricing
// @access  Private (Super Admin only)
const updatePricing = async (req, res, next) => {
  try {
    const pricingData = req.body;
    
    // Validate required fields
    if (!pricingData.cycle || !pricingData.bike || !pricingData.car) {
      return res.status(400).json({
        success: false,
        message: 'Missing required vehicle type pricing data'
      });
    }
    
    // Validate numeric fields
    const validateRate = (rate) => typeof rate === 'number' && rate >= 0;
    
    for (const vehicleType of ['cycle', 'bike', 'car']) {
      if (!validateRate(pricingData[vehicleType].firstHourRate) || 
          !validateRate(pricingData[vehicleType].additionalHourRate)) {
        return res.status(400).json({
          success: false,
          message: `Invalid pricing data for ${vehicleType}`
        });
      }
    }
    
    if (!validateRate(pricingData.gracePeriod) || !validateRate(pricingData.taxRate)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid grace period or tax rate'
      });
    }
    
    // Save to file
    fs.writeFileSync(PRICING_FILE, JSON.stringify(pricingData, null, 2));
    
    res.status(200).json({
      success: true,
      message: 'Pricing updated successfully',
      data: pricingData
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get pricing for specific vehicle type
// @route   GET /api/pricing/:vehicleType
// @access  Private (Super Admin only)
const getVehiclePricing = async (req, res, next) => {
  try {
    const { vehicleType } = req.params;
    const validTypes = ['cycle', 'bike', 'car'];
    
    if (!validTypes.includes(vehicleType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid vehicle type. Must be cycle, bike, or car'
      });
    }
    
    const pricingData = JSON.parse(fs.readFileSync(PRICING_FILE, 'utf8'));
    
    res.status(200).json({
      success: true,
      data: {
        vehicleType,
        pricing: pricingData[vehicleType],
        currency: pricingData.currency,
        taxRate: pricingData.taxRate
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get pricing data for staff (read-only)
// @route   GET /api/pricing/stand
// @access  Private (Staff and Admin roles)
const getStandPricing = async (req, res, next) => {
  try {
    const pricingData = JSON.parse(fs.readFileSync(PRICING_FILE, 'utf8'));
    
    // Return only the pricing information without sensitive data
    const standPricing = {
      cycle: pricingData.cycle,
      bike: pricingData.bike,
      car: pricingData.car,
      gracePeriod: pricingData.gracePeriod,
      currency: pricingData.currency,
      taxRate: pricingData.taxRate
    };
    
    res.status(200).json({
      success: true,
      data: standPricing
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPricing,
  updatePricing,
  getVehiclePricing,
  getStandPricing
};