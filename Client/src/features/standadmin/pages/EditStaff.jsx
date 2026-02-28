import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getStaffMember, updateStaff } from '../api';
import { FaArrowLeft, FaSave, FaUser, FaEnvelope, FaPhone, FaLock, FaBriefcase } from 'react-icons/fa';
import { FiAlertCircle } from 'react-icons/fi';

// ─── Global CSS ───────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500;600&family=DM+Sans:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes fadeUp  { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
  @keyframes spin    { to   { transform: rotate(360deg); } }

  .es-wrap { font-family: 'DM Sans', sans-serif; animation: fadeUp .28s ease; }

  .section-label {
    font-family: 'DM Mono', monospace;
    font-size: 9px; font-weight: 600;
    letter-spacing: .14em; text-transform: uppercase;
    color: #aaa; display: block; margin-bottom: 6px;
  }

  .db-card {
    background: #fff;
    border-radius: 16px;
    border: 1px solid #ebebeb;
  }

  .es-input {
    width: 100%;
    background: #fafafa;
    border: 1.5px solid #ebebeb;
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13.5px;
    color: #0a0a0a;
    outline: none;
    transition: all .15s;
  }
  .es-input:focus {
    border-color: #0a0a0a;
    background: #fff;
    box-shadow: 0 0 0 3px #f5f5f5;
  }
  .es-input.has-error { border-color: #dc2626 !important; }
  .es-input.has-error:focus { box-shadow: 0 0 0 3px #fef2f2; }

  .es-input option { font-family: 'DM Sans', sans-serif; }

  .back-btn {
    width: 34px; height: 34px; border-radius: 9px;
    background: #f5f5f5; border: none;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all .14s; flex-shrink: 0;
  }
  .back-btn:hover { background: #ebebeb; transform: translateX(-1px); }

  .cancel-btn {
    padding: 10px 20px;
    background: transparent;
    border: 1.5px solid #ebebeb;
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 600;
    color: #888; cursor: pointer; transition: all .14s;
  }
  .cancel-btn:hover { border-color: #0a0a0a; color: #0a0a0a; background: #fafafa; }

  .save-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 10px 22px;
    background: #0a0a0a; color: #fff;
    border: none; border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 700;
    cursor: pointer; transition: all .14s;
  }
  .save-btn:hover:not(:disabled) { background: #222; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,.18); }
  .save-btn:disabled { background: #d4d4d4; cursor: not-allowed; }

  .field-label {
    font-family: 'DM Mono', monospace;
    font-size: 10px; font-weight: 600;
    letter-spacing: .08em; text-transform: uppercase;
    color: #888; display: flex; align-items: center; gap: 3px;
  }

  .field-error {
    font-family: 'DM Mono', monospace;
    font-size: 10px; color: #dc2626;
    display: flex; align-items: center; gap: 4px;
  }

  .field-hint {
    font-family: 'DM Mono', monospace;
    font-size: 10px; color: #bbb;
  }
`;

// ─── Field wrapper ─────────────────────────────────────────────────────────────
const Field = ({ label, required, error, hint, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <label className="field-label">
      {label}
      {required && <span style={{ color: '#dc2626', fontFamily: 'DM Sans, sans-serif' }}>*</span>}
    </label>
    {children}
    {error && (
      <span className="field-error">
        <FiAlertCircle size={10} /> {error}
      </span>
    )}
    {hint && !error && <span className="field-hint">{hint}</span>}
  </div>
);

// ─── Input ─────────────────────────────────────────────────────────────────────
const Input = ({ icon: Icon, error, type = 'text', ...props }) => (
  <div style={{ position: 'relative' }}>
    {Icon && (
      <div style={{
        position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
        color: error ? '#dc2626' : '#bbb', pointerEvents: 'none',
      }}>
        <Icon size={12} />
      </div>
    )}
    <input
      type={type}
      className={`es-input${error ? ' has-error' : ''}`}
      style={{ padding: `10px 12px 10px ${Icon ? '34px' : '12px'}` }}
      {...props}
    />
  </div>
);

// ─── Select ────────────────────────────────────────────────────────────────────
const Select = ({ icon: Icon, error, children, ...props }) => (
  <div style={{ position: 'relative' }}>
    {Icon && (
      <div style={{
        position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
        color: error ? '#dc2626' : '#bbb', pointerEvents: 'none', zIndex: 1,
      }}>
        <Icon size={12} />
      </div>
    )}
    <select
      className={`es-input${error ? ' has-error' : ''}`}
      style={{
        padding: `10px 36px 10px ${Icon ? '34px' : '12px'}`,
        appearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23aaa' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
        backgroundPosition: 'right 12px center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '16px',
        cursor: 'pointer',
      }}
      {...props}
    >
      {children}
    </select>
  </div>
);

// ─── Spinner ───────────────────────────────────────────────────────────────────
const Spinner = ({ color = '#fff', size = 14 }) => (
  <div style={{
    width: size, height: size,
    border: `2px solid ${color}33`,
    borderTopColor: color,
    borderRadius: '50%',
    animation: 'spin .6s linear infinite',
    flexShrink: 0,
  }} />
);

// ─── Main Component ────────────────────────────────────────────────────────────
const EditStaff = () => {
  const { id }      = useParams();
  const navigate    = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({ name: '', email: '', phone: '', role: 'staff', password: '' });
  const [errors, setErrors]     = useState({});

  const { data: staffData, isLoading: isFetching, error: fetchError } = useQuery({
    queryKey: ['staff-member', id],
    queryFn: () => getStaffMember(id),
    enabled: !!id,
  });

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

  // ── Loading ──
  if (isFetching) return (
    <>
      <style>{css}</style>
      <div style={{ minHeight: '100vh', background: '#f7f7f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spinner color="#0a0a0a" size={32} />
      </div>
    </>
  );

  // ── Fetch error ──
  if (fetchError) return (
    <>
      <style>{css}</style>
      <div style={{ minHeight: '100vh', background: '#f7f7f7', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <div className="db-card" style={{ padding: '40px', maxWidth: 440, width: '100%', textAlign: 'center' }}>
          <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 20, fontStyle: 'italic', color: '#0a0a0a', marginBottom: 8 }}>
            Failed to load
          </div>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#aaa', marginBottom: 24 }}>
            {fetchError.message}
          </div>
          <button className="save-btn" onClick={() => navigate('/standadmin/staff')}>
            Back to Staff
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      <style>{css}</style>
      <div className="es-wrap" style={{ padding: '28px 32px', minHeight: '100vh', background: '#f7f7f7' }}>

        {/* Page header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button className="back-btn" onClick={() => navigate('/standadmin/staff')}>
              <FaArrowLeft size={13} color="#555" />
            </button>
            <div>
              <span className="section-label" style={{ marginBottom: 3 }}>Staff</span>
              <div style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: 28, letterSpacing: '-0.02em',
                color: '#0a0a0a', lineHeight: 1, fontStyle: 'italic',
              }}>
                Edit Staff Member
              </div>
            </div>
          </div>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#aaa', letterSpacing: '.04em' }}>
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>

        {/* Form card */}
        <div className="db-card" style={{ maxWidth: 640, padding: '32px' }}>

          {/* Submit error */}
          {errors.submit && (
            <div style={{
              background: '#fef2f2', border: '1px solid #fca5a5',
              borderRadius: 10, padding: '12px 16px',
              marginBottom: 24,
              display: 'flex', alignItems: 'center', gap: 10,
              fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#dc2626',
            }}>
              <FiAlertCircle size={13} />
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gap: 20, marginBottom: 28 }}>

              {/* Full Name */}
              <Field label="Full Name" required error={errors.name}>
                <Input icon={FaUser} name="name" value={formData.name} onChange={handleChange} placeholder="Enter full name" error={errors.name} />
              </Field>

              {/* Email + Phone */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <Field label="Email" required error={errors.email}>
                  <Input icon={FaEnvelope} name="email" type="email" value={formData.email} onChange={handleChange} placeholder="staff@example.com" error={errors.email} />
                </Field>
                <Field label="Phone" required error={errors.phone}>
                  <Input icon={FaPhone} name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 98765 43210" error={errors.phone} />
                </Field>
              </div>

              {/* Role + Password */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <Field label="Role" required error={errors.role}>
                  <Select icon={FaBriefcase} name="role" value={formData.role} onChange={handleChange} error={errors.role}>
                    <option value="staff">Staff</option>
                    <option value="manager">Manager</option>
                    <option value="supervisor">Supervisor</option>
                    <option value="coordinator">Coordinator</option>
                  </Select>
                </Field>
                <Field label="Password" hint="Leave blank to keep current">
                  <Input icon={FaLock} name="password" type="password" value={formData.password} onChange={handleChange} placeholder="New password (optional)" />
                </Field>
              </div>
            </div>

            {/* Divider */}
            <div style={{ borderTop: '1px solid #f5f5f5', marginBottom: 24 }} />

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button type="button" className="cancel-btn" onClick={() => navigate('/standadmin/staff')}>
                Cancel
              </button>
              <button type="submit" className="save-btn" disabled={updateMutation.isPending}>
                {updateMutation.isPending
                  ? <><Spinner /> Updating…</>
                  : <><FaSave size={12} /> Update Staff Member</>
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