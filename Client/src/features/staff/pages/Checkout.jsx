import React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import DataTable from '@/components/tables/DataTable';
import Button from '@/components/common/Button';
import { getParkingById, checkoutParking } from '../api';

const Checkout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { data: parking, isLoading } = useQuery({
    queryKey: ['parking', id],
    queryFn: () => getParkingById(id),
    enabled: !!id,
  });

  const checkoutMutation = useMutation({
    mutationFn: checkoutParking,
    onSuccess: () => {
      navigate('/staff/today-list');
    },
  });

  const handleCheckout = () => {
    if (window.confirm('Are you sure you want to checkout this vehicle?')) {
      checkoutMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout Vehicle</h1>
      
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Vehicle Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Vehicle Number:</span>
                <span className="font-medium">{parking?.vehicleNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Vehicle Type:</span>
                <span className="font-medium capitalize">{parking?.vehicleType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Entry Time:</span>
                <span className="font-medium">{parking?.entryTime}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Customer Name:</span>
                <span className="font-medium">{parking?.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Customer Phone:</span>
                <span className="font-medium">{parking?.customerPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">2 hours 30 minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount Due:</span>
                <span className="font-medium text-green-600">$12.50</span>
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
    </div>
  );
};

export default Checkout;
