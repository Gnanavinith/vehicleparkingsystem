import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import api from '../../../config/axios';

const CreateStand = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient(); // To invalidate queries and refresh data

  const [formData, setFormData] = useState({
    standName: '',
    contactNumber: '',
    location: '',
    adminName: '',
    adminEmail: '',
    adminPassword: ''
  });

  const mutation = useMutation({
    mutationFn: async (standData) => {
      // Map the form data to match the backend expectation
      const payload = {
        name: standData.standName,
        contactNumber: standData.contactNumber,
        location: standData.location,
        adminName: standData.adminName,
        adminEmail: standData.adminEmail,
        adminPassword: standData.adminPassword,
        // Proper values for required fields
        capacity: 1,
        hourlyRate: 1.0,
        description: 'New stand created by super admin'
      };
      
      const response = await api.post('/stands', payload);
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate the stands query to refresh the list
      queryClient.invalidateQueries(['superadmin-stands']);
      alert(data.message);
      navigate('/superadmin/stands'); // Navigate back to stands page after successful creation
    },
    onError: (error) => {
      console.error('Error creating stand:', error);
      // Show a more detailed error message
      if (error.response) {
        alert('Error creating stand: ' + error.response.data.message || error.response.statusText);
      } else if (error.request) {
        alert('Network error: Could not connect to server');
      } else {
        alert('Error creating stand: ' + error.message);
      }
    }
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleCancel = () => {
    navigate('/superadmin/stands'); // Navigate back to stands page without saving
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Create New Vehicle Stand</h1>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stand Name *
              </label>
              <input
                type="text"
                name="standName"
                value={formData.standName}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter stand name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Number *
              </label>
              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter contact number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter stand location"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Admin Name *
              </label>
              <input
                type="text"
                name="adminName"
                value={formData.adminName}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter admin name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Admin Email *
              </label>
              <input
                type="email"
                name="adminEmail"
                value={formData.adminEmail}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter admin email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Admin Password *
              </label>
              <input
                type="password"
                name="adminPassword"
                value={formData.adminPassword}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter admin password"
              />
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-6 rounded-lg font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {mutation.isPending ? 'Creating Stand...' : 'Create Stand & Admin'}
            </button>
          </div>
        </form>
      </div>

      {/* Information Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 max-w-2xl">
        <h2 className="text-lg font-semibold text-blue-800 mb-2">About Stand Creation</h2>
        <p className="text-blue-700">
          When you create a new vehicle stand, a dedicated stand admin account will be automatically created.
          The stand admin will receive login credentials to manage their specific stand operations.
        </p>
      </div>
    </div>
  );
};

export default CreateStand;