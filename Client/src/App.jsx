import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ReduxProvider from './providers/ReduxProvider';
import QueryProvider from './providers/QueryProvider';
import ProtectedRoutes from './routes/ProtectedRoutes';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import SuperAdminLayout from './layouts/SuperAdminLayout';
import StandAdminLayout from './layouts/StandAdminLayout';
import StaffLayout from './layouts/StaffLayout';

// Auth Pages
import Login from './features/auth/pages/Login';
import ForgotPassword from './features/auth/pages/ForgotPassword';
import StaffLogin from './features/auth/pages/StaffLogin';

// Super Admin Pages
import SuperAdminDashboard from './features/superadmin/pages/Dashboard';
import VehicleStands from './features/superadmin/pages/VehicleStands';
import CreateStand from './features/superadmin/pages/CreateStand';
import EditStand from './features/superadmin/pages/EditStand'; // Import the new EditStand component
import StandAdmins from './features/superadmin/pages/StandAdmins';
import Reports from './features/superadmin/pages/Reports';
import Pricing from './features/superadmin/pages/Pricing';
import Settings from './features/superadmin/pages/Settings';

// Stand Admin Pages
import StandAdminDashboard from './features/standadmin/pages/Dashboard';
import Staff from './features/standadmin/pages/Staff';
import CreateStaff from './features/standadmin/pages/CreateStaff';
import EditStaff from './features/standadmin/pages/EditStaff';
import Parkings from './features/standadmin/pages/Parkings';
import StandAdminReports from './features/standadmin/pages/Reports';
import PricingSettings from './features/standadmin/pages/PricingSettings';

// Staff Pages
import StaffDashboard from './features/staff/pages/Dashboard';
import StaffProfile from './features/staff/pages/Profile';
import NewParking from './features/staff/pages/NewParking';
import Checkout from './features/staff/pages/Checkout';
import TodayList from './features/staff/pages/TodayList';

function App() {
  return (
    <ReduxProvider>
      <QueryProvider>
        <Router>
          <Routes>
            {/* Auth Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/staff-login" element={<StaffLogin />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
            </Route>

            {/* Super Admin Routes */}
            <Route 
              element={
                <ProtectedRoutes allowedRoles={['super_admin']}>
                  <SuperAdminLayout />
                </ProtectedRoutes>
              }
            >
              <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />
              <Route path="/superadmin/stands" element={<VehicleStands />} />
              <Route path="/superadmin/stands/create" element={<CreateStand />} />
              <Route path="/superadmin/stands/edit/:id" element={<EditStand />} /> {/* Add the EditStand route */}
              <Route path="/superadmin/reports" element={<Reports />} />
              <Route path="/superadmin/pricing" element={<Pricing />} />
              <Route path="/superadmin/settings" element={<Settings />} />
            </Route>

            {/* Stand Admin Routes */}
            <Route 
              element={
                <ProtectedRoutes allowedRoles={['stand_admin']}>
                  <StandAdminLayout />
                </ProtectedRoutes>
              }
            >
              <Route path="/standadmin/dashboard" element={<StandAdminDashboard />} />
              <Route path="/standadmin/staff" element={<Staff />} />
              <Route path="/standadmin/create-staff" element={<CreateStaff />} />
              <Route path="/standadmin/staff/edit/:id" element={<EditStaff />} />
              <Route path="/standadmin/parkings" element={<Parkings />} />
              <Route path="/standadmin/reports" element={<StandAdminReports />} />
              <Route path="/standadmin/pricing" element={<PricingSettings />} />
            </Route>

            {/* Staff Routes */}
            <Route 
              element={
                <ProtectedRoutes allowedRoles={['staff']}>
                  <StaffLayout />
                </ProtectedRoutes>
              }
            >
              <Route path="/staff/dashboard" element={<StaffDashboard />} />
              <Route path="/staff/new-parking" element={<NewParking />} />
              <Route path="/staff/checkout" element={<Checkout />} />
              <Route path="/staff/today-list" element={<TodayList />} />
              <Route path="/staff/profile" element={<StaffProfile />} />
            </Route>

            {/* Default Route */}
            <Route path="/" element={<Login />} />
          </Routes>
        </Router>
      </QueryProvider>
    </ReduxProvider>
  );
}

export default App;