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
    const Parking = require('../models/Parking');
    
    let parkings;
    if (req.user.role === 'super_admin') {
      // Super admin gets all parkings
      parkings = await Parking.find({ status: 'completed' });
    } else {
      // Stand admin gets only their stand's parkings
      if (!req.user.stand) {
        return res.status(404).json({
          success: false,
          message: 'No stand assigned to this admin'
        });
      }
      parkings = await Parking.find({ 
        stand: req.user.stand,
        status: 'completed' 
      });
    }
    
    // Group by month for the last 8 months
    const now = new Date();
    const revenueData = [];
    
    for (let i = 7; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      
      const monthParkings = parkings.filter(p => {
        const checkoutDate = new Date(p.outTime || p.updatedAt);
        return checkoutDate >= month && checkoutDate < nextMonth;
      });
      
      const revenue = monthParkings.reduce((sum, p) => sum + (p.amount || 0), 0);
      
      revenueData.push({
        date: month.toLocaleDateString('en-US', { month: 'short' }),
        revenue: revenue,
        expenses: revenue * 0.3, // Placeholder expenses
        profit: revenue * 0.7  // Placeholder profit
      });
    }
    
    res.status(200).json({
      success: true,
      data: revenueData
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
      outTime: {
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
      outTime: {
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

// @desc    Get occupancy data
// @route   GET /api/reports/occupancy
// @access  Private (Stand Admin and above)
const getOccupancyData = async (req, res, next) => {
  try {
    const Parking = require('../models/Parking');
    
    let parkings;
    if (req.user.role === 'super_admin') {
      // Super admin gets all parkings
      parkings = await Parking.find({});
    } else {
      // Stand admin gets only their stand's parkings
      if (!req.user.stand) {
        return res.status(404).json({
          success: false,
          message: 'No stand assigned to this admin'
        });
      }
      parkings = await Parking.find({ stand: req.user.stand });
    }
    
    // Calculate occupancy by day of week
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const occupancyByDay = {};
    days.forEach(day => occupancyByDay[day] = []);
    
    parkings.forEach(parking => {
      const dayOfWeek = days[new Date(parking.createdAt).getDay()];
      occupancyByDay[dayOfWeek].push(parking);
    });
    
    const occupancyData = days.map(day => {
      // Calculate average occupancy percentage for this day
      const avgOccupancy = Math.min(100, Math.round((occupancyByDay[day].length / 10) * 100)); // Assuming 10 is typical capacity
      return {
        name: day,
        value: avgOccupancy
      };
    });
    
    res.status(200).json({
      success: true,
      data: occupancyData
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get zone distribution data
// @route   GET /api/reports/zones
// @access  Private (Stand Admin and above)
const getZoneDistribution = async (req, res, next) => {
  try {
    // For now, return placeholder data
    // In a real implementation, this would query actual zone data
    const zoneData = [
      { name: 'Zone A', value: 35 },
      { name: 'Zone B', value: 25 },
      { name: 'Zone C', value: 20 },
      { name: 'Zone D', value: 20 },
    ];
    
    res.status(200).json({
      success: true,
      data: zoneData
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get hourly activity data
// @route   GET /api/reports/hourly
// @access  Private (Stand Admin and above)
const getHourlyActivity = async (req, res, next) => {
  try {
    const Parking = require('../models/Parking');
    
    let parkings;
    if (req.user.role === 'super_admin') {
      // Super admin gets all parkings
      parkings = await Parking.find({});
    } else {
      // Stand admin gets only their stand's parkings
      if (!req.user.stand) {
        return res.status(404).json({
          success: false,
          message: 'No stand assigned to this admin'
        });
      }
      parkings = await Parking.find({ stand: req.user.stand });
    }
    
    // Group parkings by hour
    const hourlyCounts = {};
    for (let i = 0; i < 24; i++) {
      const hour = i < 6 ? `${i+6}am` : i < 12 ? `${i}am` : i === 12 ? '12pm' : i < 18 ? `${i-12}pm` : `${i-12}pm`;
      hourlyCounts[hour] = 0;
    }
    
    // Adjust for the correct mapping
    parkings.forEach(parking => {
      const hour = new Date(parking.createdAt).getHours();
      let hourLabel;
      if (hour === 0) hourLabel = '12am';
      else if (hour < 6) hourLabel = `${hour+6}am`;  // Shift to start at 6am
      else if (hour < 12) hourLabel = `${hour}am`;
      else if (hour === 12) hourLabel = '12pm';
      else if (hour < 18) hourLabel = `${hour-12}pm`;
      else if (hour < 22) hourLabel = `${hour-12}pm`;
      else hourLabel = `${hour-12}pm`;
      
      if (hourlyCounts[hourLabel] !== undefined) {
        hourlyCounts[hourLabel]++;
      }
    });
    
    // Convert to the format expected by the frontend
    const activityData = [
      { hour: '6am', vehicles: hourlyCounts['6am'] || 0 },
      { hour: '8am', vehicles: hourlyCounts['8am'] || 0 },
      { hour: '10am', vehicles: hourlyCounts['10am'] || 0 },
      { hour: '12pm', vehicles: hourlyCounts['12pm'] || 0 },
      { hour: '2pm', vehicles: hourlyCounts['2pm'] || 0 },
      { hour: '4pm', vehicles: hourlyCounts['4pm'] || 0 },
      { hour: '6pm', vehicles: hourlyCounts['6pm'] || 0 },
      { hour: '8pm', vehicles: hourlyCounts['8pm'] || 0 },
      { hour: '10pm', vehicles: hourlyCounts['10pm'] || 0 },
    ];
    
    res.status(200).json({
      success: true,
      data: activityData
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
  getDashboardStats,
  getOccupancyData,
  getZoneDistribution,
  getHourlyActivity
};