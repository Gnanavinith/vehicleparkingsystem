import api from '../../config/axios';

export const getVehicleStands = async () => {
  const response = await api.get('/vehicle-stands');
  return response.data;
};

export const createVehicleStand = async (data) => {
  const response = await api.post('/vehicle-stands', data);
  return response.data;
};

export const updateVehicleStand = async (id, data) => {
  const response = await api.put(`/vehicle-stands/${id}`, data);
  return response.data;
};

export const deleteVehicleStand = async (id) => {
  const response = await api.delete(`/vehicle-stands/${id}`);
  return response.data;
};

export const getStandAdmins = async () => {
  const response = await api.get('/users?role=stand_admin');
  return response.data;
};

export const createStandAdmin = async (data) => {
  const response = await api.post('/users', data);
  return response.data;
};

export default {
  getVehicleStands,
  createVehicleStand,
  updateVehicleStand,
  deleteVehicleStand,
  getStandAdmins,
  createStandAdmin,
};
