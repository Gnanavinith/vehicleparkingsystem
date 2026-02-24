const calculateAmount = (entryTime, exitTime, hourlyRate) => {
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
  
  // Calculate amount based on duration and hourly rate
  const hours = durationInMinutes / 60;
  const amount = Math.ceil(hours * hourlyRate);
  
  return {
    duration: durationInMinutes,
    amount: amount,
    hours: hours
  };
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