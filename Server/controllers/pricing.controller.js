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
    console.log('getStandPricing called with user:', req.user);
    
    // All authenticated users (super_admin, stand_admin, staff) can access stand pricing
    // super_admin gets global pricing, others get their assigned stand's pricing
    if (req.user.role === 'super_admin') {
      // Super admin gets global pricing from file
      const PRICING_FILE = path.join(__dirname, '../../data/pricing.json');
      const pricingData = JSON.parse(fs.readFileSync(PRICING_FILE, 'utf8'));
      
      // Return only the pricing information without sensitive data
      const standPricing = {
        cycle: {
          firstHourRate: pricingData.cycle?.firstHourRate || pricingData.cycle || 5,
          additionalHourRate: pricingData.cycle?.additionalHourRate || (pricingData.cycle ? Math.floor((pricingData.cycle || 5) / 2) : 3)
        },
        bike: {
          firstHourRate: pricingData.bike?.firstHourRate || pricingData.bike || 10,
          additionalHourRate: pricingData.bike?.additionalHourRate || (pricingData.bike ? Math.floor((pricingData.bike || 10) / 2) : 5)
        },
        car: {
          firstHourRate: pricingData.car?.firstHourRate || pricingData.car || 20,
          additionalHourRate: pricingData.car?.additionalHourRate || (pricingData.car ? Math.floor((pricingData.car || 20) / 2) : 10)
        },
        currency: pricingData.currency || 'INR',
        gracePeriod: pricingData.gracePeriod || 15,
        taxRate: pricingData.taxRate || 0
      };
      
      res.status(200).json({
        success: true,
        data: standPricing
      });
    } else {
      // For stand admins and staff, get pricing from their assigned stand
      const User = require('../models/User');
      const Stand = require('../models/Stand');
      
      // Get the user to find their assigned stand
      const user = await User.findById(req.user.id).populate('stand', 'pricing currency');
      
      if (!user || !user.stand) {
        return res.status(404).json({
          success: false,
          message: 'No stand assigned to this user'
        });
      }
      
      // Return pricing from the assigned stand in the format expected by the frontend
      const standPricing = {
        cycle: {
          firstHourRate: user.stand.pricing?.cycle || 5,
          additionalHourRate: user.stand.pricing?.cycle ? Math.floor((user.stand.pricing?.cycle || 5) / 2) : 3
        },
        bike: {
          firstHourRate: user.stand.pricing?.bike || 10,
          additionalHourRate: user.stand.pricing?.bike ? Math.floor((user.stand.pricing?.bike || 10) / 2) : 5
        },
        car: {
          firstHourRate: user.stand.pricing?.car || 20,
          additionalHourRate: user.stand.pricing?.car ? Math.floor((user.stand.pricing?.car || 20) / 2) : 10
        },
        currency: user.stand.currency || 'INR',
        gracePeriod: 15,
        taxRate: 0
      };
      
      res.status(200).json({
        success: true,
        data: standPricing
      });
    }
  } catch (error) {
    next(error);
  }
};

const updateStandPricing = async (req, res, next) => {
  try {
    // For stand admins, update pricing for their assigned stand
    if (req.user.role === 'stand_admin') {
      const User = require('../models/User');
      const Stand = require('../models/Stand');
      
      // Get the user to find their assigned stand
      const user = await User.findById(req.user.id).populate('stand');
      
      if (!user || !user.stand) {
        return res.status(404).json({
          success: false,
          message: 'No stand assigned to this user'
        });
      }
      
      const { pricing } = req.body;
      
      // Validate required fields
      if (!pricing || !pricing.cycle || !pricing.bike || !pricing.car) {
        return res.status(400).json({
          success: false,
          message: 'Missing required pricing data (cycle, bike, car)'
        });
      }
      
      // Validate numeric fields
      const validateRate = (rate) => typeof rate === 'number' && rate >= 0;
      
      if (!validateRate(pricing.cycle) || !validateRate(pricing.bike) || !validateRate(pricing.car)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid pricing values. Must be positive numbers.'
        });
      }
      
      // Update the stand's pricing
      const updatedStand = await Stand.findByIdAndUpdate(
        user.stand._id,
        { 
          pricing: {
            cycle: pricing.cycle,
            bike: pricing.bike,
            car: pricing.car
          }
        },
        { new: true, runValidators: true }
      );
      
      res.status(200).json({
        success: true,
        message: 'Stand pricing updated successfully',
        data: {
          cycle: updatedStand.pricing.cycle,
          bike: updatedStand.pricing.bike,
          car: updatedStand.pricing.car,
          currency: updatedStand.currency
        }
      });
    } else if (req.user.role === 'staff') {
      // Staff members cannot update pricing
      return res.status(403).json({
        success: false,
        message: 'Access denied. Staff members cannot update pricing. Only stand admins can update their stand pricing.'
      });
    } else {
      // Super admin or other roles
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only stand admins can update their stand pricing.'
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPricing,
  updatePricing,
  getVehiclePricing,
  getStandPricing,
  updateStandPricing
};