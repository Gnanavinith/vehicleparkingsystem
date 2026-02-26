import React from 'react';
import { Outlet } from 'react-router-dom';
import Topbar from '../components/standadmin/Topbar';
import Sidebar from '../components/standadmin/Sidebar';

const StandAdminLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Part of flex flow, not fixed */}
      <aside className="w-60 shrink-0 border-r bg-white">
        <Sidebar />
      </aside>

      {/* Main Content Container - Flex flow manages spacing */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Topbar - Sticky for consistent header behavior */}
        <header className="sticky top-0 z-20 bg-white border-b">
          <Topbar />
        </header>

        {/* Main Content Area - Scrollable content area */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default StandAdminLayout;