import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../config/axios';

import { FiArrowLeft, FiSave, FiTrash2, FiEye, FiEyeOff, FiAlertTriangle } from 'react-icons/fi';
import { HiOutlineBuildingOffice2 } from 'react-icons/hi2';
import { MdOutlineAdminPanelSettings, MdOutlineLocationOn, MdOutlinePhone } from 'react-icons/md';
import { RiParkingBoxLine } from 'react-icons/ri';
import { BsCurrencyDollar, BsPersonFill } from 'react-icons/bs';
import { FaMoneyBillWave } from 'react-icons/fa';
import { FaEnvelope, FaLock } from 'react-icons/fa';

// Currency symbol mapping
const CURRENCY_SYMBOLS = {
  'USD': '$',
  'EUR': '€',
  'GBP': '£',
  'INR': '₹',
  'JPY': '¥',
  'CAD': 'C$',
  'AUD': 'A$',
  'CHF': 'CHF',
  'CNY': '¥',
  'SGD': 'S$'
};

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
  amber:       '#f59e0b',
  amberLight:  '#fef3c7',
};

// ─── Field Component ───────────────────────────────────────────────────────────
const Field = ({ label, required, error, hint, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
    <label style={{ fontSize: 12.5, fontWeight: 600, color: C.sub, display: 'flex', alignItems: 'center', gap: 4 }}>
      {label}
      {required && <span style={{ color: C.red, fontSize: 13 }}>*</span>}
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

// ─── Input Component ───────────────────────────────────────────────────────────
const Input = ({ icon: Icon, error, suffix, style = {}, ...props }) => (
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
        paddingRight: suffix ? 44 : 12,
        border: `1.5px solid ${error ? C.red : C.border}`,
        borderRadius: 9, fontSize: 13.5, color: C.text,
        background: C.card, outline: 'none',
        transition: 'border-color 0.15s, box-shadow 0.15s',
        ...style,
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
    {suffix}
  </div>
);

// ─── Textarea Component ────────────────────────────────────────────────────────
const Textarea = ({ error, ...props }) => (
  <textarea
    {...props}
    style={{
      width: '100%', fontFamily: 'Inter, sans-serif',
      padding: '9px 12px', border: `1.5px solid ${error ? C.red : C.border}`,
      borderRadius: 9, fontSize: 13.5, color: C.text, background: C.card,
      outline: 'none', resize: 'vertical', lineHeight: 1.5,
      transition: 'border-color 0.15s, box-shadow 0.15s',
    }}
    onFocus={e => { e.target.style.borderColor = C.borderFocus; e.target.style.boxShadow = `0 0 0 3px ${C.accentLight}`; }}
    onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none'; }}
  />
);

//─── Select Component──────────────────────────────────────────────────────────
const Select = ({ icon: Icon, error, children, style = {}, ...props }) => (
  <div style={{ position: 'relative' }}>
    {Icon && (
      <div style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', zIndex: 1 }}>
        <Icon style={{ color: error ? C.red : C.muted, fontSize: 14 }} />
      </div>
    )}
    <select
      {...props}
      style={{
        width: '100%', fontFamily: 'Inter, sans-serif',
        padding: `9px 12px 9px ${Icon ? '34px' : '12px'}`,
        border: `1.5px solid ${error ? C.red : C.border}`,
        borderRadius: 9, fontSize: 13.5, color: C.text,
        background: C.card, outline: 'none',
        appearance: 'none',
        transition: 'border-color 0.15s, box-shadow 0.15s',
        ...style,
      }}
      onFocus={e => {
        e.target.style.borderColor = error ? C.red : C.borderFocus;
        e.target.style.boxShadow = `0 0 0 3px ${error ? '#fee2e2' : C.accentLight}`;
      }}
      onBlur={e => {
        e.target.style.borderColor = error ? C.red : C.border;
        e.target.style.boxShadow = 'none';
      }}
    >
      {children}
    </select>
    <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: C.muted }}>
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="m6 9 6 6 6-6" />
      </svg>
    </div>
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

// ─── Delete Confirm Modal ──────────────────────────────────────────────────────
const DeleteModal = ({ name, onConfirm, onCancel, isPending }) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
    <div style={{ background: C.card, borderRadius: 16, padding: '28px', width: 420, boxShadow: '0 24px 48px rgba(15,23,42,0.18)', border: `1px solid ${C.border}` }}>
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 22 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: C.redLight, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <FiAlertTriangle style={{ color: C.red, fontSize: 21 }} />
        </div>
        <div>
          <p style={{ fontSize: 15, fontWeight: 700, color: C.text, margin: 0 }}>Delete Stand</p>
          <p style={{ fontSize: 13, color: C.sub, marginTop: 5, lineHeight: 1.55 }}>
            Are you sure you want to permanently delete <strong>"{name}"</strong>? All associated data will be lost and this cannot be undone.
          </p>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button onClick={onCancel} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 9, padding: '8px 18px', fontSize: 13, fontWeight: 600, color: C.sub, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>Cancel</button>
        <button onClick={onConfirm} disabled={isPending} style={{ background: C.red, border: 'none', borderRadius: 9, padding: '8px 20px', fontSize: 13, fontWeight: 600, color: '#fff', cursor: isPending ? 'not-allowed' : 'pointer', opacity: isPending ? 0.7 : 1, fontFamily: 'Inter, sans-serif' }}>
          {isPending ? 'Deleting…' : 'Delete Stand'}
        </button>
      </div>
    </div>
  </div>
);

// ─── Main Component ────────────────────────────────────────────────────────────
const EditStand = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: '', location: '', capacity: '', hourlyRate: '',
    currency: 'USD', description: '', contactNumber: '',
    adminName: '', adminEmail: '', adminPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data: standData, isLoading, error } = useQuery({
    queryKey: ['stand', id],
    queryFn: async () => { const r = await api.get(`/stands/${id}`); return r.data.data; },
    enabled: !!id,
  });

  useEffect(() => {
    if (standData) {
      setFormData({
        name: standData.name || '',
        location: standData.location || '',
        capacity: standData.capacity || '',
        hourlyRate: standData.hourlyRate || '',
        currency: standData.currency || 'USD',
        description: standData.description || '',
        contactNumber: standData.contactNumber || '',
        adminName: standData.admin?.name || '',
        adminEmail: standData.admin?.email || '',
        adminPassword: '',
      });
    }
  }, [standData]);

  const updateStandMutation = useMutation({
    mutationFn: async (data) => { const r = await api.put(`/stands/${id}`, data); return r.data; },
    onSuccess: () => {
      queryClient.invalidateQueries(['superadmin-stands']);
      queryClient.invalidateQueries(['stand', id]);
      navigate('/superadmin/stands');
    },
    onError: (err) => { if (err.response?.data?.message) alert(`Error: ${err.response.data.message}`); },
  });

  const deleteStandMutation = useMutation({
    mutationFn: async () => { const r = await api.delete(`/stands/${id}`); return r.data; },
    onSuccess: () => { queryClient.invalidateQueries(['superadmin-stands']); navigate('/superadmin/stands'); },
    onError: (err) => { if (err.response?.data?.message) alert(`Error: ${err.response.data.message}`); },
  });

  const handleChange = e => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = e => {
    e.preventDefault();
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Name is required';
    if (!formData.location.trim()) errs.location = 'Location is required';
    if (!formData.capacity || formData.capacity <= 0) errs.capacity = 'Must be greater than 0';
    if (formData.hourlyRate === '' || formData.hourlyRate < 0) errs.hourlyRate = 'Must be 0 or greater';
    if (!formData.currency) errs.currency = 'Currency is required';
    if (!formData.adminName.trim()) errs.adminName = 'Admin name is required';
    if (!formData.adminEmail.trim()) errs.adminEmail = 'Admin email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.adminEmail)) errs.adminEmail = 'Invalid email address';
    setErrors(errs);
    if (!Object.keys(errs).length) updateStandMutation.mutate(formData);
  };

  if (isLoading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 260 }}>
      <div style={{ width: 36, height: 36, border: `3px solid ${C.accentLight}`, borderTopColor: C.accent, borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (error) return (
    <div style={{ background: C.redLight, border: `1px solid #fca5a5`, borderRadius: 12, padding: '14px 18px', color: C.red, fontSize: 14, fontFamily: 'Inter, sans-serif' }}>
      <strong>Error:</strong> {error.message}
    </div>
  );

  return (
    <div style={{ background: C.bg, minHeight: '100vh', padding: '28px 32px', fontFamily: 'Inter, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
      `}</style>

      {showDeleteModal && (
        <DeleteModal
          name={formData.name}
          onConfirm={() => deleteStandMutation.mutate()}
          onCancel={() => setShowDeleteModal(false)}
          isPending={deleteStandMutation.isPending}
        />
      )}

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button
            onClick={() => navigate('/superadmin/stands')}
            style={{
              width: 36, height: 36, borderRadius: 9, background: C.card,
              border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', boxShadow: '0 1px 3px rgba(15,23,42,0.06)',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = C.accentLight}
            onMouseLeave={e => e.currentTarget.style.background = C.card}
          >
            <FiArrowLeft style={{ color: C.sub, fontSize: 16 }} />
          </button>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: C.text, letterSpacing: '-0.025em', margin: 0 }}>Edit Stand</h1>
            <p style={{ fontSize: 13, color: C.sub, marginTop: 3 }}>
              {formData.name ? `Editing "${formData.name}"` : 'Update stand details and admin information'}
            </p>
          </div>
        </div>

        {/* Status badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {standData && (
            <span style={{
              fontSize: 12, fontWeight: 600, padding: '5px 12px', borderRadius: 20,
              background: standData.isActive ? C.greenLight : C.redLight,
              color: standData.isActive ? C.green : C.red,
              display: 'flex', alignItems: 'center', gap: 5,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: standData.isActive ? C.green : C.red }} />
              {standData.isActive ? 'Active' : 'Inactive'}
            </span>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>

          {/* ── Stand Information ── */}
          <SectionCard title="Stand Information" subtitle="Basic details about this parking location" Icon={HiOutlineBuildingOffice2} iconBg={C.accentLight} iconColor={C.accent}>
            <Field label="Stand Name" required error={errors.name}>
              <Input icon={RiParkingBoxLine} name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Main Street Parking" error={errors.name} />
            </Field>
            <Field label="Location" required error={errors.location}>
              <Input icon={MdOutlineLocationOn} name="location" value={formData.location} onChange={handleChange} placeholder="e.g. 123 Main St, Downtown" error={errors.location} />
            </Field>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <Field label="Capacity" required error={errors.capacity}>
                <Input
                  icon={RiParkingBoxLine}
                  name="capacity" type="number" min="1"
                  value={formData.capacity} onChange={handleChange}
                  placeholder="e.g. 100" error={errors.capacity}
                />
              </Field>
              <Field label="Currency" required error={errors.currency}>
                <Select
                  icon={FaMoneyBillWave}
                  name="currency"
                  value={formData.currency} onChange={handleChange}
                  error={errors.currency}
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="INR">INR - Indian Rupee</option>
                  <option value="JPY">JPY - Japanese Yen</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                  <option value="AUD">AUD - Australian Dollar</option>
                  <option value="CHF">CHF - Swiss Franc</option>
                  <option value="CNY">CNY - Chinese Yuan</option>
                  <option value="SGD">SGD - Singapore Dollar</option>
                </Select>
              </Field>
            </div>
            
            {/* Currency Info Box */}
            <div style={{ background: C.accentLight, border: `1px solid #c7d2fe`, borderRadius: 8, padding: '8px 12px', marginTop: -8, marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FaMoneyBillWave style={{ color: C.accent, fontSize: 14 }} />
                <span style={{ fontSize: 12, color: C.accent, fontWeight: 600 }}>
                  Selected: {formData.currency} ({CURRENCY_SYMBOLS[formData.currency] || '$'})
                </span>
              </div>
            </div>
            
            <Field label={`Hourly Rate in ${formData.currency}`} required error={errors.hourlyRate}>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', zIndex: 1 }}>
                  <span style={{ color: errors.hourlyRate ? C.red : C.muted, fontSize: 14, fontWeight: 'bold' }}>
                    {CURRENCY_SYMBOLS[formData.currency] || '$'}
                  </span>
                </div>
                <input
                  name="hourlyRate"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.hourlyRate}
                  onChange={handleChange}
                  placeholder={`e.g. 5.00 ${CURRENCY_SYMBOLS[formData.currency] || '$'}'`}
                  style={{
                    width: '100%', fontFamily: 'Inter, sans-serif',
                    padding: '9px 12px 9px 34px',
                    paddingRight: 44,
                    border: `1.5px solid ${errors.hourlyRate ? C.red : C.border}`,
                    borderRadius: 9, fontSize: 13.5, color: C.text,
                    background: C.card, outline: 'none',
                    transition: 'border-color 0.15s, box-shadow 0.15s',
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = errors.hourlyRate ? C.red : C.borderFocus;
                    e.target.style.boxShadow = `0 0 0 3px ${errors.hourlyRate ? '#fee2e2' : C.accentLight}`;
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = errors.hourlyRate ? C.red : C.border;
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                  <span style={{ color: C.muted, fontSize: 14, fontWeight: 'bold' }}>
                    {CURRENCY_SYMBOLS[formData.currency] || '$'}
                  </span>
                </div>
              </div>
            </Field>
            <Field label="Contact Number">
              <Input icon={MdOutlinePhone} name="contactNumber" value={formData.contactNumber} onChange={handleChange} placeholder="e.g. +1 555-000-0000" />
            </Field>
            <Field label="Description">
              <Textarea name="description" value={formData.description} onChange={handleChange} rows={4} placeholder="Describe the stand, facilities, access info…" />
            </Field>
          </SectionCard>

          {/* ── Admin Information ── */}
          <SectionCard title="Admin Information" subtitle="Assigned administrator for this stand" Icon={MdOutlineAdminPanelSettings} iconBg="#ede9fe" iconColor="#8b5cf6">
            <Field label="Admin Name" required error={errors.adminName}>
              <Input icon={BsPersonFill} name="adminName" value={formData.adminName} onChange={handleChange} placeholder="e.g. John Doe" error={errors.adminName} />
            </Field>
            <Field label="Admin Email" required error={errors.adminEmail}>
              <Input icon={FaEnvelope} name="adminEmail" type="email" value={formData.adminEmail} onChange={handleChange} placeholder="admin@example.com" error={errors.adminEmail} />
            </Field>
            <Field label="Admin Password" hint="Leave blank to keep the current password">
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', zIndex: 1 }}>
                  <FaLock style={{ color: C.muted, fontSize: 13 }} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="adminPassword"
                  value={formData.adminPassword}
                  onChange={handleChange}
                  placeholder="Leave blank to keep current password"
                  style={{
                    width: '100%', fontFamily: 'Inter, sans-serif',
                    padding: '9px 40px 9px 34px',
                    border: `1.5px solid ${C.border}`, borderRadius: 9,
                    fontSize: 13.5, color: C.text, background: C.card, outline: 'none',
                    transition: 'border-color 0.15s, box-shadow 0.15s',
                  }}
                  onFocus={e => { e.target.style.borderColor = C.borderFocus; e.target.style.boxShadow = `0 0 0 3px ${C.accentLight}`; }}
                  onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none'; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  style={{ position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: C.muted, padding: 2 }}
                >
                  {showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
              </div>
            </Field>

            {/* Info box */}
            <div style={{ background: C.accentLight, border: `1px solid #c7d2fe`, borderRadius: 10, padding: '14px 16px', marginTop: 4 }}>
              <p style={{ fontSize: 12.5, color: C.accent, fontWeight: 600, margin: '0 0 4px' }}>💡 About Admin Updates</p>
              <p style={{ fontSize: 12, color: '#4338ca', margin: 0, lineHeight: 1.55 }}>
                Changes to admin email or name will update the administrator's account credentials. A password change will be applied immediately.
              </p>
            </div>
          </SectionCard>
        </div>

        {/* ── Action Bar ── */}
        <div style={{
          background: C.card, border: `1px solid ${C.border}`, borderRadius: 14,
          padding: '16px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          boxShadow: '0 1px 3px rgba(15,23,42,0.06)',
        }}>
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            disabled={deleteStandMutation.isPending}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: C.redLight, border: `1px solid #fca5a5`, borderRadius: 9,
              padding: '9px 18px', fontSize: 13, fontWeight: 600, color: C.red,
              cursor: deleteStandMutation.isPending ? 'not-allowed' : 'pointer',
              opacity: deleteStandMutation.isPending ? 0.7 : 1, fontFamily: 'Inter, sans-serif',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => { if (!deleteStandMutation.isPending) e.currentTarget.style.background = '#fecaca'; }}
            onMouseLeave={e => e.currentTarget.style.background = C.redLight}
          >
            <FiTrash2 size={14} />
            Delete Stand
          </button>

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
              disabled={updateStandMutation.isPending}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: updateStandMutation.isPending ? '#a5b4fc' : C.accent,
                border: 'none', borderRadius: 9,
                padding: '9px 22px', fontSize: 13, fontWeight: 600, color: '#fff',
                cursor: updateStandMutation.isPending ? 'not-allowed' : 'pointer',
                boxShadow: updateStandMutation.isPending ? 'none' : '0 2px 8px rgba(99,102,241,0.38)',
                fontFamily: 'Inter, sans-serif', transition: 'background 0.15s',
              }}
            >
              <FiSave size={14} />
              {updateStandMutation.isPending ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditStand;