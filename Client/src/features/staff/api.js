import api from '../../config/axios';

export const getProfile = async () => {
  const response = await api.get('/auth/profile');
  return response.data.data;
};

export const getTodayParkings = async () => {
  const response = await api.get('/parkings/today');
  return response.data.data;
};

export const getActiveParkings = async () => {
  const response = await api.get('/parkings/active');
  return response.data.data;
};

export const getAllParkings = async () => {
  const response = await api.get('/parkings');
  return response.data.data;
};

export const searchParkingByVehicleNumber = async (vehicleNumber) => {
  const response = await api.get(`/parkings/search?vehicleNumber=${encodeURIComponent(vehicleNumber)}`);
  return response.data.data;
};

export const createParking = async (data) => {
  const response = await api.post('/parkings', data);
  return response.data;
};

export const getParkingById = async (id) => {
  const response = await api.get(`/parkings/${id}`);
  return response.data.data;
};

export const checkoutParking = async (id, checkoutData = {}) => {
  const response = await api.post(`/parkings/${id}/checkout`, checkoutData);
  return response.data;
};

export const getStandPricing = async () => {
  const response = await api.get('/pricing/stand');
  return response.data.data;
};

export default {
  getTodayParkings,
  getActiveParkings,
  getAllParkings,
  createParking,
  getParkingById,
  checkoutParking,
  getStandPricing,
};
