import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../config/axios';

import { FiArrowLeft, FiAlertTriangle, FiEye, FiEyeOff } from 'react-icons/fi';
import { HiOutlineBuildingOffice2 } from 'react-icons/hi2';
import { MdOutlineAdminPanelSettings, MdOutlineLocationOn, MdOutlinePhone } from 'react-icons/md';
import { RiParkingBoxLine } from 'react-icons/ri';
import { BsPersonFill, BsInfoCircleFill } from 'react-icons/bs';
import { FaEnvelope, FaLock, FaPlus } from 'react-icons/fa';

// ─── Tokens ────────────────────────────────────────────────────────────────────
const C = {
  bg:          '#f1f5f9',
  card:        '#ffffff',
  border:      '#e2e8f0',
  borderFocus: '#6366f1',
  text:        '#0f172a',
  sub:         '#475569',
  muted:       '#94a3b8',
  accent:      '#6366f1',
  accentLight: '#eef2ff',
  green:       '#10b981',
  greenLight:  '#d1fae5',
  red:         '#ef4444',
  redLight:    '#fee2e2',
  purple:      '#8b5cf6',
  purpleLight: '#ede9fe',
};

// ─── Field ─────────────────────────────────────────────────────────────────────
const Field = ({ label, required, error, hint, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
    <label style={{ fontSize: 12.5, fontWeight: 600, color: C.sub, display: 'flex', alignItems: 'center', gap: 4 }}>
      {label} {required && <span style={{ color: C.red }}>*</span>}
    </label>
    {children}
    {error && (
      <p style={{ fontSize: 11.5, color: C.red, display: 'flex', alignItems: 'center', gap: 4, margin: 0 }}>
        <FiAlertTriangle size={11} /> {error}
      </p>
    )}
    {hint && !error && <p style={{ fontSize: 11.5, color: C.muted, margin: 0 }}>{hint}</p>}
  </div>
);

// ─── Input ─────────────────────────────────────────────────────────────────────
const Input = ({ icon: Icon, error, ...props }) => (
  <div style={{ position: 'relative' }}>
    {Icon && (
      <div style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', zIndex: 1 }}>
        <Icon style={{ color: error ? C.red : C.muted, fontSize: 14 }} />
      </div>
    )}
    <input
      {...props}
      style={{
        width: '100%', fontFamily: 'Inter, sans-serif',
        padding: `9px 12px 9px ${Icon ? '34px' : '12px'}`,
        border: `1.5px solid ${error ? C.red : C.border}`,
        borderRadius: 9, fontSize: 13.5, color: C.text,
        background: C.card, outline: 'none',
        transition: 'border-color 0.15s, box-shadow 0.15s',
      }}
      onFocus={e => {
        e.target.style.borderColor = error ? C.red : C.borderFocus;
        e.target.style.boxShadow = `0 0 0 3px ${error ? '#fee2e2' : C.accentLight}`;
      }}
      onBlur={e => {
        e.target.style.borderColor = error ? C.red : C.border;
        e.target.style.boxShadow = 'none';
      }}
    />
  </div>
);

// ─── Section Card ──────────────────────────────────────────────────────────────
const SectionCard = ({ title, subtitle, Icon, iconBg, iconColor, children }) => (
  <div style={{
    background: C.card, border: `1px solid ${C.border}`, borderRadius: 14,
    boxShadow: '0 1px 3px rgba(15,23,42,0.06)', overflow: 'hidden',
  }}>
    <div style={{
      padding: '18px 22px', borderBottom: `1px solid ${C.border}`,
      display: 'flex', alignItems: 'center', gap: 12,
      background: 'linear-gradient(135deg, #fafbff 0%, #f8fafc 100%)',
    }}>
      <div style={{ width: 38, height: 38, borderRadius: 10, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon style={{ color: iconColor, fontSize: 17 }} />
      </div>
      <div>
        <p style={{ fontSize: 14, fontWeight: 700, color: C.text, margin: 0 }}>{title}</p>
        {subtitle && <p style={{ fontSize: 12, color: C.muted, margin: 0, marginTop: 2 }}>{subtitle}</p>}
      </div>
    </div>
    <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: 18 }}>
      {children}
    </div>
  </div>
);

// ─── Main Component ────────────────────────────────────────────────────────────
const CreateStand = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    standName: '',
    contactNumber: '',
    location: '',
    adminName: '',
    adminEmail: '',
    adminPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const mutation = useMutation({
    mutationFn: async (standData) => {
      const payload = {
        name: standData.standName,
        contactNumber: standData.contactNumber,
        location: standData.location,
        adminName: standData.adminName,
        adminEmail: standData.adminEmail,
        adminPassword: standData.adminPassword,
        capacity: 1,
        hourlyRate: 1.0,
        description: 'New stand created by super admin',
      };
      const response = await api.post('/stands', payload);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['superadmin-stands']);
      navigate('/superadmin/stands');
    },
    onError: (error) => {
      console.error('Error creating stand:', error);
    },
  });

  const handleChange = e => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!formData.standName.trim()) errs.standName = 'Stand name is required';
    if (!formData.contactNumber.trim()) errs.contactNumber = 'Contact number is required';
    if (!formData.location.trim()) errs.location = 'Location is required';
    if (!formData.adminName.trim()) errs.adminName = 'Admin name is required';
    if (!formData.adminEmail.trim()) errs.adminEmail = 'Admin email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.adminEmail)) errs.adminEmail = 'Invalid email address';
    if (!formData.adminPassword.trim()) errs.adminPassword = 'Password is required';
    else if (formData.adminPassword.length < 6) errs.adminPassword = 'Must be at least 6 characters';
    return errs;
  };

  const handleSubmit = e => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (!Object.keys(errs).length) mutation.mutate(formData);
  };

  // Progress indicator — how many fields filled
  const totalFields = Object.keys(formData).length;
  const filledFields = Object.values(formData).filter(v => v.trim().length > 0).length;
  const progress = Math.round((filledFields / totalFields) * 100);

  return (
    <div style={{ background: C.bg, minHeight: '100vh', padding: '28px 32px', fontFamily: 'Inter, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
      `}</style>

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button
            onClick={() => navigate('/superadmin/stands')}
            style={{
              width: 36, height: 36, borderRadius: 9, background: C.card,
              border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', boxShadow: '0 1px 3px rgba(15,23,42,0.06)', transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = C.accentLight}
            onMouseLeave={e => e.currentTarget.style.background = C.card}
          >
            <FiArrowLeft style={{ color: C.sub, fontSize: 16 }} />
          </button>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: C.text, letterSpacing: '-0.025em', margin: 0 }}>Create New Stand</h1>
            <p style={{ fontSize: 13, color: C.sub, marginTop: 3 }}>Set up a new parking location and its administrator.</p>
          </div>
        </div>

        {/* Progress pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 120, height: 6, background: C.border, borderRadius: 99, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progress}%`, background: progress === 100 ? C.green : C.accent, borderRadius: 99, transition: 'width 0.3s ease' }} />
          </div>
          <span style={{ fontSize: 12, fontWeight: 600, color: progress === 100 ? C.green : C.sub }}>{progress}% complete</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>

          {/* ── Stand Information ── */}
          <SectionCard
            title="Stand Information"
            subtitle="Basic details about this parking location"
            Icon={HiOutlineBuildingOffice2} iconBg={C.accentLight} iconColor={C.accent}
          >
            <Field label="Stand Name" required error={errors.standName}>
              <Input icon={RiParkingBoxLine} name="standName" value={formData.standName} onChange={handleChange} placeholder="e.g. Main Street Parking" error={errors.standName} />
            </Field>
            <Field label="Location" required error={errors.location}>
              <Input icon={MdOutlineLocationOn} name="location" value={formData.location} onChange={handleChange} placeholder="e.g. 123 Main St, Downtown" error={errors.location} />
            </Field>
            <Field label="Contact Number" required error={errors.contactNumber}>
              <Input icon={MdOutlinePhone} name="contactNumber" type="tel" value={formData.contactNumber} onChange={handleChange} placeholder="e.g. +1 555-000-0000" error={errors.contactNumber} />
            </Field>

            {/* Info notice */}
            <div style={{ background: C.accentLight, border: '1px solid #c7d2fe', borderRadius: 10, padding: '13px 15px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <BsInfoCircleFill style={{ color: C.accent, fontSize: 14, flexShrink: 0, marginTop: 1 }} />
              <p style={{ fontSize: 12, color: '#4338ca', margin: 0, lineHeight: 1.55 }}>
                Capacity and hourly rate can be configured after creation from the stand's edit page.
              </p>
            </div>
          </SectionCard>

          {/* ── Admin Information ── */}
          <SectionCard
            title="Admin Account"
            subtitle="Credentials for the stand administrator"
            Icon={MdOutlineAdminPanelSettings} iconBg={C.purpleLight} iconColor={C.purple}
          >
            <Field label="Admin Name" required error={errors.adminName}>
              <Input icon={BsPersonFill} name="adminName" value={formData.adminName} onChange={handleChange} placeholder="e.g. John Doe" error={errors.adminName} />
            </Field>
            <Field label="Admin Email" required error={errors.adminEmail}>
              <Input icon={FaEnvelope} name="adminEmail" type="email" value={formData.adminEmail} onChange={handleChange} placeholder="admin@example.com" error={errors.adminEmail} />
            </Field>
            <Field label="Admin Password" required error={errors.adminPassword} hint={!errors.adminPassword ? 'Minimum 6 characters' : undefined}>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', zIndex: 1 }}>
                  <FaLock style={{ color: errors.adminPassword ? C.red : C.muted, fontSize: 13 }} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="adminPassword"
                  value={formData.adminPassword}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                  style={{
                    width: '100%', fontFamily: 'Inter, sans-serif',
                    padding: '9px 40px 9px 34px',
                    border: `1.5px solid ${errors.adminPassword ? C.red : C.border}`,
                    borderRadius: 9, fontSize: 13.5, color: C.text, background: C.card, outline: 'none',
                    transition: 'border-color 0.15s, box-shadow 0.15s',
                  }}
                  onFocus={e => { e.target.style.borderColor = errors.adminPassword ? C.red : C.borderFocus; e.target.style.boxShadow = `0 0 0 3px ${errors.adminPassword ? '#fee2e2' : C.accentLight}`; }}
                  onBlur={e => { e.target.style.borderColor = errors.adminPassword ? C.red : C.border; e.target.style.boxShadow = 'none'; }}
                />
                <button type="button" onClick={() => setShowPassword(v => !v)} style={{ position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: C.muted, padding: 2 }}>
                  {showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
              </div>
              {errors.adminPassword && (
                <p style={{ fontSize: 11.5, color: C.red, display: 'flex', alignItems: 'center', gap: 4, margin: 0 }}>
                  <FiAlertTriangle size={11} /> {errors.adminPassword}
                </p>
              )}
            </Field>

            {/* What happens next */}
            <div style={{ background: C.greenLight, border: '1px solid #6ee7b7', borderRadius: 10, padding: '13px 15px', display: 'flex', gap: 10, alignItems: 'flex-start', marginTop: 4 }}>
              <BsInfoCircleFill style={{ color: C.green, fontSize: 14, flexShrink: 0, marginTop: 1 }} />
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, color: '#065f46', margin: '0 0 3px' }}>What happens next?</p>
                <p style={{ fontSize: 12, color: '#047857', margin: 0, lineHeight: 1.55 }}>
                  A stand admin account will be created with these credentials. They can log in immediately to manage their stand.
                </p>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* ── Action Bar ── */}
        <div style={{
          background: C.card, border: `1px solid ${C.border}`, borderRadius: 14,
          padding: '16px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          boxShadow: '0 1px 3px rgba(15,23,42,0.06)',
        }}>
          {/* Error summary */}
          {Object.keys(errors).length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: C.redLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FiAlertTriangle style={{ color: C.red, fontSize: 13 }} />
              </div>
              <p style={{ fontSize: 12.5, color: C.red, margin: 0, fontWeight: 500 }}>
                {Object.keys(errors).length} field{Object.keys(errors).length > 1 ? 's' : ''} need attention
              </p>
            </div>
          )}
          {Object.keys(errors).length === 0 && <div />}

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              type="button"
              onClick={() => navigate('/superadmin/stands')}
              style={{
                background: C.bg, border: `1px solid ${C.border}`, borderRadius: 9,
                padding: '9px 18px', fontSize: 13, fontWeight: 600, color: C.sub,
                cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: mutation.isPending ? '#a5b4fc' : C.accent,
                border: 'none', borderRadius: 9,
                padding: '9px 22px', fontSize: 13, fontWeight: 600, color: '#fff',
                cursor: mutation.isPending ? 'not-allowed' : 'pointer',
                boxShadow: mutation.isPending ? 'none' : '0 2px 8px rgba(99,102,241,0.38)',
                fontFamily: 'Inter, sans-serif', transition: 'background 0.15s',
              }}
            >
              {mutation.isPending
                ? <><span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} /> Creating…</>
                : <><FaPlus size={11} /> Create Stand & Admin</>
              }
            </button>
          </div>
        </div>
      </form>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default CreateStand;