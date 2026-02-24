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
  hourlyRate: Joi.number().min(0).required().messages({
    'number.min': 'Hourly rate cannot be negative',
    'any.required': 'Hourly rate is required'
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
  hourlyRate: Joi.number().min(0).optional().messages({
    'number.min': 'Hourly rate cannot be negative'
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