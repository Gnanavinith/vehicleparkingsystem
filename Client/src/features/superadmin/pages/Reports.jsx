import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

// Mock API service - replace with actual API calls
const superAdminApi = {
  getGlobalReports: async () => {
    // In a real app, this would be an API call
    return {
      totalRevenue: 45678.90,
      dailyRevenue: [
        { date: '2024-02-19', revenue: 1250.75 },
        { date: '2024-02-20', revenue: 1320.50 },
        { date: '2024-02-21', revenue: 1180.25 },
        { date: '2024-02-22', revenue: 1450.80 },
        { date: '2024-02-23', revenue: 1380.60 },
        { date: '2024-02-24', revenue: 1420.90 },
      ],
      standWiseRevenue: [
        { stand: 'Main Street Parking', revenue: 12500.75 },
        { stand: 'Downtown Mall', revenue: 9800.50 },
        { stand: 'Airport Terminal', revenue: 8200.25 },
        { stand: 'City Center', revenue: 7650.80 },
        { stand: 'Shopping District', revenue: 7526.60 },
      ],
      monthlyComparison: [
        { month: 'Jan 2024', revenue: 42000.50 },
        { month: 'Feb 2024', revenue: 45678.90 },
      ]
    };
  }
};

const Reports = () => {
  const [dateRange, setDateRange] = useState('today');

  const { data: reports, isLoading, error } = useQuery({
    queryKey: ['superadmin-reports', dateRange],
    queryFn: superAdminApi.getGlobalReports,
    staleTime: 300000, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error.message}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Global Reports</h1>
        <div className="flex items-center space-x-4">
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
            </svg>
            Export CSV
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-semibold text-gray-900">${reports?.totalRevenue?.toFixed(2) || '0.00'}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Daily Rev</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${(reports?.dailyRevenue && reports.dailyRevenue.length > 0 
                  ? reports.dailyRevenue.reduce((sum, day) => sum + day.revenue, 0) / reports.dailyRevenue.length 
                  : 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-yellow-100">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Top Stand</p>
              <p className="text-2xl font-semibold text-gray-900 truncate">
                {reports?.standWiseRevenue?.[0]?.stand || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-100">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Stands</p>
              <p className="text-2xl font-semibold text-gray-900">{reports?.standWiseRevenue?.length || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Revenue Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Daily Revenue</h2>
          <div className="h-64 flex items-end justify-between space-x-2">
            {(reports?.dailyRevenue || []).map((day, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div className="text-sm text-gray-600 mb-1">${day.revenue}</div>
                <div 
                  className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg"
                  style={{ height: `${(day.revenue / Math.max(...(reports?.dailyRevenue || []).map(d => d.revenue))) * 80}%` }}
                ></div>
                <div className="text-xs text-gray-500 mt-1">{day.date.substring(5)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Stand Wise Revenue Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Stand-wise Revenue</h2>
          <div className="space-y-4">
            {(reports?.standWiseRevenue || []).map((stand, index) => (
              <div key={index} className="flex items-center">
                <div className="w-32 text-sm font-medium text-gray-700 truncate">{stand.stand}</div>
                <div className="flex-1 ml-2">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ 
                        width: `${(stand.revenue / Math.max(...(reports?.standWiseRevenue || []).map(s => s.revenue))) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
                <div className="w-20 text-right text-sm font-medium text-gray-900">${stand.revenue.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Comparison */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Monthly Comparison</h2>
        <div className="flex items-end justify-between h-48">
          {(reports?.monthlyComparison || []).map((month, index) => (
            <div key={index} className="flex flex-col items-center flex-1 mx-2">
              <div className="text-sm text-gray-600 font-medium mb-2">${month.revenue.toFixed(2)}</div>
              <div 
                className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg"
                style={{ height: `${(month.revenue / Math.max(...(reports?.monthlyComparison || []).map(m => m.revenue))) * 80}%` }}
              ></div>
              <div className="text-xs text-gray-500 mt-2">{month.month}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;