import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '@/redux/slices/authSlice';

const StaffSidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/staff/dashboard',
      icon: '🏠',
    },
    {
      name: 'New Parking',
      path: '/staff/new-parking',
      icon: '🅿️',
    },
    {
      name: 'Checkout',
      path: '/staff/checkout',
      icon: '✅',
    },
    {
      name: "Today's List",
      path: '/staff/today-list',
      icon: '📋',
    },
    {
      name: 'Profile',
      path: '/staff/profile',
      icon: '👤',
    },
  ];

  const handleLogout = () => {
    dispatch(logout());
    // Redirect handled by Redux middleware
  };

  return (
    <div className="bg-white shadow-sm border-r border-gray-200 w-64 flex-shrink-0 h-screen flex flex-col">
      {/* Logo/Stand Info */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">P</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Parking System</h2>
            <p className="text-xs text-gray-500">Staff Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-gray-200">
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-900 truncate">
            {user?.name || 'Staff Member'}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {user?.email || 'staff@parking.com'}
          </p>
        </div>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors"
        >
          <span className="text-lg">🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default StaffSidebar;