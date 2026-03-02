import api from '../../config/axios';

export const getStaff = async () => {
  try {
    console.log('Making API call to /staff');
    const token = localStorage.getItem('token');
    console.log('Token present:', !!token);
    
    const response = await api.get('/staff');
    console.log('API Response:', response.data);
    return response.data.data; // Return the actual data array, not the full response
  } catch (error) {
    console.error('API Error:', error);
    if (error.response) {
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);
    }
    throw error;
  }
};

export const createStaff = async (data) => {
  const response = await api.post('/staff', data);
  return response.data;
};

export const updateStaff = async (id, data) => {
  const response = await api.put(`/staff/${id}`, data);
  return response.data;
};

export const deleteStaff = async (id) => {
  const response = await api.delete(`/staff/${id}`);
  return response.data;
};

export const getStaffStats = async () => {
  const response = await api.get('/staff/stats');
  return response.data.data;
};

export const getStaffMember = async (id) => {
  const response = await api.get(`/staff/${id}`);
  return response.data.data;
};

export const getParkings = async () => {
  const response = await api.get('/parkings');
  return response.data.data || response.data; // Handle both response formats
};

export const getDailyReport = async () => {
  const response = await api.get('/reports/daily');
  return response.data.data || response.data;
};

export const getMonthlyReport = async () => {
  const response = await api.get('/reports/monthly');
  return response.data.data || response.data;
};

export const getDashboardStats = async () => {
  try {
    console.log('Fetching dashboard stats...');
    const response = await api.get('/dashboard/stats');
    console.log('Dashboard stats response:', response.data);
    console.log('Full response:', response);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    if (error.response) {
      console.error('Error response data:', error.response.data);
    }
    throw error;
  }
};

export const getRevenueChart = async () => {
  // Fetch revenue chart data for stand admin
  const response = await api.get('/reports/revenue');
  return response.data.data || [
    { date: 'Jan', revenue: 12000, expenses: 4000, profit: 8000 },
    { date: 'Feb', revenue: 14500, expenses: 4500, profit: 10000 },
    { date: 'Mar', revenue: 13800, expenses: 4200, profit: 9600 },
    { date: 'Apr', revenue: 16200, expenses: 5100, profit: 11100 },
    { date: 'May', revenue: 15800, expenses: 4800, profit: 11000 },
    { date: 'Jun', revenue: 17500, expenses: 5400, profit: 12100 },
    { date: 'Jul', revenue: 18900, expenses: 5800, profit: 13100 },
    { date: 'Aug', revenue: 18200, expenses: 5600, profit: 12600 },
  ];
};

export const getOccupancyData = async () => {
  // Fetch occupancy data for stand admin
  const response = await api.get('/reports/occupancy');
  return response.data.data || [
    { name: 'Mon', value: 72 },
    { name: 'Tue', value: 85 },
    { name: 'Wed', value: 91 },
    { name: 'Thu', value: 88 },
    { name: 'Fri', value: 95 },
    { name: 'Sat', value: 78 },
    { name: 'Sun', value: 60 },
  ];
};

export const getZoneDistribution = async () => {
  // Fetch zone distribution data for stand admin
  const response = await api.get('/reports/zones');
  return response.data.data || [
    { name: 'Zone A', value: 35 },
    { name: 'Zone B', value: 25 },
    { name: 'Zone C', value: 20 },
    { name: 'Zone D', value: 20 },
  ];
};

export const getHourlyActivity = async () => {
  // Fetch hourly activity data for stand admin
  const response = await api.get('/reports/hourly');
  return response.data.data || [
    { hour: '6am',  vehicles: 8 },
    { hour: '8am',  vehicles: 22 },
    { hour: '10am', vehicles: 35 },
    { hour: '12pm', vehicles: 42 },
    { hour: '2pm',  vehicles: 38 },
    { hour: '4pm',  vehicles: 45 },
    { hour: '6pm',  vehicles: 39 },
    { hour: '8pm',  vehicles: 25 },
    { hour: '10pm', vehicles: 12 },
  ];
};

export default {
  getStaff,
  createStaff,
  getParkings,
};
