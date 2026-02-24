import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getReports } from '../api';

const Reports = () => {
  const { data: reports, isLoading } = useQuery({
    queryKey: ['reports'],
    queryFn: getReports,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Reports</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Daily Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Total Parkings:</span>
              <span className="font-medium">42</span>
            </div>
            <div className="flex justify-between">
              <span>Revenue:</span>
              <span className="font-medium text-green-600">$1,240</span>
            </div>
            <div className="flex justify-between">
              <span>Average Duration:</span>
              <span className="font-medium">2.5 hours</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Total Parkings:</span>
              <span className="font-medium">1,240</span>
            </div>
            <div className="flex justify-between">
              <span>Revenue:</span>
              <span className="font-medium text-green-600">$32,560</span>
            </div>
            <div className="flex justify-between">
              <span>Occupancy Rate:</span>
              <span className="font-medium">78%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
