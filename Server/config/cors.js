const cors = require('cors');

const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:5176',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'http://127.0.0.1:5175',
    'http://127.0.0.1:5176',
    'https://vehiclestandparking.netlify.app/',
    process.env.FRONTEND_URL
  ].filter(Boolean), // Remove any undefined/null values
  credentials: true,
  optionsSuccessStatus: 200
};

module.exports = corsOptions;