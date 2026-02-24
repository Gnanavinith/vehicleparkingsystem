const jwt = require('jsonwebtoken');

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

const generateResetToken = () => {
  return Math.random().toString(36).substr(2, 15);
};

module.exports = {
  generateToken,
  generateResetToken
};