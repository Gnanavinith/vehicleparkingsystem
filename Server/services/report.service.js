const Parking = require('../models/Parking');
const Stand = require('../models/Stand');

const generateDailyReport = async (date = new Date()) => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const parkings = await Parking.find({
    entryTime: {
      $gte: startOfDay,
      $lte: endOfDay
    },
    status: 'completed'
  }).populate('stand', 'name location');

  const totalParkings = parkings.length;
  const totalRevenue = parkings.reduce((sum, parking) => sum + (parking.amount || 0), 0);
  const avgDuration = parkings.length > 0 
    ? Math.round(parkings.reduce((sum, parking) => sum + (parking.duration || 0), 0) / parkings.length)
    : 0;

  // Group by stand
  const standStats = {};
  parkings.forEach(parking => {
    const standId = parking.stand._id.toString();
    if (!standStats[standId]) {
      standStats[standId] = {
        standName: parking.stand.name,
        location: parking.stand.location,
        totalParkings: 0,
        totalRevenue: 0
      };
    }
    standStats[standId].totalParkings++;
    standStats[standId].totalRevenue += parking.amount || 0;
  });

  return {
    date: startOfDay,
    totalParkings,
    totalRevenue,
    averageDuration: avgDuration,
    standStats: Object.values(standStats)
  };
};

const generateMonthlyReport = async (month = new Date().getMonth(), year = new Date().getFullYear()) => {
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0, 23, 59, 59, 999);

  const parkings = await Parking.find({
    entryTime: {
      $gte: startDate,
      $lte: endDate
    },
    status: 'completed'
  });

  const dailyStats = {};
  const stands = await Stand.find({});

  // Initialize daily stats
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateKey = d.toISOString().split('T')[0];
    dailyStats[dateKey] = {
      date: new Date(d),
      totalParkings: 0,
      totalRevenue: 0,
      standStats: {}
    };
    
    stands.forEach(stand => {
      dailyStats[dateKey].standStats[stand._id.toString()] = {
        standName: stand.name,
        totalParkings: 0,
        totalRevenue: 0
      };
    });
  }

  // Populate stats
  parkings.forEach(parking => {
    const dateKey = parking.entryTime.toISOString().split('T')[0];
    if (dailyStats[dateKey]) {
      dailyStats[dateKey].totalParkings++;
      dailyStats[dateKey].totalRevenue += parking.amount || 0;
      
      const standId = parking.stand.toString();
      if (dailyStats[dateKey].standStats[standId]) {
        dailyStats[dateKey].standStats[standId].totalParkings++;
        dailyStats[dateKey].standStats[standId].totalRevenue += parking.amount || 0;
      }
    }
  });

  const totalParkings = parkings.length;
  const totalRevenue = parkings.reduce((sum, parking) => sum + (parking.amount || 0), 0);

  return {
    month: startDate.toLocaleString('default', { month: 'long' }),
    year,
    totalParkings,
    totalRevenue,
    dailyStats: Object.values(dailyStats)
  };
};

module.exports = {
  generateDailyReport,
  generateMonthlyReport
};