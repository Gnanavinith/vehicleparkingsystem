import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import DataTable from '../../../components/tables/DataTable';

// Mock API service - replace with actual API calls
const superAdminApi = {
  getAllStandAdmins: async () => {
    // In a real app, this would be an API call
    return [
      { id: 1, name: 'John Smith', email: 'john@mainstreet.com', stand: 'Main Street Parking', status: 'Active', lastLogin: '2024-02-20' },
      { id: 2, name: 'Jane Doe', email: 'jane@downtown.com', stand: 'Downtown Mall', status: 'Active', lastLogin: '2024-02-22' },
      { id: 3, name: 'Mike Johnson', email: 'mike@airport.com', stand: 'Airport Terminal', status: 'Active', lastLogin: '2024-02-21' },
      { id: 4, name: 'Sarah Williams', email: 'sarah@citycenter.com', stand: 'City Center', status: 'Inactive', lastLogin: '2024-01-15' },
      { id: 5, name: 'David Brown', email: 'david@shopping.com', stand: 'Shopping District', status: 'Active', lastLogin: '2024-02-23' },
    ];
  }
};

const StandAdmins = () => {
  const navigate = useNavigate();

  const { data: admins, isLoading, error } = useQuery({
    queryKey: ['superadmin-stand-admins'],
    queryFn: superAdminApi.getAllStandAdmins,
    staleTime: 300000, // 5 minutes
  });

  const columns = [
    { Header: 'Name', accessor: 'name' },
    { Header: 'Email', accessor: 'email' },
    { Header: 'Assigned Stand', accessor: 'stand' },
    { Header: 'Status', accessor: 'status', Cell: ({ value }) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        value === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {value}
      </span>
    )},
    { Header: 'Last Login', accessor: 'lastLogin' },
    { Header: 'Actions', accessor: 'actions', disableSortBy: true, Cell: ({ row }) => (
      <div className="flex space-x-2">
        <button 
          onClick={() => navigate(`/superadmin/admins/edit/${row.original.id}`)}
          className="text-blue-600 hover:text-blue-900"
        >
          Edit
        </button>
        <button 
          onClick={() => console.log('Reset password for:', row.original.id)}
          className="text-yellow-600 hover:text-yellow-900"
        >
          Reset Password
        </button>
        <button 
          onClick={() => console.log('Toggle status:', row.original.id)}
          className={`${
            row.original.status === 'Active' 
              ? 'text-red-600 hover:text-red-900' 
              : 'text-green-600 hover:text-green-900'
          }`}
        >
          {row.original.status === 'Active' ? 'Disable' : 'Enable'}
        </button>
      </div>
    )}
  ];

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
        <h1 className="text-3xl font-bold text-gray-900">Stand Admins</h1>
        <button 
          onClick={() => navigate('/superadmin/admins/create')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Create Admin
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <DataTable 
          columns={columns} 
          data={admins || []} 
          searchPlaceholder="Search admins..."
        />
      </div>

      {/* Admin Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Admins</p>
              <p className="text-2xl font-semibold text-gray-900">{admins?.length || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Admins</p>
              <p className="text-2xl font-semibold text-gray-900">
                {admins?.filter(admin => admin.status === 'Active').length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-yellow-100">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Managed Stands</p>
              <p className="text-2xl font-semibold text-gray-900">
                {new Set(admins?.map(admin => admin.stand)).size || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StandAdmins;