import api from '../../config/axios';

// Pricing API functions
export const getPricing = async () => {
  try {
    const response = await api.get('/pricing');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching pricing:', error);
    throw error;
  }
};

export const updatePricing = async (pricingData) => {
  try {
    const response = await api.put('/pricing', pricingData);
    return response.data.data;
  } catch (error) {
    console.error('Error updating pricing:', error);
    throw error;
  }
};

export const getVehiclePricing = async (vehicleType) => {
  try {
    const response = await api.get(`/pricing/${vehicleType}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching vehicle pricing:', error);
    throw error;
  }
};

export default {
  getPricing,
  updatePricing,
  getVehiclePricing
};