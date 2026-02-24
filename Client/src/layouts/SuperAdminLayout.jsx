import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/superadmin/Sidebar';
import Topbar from '../components/superadmin/Topbar';

const SuperAdminLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Fixed position */}
      <Sidebar />

      {/* Main Content - Add left margin to accommodate fixed sidebar */}
      <div className="flex-1 flex flex-col overflow-hidden ml-64">
        {/* Topbar */}
        <Topbar />

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 bg-gray-50">
          <div className="container mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default SuperAdminLayout;