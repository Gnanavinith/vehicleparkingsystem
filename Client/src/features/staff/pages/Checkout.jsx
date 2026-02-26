import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import DataTable from '@/components/tables/DataTable';
import Button from '@/components/common/Button';
import { getParkingById, checkoutParking, getTodayParkings, searchParkingByVehicleNumber } from '../api';
import { FaSearch, FaCar, FaMotorcycle, FaTruck, FaBus } from 'react-icons/fa';

const Checkout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedParking, setSelectedParking] = useState(null);
  
  // Get today's parkings for search
  const { data: todayParkings = [], isLoading: parkingsLoading } = useQuery({
    queryKey: ['today-parkings'],
    queryFn: getTodayParkings,
  });
  
  const { data: parking, isLoading } = useQuery({
    queryKey: ['parking', id],
    queryFn: () => getParkingById(id),
    enabled: !!id && !selectedParking,
  });

  const checkoutMutation = useMutation({
    mutationFn: checkoutParking,
    onSuccess: () => {
      navigate('/staff/today-list');
    },
  });

  const handleCheckout = () => {
    const parkingId = selectedParking?._id || id;
    if (window.confirm('Are you sure you want to checkout this vehicle?')) {
      checkoutMutation.mutate(parkingId);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    
    try {
      const response = await searchParkingByVehicleNumber(searchTerm);
      const foundParkings = response.data;
      
      if (foundParkings && foundParkings.length > 0) {
        if (foundParkings.length === 1) {
          setSelectedParking(foundParkings[0]);
        } else {
          // Show multiple results
          setSelectedParking(foundParkings[0]); // Select first one for now
          alert(`Found ${foundParkings.length} active parkings. Showing the first one.`);
        }
      } else {
        alert('No active parking found for this vehicle number');
      }
    } catch (error) {
      console.error('Search error:', error);
      alert('Error searching for vehicle');
    }
  };

  const getVehicleIcon = (vehicleType) => {
    switch (vehicleType) {
      case 'car': return FaCar;
      case 'motorcycle': return FaMotorcycle;
      case 'truck': return FaTruck;
      case 'bus': return FaBus;
      default: return FaCar;
    }
  };

  const currentParking = selectedParking || parking;

  if (isLoading || parkingsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout Vehicle</h1>
      
      {/* Search Section */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Search Vehicle</h2>
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter vehicle number (e.g. TN-01-AB-1234)"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Search
          </button>
        </form>
        
        {todayParkings.length > 0 && (
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">Active vehicles today: {todayParkings.filter(p => p.status === 'active').length}</p>
            <div className="max-h-40 overflow-y-auto">
              {todayParkings
                .filter(p => p.status === 'active')
                .map(parking => {
                  const Icon = getVehicleIcon(parking.vehicleType);
                  return (
                    <div 
                      key={parking._id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg mb-2 hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedParking(parking)}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="text-gray-600" />
                        <div>
                          <p className="font-medium">{parking.vehicleNumber}</p>
                          <p className="text-sm text-gray-500 capitalize">{parking.vehicleType}</p>
                        </div>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        <p>Entry: {new Date(parking.createdAt).toLocaleTimeString()}</p>
                      </div>
                    </div>
                  );
                })
              }
            </div>
          </div>
        )}
      </div>

      {/* Checkout Details */}
      {currentParking && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Vehicle Details</h2>
            <button 
              onClick={() => setSelectedParking(null)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Clear Selection
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Vehicle Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Vehicle Number:</span>
                  <span className="font-medium">{currentParking.vehicleNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Vehicle Type:</span>
                  <span className="font-medium capitalize">{currentParking.vehicleType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Entry Time:</span>
                  <span className="font-medium">{new Date(currentParking.createdAt).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Token ID:</span>
                  <span className="font-medium">{currentParking.tokenId}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Customer Name:</span>
                  <span className="font-medium">{currentParking.customerName || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Customer Phone:</span>
                  <span className="font-medium">{currentParking.customerPhone || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">
                    {Math.floor((new Date() - new Date(currentParking.createdAt)) / (1000 * 60 * 60))} hours
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium capitalize text-green-600">{currentParking.status}</span>
                </div>
              </div>
            </div>
          </div>
        
        <div className="flex justify-end space-x-4 mt-6">
          <Button
            variant="secondary"
            onClick={() => navigate('/staff/today-list')}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCheckout}
            disabled={checkoutMutation.isPending}
          >
            {checkoutMutation.isPending ? 'Processing...' : 'Complete Checkout'}
          </Button>
        </div>
      </div>
      )}
    </div>
  );
};

export default Checkout;
