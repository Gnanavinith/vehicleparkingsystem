import React from 'react';
import { useQuery } from '@tanstack/react-query';
import DataTable from '@/components/tables/DataTable';
import { getParkings } from '../api';

const Parkings = () => {
  const { data: parkings, isLoading } = useQuery({
    queryKey: ['parkings'],
    queryFn: getParkings,
  });

  const columns = [
    {
      key: 'vehicleNumber',
      label: 'Vehicle Number',
    },
    {
      key: 'entryTime',
      label: 'Entry Time',
    },
    {
      key: 'duration',
      label: 'Duration',
    },
    {
      key: 'amount',
      label: 'Amount ($)',
    },
    {
      key: 'status',
      label: 'Status',
      render: (status) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          status === 'active' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {status}
        </span>
      ),
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Parking Records</h1>
      
      <div className="bg-white rounded-lg shadow">
        <DataTable
          columns={columns}
          data={parkings || []}
          loading={isLoading}
        />
      </div>
    </div>
  );
};

export default Parkings;
