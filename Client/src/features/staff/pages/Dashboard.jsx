import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getParkings } from '@/features/standadmin/api';

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Staff Dashboard</h1>
        <p className="text-gray-600 mt-1">Manage daily parking operations</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <span className="text-2xl">🅿️</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Active Parkings</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeParkings}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <span className="text-2xl">🚗</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Entries</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalEntries}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Completed Today</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completedToday}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <span className="text-2xl">💰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Today's Collection</p>
              <p className="text-2xl font-bold text-gray-900">${stats.todayCollection}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickActions.map((action) => (
          <Link
            key={action.path}
            to={action.path}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
          >
            <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center text-white text-2xl mb-4 group-hover:scale-110 transition-transform`}>
              {action.icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
            <p className="text-gray-600 text-sm">{action.description}</p>
            <div className="mt-4 text-blue-600 text-sm font-medium group-hover:text-blue-700">
              Start →
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        </div>
        <div className="p-6">
          <div className="text-center py-8 text-gray-500">
            <span className="text-4xl mb-4 block">📋</span>
            <p>No recent activity</p>
            <p className="text-sm mt-1">New entries will appear here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;