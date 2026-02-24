export const ROUTES = {
  // Auth routes
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  
  // Super Admin routes
  SUPER_ADMIN_DASHBOARD: '/superadmin/dashboard',
  VEHICLE_STANDS: '/superadmin/vehicle-stands',
  CREATE_STAND: '/superadmin/create-stand',
  STAND_ADMINS: '/superadmin/stand-admins',
  
  // Stand Admin routes
  STAND_ADMIN_DASHBOARD: '/standadmin/dashboard',
  STAFF: '/standadmin/staff',
  CREATE_STAFF: '/standadmin/create-staff',
  PARKINGS: '/standadmin/parkings',
  REPORTS: '/standadmin/reports',
  
  // Staff routes
  STAFF_DASHBOARD: '/staff/dashboard',
  NEW_PARKING: '/staff/new-parking',
  CHECKOUT: '/staff/checkout',
  TODAY_LIST: '/staff/today-list',
};

export default ROUTES;
