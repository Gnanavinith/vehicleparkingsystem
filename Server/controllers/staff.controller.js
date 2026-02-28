const User = require('../models/User');
const Stand = require('../models/Stand');
const bcrypt = require('bcryptjs');

// @desc    Get all staff members
// @route   GET /api/staff
// @access  Private (Stand Admin only)
const getStaff = async (req, res, next) => {
  try {
    let query = { role: 'staff' };
    
    // If stand admin, only get staff from their stand
    if (req.user.role === 'stand_admin' && req.user.stand) {
      query.stand = req.user.stand;
    }

    const staff = await User.find(query)
      .select('-password')
      .populate('stand', 'name location')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: staff.length,
      data: staff
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single staff member
// @route   GET /api/staff/:id
// @access  Private (Stand Admin only)
const getStaffMember = async (req, res, next) => {
  try {
    const staff = await User.findById(req.params.id)
      .select('-password')
      .populate('stand', 'name location');

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: 'Staff member not found'
      });
    }

    // Check if stand admin is trying to access staff from different stand
    if (req.user.role === 'stand_admin' && 
        req.user.stand && 
        staff.stand && 
        staff.stand.toString() !== req.user.stand.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this staff member'
      });
    }

    res.status(200).json({
      success: true,
      data: staff
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new staff member
// @route   POST /api/staff
// @access  Private (Stand Admin only)
const createStaff = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create staff member
    const staff = await User.create({
      name,
      email,
      password,
      phone,
      role: 'staff',
      stand: req.user.stand, // Assign to admin's stand
      isActive: true
    });

    res.status(201).json({
      success: true,
      message: 'Staff member created successfully',
      data: {
        id: staff._id,
        name: staff.name,
        email: staff.email,
        phone: staff.phone,
        role: staff.role,
        stand: staff.stand
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update staff member
// @route   PUT /api/staff/:id
// @access  Private (Stand Admin only)
const updateStaff = async (req, res, next) => {
  try {
    let staff = await User.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({
        success: false,
        message: 'Staff member not found'
      });
    }

    // Check if stand admin is trying to update staff from different stand
    if (req.user.role === 'stand_admin' && 
        req.user.stand && 
        staff.stand && 
        staff.stand.toString() !== req.user.stand.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this staff member'
      });
    }

    // Prevent role changes
    if (req.body.role && req.body.role !== 'staff') {
      return res.status(400).json({
        success: false,
        message: 'Cannot change staff member role'
      });
    }

    // Handle password update
    let updateData = { ...req.body };
    if (updateData.password) {
      // If password is provided, hash it
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    } else {
      // If no password provided, remove it from update data to keep existing password
      delete updateData.password;
    }

    // Update staff member
    staff = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
        select: '-password'
      }
    ).populate('stand', 'name location');

    res.status(200).json({
      success: true,
      message: 'Staff member updated successfully',
      data: staff
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete staff member
// @route   DELETE /api/staff/:id
// @access  Private (Stand Admin only)
const deleteStaff = async (req, res, next) => {
  try {
    const staff = await User.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({
        success: false,
        message: 'Staff member not found'
      });
    }

    // Check if stand admin is trying to delete staff from different stand
    if (req.user.role === 'stand_admin' && 
        req.user.stand && 
        staff.stand && 
        staff.stand.toString() !== req.user.stand.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this staff member'
      });
    }

    // Soft delete - deactivate instead of remove
    staff.isActive = false;
    await staff.save();

    res.status(200).json({
      success: true,
      message: 'Staff member deactivated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get staff statistics
// @route   GET /api/staff/stats
// @access  Private (Stand Admin only)
const getStaffStats = async (req, res, next) => {
  try {
    let query = { role: 'staff' };
    
    // If stand admin, only get stats for their stand
    if (req.user.role === 'stand_admin' && req.user.stand) {
      query.stand = req.user.stand;
    }

    const totalStaff = await User.countDocuments(query);
    const activeStaff = await User.countDocuments({ ...query, isActive: true });
    const inactiveStaff = totalStaff - activeStaff;

    res.status(200).json({
      success: true,
      data: {
        total: totalStaff,
        active: activeStaff,
        inactive: inactiveStaff
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStaff,
  getStaffMember,
  createStaff,
  updateStaff,
  deleteStaff,
  getStaffStats
};