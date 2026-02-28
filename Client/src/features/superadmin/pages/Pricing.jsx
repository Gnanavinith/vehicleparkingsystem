import React, { useState, useEffect } from 'react';
import { FaSave, FaRupeeSign } from 'react-icons/fa';
import { FiEdit2, FiX, FiMoon, FiCalendar, FiCreditCard, FiRefreshCw } from 'react-icons/fi';
import { MdOutlineTimer, MdOutlinePercent, MdOutlineAttachMoney } from 'react-icons/md';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPricing, updatePricing } from '../api';

// ─── Global CSS ────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500;600&family=DM+Sans:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes fadeUp  { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
  @keyframes countUp { from { opacity: 0; transform: translateY(6px);  } to { opacity: 1; transform: none; } }
  @keyframes spin    { to { transform: rotate(360deg); } }

  .pr-wrap { font-family: 'DM Sans', sans-serif; animation: fadeUp .28s ease; }

  .section-label {
    font-family: 'DM Mono', monospace;
    font-size: 9px; font-weight: 600;
    letter-spacing: .14em; text-transform: uppercase;
    color: #aaa; display: block; margin-bottom: 6px;
  }

  .db-card {
    background: #fff; border-radius: 16px;
    border: 1px solid #ebebeb; transition: box-shadow .18s;
  }
  .db-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,.06); }

  .pr-input {
    width: 100%; background: #fafafa;
    border: 1.5px solid #ebebeb; border-radius: 10px;
    padding: 10px 12px 10px 36px;
    font-family: 'DM Mono', monospace; font-size: 16px; font-weight: 600;
    color: #0a0a0a; outline: none; transition: all .15s;
    -moz-appearance: textfield;
  }
  .pr-input::-webkit-outer-spin-button,
  .pr-input::-webkit-inner-spin-button { -webkit-appearance: none; }
  .pr-input:focus { border-color: #0a0a0a; background: #fff; box-shadow: 0 0 0 3px #f5f5f5; }

  .pr-select {
    width: 100%; background: #fafafa;
    border: 1.5px solid #ebebeb; border-radius: 10px;
    padding: 10px 32px 10px 36px;
    font-family: 'DM Mono', monospace; font-size: 13px; font-weight: 600;
    color: #0a0a0a; outline: none; transition: all .15s;
    appearance: none; cursor: pointer;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23aaa' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
    background-position: right 10px center;
    background-repeat: no-repeat; background-size: 14px;
  }
  .pr-select:focus { border-color: #0a0a0a; box-shadow: 0 0 0 3px #f5f5f5; }

  .edit-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 10px 18px; background: #0a0a0a; color: #fff;
    border: none; border-radius: 10px;
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 700;
    cursor: pointer; transition: all .14s;
  }
  .edit-btn:hover { background: #222; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,.18); }

  .save-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 10px 18px; background: #0a0a0a; color: #fff;
    border: none; border-radius: 10px;
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 700;
    cursor: pointer; transition: all .14s;
  }
  .save-btn:hover { background: #222; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,.18); }
  .save-btn:disabled { background: #d4d4d4; cursor: not-allowed; transform: none; box-shadow: none; }

  .cancel-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 10px 18px; background: transparent; color: #888;
    border: 1.5px solid #ebebeb; border-radius: 10px;
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
    cursor: pointer; transition: all .14s;
  }
  .cancel-btn:hover { border-color: #0a0a0a; color: #0a0a0a; background: #fafafa; }

  .toggle-track {
    width: 42px; height: 24px; border-radius: 99px;
    border: 1.5px solid #ebebeb;
    background: #f5f5f5; position: relative;
    cursor: pointer; transition: all .2s; flex-shrink: 0;
  }
  .toggle-track.on { background: #0a0a0a; border-color: #0a0a0a; }
  .toggle-knob {
    width: 16px; height: 16px; border-radius: 50%;
    background: #ccc; position: absolute;
    top: 3px; left: 3px; transition: all .2s;
  }
  .toggle-track.on .toggle-knob { background: #fff; left: 19px; }

  .field-label {
    font-family: 'DM Mono', monospace;
    font-size: 10px; font-weight: 600;
    letter-spacing: .08em; text-transform: uppercase;
    color: #888; display: block; margin-bottom: 8px;
  }

  .display-val {
    font-family: 'DM Serif Display', serif;
    font-size: 22px; color: #0a0a0a;
    animation: countUp .3s ease;
  }

  .preview-card {
    background: #f7f7f7; border-radius: 12px;
    border: 1px solid #ebebeb; padding: 18px 20px;
    display: flex; flex-direction: column; gap: 6px;
  }

  .vtype-btn {
    padding: 8px 16px;
    border: none; border-radius: 8px;
    font-family: 'DM Mono', monospace; font-size: 12px; font-weight: 600;
    text-transform: uppercase; cursor: pointer; transition: all .14s;
  }
  .vtype-btn.active  { background: #0a0a0a; color: #fff; }
  .vtype-btn.inactive { background: #f5f5f5; color: #666; }
  .vtype-btn.inactive:hover { background: #ebebeb; }
`;

// ─── Defaults ─────────────────────────────────────────────────────────────────
const DEFAULT_PRICING = {
  cycle: { firstHourRate: 5.00, additionalHourRate: 3.00 },
  bike:  { firstHourRate: 10.00, additionalHourRate: 5.00 },
  car:   { firstHourRate: 20.00, additionalHourRate: 10.00 },
  gracePeriod: 15,
  currency: 'INR',
  taxRate: 0,
};

const CURRENCY_SYM = { USD: '$', EUR: '€', GBP: '£', INR: '₹' };
const VEHICLE_TYPES = ['cycle', 'bike', 'car'];

// ─── Sub-components ───────────────────────────────────────────────────────────
const Toggle = ({ checked, onChange }) => (
  <div className={`toggle-track ${checked ? 'on' : ''}`} onClick={onChange}>
    <div className="toggle-knob" />
  </div>
);

const Field = ({ label, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <span className="field-label">{label}</span>
    {children}
  </div>
);

const InputWithIcon = ({ icon: Icon, suffix, ...props }) => (
  <div style={{ position: 'relative' }}>
    <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#bbb', pointerEvents: 'none' }}>
      <Icon size={12} />
    </div>
    <input className="pr-input" {...props} />
    {suffix && (
      <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontFamily: 'DM Mono, monospace', fontSize: 10, color: '#bbb', pointerEvents: 'none' }}>
        {suffix}
      </div>
    )}
  </div>
);

const SelectWithIcon = ({ icon: Icon, children, ...props }) => (
  <div style={{ position: 'relative' }}>
    <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#bbb', pointerEvents: 'none', zIndex: 1 }}>
      <Icon size={12} />
    </div>
    <select className="pr-select" {...props}>{children}</select>
  </div>
);

const VTypeTabs = ({ active, onSelect }) => (
  <div style={{ display: 'flex', gap: 8 }}>
    {VEHICLE_TYPES.map(type => (
      <button
        key={type}
        type="button"
        className={`vtype-btn ${active === type ? 'active' : 'inactive'}`}
        onClick={() => onSelect(type)}
      >
        {type}
      </button>
    ))}
  </div>
);

// ─── Main ─────────────────────────────────────────────────────────────────────
const Pricing = () => {
  const queryClient = useQueryClient();

  const { data: pricingData, isLoading, error } = useQuery({
    queryKey: ['pricing'],
    queryFn: getPricing,
    staleTime: 300000,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft]         = useState(DEFAULT_PRICING);
  const [toggles, setToggles]     = useState({ night: false, weekend: false, monthly: false });
  const [activeTab, setActiveTab] = useState('cycle');

  // FIX: sync draft when pricingData loads
  useEffect(() => {
    if (pricingData) setDraft(pricingData);
  }, [pricingData]);

  // Use pricingData for display, fallback to defaults
  const pricing = pricingData || DEFAULT_PRICING;
  const sym = CURRENCY_SYM[isEditing ? draft.currency : pricing.currency] || '₹';

  const updateMutation = useMutation({
    mutationFn: updatePricing,
    onSuccess: () => { queryClient.invalidateQueries(['pricing']); setIsEditing(false); },
    onError: (err) => console.error('Error updating pricing:', err),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDraft(prev => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], [name]: parseFloat(value) || 0 },
    }));
  };

  const handleGlobalChange = e => {
    const { name, value } = e.target;
    setDraft(prev => ({
      ...prev,
      [name]: name === 'taxRate' || name === 'gracePeriod' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSave = e => { e.preventDefault(); updateMutation.mutate(draft); };
  const handleEdit   = () => { if (pricingData) setDraft(pricingData); setIsEditing(true); };
  const handleCancel = () => { if (pricingData) setDraft(pricingData); setIsEditing(false); };

  // Preview rows use draft values so they update live while editing
  const activePricing = isEditing ? draft : pricing;
  const preview = [
    { label: '1 Hour',  value: activePricing[activeTab]?.firstHourRate || 0 },
    { label: '2 Hours', value: (activePricing[activeTab]?.firstHourRate || 0) + (activePricing[activeTab]?.additionalHourRate || 0) },
    { label: '5 Hours', value: (activePricing[activeTab]?.firstHourRate || 0) + (activePricing[activeTab]?.additionalHourRate || 0) * 4 },
  ];

  const options = [
    { key: 'night',   icon: FiMoon,       label: 'Night Pricing',  desc: 'Different rates for nighttime hours' },
    { key: 'weekend', icon: FiCalendar,   label: 'Weekend Pricing', desc: 'Different rates for weekends' },
    { key: 'monthly', icon: FiCreditCard, label: 'Monthly Pass',    desc: 'Enable monthly subscription options' },
  ];

  // ── Loading ──
  if (isLoading) return (
    <>
      <style>{css}</style>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div style={{ width: 36, height: 36, border: '3px solid #ebebeb', borderTopColor: '#0a0a0a', borderRadius: '50%', animation: 'spin .7s linear infinite' }} />
      </div>
    </>
  );

  // ── Error ──
  if (error) return (
    <>
      <style>{css}</style>
      <div style={{ padding: '28px 32px', minHeight: '100vh', background: '#f7f7f7', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="db-card" style={{ padding: '32px', maxWidth: 400, textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <FiX size={24} color="#dc2626" />
          </div>
          <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 20, fontStyle: 'italic', color: '#0a0a0a', marginBottom: 8 }}>
            Error Loading Pricing
          </div>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, color: '#888', marginBottom: 20, lineHeight: 1.6 }}>
            {error.message || 'Failed to load pricing data'}
          </div>
          <button className="edit-btn" onClick={() => queryClient.invalidateQueries(['pricing'])} style={{ margin: '0 auto' }}>
            <FiRefreshCw size={12} /> Try Again
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      <style>{css}</style>
      <div className="pr-wrap" style={{ padding: '28px 32px', minHeight: '100vh', background: '#f7f7f7' }}>

        {/* ── Header ── */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <span className="section-label">Configuration</span>
            <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 28, letterSpacing: '-0.02em', color: '#0a0a0a', lineHeight: 1, fontStyle: 'italic' }}>
              Pricing Defaults
            </div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#aaa', marginTop: 4, letterSpacing: '.04em' }}>
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>
          {!isEditing && (
            <button className="edit-btn" onClick={handleEdit}>
              <FiEdit2 size={12} /> Edit Pricing
            </button>
          )}
        </div>

        {/* ── Rate Configuration ── */}
        <div className="db-card" style={{ padding: '24px 28px', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <span className="section-label" style={{ marginBottom: 0 }}>Rate Configuration</span>
            {/* FIX: single vehicle type tab row — removed duplicate */}
            <VTypeTabs active={activeTab} onSelect={setActiveTab} />
          </div>

          <form onSubmit={handleSave}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: isEditing ? 28 : 0 }}>

              <Field label={`First Hour Rate (${isEditing ? draft.currency : pricing.currency})`}>
                {isEditing ? (
                  <InputWithIcon icon={FaRupeeSign} name="firstHourRate" type="number" step="0.01" min="0"
                    value={draft[activeTab]?.firstHourRate || 0} onChange={handleChange} required />
                ) : (
                  // FIX: was `pricing.currency` referencing undefined `pricing` var — now uses pricingData correctly
                  <div className="display-val">{sym}{(pricing[activeTab]?.firstHourRate || 0).toFixed(2)}</div>
                )}
              </Field>

              <Field label={`Additional Hour Rate (${isEditing ? draft.currency : pricing.currency})`}>
                {isEditing ? (
                  <InputWithIcon icon={FaRupeeSign} name="additionalHourRate" type="number" step="0.01" min="0"
                    value={draft[activeTab]?.additionalHourRate || 0} onChange={handleChange} required />
                ) : (
                  <div className="display-val">{sym}{(pricing[activeTab]?.additionalHourRate || 0).toFixed(2)}</div>
                )}
              </Field>

              <Field label="Grace Period">
                {isEditing ? (
                  <InputWithIcon icon={MdOutlineTimer} name="gracePeriod" type="number" min="0"
                    value={draft.gracePeriod} onChange={handleGlobalChange} suffix="min" required />
                ) : (
                  <div className="display-val">
                    {pricing.gracePeriod || 0}
                    <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 13, color: '#bbb', marginLeft: 4 }}>min</span>
                  </div>
                )}
              </Field>

              <Field label="Currency">
                {isEditing ? (
                  <SelectWithIcon icon={MdOutlineAttachMoney} name="currency" value={draft.currency} onChange={handleGlobalChange}>
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </SelectWithIcon>
                ) : (
                  <div className="display-val">{pricing.currency || 'INR'}</div>
                )}
              </Field>

              <Field label="Tax Rate">
                {isEditing ? (
                  <InputWithIcon icon={MdOutlinePercent} name="taxRate" type="number" step="0.01" min="0" max="100"
                    value={draft.taxRate} onChange={handleGlobalChange} suffix="%" />
                ) : (
                  <div className="display-val">
                    {pricing.taxRate || 0}
                    <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 13, color: '#bbb', marginLeft: 2 }}>%</span>
                  </div>
                )}
              </Field>
            </div>

            {isEditing && (
              <>
                <div style={{ borderTop: '1px solid #f5f5f5', marginBottom: 20 }} />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                  <button type="button" className="cancel-btn" onClick={handleCancel}>
                    <FiX size={12} /> Cancel
                  </button>
                  <button type="submit" className="save-btn" disabled={updateMutation.isPending}>
                    {updateMutation.isPending
                      ? <><div style={{ width: 12, height: 12, border: '2px solid #fff4', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin .6s linear infinite' }} /> Saving…</>
                      : <><FaSave size={12} /> Save Changes</>
                    }
                  </button>
                </div>
              </>
            )}
          </form>
        </div>

        {/* ── Pricing Preview ── */}
        <div className="db-card" style={{ padding: '24px 28px', marginBottom: 14 }}>
          <span className="section-label" style={{ marginBottom: 18 }}>Pricing Preview</span>

          {/* Duration breakdown */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
            {preview.map(({ label, value }) => (
              <div key={label} className="preview-card">
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: '#aaa', textTransform: 'uppercase', letterSpacing: '.10em' }}>
                  {label}
                </span>
                <span style={{ fontFamily: 'DM Serif Display, serif', fontSize: 28, color: '#0a0a0a', lineHeight: 1, marginTop: 4 }}>
                  {sym}{value.toFixed(2)}
                </span>
                {(pricing.taxRate || 0) > 0 && (
                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: '#bbb', marginTop: 4 }}>
                    +{pricing.taxRate}% tax → {sym}{(value * (1 + pricing.taxRate / 100)).toFixed(2)}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* All vehicle types summary */}
          <div style={{ paddingTop: 20, borderTop: '1px solid #f0f0f0' }}>
            <span className="section-label">All Vehicle Types — 1st Hour Rate</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 12 }}>
              {VEHICLE_TYPES.map(type => (
                <div key={type} style={{
                  background: '#fafafa', borderRadius: 10, padding: '16px', textAlign: 'center',
                  border: activeTab === type ? '2px solid #0a0a0a' : '1px solid #ebebeb',
                  cursor: 'pointer', transition: 'border .14s',
                }} onClick={() => setActiveTab(type)}>
                  <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#888', textTransform: 'uppercase', marginBottom: 8 }}>
                    {type}
                  </div>
                  <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, color: '#0a0a0a' }}>
                    {sym}{(activePricing[type]?.firstHourRate || 0).toFixed(2)}
                  </div>
                  <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: '#bbb', marginTop: 4 }}>per hour</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Additional Options ── */}
        <div className="db-card" style={{ padding: '24px 28px' }}>
          <span className="section-label" style={{ marginBottom: 18 }}>Additional Options</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {options.map(({ key, icon: Icon, label, desc }, i) => (
              <div key={key} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 0',
                borderBottom: i < options.length - 1 ? '1px solid #f5f5f5' : 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 9,
                    background: toggles[key] ? '#0a0a0a' : '#f5f5f5',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'background .2s', flexShrink: 0,
                  }}>
                    <Icon size={14} color={toggles[key] ? '#fff' : '#aaa'} />
                  </div>
                  <div>
                    <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 700, color: '#0a0a0a' }}>{label}</div>
                    <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: '#bbb', marginTop: 2 }}>{desc}</div>
                  </div>
                </div>
                <Toggle checked={toggles[key]} onChange={() => setToggles(p => ({ ...p, [key]: !p[key] }))} />
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  );
};

export default Pricing;