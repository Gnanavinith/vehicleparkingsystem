import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getParkings } from '@/features/standadmin/api';
import { FaCar, FaCheckCircle, FaDollarSign, FaParking, FaChartBar, FaHistory } from 'react-icons/fa';

const StaffDashboard = () => {
  // Mock data for demonstration
  const stats = {
    activeParkings: 12,
    totalEntries: 28,
    completedToday: 16,
    todayCollection: 420
  };

  const quickActions = [
    {
      title: 'New Parking',
      description: 'Add new vehicle entry',
      path: '/staff/new-parking',
      icon: '🅿️',
      color: 'bg-blue-500'
    },
    {
      title: 'Checkout',
      description: 'Process vehicle exit',
      path: '/staff/checkout',
      icon: '✅',
      color: 'bg-green-500'
    },
    {
      title: "Today's List",
      description: 'View all entries',
      path: '/staff/today-list',
      icon: '📋',
      color: 'bg-purple-500'
    }
  ];

  // Mock recent activity data
  const recentActivity = [
    { id: 1, action: 'New vehicle entry', time: '2 minutes ago', type: 'entry' },
    { id: 2, action: 'Vehicle checkout completed', time: '15 minutes ago', type: 'exit' },
    { id: 3, action: 'Payment processed', time: '22 minutes ago', type: 'payment' },
    { id: 4, action: 'New parking space allocated', time: '1 hour ago', type: 'allocation' },
  ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage daily parking operations</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <select className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards - Improved Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FaParking className="text-blue-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Parkings</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeParkings}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <FaCar className="text-green-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Entries</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalEntries}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <FaCheckCircle className="text-purple-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed Today</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completedToday}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <FaDollarSign className="text-yellow-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Today's Collection</p>
              <p className="text-2xl font-bold text-gray-900">${stats.todayCollection}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
              <FaChartBar className="text-gray-400" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {quickActions.map((action) => (
                <Link
                  key={action.path}
                  to={action.path}
                  className="bg-gray-50 p-5 rounded-lg border border-gray-100 hover:bg-gray-100 hover:border-gray-200 transition-all group"
                >
                  <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform`}>
                    {action.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                  <div className="mt-3 text-blue-600 text-sm font-medium group-hover:text-blue-700">
                    Start →
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              <FaHistory className="text-gray-400" />
            </div>
          </div>
          <div className="p-6 space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className={`p-2 rounded-full ${
                  activity.type === 'entry' ? 'bg-blue-100' : 
                  activity.type === 'exit' ? 'bg-green-100' : 
                  activity.type === 'payment' ? 'bg-yellow-100' : 'bg-purple-100'
                }`}>
                  {activity.type === 'entry' && <FaCar className="text-blue-600 text-sm" />}
                  {activity.type === 'exit' && <FaCheckCircle className="text-green-600 text-sm" />}
                  {activity.type === 'payment' && <FaDollarSign className="text-yellow-600 text-sm" />}
                  {activity.type === 'allocation' && <FaParking className="text-purple-600 text-sm" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
            <div className="pt-4 border-t border-gray-100">
              <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
                View all activity
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Performance Summary</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Updated 2 min ago</span>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">85%</div>
            <div className="text-sm text-gray-600 mt-1">Occupancy Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">12m</div>
            <div className="text-sm text-gray-600 mt-1">Avg. Duration</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">98%</div>
            <div className="text-sm text-gray-600 mt-1">Satisfaction</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">4.2x</div>
            <div className="text-sm text-gray-600 mt-1">Efficiency</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;