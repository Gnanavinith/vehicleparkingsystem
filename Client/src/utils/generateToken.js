export const generateToken = () => {
  return Math.random().toString(36).substr(2, 9);
};

export const generateResetToken = () => {
  return Math.random().toString(36).substr(2, 15);
};

export default {
  generateToken,
  generateResetToken,
};
