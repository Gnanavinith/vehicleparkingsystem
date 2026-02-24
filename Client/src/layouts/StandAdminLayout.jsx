import React from 'react';
import { Outlet } from 'react-router-dom';
import Topbar from '../components/standadmin/Topbar';
import Sidebar from '../components/standadmin/Sidebar';

const StandAdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StandAdminLayout;
