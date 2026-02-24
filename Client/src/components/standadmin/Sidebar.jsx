import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/standadmin/dashboard',
      icon: '📊',
    },
    {
      name: 'Staff Management',
      path: '/standadmin/staff',
      icon: '👥',
    },
    {
      name: 'Parkings',
      path: '/standadmin/parkings',
      icon: '🚗',
    },
    {
      name: 'Reports',
      path: '/standadmin/reports',
      icon: '📈',
    },
    {
      name: 'Pricing Settings',
      path: '/standadmin/pricing',
      icon: '💵',
    },
  ];

  return (
    <div className="bg-white shadow-sm border-r border-gray-200 w-64 flex-shrink-0">
      <div className="p-6">
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900">Parking Stand</h2>
          <p className="text-sm text-gray-500">Stand Management System</p>
        </div>
        
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;