const calculateAmount = (entryTime, exitTime, vehicleType, pricingData) => {
  if (!entryTime || !exitTime || !pricingData) {
    throw new Error('Missing required parameters');
  }

  const entry = new Date(entryTime);
  const exit = new Date(exitTime);
  
  if (exit <= entry) {
    throw new Error('Exit time must be after entry time');
  }

  // Calculate duration in minutes
  const durationInMinutes = Math.ceil((exit - entry) / (1000 * 60));
  
  // Handle different pricing structures
  if (typeof pricingData === 'number') {
    // Simple hourly rate (backward compatibility)
    const hours = durationInMinutes / 60;
    return Math.ceil(hours * pricingData);
  } else if (pricingData.firstHourRate !== undefined && pricingData.additionalHourRate !== undefined) {
    // Two-tier pricing structure
    const totalHours = durationInMinutes / 60;
    
    if (totalHours <= 1) {
      // Only first hour
      return Math.ceil(pricingData.firstHourRate);
    } else {
      // First hour + additional hours
      const additionalHours = Math.ceil(totalHours - 1);
      const amount = pricingData.firstHourRate + (additionalHours * pricingData.additionalHourRate);
      return Math.ceil(amount);
    }
  } else {
    throw new Error('Invalid pricing data structure');
  }
};

const calculateDuration = (entryTime, exitTime) => {
  if (!entryTime || !exitTime) {
    throw new Error('Missing required parameters');
  }

  const entry = new Date(entryTime);
  const exit = new Date(exitTime);
  
  if (exit <= entry) {
    throw new Error('Exit time must be after entry time');
  }

  const diffInMs = exit - entry;
  const hours = Math.floor(diffInMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

module.exports = {
  calculateAmount,
  calculateDuration
};