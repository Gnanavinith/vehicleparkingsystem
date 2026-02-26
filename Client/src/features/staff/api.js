import api from '../../config/axios';

export const getTodayParkings = async () => {
  const response = await api.get('/parkings/today');
  return response.data;
};

export const searchParkingByVehicleNumber = async (vehicleNumber) => {
  const response = await api.get(`/parkings/search?vehicleNumber=${encodeURIComponent(vehicleNumber)}`);
  return response.data;
};

export const createParking = async (data) => {
  const response = await api.post('/parkings', data);
  return response.data;
};

export const getParkingById = async (id) => {
  const response = await api.get(`/parkings/${id}`);
  return response.data;
};

export const checkoutParking = async (id) => {
  const response = await api.post(`/parkings/${id}/checkout`);
  return response.data;
};

export default {
  getTodayParkings,
  createParking,
  getParkingById,
  checkoutParking,
};
