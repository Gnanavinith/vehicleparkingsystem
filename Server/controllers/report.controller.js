const { generateDailyReport, generateMonthlyReport } = require('../services/report.service');

// @desc    Get daily report
// @route   GET /api/reports/daily
// @access  Private (Stand Admin and above)
const getDailyReport = async (req, res, next) => {
  try {
    const date = req.query.date ? new Date(req.query.date) : new Date();
    
    const report = await generateDailyReport(date);

    res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get monthly report
// @route   GET /api/reports/monthly
// @access  Private (Stand Admin and above)
const getMonthlyReport = async (req, res, next) => {
  try {
    const month = req.query.month ? parseInt(req.query.month) - 1 : new Date().getMonth();
    const year = req.query.year ? parseInt(req.query.year) : new Date().getFullYear();
    
    const report = await generateMonthlyReport(month, year);

    res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get stand-specific report
// @route   GET /api/reports/stand/:standId
// @access  Private (Stand Admin and above)
const getStandReport = async (req, res, next) => {
  try {
    // This would require implementing stand-specific reporting logic
    // For now, returning a placeholder
    
    res.status(200).json({
      success: true,
      message: 'Stand report functionality to be implemented',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get revenue statistics
// @route   GET /api/reports/revenue
// @access  Private (Stand Admin and above)
const getRevenueStats = async (req, res, next) => {
  try {
    // This would require implementing revenue statistics logic
    // For now, returning a placeholder
    
    res.status(200).json({
      success: true,
      message: 'Revenue statistics functionality to be implemented',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard statistics for superadmin
// @route   GET /api/reports/dashboard
// @access  Private (Super Admin only)
const getDashboardStats = async (req, res, next) => {
  try {
    // Only allow super admin access
    if (req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Super admin only.'
      });
    }

    // Get counts for different entities
    const Stand = require('../models/Stand');
    const User = require('../models/User');
    const Parking = require('../models/Parking');

    const totalStands = await Stand.countDocuments({});
    const totalStandAdmins = await User.countDocuments({ role: 'stand_admin' });
    const totalStaff = await User.countDocuments({ role: 'staff' });
    const activeParkings = await Parking.countDocuments({ status: 'active' });

    // Calculate today's revenue
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todayParkings = await Parking.find({
      checkoutTime: {
        $gte: startOfDay,
        $lte: endOfDay
      },
      status: 'completed'
    });

    const todayRevenue = todayParkings.reduce((sum, parking) => sum + (parking.amount || 0), 0);

    // Calculate monthly revenue (current month)
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59, 999);

    const monthlyParkings = await Parking.find({
      checkoutTime: {
        $gte: startOfMonth,
        $lte: endOfMonth
      },
      status: 'completed'
    });

    const monthlyRevenue = monthlyParkings.reduce((sum, parking) => sum + (parking.amount || 0), 0);

    res.status(200).json({
      success: true,
      data: {
        totalStands,
        totalStandAdmins,
        totalStaff,
        activeParkings,
        todayRevenue,
        monthlyRevenue
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDailyReport,
  getMonthlyReport,
  getStandReport,
  getRevenueStats,
  getDashboardStats
};