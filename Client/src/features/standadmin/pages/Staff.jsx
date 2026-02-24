import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import DataTable from '@/components/tables/DataTable';
import Button from '@/components/common/Button';
import { getStaff } from '../api';

const Staff = () => {
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);
  
  console.log('Auth state:', { user, token });
  console.log('Token in localStorage:', localStorage.getItem('token'));

  const { data: staff, isLoading, error } = useQuery({
    queryKey: ['staff'],
    queryFn: getStaff,
    enabled: !!token, // Only run query if token exists
  });

  // Debug logging
  console.log('Staff data:', staff);
  console.log('Is loading:', isLoading);
  console.log('Error:', error);
  console.log('Data type:', typeof staff);
  console.log('Is array:', Array.isArray(staff));

  const handleCreateStaff = () => {
    navigate('/standadmin/create-staff');
  };

  const columns = [
    {
      key: 'name',
      label: 'Name',
    },
    {
      key: 'email',
      label: 'Email',
    },
    {
      key: 'phone',
      label: 'Phone',
    },
    {
      key: 'status',
      label: 'Status',
      render: (status) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          status === 'active' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {status}
        </span>
      ),
    },
  ];

  if (!token) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600">Please log in as a stand admin to view staff</p>
          <button 
            onClick={() => navigate('/login')}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
        <Button onClick={handleCreateStaff}>Create New Staff</Button>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <DataTable
          columns={columns}
          data={staff || []}
          loading={isLoading}
        />
      </div>
      
      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          Error loading staff: {error.message}
        </div>
      )}
    </div>
  );
};

export default Staff;
