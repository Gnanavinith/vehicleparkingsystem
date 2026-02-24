const Stand = require('../models/Stand');
const User = require('../models/User');
const { createStandValidation, updateStandValidation, assignAdminValidation } = require('../validations/stand.validation');

// @desc    Get all stands
// @route   GET /api/stands
// @access  Private (All roles)
const getStands = async (req, res, next) => {
  try {
    const stands = await Stand.find()
      .populate('admin', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: stands.length,
      data: stands
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single stand
// @route   GET /api/stands/:id
// @access  Private (All roles)
const getStand = async (req, res, next) => {
  try {
    const stand = await Stand.findById(req.params.id)
      .populate('admin', 'name email');

    if (!stand) {
      return res.status(404).json({
        success: false,
        message: 'Stand not found'
      });
    }

    res.status(200).json({
      success: true,
      data: stand
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new stand with admin
// @route   POST /api/stands
// @access  Private (Super Admin only)
const createStand = async (req, res, next) => {
  try {
    // Validate request body
    const { error } = createStandValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { name, location, capacity, hourlyRate, description, contactNumber, adminName, adminEmail, adminPassword } = req.body;

    // Check if stand already exists
    const standExists = await Stand.findOne({ name });
    if (standExists) {
      return res.status(400).json({
        success: false,
        message: 'Stand with this name already exists'
      });
    }

    // Check if admin email already exists
    const adminExists = await User.findOne({ email: adminEmail });
    if (adminExists) {
      return res.status(400).json({
        success: false,
        message: 'Admin with this email already exists'
      });
    }

    // Create stand first
    const stand = await Stand.create({
      name,
      location,
      capacity,
      hourlyRate,
      description
    });

    // Create admin user linked to this stand
    const admin = await User.create({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      phone: contactNumber,
      role: 'stand_admin',
      stand: stand._id  // Link the admin to the stand
    });

    // Update stand with admin reference
    stand.admin = admin._id;
    await stand.save();

    res.status(201).json({
      success: true,
      message: 'Stand and admin created successfully',
      data: {
        stand,
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update stand
// @route   PUT /api/stands/:id
// @access  Private (Super Admin only)
const updateStand = async (req, res, next) => {
  try {
    // Validate request body
    const { error } = updateStandValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    let stand = await Stand.findById(req.params.id);
    if (!stand) {
      return res.status(404).json({
        success: false,
        message: 'Stand not found'
      });
    }

    // Update stand
    stand = await Stand.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Stand updated successfully',
      data: stand
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete stand
// @route   DELETE /api/stands/:id
// @access  Private (Super Admin only)
const deleteStand = async (req, res, next) => {
  try {
    const stand = await Stand.findById(req.params.id);
    if (!stand) {
      return res.status(404).json({
        success: false,
        message: 'Stand not found'
      });
    }

    // Check if stand has active parkings
    // This would require checking the Parking model
    // For now, we'll allow deletion

    await stand.remove();

    res.status(200).json({
      success: true,
      message: 'Stand deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Assign admin to stand
// @route   PUT /api/stands/:id/assign-admin
// @access  Private (Super Admin only)
const assignAdmin = async (req, res, next) => {
  try {
    // Validate request body
    const { error } = assignAdminValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { adminId } = req.body;

    // Check if stand exists
    const stand = await Stand.findById(req.params.id);
    if (!stand) {
      return res.status(404).json({
        success: false,
        message: 'Stand not found'
      });
    }

    // Check if admin exists and has correct role
    const admin = await User.findById(adminId);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    if (admin.role !== 'stand_admin') {
      return res.status(400).json({
        success: false,
        message: 'User must be a stand admin'
      });
    }

    // Assign admin to stand
    stand.admin = adminId;
    await stand.save();

    // Update user's stand assignment
    admin.stand = stand._id;
    await admin.save();

    res.status(200).json({
      success: true,
      message: 'Admin assigned to stand successfully',
      data: stand
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStands,
  getStand,
  createStand,
  updateStand,
  deleteStand,
  assignAdmin
};