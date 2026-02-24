const Joi = require('joi');

const loginValidation = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email',
    'any.required': 'Email is required'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters',
    'any.required': 'Password is required'
  })
});

const registerValidation = Joi.object({
  name: Joi.string().trim().max(50).required().messages({
    'string.max': 'Name cannot exceed 50 characters',
    'any.required': 'Name is required'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email',
    'any.required': 'Email is required'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters',
    'any.required': 'Password is required'
  }),
  phone: Joi.string().trim().optional(),
  role: Joi.string().valid('super_admin', 'stand_admin', 'staff').default('staff'),
  stand: Joi.string().optional() // ObjectId format validation can be added
});

const forgotPasswordValidation = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email',
    'any.required': 'Email is required'
  })
});

const resetPasswordValidation = Joi.object({
  token: Joi.string().required().messages({
    'any.required': 'Reset token is required'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters',
    'any.required': 'Password is required'
  })
});

module.exports = {
  loginValidation,
  registerValidation,
  forgotPasswordValidation,
  resetPasswordValidation
};