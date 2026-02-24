import React from 'react';
import { useSelector } from 'react-redux';

const StaffTopbar = () => {
  const { user } = useSelector((state) => state.auth);
  
  // Mock stand name - in real app, this would come from user's assigned stand
  const standName = "Main Parking Stand";

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">{standName}</h1>
          <p className="text-sm text-gray-500">Staff Dashboard</p>
        </div>
        
        <div className="flex items-center space-x-6">
          {/* Notifications (optional) */}
          <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <span className="text-xl">🔔</span>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          {/* User Info */}
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {user?.name || 'Staff Member'}
              </p>
              <p className="text-xs text-gray-500">Staff</p>
            </div>
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">
                {user?.name?.charAt(0) || 'S'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffTopbar;