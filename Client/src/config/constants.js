export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  
  // Vehicle Stands
  VEHICLE_STANDS: '/vehicle-stands',
  CREATE_STAND: '/vehicle-stands',
  UPDATE_STAND: (id) => `/vehicle-stands/${id}`,
  DELETE_STAND: (id) => `/vehicle-stands/${id}`,
  
  // Users
  USERS: '/users',
  CREATE_USER: '/users',
  UPDATE_USER: (id) => `/users/${id}`,
  DELETE_USER: (id) => `/users/${id}`,
  
  // Parkings
  PARKINGS: '/parkings',
  CREATE_PARKING: '/parkings',
  CHECKOUT_PARKING: (id) => `/parkings/${id}/checkout`,
  PARKING_HISTORY: '/parkings/history',
  
  // Reports
  DAILY_REPORT: '/reports/daily',
  MONTHLY_REPORT: '/reports/monthly',
  STAND_REPORT: (standId) => `/reports/stand/${standId}`,
};

export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  STAND_ADMIN: 'stand_admin',
  STAFF: 'staff',
};

export const PARKING_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
};

export default {
  API_ENDPOINTS,
  ROLES,
  PARKING_STATUS,
  PAYMENT_STATUS,
};
