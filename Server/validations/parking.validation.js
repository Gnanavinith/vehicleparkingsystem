const Joi = require('joi');

const createParkingValidation = Joi.object({
  vehicleNumber: Joi.string().trim().uppercase().required().messages({
    'any.required': 'Vehicle number is required'
  }),
  vehicleType: Joi.string().valid('car', 'motorcycle', 'truck', 'bus').default('car'),
  customerName: Joi.string().trim().required().messages({
    'any.required': 'Customer name is required'
  }),
  customerPhone: Joi.string().trim().optional(),
  stand: Joi.string().required().messages({
    'any.required': 'Stand is required'
  }),
  hourlyRate: Joi.number().min(0).required().messages({
    'number.min': 'Hourly rate cannot be negative',
    'any.required': 'Hourly rate is required'
  }),
  notes: Joi.string().trim().optional()
});

const updateParkingValidation = Joi.object({
  vehicleNumber: Joi.string().trim().uppercase().optional(),
  vehicleType: Joi.string().valid('car', 'motorcycle', 'truck', 'bus').optional(),
  customerName: Joi.string().trim().optional(),
  customerPhone: Joi.string().trim().optional(),
  stand: Joi.string().optional(),
  hourlyRate: Joi.number().min(0).optional().messages({
    'number.min': 'Hourly rate cannot be negative'
  }),
  status: Joi.string().valid('active', 'completed', 'cancelled').optional(),
  paymentStatus: Joi.string().valid('pending', 'paid', 'failed').optional(),
  notes: Joi.string().trim().optional()
});

const checkoutValidation = Joi.object({
  exitTime: Joi.date().optional().messages({
    'date.base': 'Invalid exit time format'
  }),
  paymentStatus: Joi.string().valid('pending', 'paid', 'failed').default('paid')
});

module.exports = {
  createParkingValidation,
  updateParkingValidation,
  checkoutValidation
};