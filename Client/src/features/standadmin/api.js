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

export const getReports = async () => {
  const response = await api.get('/reports/daily');
  return response.data.data || response.data; // Handle both response formats
};

export default {
  getStaff,
  createStaff,
  getParkings,
  getReports,
};
