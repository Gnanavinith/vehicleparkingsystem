const Joi = require('joi');

const createStandValidation = Joi.object({
  name: Joi.string().trim().max(100).required().messages({
    'string.max': 'Stand name cannot exceed 100 characters',
    'any.required': 'Stand name is required'
  }),
  location: Joi.string().trim().required().messages({
    'any.required': 'Location is required'
  }),
  capacity: Joi.number().integer().min(1).required().messages({
    'number.min': 'Capacity must be at least 1',
    'any.required': 'Capacity is required'
  }),
  pricing: Joi.object({
    cycle: Joi.number().min(0).required().messages({
      'number.min': 'Cycle rate cannot be negative',
      'any.required': 'Cycle rate is required'
    }),
    bike: Joi.number().min(0).required().messages({
      'number.min': 'Bike rate cannot be negative',
      'any.required': 'Bike rate is required'
    }),
    car: Joi.number().min(0).required().messages({
      'number.min': 'Car rate cannot be negative',
      'any.required': 'Car rate is required'
    })
  }).required().messages({
    'any.required': 'Pricing information is required'
  }),
  currency: Joi.string().valid('USD', 'EUR', 'GBP', 'INR', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'SGD').required().messages({
    'any.required': 'Currency is required',
    'any.only': 'Invalid currency selected'
  }),
  description: Joi.string().trim().optional(),
  contactNumber: Joi.string().optional(),
  adminName: Joi.string().optional(),
  adminEmail: Joi.string().email().optional(),
  adminPassword: Joi.string().optional()
});

const updateStandValidation = Joi.object({
  name: Joi.string().trim().max(100).optional().messages({
    'string.max': 'Stand name cannot exceed 100 characters'
  }),
  location: Joi.string().trim().optional(),
  capacity: Joi.number().integer().min(1).optional().messages({
    'number.min': 'Capacity must be at least 1'
  }),
  pricing: Joi.object({
    cycle: Joi.number().min(0).optional().messages({
      'number.min': 'Cycle rate cannot be negative'
    }),
    bike: Joi.number().min(0).optional().messages({
      'number.min': 'Bike rate cannot be negative'
    }),
    car: Joi.number().min(0).optional().messages({
      'number.min': 'Car rate cannot be negative'
    })
  }),
  currency: Joi.string().valid('USD', 'EUR', 'GBP', 'INR', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'SGD').optional().messages({
    'any.only': 'Invalid currency selected'
  }),
  status: Joi.string().valid('active', 'inactive', 'maintenance').optional(),
  description: Joi.string().trim().optional()
});

const assignAdminValidation = Joi.object({
  adminId: Joi.string().required().messages({
    'any.required': 'Admin ID is required'
  })
});

module.exports = {
  createStandValidation,
  updateStandValidation,
  assignAdminValidation
};