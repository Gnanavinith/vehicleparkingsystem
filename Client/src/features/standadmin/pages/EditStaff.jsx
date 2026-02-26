import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getStaffMember, updateStaff } from '../api';
import { FaArrowLeft, FaSave, FaUser, FaEnvelope, FaPhone, FaLock, FaBriefcase } from 'react-icons/fa';

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
  bg: '#f8f9fb',
  card: '#ffffff',
  border: '#e5e7eb',
  text: '#0f172a',
  sub: '#6b7280',
  muted: '#9ca3af',
  accent: '#0f172a',
  accentLight: '#f3f4f6',
  red: '#ef4444',
  redLight: '#fee2e2',
};

// ─── Form Field ───────────────────────────────────────────────────────────────
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
const Input = ({ icon: Icon, error, type = 'text', ...props }) => (
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

// ─── Select ───────────────────────────────────────────────────────────────────
const Select = ({ icon: Icon, error, children, ...props }) => (
  <div style={{ position: 'relative' }}>
    {Icon && (
      <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: error ? C.red : C.muted, pointerEvents: 'none', zIndex: 1 }}>
        <Icon size={13} />
      </div>
    )}
    <select
      {...props}
      style={{
        width: '100%',
        padding: `10px 36px 10px ${Icon ? '36px' : '12px'}`,
        border: `1.5px solid ${error ? C.red : C.border}`,
        borderRadius: '10px',
        fontSize: '14px',
        color: C.text,
        background: C.card,
        fontFamily: "'Geist', -apple-system, sans-serif",
        outline: 'none',
        appearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
        backgroundPosition: 'right 12px center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '16px',
        transition: 'border-color 0.15s, box-shadow 0.15s',
        cursor: 'pointer',
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

// ─── Spinner ──────────────────────────────────────────────────────────────────
const Spinner = ({ color = 'white' }) => (
  <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTop: `2px solid ${color}`, borderRadius: '50%', animation: 'spin 0.8s linear infinite', flexShrink: 0 }} />
);

// ─── Main Component ───────────────────────────────────────────────────────────
const EditStaff = () => {
  const { id }      = useParams();
  const navigate    = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({ name: '', email: '', phone: '', role: 'staff', password: '' });
  const [errors, setErrors]     = useState({});

  // Fetch existing staff member
  const { data: staffData, isLoading: isFetching, error: fetchError } = useQuery({
    queryKey: ['staff-member', id],
    queryFn: () => getStaffMember(id),
    enabled: !!id,
  });

  // Populate form on load
  useEffect(() => {
    if (staffData) {
      setFormData({
        name:     staffData.name  || '',
        email:    staffData.email || '',
        phone:    staffData.phone || '',
        role:     staffData.role  || 'staff',
        password: '',
      });
    }
  }, [staffData]);

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: data => updateStaff(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['staff']);
      queryClient.invalidateQueries(['staff-member', id]);
      navigate('/standadmin/staff');
    },
    onError: err => {
      setErrors({ submit: err.response?.data?.message || 'Failed to update staff member' });
    },
  });

  const validate = () => {
    const errs = {};
    if (!formData.name.trim())  errs.name  = 'Name is required';
    if (!formData.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = 'Invalid email format';
    if (!formData.phone.trim()) errs.phone = 'Phone number is required';
    if (!formData.role)         errs.role  = 'Role is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!validate()) return;
    const payload = { ...formData };
    if (!payload.password) delete payload.password;
    updateMutation.mutate(payload);
  };

  // ── Loading state ──
  if (isFetching) {
    return (
      <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{ width: 36, height: 36, border: `3px solid ${C.accentLight}`, borderTop: `3px solid ${C.accent}`, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  // ── Error state ──
  if (fetchError) {
    return (
      <div style={{ minHeight: '100vh', background: C.bg, padding: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Geist', sans-serif" }}>
        <div style={{ background: C.card, borderRadius: '16px', padding: '40px', maxWidth: '480px', width: '100%', textAlign: 'center', border: `1px solid ${C.border}` }}>
          <p style={{ color: C.red, fontWeight: '600', marginBottom: '8px' }}>Failed to load staff member</p>
          <p style={{ color: C.sub, fontSize: '14px', marginBottom: '24px' }}>{fetchError.message}</p>
          <button onClick={() => navigate('/standadmin/staff')} style={{ background: C.accent, color: 'white', border: 'none', borderRadius: '8px', padding: '10px 20px', cursor: 'pointer', fontWeight: '500' }}>
            Back to Staff
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Geist', -apple-system, sans-serif; }
        .submit-btn { transition: all 0.15s; }
        .submit-btn:hover:not(:disabled) { background: #000 !important; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important; }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed !important; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div style={{ minHeight: '100vh', background: C.bg, padding: '32px', fontFamily: "'Geist', -apple-system, sans-serif" }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', background: C.card, borderRadius: '16px', border: `1px solid ${C.border}`, boxShadow: '0 1px 4px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)', overflow: 'hidden' }}>

          {/* Header */}
          <div style={{ padding: '24px 32px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => navigate('/standadmin/staff')}
              style={{ width: '36px', height: '36px', borderRadius: '10px', background: C.accentLight, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background 0.15s', flexShrink: 0 }}
              onMouseEnter={e => e.currentTarget.style.background = C.border}
              onMouseLeave={e => e.currentTarget.style.background = C.accentLight}
            >
              <FaArrowLeft style={{ color: C.sub, fontSize: '14px' }} />
            </button>
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: '600', color: C.text, letterSpacing: '-0.02em' }}>Edit Staff Member</h1>
              <p style={{ fontSize: '13px', color: C.muted, marginTop: '2px' }}>Update staff member details</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ padding: '32px' }}>
            {/* Submit error banner */}
            {errors.submit && (
              <div style={{ background: C.redLight, border: '1px solid #fecaca', borderRadius: '10px', padding: '14px 18px', marginBottom: '24px', color: C.red, fontSize: '14px' }}>
                <strong>Error:</strong> {errors.submit}
              </div>
            )}

            <div style={{ display: 'grid', gap: '20px', marginBottom: '32px' }}>
              <Field label="Full Name" required error={errors.name}>
                <Input icon={FaUser} name="name" value={formData.name} onChange={handleChange} placeholder="Enter full name" error={errors.name} />
              </Field>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <Field label="Email" required error={errors.email}>
                  <Input icon={FaEnvelope} name="email" type="email" value={formData.email} onChange={handleChange} placeholder="staff@example.com" error={errors.email} />
                </Field>
                <Field label="Phone Number" required error={errors.phone}>
                  <Input icon={FaPhone} name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" error={errors.phone} />
                </Field>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <Field label="Role" required error={errors.role}>
                  <Select icon={FaBriefcase} name="role" value={formData.role} onChange={handleChange} error={errors.role}>
                    <option value="staff">Staff</option>
                    <option value="manager">Manager</option>
                    <option value="supervisor">Supervisor</option>
                    <option value="coordinator">Coordinator</option>
                  </Select>
                </Field>
                <Field label="Password" hint="Leave blank to keep current password">
                  <Input icon={FaLock} name="password" type="password" value={formData.password} onChange={handleChange} placeholder="New password (optional)" />
                </Field>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                type="button"
                onClick={() => navigate('/standadmin/staff')}
                style={{ background: 'transparent', border: `1px solid ${C.border}`, borderRadius: '10px', padding: '11px 24px', fontSize: '14px', fontWeight: '500', color: C.sub, cursor: 'pointer', transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = C.accentLight}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="submit-btn"
                disabled={updateMutation.isPending}
                style={{ background: C.accent, color: 'white', border: 'none', borderRadius: '10px', padding: '11px 24px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                {updateMutation.isPending
                  ? <><Spinner /> Updating...</>
                  : <><FaSave size={13} /> Update Staff Member</>
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditStaff;