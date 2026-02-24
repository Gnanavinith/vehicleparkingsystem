import React from 'react';
import { Outlet } from 'react-router-dom';
import StaffSidebar from '../components/staff/Sidebar';
import StaffTopbar from '../components/staff/Topbar';

const StaffLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <StaffSidebar />
      <div className="flex-1 flex flex-col">
        <StaffTopbar />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StaffLayout;