const Parking = require('../models/Parking');
const Stand = require('../models/Stand');
const { calculateAmount } = require('../utils/calculateAmount');

// @desc    Create new parking entry
// @route   POST /api/parking/in
// @access  Private (Staff only)
const createParking = async (req, res, next) => {
  try {
    const { vehicleNumber, vehicleType } = req.body;
    
    // Validate required fields
    if (!vehicleNumber || !vehicleType) {
      return res.status(400).json({
        success: false,
        message: 'Vehicle number and type are required'
      });
    }

    // Generate unique token ID
    const tokenId = `TK${Date.now().toString().slice(-8)}`;
    
    // Get staff's stand
    const stand = await Stand.findById(req.user.stand);
    if (!stand) {
      return res.status(404).json({
        success: false,
        message: 'Stand not found'
      });
    }

    // Check if vehicle is already parked
    const existingParking = await Parking.findOne({
      vehicleNumber: vehicleNumber.toUpperCase(),
      status: 'active',
      stand: req.user.stand
    });

    if (existingParking) {
      return res.status(400).json({
        success: false,
        message: 'Vehicle is already parked'
      });
    }

    // Check stand capacity
    if (stand.currentOccupancy >= stand.capacity) {
      return res.status(400).json({
        success: false,
        message: 'Stand is at full capacity'
      });
    }

    // Create parking entry
    const parking = await Parking.create({
      tokenId,
      vehicleNumber: vehicleNumber.toUpperCase(),
      vehicleType: vehicleType.toLowerCase(),
      stand: req.user.stand,
      staff: req.user.id
    });

    // Update stand occupancy
    stand.currentOccupancy += 1;
    await stand.save();

    res.status(201).json({
      success: true,
      message: 'Vehicle parked successfully',
      data: parking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Checkout vehicle by ID
// @route   POST /api/parking/:id/checkout
// @access  Private (Staff only)
const checkoutParkingById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const parking = await Parking.findOne({
      _id: id,
      status: 'active',
      stand: req.user.stand
    });
    
    if (!parking) {
      return res.status(404).json({
        success: false,
        message: 'Active parking entry not found'
      });
    }

    // Set checkout time
    parking.outTime = new Date();
    parking.status = 'completed';
    
    // Calculate amount
    const stand = await Stand.findById(req.user.stand);
    parking.amount = calculateAmount(
      parking.inTime, 
      parking.outTime, 
      parking.vehicleType, 
      stand.hourlyRate
    );
    
    await parking.save();

    // Update stand occupancy
    const standDoc = await Stand.findById(req.user.stand);
    if (standDoc.currentOccupancy > 0) {
      standDoc.currentOccupancy -= 1;
      await standDoc.save();
    }

    res.status(200).json({
      success: true,
      message: 'Vehicle checked out successfully',
      data: parking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Checkout vehicle
// @route   POST /api/parking/out
// @access  Private (Staff only)
const checkoutParking = async (req, res, next) => {
  try {
    const { tokenId, vehicleNumber } = req.body;
    
    // Need either tokenId or vehicleNumber
    if (!tokenId && !vehicleNumber) {
      return res.status(400).json({
        success: false,
        message: 'Token ID or Vehicle Number is required'
      });
    }

    // Find active parking
    let query = { status: 'active', stand: req.user.stand };
    
    if (tokenId) {
      query.tokenId = tokenId;
    } else {
      query.vehicleNumber = vehicleNumber.toUpperCase();
    }

    const parking = await Parking.findOne(query);
    
    if (!parking) {
      return res.status(404).json({
        success: false,
        message: 'Active parking entry not found'
      });
    }

    // Set checkout time
    parking.outTime = new Date();
    parking.status = 'completed';
    
    // Calculate amount
    const stand = await Stand.findById(req.user.stand);
    parking.amount = calculateAmount(
      parking.inTime, 
      parking.outTime, 
      parking.vehicleType, 
      stand.hourlyRate
    );
    
    await parking.save();

    // Update stand occupancy
    const standDoc = await Stand.findById(req.user.stand);
    if (standDoc.currentOccupancy > 0) {
      standDoc.currentOccupancy -= 1;
      await standDoc.save();
    }

    res.status(200).json({
      success: true,
      message: 'Vehicle checked out successfully',
      data: parking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get today's parking list
// @route   GET /api/parking/today
// @access  Private (Staff only)
const getTodayParking = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const parkingList = await Parking.find({
      stand: req.user.stand,
      createdAt: {
        $gte: today,
        $lt: tomorrow
      }
    })
    .populate('staff', 'name email')
    .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: parkingList.length,
      data: parkingList
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get active parkings
// @route   GET /api/parking/active
// @access  Private (Staff only)
const getActiveParkings = async (req, res, next) => {
  try {
    const activeParkings = await Parking.find({
      stand: req.user.stand,
      status: 'active'
    })
    .populate('staff', 'name')
    .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: activeParkings.length,
      data: activeParkings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get parking by token ID
// @route   GET /api/parking/token/:tokenId
// @access  Private (Staff only)
const getParkingByToken = async (req, res, next) => {
  try {
    const { tokenId } = req.params;
    
    const parking = await Parking.findOne({
      tokenId,
      stand: req.user.stand
    })
    .populate('staff', 'name email')
    .populate('stand', 'name location');

    if (!parking) {
      return res.status(404).json({
        success: false,
        message: 'Parking entry not found'
      });
    }

    res.status(200).json({
      success: true,
      data: parking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search parking by vehicle number
// @route   GET /api/parking/search
// @access  Private (Staff only)
const searchParkingByVehicleNumber = async (req, res, next) => {
  try {
    const { vehicleNumber } = req.query;
    
    if (!vehicleNumber) {
      return res.status(400).json({
        success: false,
        message: 'Vehicle number is required'
      });
    }

    const parkings = await Parking.find({
      vehicleNumber: { $regex: vehicleNumber, $options: 'i' },
      stand: req.user.stand,
      status: 'active'
    })
    .populate('staff', 'name')
    .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: parkings.length,
      data: parkings
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createParking,
  checkoutParking,
  checkoutParkingById,
  getTodayParking,
  getActiveParkings,
  getParkingByToken,
  searchParkingByVehicleNumber
};