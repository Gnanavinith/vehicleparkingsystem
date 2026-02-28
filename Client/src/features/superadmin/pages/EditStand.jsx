import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../config/axios';

import { FiArrowLeft, FiSave, FiTrash2, FiEye, FiEyeOff, FiAlertTriangle } from 'react-icons/fi';
import { HiOutlineBuildingOffice2 } from 'react-icons/hi2';
import { MdOutlineAdminPanelSettings, MdOutlineLocationOn, MdOutlinePhone } from 'react-icons/md';
import { RiParkingBoxLine } from 'react-icons/ri';
import { BsPersonFill } from 'react-icons/bs';
import { FaMoneyBillWave, FaEnvelope, FaLock } from 'react-icons/fa';

// ─── Currency ──────────────────────────────────────────────────────────────────
const CURRENCY_SYMBOLS = {
  USD: '$', EUR: '€', GBP: '£', INR: '₹', JPY: '¥',
  CAD: 'C$', AUD: 'A$', CHF: 'CHF', CNY: '¥', SGD: 'S$',
};

// ─── Global CSS ────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500;600&family=DM+Sans:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
  @keyframes spin   { to { transform: rotate(360deg); } }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

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
    transition: box-shadow .18s;
  }

  /* ── Form inputs ── */
  .es-input, .es-select, .es-textarea {
    width: 100%;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    color: #0a0a0a;
    background: #fff;
    border: 1.5px solid #ebebeb;
    border-radius: 10px;
    padding: 9px 12px;
    outline: none;
    transition: border-color .14s, box-shadow .14s;
  }
  .es-input:focus, .es-select:focus, .es-textarea:focus {
    border-color: #0a0a0a;
    box-shadow: 0 0 0 3px rgba(10,10,10,0.06);
  }
  .es-input.error, .es-select.error { border-color: #dc2626; }
  .es-input.error:focus { box-shadow: 0 0 0 3px #fee2e2; }
  .es-input.has-icon { padding-left: 34px; }
  .es-select { appearance: none; }
  .es-textarea { resize: vertical; line-height: 1.55; }
  .es-input::placeholder, .es-textarea::placeholder { color: #ccc; }

  .field-label {
    font-family: 'DM Mono', monospace;
    font-size: 10px; font-weight: 600;
    letter-spacing: .06em; text-transform: uppercase;
    color: #888; margin-bottom: 5px; display: flex; align-items: center; gap: 4px;
  }
  .field-error {
    font-family: 'DM Mono', monospace;
    font-size: 10px; color: #dc2626;
    display: flex; align-items: center; gap: 4px; margin-top: 4px;
  }
  .field-hint {
    font-family: 'DM Mono', monospace;
    font-size: 10px; color: #bbb; margin-top: 4px;
  }

  /* ── Back button ── */
  .back-btn {
    width: 36px; height: 36px; border-radius: 10px;
    background: #fff; border: 1.5px solid #ebebeb;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all .14s; flex-shrink: 0;
  }
  .back-btn:hover { border-color: #0a0a0a; background: #fafafa; }

  /* ── Action buttons ── */
  .save-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 10px 22px; background: #0a0a0a; color: #fff;
    border: none; border-radius: 10px;
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 700;
    cursor: pointer; transition: all .14s;
  }
  .save-btn:hover:not(:disabled) { background: #222; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,.18); }
  .save-btn:disabled { background: #d4d4d4; cursor: not-allowed; }

  .cancel-btn {
    padding: 10px 18px; background: transparent;
    border: 1.5px solid #ebebeb; border-radius: 10px;
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
    color: #888; cursor: pointer; transition: all .14s;
  }
  .cancel-btn:hover { border-color: #0a0a0a; color: #0a0a0a; }

  .delete-btn {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 10px 18px; background: #fef2f2; color: #dc2626;
    border: 1.5px solid #fecaca; border-radius: 10px;
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
    cursor: pointer; transition: all .14s;
  }
  .delete-btn:hover:not(:disabled) { background: #fecaca; border-color: #dc2626; }
  .delete-btn:disabled { opacity: .6; cursor: not-allowed; }

  .delete-confirm-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 10px 20px; background: #dc2626; color: #fff;
    border: none; border-radius: 10px;
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 700;
    cursor: pointer; transition: all .14s;
  }
  .delete-confirm-btn:hover:not(:disabled) { background: #b91c1c; }
  .delete-confirm-btn:disabled { background: #d4d4d4; cursor: not-allowed; }

  /* ── Info box ── */
  .info-box {
    background: #f7f7f7; border: 1.5px solid #ebebeb;
    border-radius: 10px; padding: 12px 14px;
  }
`;

// ─── Spinner ───────────────────────────────────────────────────────────────────
const Spinner = ({ color = '#fff', size = 14 }) => (
  <div style={{
    width: size, height: size,
    border: `2px solid ${color}33`, borderTopColor: color,
    borderRadius: '50%', animation: 'spin .6s linear infinite', flexShrink: 0,
  }} />
);

// ─── Field wrapper ────────────────────────────────────────────────────────────
const Field = ({ label, required, error, hint, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <div className="field-label">
      {label}
      {required && <span style={{ color: '#dc2626', fontSize: 11 }}>*</span>}
    </div>
    {children}
    {error && <div className="field-error"><FiAlertTriangle size={10} />{error}</div>}
    {hint && !error && <div className="field-hint">{hint}</div>}
  </div>
);

// ─── Input with optional icon ─────────────────────────────────────────────────
const Input = ({ icon: Icon, error, ...props }) => (
  <div style={{ position: 'relative' }}>
    {Icon && (
      <div style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', zIndex: 1 }}>
        <Icon style={{ color: error ? '#dc2626' : '#ccc', fontSize: 13 }} />
      </div>
    )}
    <input className={`es-input${Icon ? ' has-icon' : ''}${error ? ' error' : ''}`} {...props} />
  </div>
);

// ─── Select with optional icon ────────────────────────────────────────────────
const Select = ({ icon: Icon, error, children, ...props }) => (
  <div style={{ position: 'relative' }}>
    {Icon && (
      <div style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', zIndex: 1 }}>
        <Icon style={{ color: '#ccc', fontSize: 13 }} />
      </div>
    )}
    <select className={`es-select${error ? ' error' : ''}`} style={{ paddingLeft: Icon ? 34 : 12 }} {...props}>
      {children}
    </select>
    {/* chevron */}
    <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#ccc' }}>
      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path d="m6 9 6 6 6-6" />
      </svg>
    </div>
  </div>
);

// ─── Section Card ─────────────────────────────────────────────────────────────
const SectionCard = ({ title, subtitle, Icon, iconBg, iconColor, children }) => (
  <div className="db-card" style={{ overflow: 'hidden' }}>
    {/* card header */}
    <div style={{
      padding: '16px 20px', borderBottom: '1px solid #f5f5f5',
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <div style={{ width: 34, height: 34, borderRadius: 9, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon style={{ color: iconColor, fontSize: 15 }} />
      </div>
      <div>
        <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 16, fontStyle: 'italic', color: '#0a0a0a' }}>{title}</div>
        {subtitle && <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: '#aaa', marginTop: 2, letterSpacing: '.03em' }}>{subtitle}</div>}
      </div>
    </div>
    {/* card body */}
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {children}
    </div>
  </div>
);

// ─── Delete Modal ─────────────────────────────────────────────────────────────
const DeleteModal = ({ name, onConfirm, onCancel, isPending }) => (
  <div style={{
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000, animation: 'fadeIn .15s ease',
  }}>
    <div className="db-card" style={{ padding: '32px', maxWidth: 400, width: '90%' }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{
          width: 48, height: 48, borderRadius: '50%', background: '#fef2f2',
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
        }}>
          <FiAlertTriangle size={20} color="#dc2626" />
        </div>
        <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 20, fontStyle: 'italic', color: '#0a0a0a', marginBottom: 8 }}>
          Delete Stand
        </div>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#888', lineHeight: 1.7 }}>
          Are you sure you want to permanently delete{' '}
          <span style={{ color: '#0a0a0a', fontWeight: 600 }}>{name}</span>?
          <br />All associated data will be lost and this cannot be undone.
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button className="cancel-btn" onClick={onCancel}>Cancel</button>
        <button className="delete-confirm-btn" onClick={onConfirm} disabled={isPending}>
          {isPending ? <><Spinner /> Deleting…</> : <><FiTrash2 size={11} /> Delete Stand</>}
        </button>
      </div>
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const EditStand = () => {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const queryClient  = useQueryClient();

  const [formData, setFormData] = useState({
    name: '', location: '', capacity: '',
    pricing: { cycle: 5, bike: 10, car: 20 },
    currency: 'INR', description: '', contactNumber: '',
    adminName: '', adminEmail: '', adminPassword: '',
  });
  const [errors, setErrors]           = useState({});
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
        name:          standData.name          || '',
        location:      standData.location      || '',
        capacity:      standData.capacity      || '',
        pricing:       standData.pricing       || { cycle: 5, bike: 10, car: 20 },
        currency:      standData.currency      || 'INR',
        description:   standData.description   || '',
        contactNumber: standData.contactNumber || '',
        adminName:     standData.admin?.name   || '',
        adminEmail:    standData.admin?.email  || '',
        adminPassword: '',
      });
    }
  }, [standData]);

  const updateMutation = useMutation({
    mutationFn: async (data) => { const r = await api.put(`/stands/${id}`, data); return r.data; },
    onSuccess:  () => { queryClient.invalidateQueries(['superadmin-stands']); queryClient.invalidateQueries(['stand', id]); navigate('/superadmin/stands'); },
    onError:    (err) => { if (err.response?.data?.message) alert(`Error: ${err.response.data.message}`); },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => { const r = await api.delete(`/stands/${id}`); return r.data; },
    onSuccess:  () => { queryClient.invalidateQueries(['superadmin-stands']); navigate('/superadmin/stands'); },
    onError:    (err) => { if (err.response?.data?.message) alert(`Error: ${err.response.data.message}`); },
  });

  const handleChange = e => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = e => {
    e.preventDefault();
    const errs = {};
    if (!formData.name.trim())                         errs.name       = 'Name is required';
    if (!formData.location.trim())                     errs.location   = 'Location is required';
    if (!formData.capacity || formData.capacity <= 0)  errs.capacity   = 'Must be greater than 0';
    if (!formData.pricing.cycle || formData.pricing.cycle < 0) errs.cycleRate = 'Must be 0 or greater';
    if (!formData.pricing.bike || formData.pricing.bike < 0) errs.bikeRate = 'Must be 0 or greater';
    if (!formData.pricing.car || formData.pricing.car < 0) errs.carRate = 'Must be 0 or greater';
    if (!formData.currency)                            errs.currency   = 'Currency is required';
    if (!formData.adminName.trim())                    errs.adminName  = 'Admin name is required';
    if (!formData.adminEmail.trim())                   errs.adminEmail = 'Admin email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.adminEmail)) errs.adminEmail = 'Invalid email address';
    setErrors(errs);
    if (!Object.keys(errs).length) updateMutation.mutate(formData);
  };

  // ── Loading ──
  if (isLoading) return (
    <>
      <style>{css}</style>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 260 }}>
        <Spinner color="#0a0a0a" size={32} />
      </div>
    </>
  );

  // ── Error ──
  if (error) return (
    <>
      <style>{css}</style>
      <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 12, padding: '14px 18px', color: '#dc2626', fontSize: 13, fontFamily: 'DM Mono, monospace' }}>
        <strong>Error:</strong> {error.message}
      </div>
    </>
  );

  const sym = CURRENCY_SYMBOLS[formData.currency] || '₹';

  return (
    <>
      <style>{css}</style>
      <div className="es-wrap" style={{ padding: '28px 32px', minHeight: '100vh', background: '#f7f7f7' }}>

        {showDeleteModal && (
          <DeleteModal
            name={formData.name}
            onConfirm={() => deleteMutation.mutate()}
            onCancel={() => setShowDeleteModal(false)}
            isPending={deleteMutation.isPending}
          />
        )}

        {/* ── Header ── */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button className="back-btn" onClick={() => navigate('/superadmin/stands')}>
              <FiArrowLeft size={15} color="#555" />
            </button>
            <div>
              <span className="section-label">Network / Stands</span>
              <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 28, letterSpacing: '-0.02em', color: '#0a0a0a', lineHeight: 1, fontStyle: 'italic' }}>
                Edit Stand
              </div>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#aaa', marginTop: 4, letterSpacing: '.04em' }}>
                {formData.name ? `Editing "${formData.name}"` : 'Update stand details and admin information'}
              </div>
            </div>
          </div>

          {/* Status badge */}
          {standData && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontFamily: 'DM Mono, monospace', fontSize: 10, fontWeight: 700,
              letterSpacing: '.08em', textTransform: 'uppercase',
              background: standData.isActive ? '#f0fdf4' : '#f5f5f5',
              color: standData.isActive ? '#059669' : '#aaa',
              padding: '5px 12px', borderRadius: 20,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: standData.isActive ? '#22c55e' : '#d1d5db' }} />
              {standData.isActive ? 'Active' : 'Inactive'}
            </span>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>

            {/* ── Stand Information ── */}
            <SectionCard
              title="Stand Information"
              subtitle="Basic details about this parking location"
              Icon={HiOutlineBuildingOffice2}
              iconBg="#eff6ff"
              iconColor="#1d4ed8"
            >
              <Field label="Stand Name" required error={errors.name}>
                <Input icon={RiParkingBoxLine} name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Main Street Parking" error={errors.name} />
              </Field>

              <Field label="Location" required error={errors.location}>
                <Input icon={MdOutlineLocationOn} name="location" value={formData.location} onChange={handleChange} placeholder="e.g. 123 Main St, Downtown" error={errors.location} />
              </Field>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Field label="Capacity" required error={errors.capacity}>
                  <Input icon={RiParkingBoxLine} name="capacity" type="number" min="1" value={formData.capacity} onChange={handleChange} placeholder="e.g. 100" error={errors.capacity} />
                </Field>
                <Field label="Currency" required error={errors.currency}>
                  <Select icon={FaMoneyBillWave} name="currency" value={formData.currency} onChange={handleChange} error={errors.currency}>
                    <option value="USD">USD — $</option>
                    <option value="EUR">EUR — €</option>
                    <option value="GBP">GBP — £</option>
                    <option value="INR">INR — ₹</option>
                    <option value="JPY">JPY — ¥</option>
                    <option value="CAD">CAD — C$</option>
                    <option value="AUD">AUD — A$</option>
                    <option value="CHF">CHF</option>
                    <option value="CNY">CNY — ¥</option>
                    <option value="SGD">SGD — S$</option>
                  </Select>
                </Field>
              </div>

              {/* Currency pill */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: -6 }}>
                <span style={{
                  fontFamily: 'DM Mono, monospace', fontSize: 10, fontWeight: 700,
                  letterSpacing: '.08em', textTransform: 'uppercase',
                  background: '#eff6ff', color: '#1d4ed8',
                  padding: '3px 10px', borderRadius: 20,
                }}>
                  {formData.currency} · {sym}
                </span>
              </div>

              {/* Vehicle-specific pricing */}
              <div style={{ 
                background: '#f8fafc', 
                border: '1px solid #e2e8f0', 
                borderRadius: 10, 
                padding: 16,
                marginTop: 8
              }}>
                <div style={{ 
                  fontFamily: 'DM Mono, monospace', 
                  fontSize: 10, 
                  fontWeight: 700,
                  letterSpacing: '.08em', 
                  textTransform: 'uppercase',
                  color: '#64748b', 
                  marginBottom: 12 
                }}>
                  Vehicle Pricing
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                  <Field label="Cycle" error={errors.cycleRate}>
                    <div style={{ position: 'relative' }}>
                      <div style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', zIndex: 1, fontFamily: 'DM Serif Display, serif', fontSize: 14, color: errors.cycleRate ? '#dc2626' : '#aaa' }}>
                        {sym}
                      </div>
                      <input
                        className={`es-input has-icon${errors.cycleRate ? ' error' : ''}`}
                        name="pricing.cycle"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.pricing.cycle}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          pricing: { ...prev.pricing, cycle: parseFloat(e.target.value) || 0 }
                        }))}
                        placeholder="5.00"
                      />
                    </div>
                  </Field>
                  
                  <Field label="Bike" error={errors.bikeRate}>
                    <div style={{ position: 'relative' }}>
                      <div style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', zIndex: 1, fontFamily: 'DM Serif Display, serif', fontSize: 14, color: errors.bikeRate ? '#dc2626' : '#aaa' }}>
                        {sym}
                      </div>
                      <input
                        className={`es-input has-icon${errors.bikeRate ? ' error' : ''}`}
                        name="pricing.bike"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.pricing.bike}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          pricing: { ...prev.pricing, bike: parseFloat(e.target.value) || 0 }
                        }))}
                        placeholder="10.00"
                      />
                    </div>
                  </Field>
                  
                  <Field label="Car" error={errors.carRate}>
                    <div style={{ position: 'relative' }}>
                      <div style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', zIndex: 1, fontFamily: 'DM Serif Display, serif', fontSize: 14, color: errors.carRate ? '#dc2626' : '#aaa' }}>
                        {sym}
                      </div>
                      <input
                        className={`es-input has-icon${errors.carRate ? ' error' : ''}`}
                        name="pricing.car"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.pricing.car}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          pricing: { ...prev.pricing, car: parseFloat(e.target.value) || 0 }
                        }))}
                        placeholder="20.00"
                      />
                    </div>
                  </Field>
                </div>
              </div>

              <Field label="Contact Number">
                <Input icon={MdOutlinePhone} name="contactNumber" value={formData.contactNumber} onChange={handleChange} placeholder="e.g. +91 98765 43210" />
              </Field>

              <Field label="Description">
                <textarea className="es-textarea" name="description" value={formData.description} onChange={handleChange} rows={4} placeholder="Describe the stand, facilities, access info…" />
              </Field>
            </SectionCard>

            {/* ── Admin Information ── */}
            <SectionCard
              title="Admin Information"
              subtitle="Assigned administrator for this stand"
              Icon={MdOutlineAdminPanelSettings}
              iconBg="#f5f3ff"
              iconColor="#7c3aed"
            >
              <Field label="Admin Name" required error={errors.adminName}>
                <Input icon={BsPersonFill} name="adminName" value={formData.adminName} onChange={handleChange} placeholder="e.g. John Doe" error={errors.adminName} />
              </Field>

              <Field label="Admin Email" required error={errors.adminEmail}>
                <Input icon={FaEnvelope} name="adminEmail" type="email" value={formData.adminEmail} onChange={handleChange} placeholder="admin@example.com" error={errors.adminEmail} />
              </Field>

              <Field label="Admin Password" hint="Leave blank to keep the current password">
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', zIndex: 1 }}>
                    <FaLock style={{ color: '#ccc', fontSize: 12 }} />
                  </div>
                  <input
                    className="es-input has-icon"
                    type={showPassword ? 'text' : 'password'}
                    name="adminPassword"
                    value={formData.adminPassword}
                    onChange={handleChange}
                    placeholder="Leave blank to keep current"
                    style={{ paddingRight: 40 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    style={{ position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#bbb', padding: 2, display: 'flex' }}
                  >
                    {showPassword ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                  </button>
                </div>
              </Field>

              {/* Info box */}
              <div className="info-box">
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, fontWeight: 700, color: '#555', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 6 }}>
                  About Admin Updates
                </div>
                <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: '#777', lineHeight: 1.6 }}>
                  Changes to admin email or name will update the administrator's account credentials. A password change will be applied immediately.
                </div>
              </div>
            </SectionCard>
          </div>

          {/* ── Action Bar ── */}
          <div className="db-card" style={{ padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              type="button"
              className="delete-btn"
              onClick={() => setShowDeleteModal(true)}
              disabled={deleteMutation.isPending}
            >
              <FiTrash2 size={13} /> Delete Stand
            </button>

            <div style={{ display: 'flex', gap: 10 }}>
              <button type="button" className="cancel-btn" onClick={() => navigate('/superadmin/stands')}>
                Cancel
              </button>
              <button type="submit" className="save-btn" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? <><Spinner /> Saving…</> : <><FiSave size={13} /> Save Changes</>}
              </button>
            </div>
          </div>
        </form>

      </div>
    </>
  );
};

export default EditStand;