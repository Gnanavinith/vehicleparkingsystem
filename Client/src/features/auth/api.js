import api from '../../config/axios';

export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const loginSuperAdmin = async (credentials) => {
  const response = await api.post('/auth/login-super-admin', credentials);
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await api.post('/auth/forgot-password', { email });
  return response.data;
};

export const resetPassword = async (token, password) => {
  const response = await api.post('/auth/reset-password', { token, password });
  return response.data;
};

export default {
  login,
  loginSuperAdmin,
  forgotPassword,
  resetPassword,
};
