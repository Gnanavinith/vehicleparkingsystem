const User = require('../models/User');
const Stand = require('../models/Stand');
const Parking = require('../models/Parking');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private (Admin roles)
const getDashboardStats = async (req, res, next) => {
  try {
    let stats = {};
    
    if (req.user.role === 'super_admin') {
      // Super admin gets stats for entire system
      const totalStands = await Stand.countDocuments();
      const activeStands = await Stand.countDocuments({ status: 'active' });
      const totalStaff = await User.countDocuments({ role: 'staff' });
      const activeStaff = await User.countDocuments({ role: 'staff', isActive: true });
      const totalStandAdmins = await User.countDocuments({ role: 'stand_admin' });
      const activeStandAdmins = await User.countDocuments({ role: 'stand_admin', isActive: true });
      const totalParkings = await Parking.countDocuments();
      const activeParkings = await Parking.countDocuments({ status: 'active' });
      
      stats = {
        stands: {
          total: totalStands,
          active: activeStands,
          inactive: totalStands - activeStands
        },
        staff: {
          total: totalStaff,
          active: activeStaff,
          inactive: totalStaff - activeStaff
        },
        standAdmins: {
          total: totalStandAdmins,
          active: activeStandAdmins,
          inactive: totalStandAdmins - activeStandAdmins
        },
        parkings: {
          total: totalParkings,
          active: activeParkings,
          completed: await Parking.countDocuments({ status: 'completed' }),
          cancelled: await Parking.countDocuments({ status: 'cancelled' })
        }
      };
    } else if (req.user.role === 'stand_admin') {
      // Stand admin gets stats for their stand only
      const userStand = await User.findById(req.user.id).populate('stand');
      if (!userStand.stand) {
        return res.status(404).json({
          success: false,
          message: 'No stand assigned to this admin'
        });
      }
      
      const standStaff = await User.countDocuments({ 
        role: 'staff', 
        stand: userStand.stand._id,
        isActive: true 
      });
      
      const standParkings = await Parking.countDocuments({ 
        stand: userStand.stand._id 
      });
      
      const activeParkings = await Parking.countDocuments({ 
        stand: userStand.stand._id,
        status: 'active' 
      });
      
      // Calculate today's revenue for this stand
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      
      const todayParkings = await Parking.find({
        stand: userStand.stand._id,
        outTime: {
          $gte: startOfDay,
          $lte: endOfDay
        },
        status: 'completed'
      });
      
      const todayRevenue = todayParkings.reduce((sum, parking) => sum + (parking.amount || 0), 0);
      
      stats = {
        stand: {
          name: userStand.stand.name,
          location: userStand.stand.location,
          capacity: userStand.stand.capacity,
          currentOccupancy: userStand.stand.currentOccupancy || 0
        },
        staff: {
          total: standStaff
        },
        parkings: {
          total: standParkings,
          active: activeParkings,
          completed: await Parking.countDocuments({ 
            stand: userStand.stand._id,
            status: 'completed' 
          }),
          cancelled: await Parking.countDocuments({ 
            stand: userStand.stand._id,
            status: 'cancelled' 
          })
        },
        todayRevenue: todayRevenue
      };
      
      console.log('Stand admin dashboard stats:', stats);
    }
    
    console.log('Sending dashboard response:', { success: true, data: stats });
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats
};