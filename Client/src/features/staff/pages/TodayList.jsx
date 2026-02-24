import React from 'react';
import { useQuery } from '@tanstack/react-query';
import DataTable from '@/components/tables/DataTable';
import Button from '@/components/common/Button';
import { getTodayParkings } from '../api';

const TodayList = () => {
  const { data: parkings, isLoading } = useQuery({
    queryKey: ['today-parkings'],
    queryFn: getTodayParkings,
  });

  const columns = [
    {
      key: 'vehicleNumber',
      label: 'Vehicle Number',
    },
    {
      key: 'vehicleType',
      label: 'Type',
      render: (type) => <span className="capitalize">{type}</span>,
    },
    {
      key: 'entryTime',
      label: 'Entry Time',
    },
    {
      key: 'customerName',
      label: 'Customer',
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
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex space-x-2">
          <Button size="sm" variant="outline">
            View
          </Button>
          {row.status === 'active' && (
            <Button size="sm" variant="primary">
              Checkout
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Today's Parking List</h1>
        <Button>New Parking Entry</Button>
      </div>
      
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

export default TodayList;
