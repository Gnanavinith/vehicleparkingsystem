import React, { useState } from 'react';
import { FaCar, FaMotorcycle, FaBicycle, FaSave } from 'react-icons/fa';
import { FiCheck } from 'react-icons/fi';

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500;600&family=DM+Sans:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes fadeUp  { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
  @keyframes fadeIn  { from { opacity: 0; transform: translateY(4px); }  to { opacity: 1; transform: none; } }

  .ps-wrap { font-family: 'DM Sans', sans-serif; animation: fadeUp .28s ease; }

  .section-label {
    font-family: 'DM Mono', monospace;
    font-size: 9px; font-weight: 600;
    letter-spacing: .14em; text-transform: uppercase;
    color: #aaa; display: block; margin-bottom: 6px;
  }

  .db-card {
    background: #fff; border-radius: 16px;
    border: 1px solid #ebebeb;
    transition: box-shadow .18s;
  }
  .db-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,.06); }

  .rate-input {
    width: 100%;
    background: #fafafa;
    border: 1.5px solid #ebebeb;
    border-radius: 10px;
    padding: 11px 14px 11px 38px;
    font-family: 'DM Mono', monospace;
    font-size: 18px;
    font-weight: 600;
    color: #0a0a0a;
    outline: none;
    transition: all .15s;
    -moz-appearance: textfield;
  }
  .rate-input::-webkit-outer-spin-button,
  .rate-input::-webkit-inner-spin-button { -webkit-appearance: none; }
  .rate-input:focus {
    border-color: #0a0a0a;
    background: #fff;
    box-shadow: 0 0 0 3px #f5f5f5;
  }

  .save-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 11px 22px;
    background: #0a0a0a; color: #fff;
    border: none; border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 700;
    cursor: pointer; transition: all .14s;
  }
  .save-btn:hover { background: #222; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,.18); }
  .save-btn:active { transform: none; }
  .save-btn:disabled { background: #d4d4d4; cursor: not-allowed; transform: none; box-shadow: none; }

  .toast {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 9px 16px;
    background: #f0fdf4; color: #059669;
    border: 1px solid #bbf7d0;
    border-radius: 10px;
    font-family: 'DM Mono', monospace;
    font-size: 11px; font-weight: 600;
    letter-spacing: .04em;
    animation: fadeIn .2s ease;
  }

  .per-hour-tag {
    font-family: 'DM Mono', monospace;
    font-size: 9px; font-weight: 600;
    letter-spacing: .12em; text-transform: uppercase;
    color: #bbb;
    background: #f5f5f5;
    padding: 2px 7px; border-radius: 6px;
  }
`;

const VEHICLES = [
  {
    key: 'car',
    label: 'Car',
    icon: FaCar,
    color: '#1d4ed8',
    bg: '#eff6ff',
    default: 20,
    desc: 'Standard 4-wheeler rate',
  },
  {
    key: 'motorcycle',
    label: 'Motorcycle',
    icon: FaMotorcycle,
    color: '#d97706',
    bg: '#fffbeb',
    default: 10,
    desc: 'Bike & scooter rate',
  },
  {
    key: 'cycle',
    label: 'Bicycle',
    icon: FaBicycle,
    color: '#0d9488',
    bg: '#f0fdfa',
    default: 5,
    desc: 'Pedal cycle rate',
  },
];

const PricingSettings = () => {
  const [rates, setRates] = useState(
    Object.fromEntries(VEHICLES.map(v => [v.key, v.default]))
  );
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleChange = (key, val) => {
    setSaved(false);
    setRates(prev => ({ ...prev, [key]: val }));
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 600)); // replace with real API call
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <>
      <style>{css}</style>
      <div className="ps-wrap" style={{ padding: '28px 32px', minHeight: '100vh', background: '#f7f7f7' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <span className="section-label">Configuration</span>
            <div style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 28, letterSpacing: '-0.02em',
              color: '#0a0a0a', lineHeight: 1, fontStyle: 'italic',
            }}>
              Pricing Settings
            </div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#aaa', marginTop: 4, letterSpacing: '.04em' }}>
              Set hourly rates per vehicle type
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {saved && (
              <span className="toast">
                <FiCheck size={12} /> Rates saved
              </span>
            )}
            <button className="save-btn" onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <span style={{
                    width: 13, height: 13,
                    border: '2px solid #fff4',
                    borderTopColor: '#fff',
                    borderRadius: '50%',
                    display: 'inline-block',
                    animation: 'spin .6s linear infinite',
                  }} />
                  Saving…
                </>
              ) : (
                <><FaSave size={12} /> Save Rates</>
              )}
            </button>
          </div>
        </div>

        {/* Rate Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 20 }}>
          {VEHICLES.map(({ key, label, icon: Icon, color, bg, desc }) => (
            <div key={key} className="db-card" style={{ padding: '24px' }}>

              {/* Icon + label */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 11,
                  background: bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Icon size={18} color={color} />
                </div>
                <div>
                  <div style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: 14, color: '#0a0a0a' }}>
                    {label}
                  </div>
                  <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: '#aaa', marginTop: 1 }}>
                    {desc}
                  </div>
                </div>
                <span className="per-hour-tag" style={{ marginLeft: 'auto' }}>/ hr</span>
              </div>

              {/* Input */}
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)',
                  fontFamily: 'DM Serif Display, serif',
                  fontSize: 17, color: '#aaa', pointerEvents: 'none',
                  userSelect: 'none',
                }}>₹</span>
                <input
                  className="rate-input"
                  type="number"
                  min={0}
                  value={rates[key]}
                  onChange={e => handleChange(key, e.target.value)}
                />
              </div>

              {/* Preview */}
              <div style={{
                marginTop: 14,
                padding: '10px 14px',
                background: '#f7f7f7',
                borderRadius: 9,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: '#aaa', letterSpacing: '.06em', textTransform: 'uppercase' }}>
                  2 hrs cost
                </span>
                <span style={{ fontFamily: 'DM Serif Display, serif', fontSize: 16, color: '#0a0a0a' }}>
                  ₹{(rates[key] * 2) || 0}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Card */}
        <div className="db-card" style={{ padding: '22px 24px' }}>
          <span className="section-label">Rate Summary</span>
          <div style={{ display: 'flex', gap: 0 }}>
            {VEHICLES.map(({ key, label, icon: Icon, color, bg }, i) => (
              <div key={key} style={{
                flex: 1,
                padding: '14px 20px',
                borderRight: i < VEHICLES.length - 1 ? '1px solid #f5f5f5' : 'none',
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 9,
                  background: bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Icon size={14} color={color} />
                </div>
                <div>
                  <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: '#aaa', textTransform: 'uppercase', letterSpacing: '.12em' }}>
                    {label}
                  </div>
                  <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, color: '#0a0a0a', marginTop: 2 }}>
                    ₹{rates[key]}<span style={{ fontSize: 11, color: '#bbb', fontFamily: 'DM Mono, monospace' }}>/hr</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
};

export default PricingSettings;