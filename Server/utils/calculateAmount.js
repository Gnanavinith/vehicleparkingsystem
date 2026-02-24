const calculateAmount = (entryTime, exitTime, vehicleType, hourlyRate) => {
  if (!entryTime || !exitTime || !hourlyRate) {
    throw new Error('Missing required parameters');
  }

  const entry = new Date(entryTime);
  const exit = new Date(exitTime);
  
  if (exit <= entry) {
    throw new Error('Exit time must be after entry time');
  }

  // Calculate duration in minutes
  const durationInMinutes = Math.ceil((exit - entry) / (1000 * 60));
  
  // Apply vehicle type multipliers
  let multiplier = 1;
  switch(vehicleType) {
    case 'bike':
      multiplier = 1.0; // Base rate
      break;
    case 'cycle':
      multiplier = 0.5; // 50% of base rate
      break;
    case 'car':
      multiplier = 2.0; // 200% of base rate
      break;
    default:
      multiplier = 1.0;
  }
  
  // Calculate amount based on duration and hourly rate
  const hours = durationInMinutes / 60;
  const amount = Math.ceil(hours * hourlyRate * multiplier);
  
  return amount;
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