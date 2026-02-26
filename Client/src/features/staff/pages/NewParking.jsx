import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createParking } from '../api';
import { FaCar, FaMotorcycle, FaTruck, FaBus, FaUser, FaPhone, FaHashtag, FaArrowLeft } from 'react-icons/fa';

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
  bg: '#f8f9fb',
  card: '#ffffff',
  border: '#e5e7eb',
  borderLight: '#f0f0f0',
  text: '#0f172a',
  sub: '#6b7280',
  muted: '#9ca3af',
  accent: '#0f172a',
  accentLight: '#f3f4f6',
  red: '#ef4444',
  redLight: '#fee2e2',
};

// ─── Vehicle Types ────────────────────────────────────────────────────────────
const VEHICLE_TYPES = [
  { value: 'car',        label: 'Car',        icon: FaCar,       color: '#0369a1', bg: '#e0f2fe' },
  { value: 'motorcycle', label: 'Motorcycle',  icon: FaMotorcycle,color: '#065f46', bg: '#d1fae5' },
  { value: 'truck',      label: 'Truck',       icon: FaTruck,     color: '#92400e', bg: '#fef3c7' },
  { value: 'bus',        label: 'Bus',         icon: FaBus,       color: '#5b21b6', bg: '#ede9fe' },
];

// ─── Field ────────────────────────────────────────────────────────────────────
const Field = ({ label, required, error, hint, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
    <label style={{ fontSize: '13px', fontWeight: '500', color: C.sub, display: 'flex', alignItems: 'center', gap: '3px' }}>
      {label}
      {required && <span style={{ color: C.red }}>*</span>}
    </label>
    {children}
    {error && <p style={{ fontSize: '12px', color: C.red, margin: 0 }}>{error}</p>}
    {hint && !error && <p style={{ fontSize: '12px', color: C.muted, margin: 0 }}>{hint}</p>}
  </div>
);

// ─── Input ────────────────────────────────────────────────────────────────────
const Input = ({ icon: Icon, error, type = 'text', style: extraStyle, ...props }) => (
  <div style={{ position: 'relative' }}>
    {Icon && (
      <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: error ? C.red : C.muted, pointerEvents: 'none' }}>
        <Icon size={13} />
      </div>
    )}
    <input
      type={type}
      {...props}
      style={{
        width: '100%',
        padding: `10px 12px 10px ${Icon ? '36px' : '12px'}`,
        border: `1.5px solid ${error ? C.red : C.border}`,
        borderRadius: '10px',
        fontSize: '14px',
        color: C.text,
        background: C.card,
        fontFamily: "'Geist', -apple-system, sans-serif",
        outline: 'none',
        transition: 'border-color 0.15s, box-shadow 0.15s',
        ...extraStyle,
      }}
      onFocus={e => {
        e.target.style.borderColor = error ? C.red : C.accent;
        e.target.style.boxShadow = `0 0 0 3px ${error ? 'rgba(239,68,68,0.08)' : 'rgba(15,23,42,0.05)'}`
      }}
      onBlur={e => {
        e.target.style.borderColor = error ? C.red : C.border;
        e.target.style.boxShadow = 'none';
      }}
    />
  </div>
);

// ─── Spinner ──────────────────────────────────────────────────────────────────
const Spinner = () => (
  <div style={{ width: 15, height: 15, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
);

// ─── Main Component ───────────────────────────────────────────────────────────
const NewParking = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    vehicleNumber: '',
    vehicleType: 'car',
    customerName: '',
    customerPhone: '',
  });
  const [errors, setErrors]       = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const selectVehicle = value => {
    setFormData(prev => ({ ...prev, vehicleType: value }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.vehicleNumber.trim()) errs.vehicleNumber = 'Vehicle number is required';
    if (!formData.customerName.trim())  errs.customerName  = 'Customer name is required';
    if (!formData.customerPhone.trim()) errs.customerPhone = 'Phone number is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      await createParking(formData);
      navigate('/staff/today-list');
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to create parking entry');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedVehicle = VEHICLE_TYPES.find(v => v.value === formData.vehicleType);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Geist', -apple-system, sans-serif; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin   { to { transform: rotate(360deg); } }
        .vehicle-card { transition: all 0.15s; cursor: pointer; }
        .vehicle-card:hover { transform: translateY(-1px); }
        .submit-btn { transition: all 0.15s; }
        .submit-btn:hover:not(:disabled) { background: #111827 !important; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important; }
        .submit-btn:disabled { opacity: 0.65; cursor: not-allowed; }
        .cancel-btn { transition: background 0.15s; }
        .cancel-btn:hover { background: #f3f4f6 !important; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 2px; }
      `}</style>

      <div style={{ minHeight: '100vh', background: C.bg, padding: '32px', fontFamily: "'Geist', -apple-system, sans-serif" }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>

          {/* ── Header ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px', animation: 'fadeUp 0.35s ease both', justifyContent: 'center', borderBottom: 'none' }}>
            <button
              onClick={() => navigate('/staff/today-list')}
              style={{ width: '36px', height: '36px', borderRadius: '10px', background: C.card, border: `1px solid ${C.borderLight}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, transition: 'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = C.accentLight}
              onMouseLeave={e => e.currentTarget.style.background = C.card}
            >
              <FaArrowLeft size={13} style={{ color: C.sub }} />
            </button>
            <div>
              <p style={{ fontSize: '12px', color: C.muted, letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: '500', marginBottom: '3px' }}>Staff</p>
              <h1 style={{ fontSize: '22px', fontWeight: '600', color: C.text, letterSpacing: '-0.02em' }}>New Parking Entry</h1>
            </div>
          </div>

          {/* ── Form Card ── */}
          <div style={{ background: C.card, borderRadius: '16px', border: `1px solid ${C.borderLight}`, boxShadow: '0 1px 4px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)', overflow: 'hidden', animation: 'fadeUp 0.4s ease 0.06s both', maxWidth: '800px', margin: '0 auto' }}>

            {/* Vehicle Type Selector */}
            <div style={{ padding: '24px 28px' }}>
              <p style={{ fontSize: '11px', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600', marginBottom: '14px' }}>Vehicle Type</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                {VEHICLE_TYPES.map(v => {
                  const Icon = v.icon;
                  const selected = formData.vehicleType === v.value;
                  return (
                    <button
                      key={v.value}
                      type="button"
                      className="vehicle-card"
                      onClick={() => selectVehicle(v.value)}
                      style={{
                        padding: '16px 12px',
                        borderRadius: '12px',
                        border: `1.5px solid ${selected ? v.color : C.border}`,
                        background: selected ? v.bg : C.accentLight,
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
                        boxShadow: selected ? `0 0 0 3px ${v.bg}` : 'none',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: selected ? v.bg : C.card, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${selected ? v.color + '40' : C.borderLight}` }}>
                        <Icon size={14} style={{ color: selected ? v.color : C.muted }} />
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: '600', color: selected ? v.color : C.sub, letterSpacing: '-0.01em' }}>{v.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit}>
              <div style={{ padding: '28px 32px', display: 'grid', gap: '20px' }}>

                {/* Submit error */}
                {submitError && (
                  <div style={{ background: C.redLight, border: '1px solid #fecaca', borderRadius: '10px', padding: '12px 16px', color: C.red, fontSize: '13.5px' }}>
                    {submitError}
                  </div>
                )}

                {/* Vehicle Number */}
                <Field label="Vehicle Number" required error={errors.vehicleNumber} hint="Include hyphens if applicable, e.g. TN-01-AB-1234">
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: errors.vehicleNumber ? C.red : C.muted, pointerEvents: 'none' }}>
                      <FaHashtag size={12} />
                    </div>
                    <input
                      name="vehicleNumber"
                      value={formData.vehicleNumber}
                      onChange={handleChange}
                      placeholder="e.g. TN-01-AB-1234"
                      autoComplete="off"
                      style={{
                        width: '100%', padding: '10px 12px 10px 34px',
                        border: `1.5px solid ${errors.vehicleNumber ? C.red : C.border}`,
                        borderRadius: '10px', fontSize: '14px', color: C.text,
                        background: C.card, fontFamily: "'Geist Mono', monospace",
                        letterSpacing: '0.04em', textTransform: 'uppercase',
                        outline: 'none', transition: 'border-color 0.15s, box-shadow 0.15s',
                      }}
                      onFocus={e => { e.target.style.borderColor = errors.vehicleNumber ? C.red : C.accent; e.target.style.boxShadow = `0 0 0 3px ${errors.vehicleNumber ? 'rgba(239,68,68,0.08)' : 'rgba(15,23,42,0.05)'}`; }}
                      onBlur={e => { e.target.style.borderColor = errors.vehicleNumber ? C.red : C.border; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>
                </Field>

                {/* Two-column row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <Field label="Customer Name" required error={errors.customerName}>
                    <Input
                      icon={FaUser}
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleChange}
                      placeholder="Full name"
                      error={errors.customerName}
                    />
                  </Field>

                  <Field label="Phone Number" required error={errors.customerPhone}>
                    <Input
                      icon={FaPhone}
                      name="customerPhone"
                      value={formData.customerPhone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      type="tel"
                      error={errors.customerPhone}
                    />
                  </Field>
                </div>

                {/* Entry preview pill */}
                {formData.vehicleNumber && (
                  <div style={{ background: C.accentLight, borderRadius: '12px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '14px', border: `1px solid ${C.borderLight}` }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: selectedVehicle.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `1px solid ${C.borderLight}` }}>
                      {React.createElement(selectedVehicle.icon, { size: 13, style: { color: selectedVehicle.color } })}
                    </div>
                    <div>
                      <p style={{ fontSize: '13.5px', fontWeight: '600', color: C.text, letterSpacing: '0.04em', fontFamily: "'Geist Mono', monospace" }}>
                        {formData.vehicleNumber.toUpperCase()}
                      </p>
                      <p style={{ fontSize: '12px', color: C.muted, marginTop: '1px' }}>
                        {selectedVehicle.label}{formData.customerName ? ` · ${formData.customerName}` : ''}
                      </p>
                    </div>
                    <div style={{ marginLeft: 'auto', fontSize: '11px', color: C.muted, background: C.card, border: `1px solid ${C.borderLight}`, borderRadius: '6px', padding: '3px 8px', fontFamily: "'Geist Mono', monospace" }}>
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <div style={{ padding: '18px 32px', display: 'flex', gap: '12px', justifyContent: 'flex-end', background: '#fafafa' }}>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => navigate('/staff/today-list')}
                  style={{ padding: '11px 22px', borderRadius: '10px', border: `1px solid ${C.borderLight}`, background: C.card, color: C.sub, fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={submitting}
                  style={{ padding: '11px 24px', borderRadius: '10px', border: 'none', background: C.accent, color: 'white', fontSize: '14px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}
                >
                  {submitting ? <><Spinner /> Creating...</> : 'Create Entry'}
                </button>
              </div>
            </form>
          </div>

          {/* Tip */}
          <p style={{ textAlign: 'center', fontSize: '12px', color: C.muted, marginTop: '16px', animation: 'fadeUp 0.4s ease 0.15s both', maxWidth: '800px', margin: '16px auto 0' }}>
            Entry time is recorded automatically on submission
          </p>
        </div>
      </div>
    </>
  );
};

export default NewParking;