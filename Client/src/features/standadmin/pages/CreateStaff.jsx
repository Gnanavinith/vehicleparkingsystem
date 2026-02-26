import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createStaff } from '../api';

import { FaArrowLeft, FaSave, FaUser, FaEnvelope, FaPhone, FaLock, FaBriefcase } from 'react-icons/fa';

//─── Design Tokens─────────────────────────────────────────────────────────────
const C = {
  bg: '#f8f9fb',
  card: '#ffffff',
  border: '#e5e7eb',
  text: '#0f172a',
  sub: '#6b7280',
  muted: '#9ca3af',
  accent: '#0f172a',
  accentLight: '#f3f4f6',
  green: '#16a34a',
  red: '#ef4444',
  errorLight: '#fee2e2',
};

//─── Form Components───────────────────────────────────────────────────────────
const Field = ({ label, required, error, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
    <label style={{ fontSize: '13px', fontWeight: '500', color: C.sub, display: 'flex', alignItems: 'center', gap: '4px' }}>
      {label}
      {required && <span style={{ color: C.red, fontSize: '14px' }}>*</span>}
    </label>
    {children}
    {error && (
      <p style={{ fontSize: '12px', color: C.red, margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
        {error}
      </p>
    )}
  </div>
);

const Input = ({ icon: Icon, error, ...props }) => (
  <div style={{ position: 'relative' }}>
    {Icon && (
      <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: error ? C.red : C.muted }}>
        <Icon size={14} />
      </div>
    )}
    <input
      {...props}
      style={{
        width: '100%', padding: `10px 12px 10px ${Icon ? '36px' : '12px'}`,
        border: `1.5px solid ${error ? C.red : C.border}`,
        borderRadius: '10px', fontSize: '14px', color: C.text,
        background: C.card, fontFamily: 'Geist, sans-serif',
        transition: 'border-color 0.15s, box-shadow 0.15s',
        outline: 'none',
      }}
      onFocus={e => {
        e.target.style.borderColor = error ? C.red : C.accent;
        e.target.style.boxShadow = `0 0 0 3px ${error ? 'rgba(239,68,68,0.1)' : 'rgba(15,23,42,0.05)'}`;
      }}
      onBlur={e => {
        e.target.style.borderColor = error ? C.red : C.border;
        e.target.style.boxShadow = 'none';
      }}
    />
  </div>
);

const Select = ({ icon: Icon, error, children, ...props }) => (
  <div style={{ position: 'relative' }}>
    {Icon && (
      <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: error ? C.red : C.muted, pointerEvents: 'none' }}>
        <Icon size={14} />
      </div>
    )}
    <select
      {...props}
      style={{
        width: '100%', padding: `10px 12px 10px ${Icon ? '36px' : '12px'}`,
        border: `1.5px solid ${error ? C.red : C.border}`,
        borderRadius: '10px', fontSize: '14px', color: C.text,
        background: C.card, fontFamily: 'Geist, sans-serif',
        transition: 'border-color 0.15s, box-shadow 0.15s',
        outline: 'none', appearance: 'none',
        backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'m6 8 4 4 4-4\'/%3e%3c/svg%3e")',
        backgroundPosition: 'right 12px center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '16px',
      }}
      onFocus={e => {
        e.target.style.borderColor = error ? C.red : C.accent;
        e.target.style.boxShadow = `0 0 0 3px ${error ? 'rgba(239,68,68,0.1)' : 'rgba(15,23,42,0.05)'}`;
      }}
      onBlur={e => {
        e.target.style.borderColor = error ? C.red : C.border;
        e.target.style.boxShadow = 'none';
      }}
    >
      {children}
    </select>
  </div>
);

//─── Main Component─────────────────────────────────────────────────────────────
const CreateStaff = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'staff',
    password: '',
  });
  
  const [errors, setErrors] = useState({});
  
  const createStaffMutation = useMutation({
    mutationFn: createStaff,
    onSuccess: () => {
      queryClient.invalidateQueries(['staff']);
      navigate('/standadmin/staff');
    },
    onError: (error) => {
      if (error.response?.data?.message) {
        setErrors({ submit: error.response.data.message });
      } else {
        setErrors({ submit: 'Failed to create staff member' });
      }
    },
  });
  
  const validateForm = () => {
    const errs = {};
    
    if (!formData.name.trim()) errs.name = 'Name is required';
    if (!formData.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = 'Invalid email format';
    if (!formData.phone.trim()) errs.phone = 'Phone number is required';
    if (!formData.role) errs.role = 'Role is required';
    if (!formData.password) errs.password = 'Password is required';
    else if (formData.password.length < 6) errs.password = 'Password must be at least 6 characters';
    
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      createStaffMutation.mutate(formData);
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  return (
    <div style={{ background: C.bg, minHeight: '100vh', padding: '32px', fontFamily: 'Geist, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }
        .form-card { 
          max-width: 600px; 
          margin: 0 auto; 
          background: ${C.card}; 
          border-radius: 16px; 
          border: 1px solid ${C.border};
          box-shadow: 0 1px 4px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03);
        }
        .submit-btn {
          transition: all 0.15s;
          background: ${C.accent};
          color: white;
          border: none;
          border-radius: 10px;
          padding: 12px 24px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .submit-btn:hover:not(:disabled) {
          background: #000;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
      `}</style>
      
      <div className="form-card">
        {/* Header */}
        <div style={{ 
          padding: '24px 32px', 
          borderBottom: `1px solid ${C.border}`,
          display: 'flex', 
          alignItems: 'center', 
          gap: '16px' 
        }}>
          <button
            onClick={() => navigate('/standadmin/staff')}
            style={{
              width: '36px', height: '36px', 
              borderRadius: '10px', 
              background: C.accentLight,
              border: 'none',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#e5e7eb'}
            onMouseLeave={e => e.currentTarget.style.background = C.accentLight}
          >
            <FaArrowLeft style={{ color: C.sub, fontSize: '16px' }} />
          </button>
          <div>
            <h1 style={{ 
              fontSize: '22px', 
              fontWeight: '600', 
              color: C.text, 
              letterSpacing: '-0.02em',
              margin: 0 
            }}>
              Create Staff Member
            </h1>
            <p style={{ 
              fontSize: '13px', 
              color: C.muted, 
              marginTop: '4px',
              margin: 0 
            }}>
              Add a new staff member to your team
            </p>
          </div>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '32px' }}>
          {errors.submit && (
            <div style={{ 
              background: C.errorLight, 
              border: `1px solid #fecaca`, 
              borderRadius: '10px', 
              padding: '14px 18px', 
              marginBottom: '24px',
              color: C.red, 
              fontSize: '14px' 
            }}>
              <strong>Error:</strong> {errors.submit}
            </div>
          )}
          
          <div style={{ display: 'grid', gap: '20px', marginBottom: '32px' }}>
            <Field label="Full Name" required error={errors.name}>
              <Input 
                icon={FaUser}
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter full name"
                error={errors.name}
              />
            </Field>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Field label="Email" required error={errors.email}>
                <Input 
                  icon={FaEnvelope}
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="staff@example.com"
                  error={errors.email}
                />
              </Field>
              
              <Field label="Phone Number" required error={errors.phone}>
                <Input 
                  icon={FaPhone}
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  error={errors.phone}
                />
              </Field>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Field label="Role" required error={errors.role}>
                <Select 
                  icon={FaBriefcase}
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  error={errors.role}
                >
                  <option value="staff">Staff</option>
                  <option value="manager">Manager</option>
                  <option value="supervisor">Supervisor</option>
                  <option value="coordinator">Coordinator</option>
                </Select>
              </Field>
              
              <Field label="Password" required error={errors.password}>
                <Input 
                  icon={FaLock}
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  error={errors.password}
                />
              </Field>
            </div>
          </div>
          
          {/* Submit Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button
              type="button"
              onClick={() => navigate('/standadmin/staff')}
              style={{
                background: 'transparent',
                border: `1px solid ${C.border}`,
                borderRadius: '10px',
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: '500',
                color: C.sub,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = C.accentLight}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              Cancel
            </button>
            
            <button 
              type="submit" 
              className="submit-btn"
              disabled={createStaffMutation.isPending}
            >
              {createStaffMutation.isPending ? (
                <>
                  <div style={{ 
                    width: '16px', 
                    height: '16px', 
                    border: '2px solid rgba(255,255,255,0.3)', 
                    borderTop: '2px solid white', 
                    borderRadius: '50%', 
                    animation: 'spin 0.8s linear infinite' 
                  }} />
                  Creating...
                </>
              ) : (
                <>
                  <FaSave size={14} />
                  Create Staff Member
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default CreateStaff;