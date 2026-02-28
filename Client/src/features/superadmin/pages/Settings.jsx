import React, { useState } from 'react';
import { FiEdit2, FiX, FiSave, FiUpload } from 'react-icons/fi';
import { MdOutlineAttachMoney, MdOutlinePercent, MdOutlineMail, MdOutlineWatchLater } from 'react-icons/md';
import { HiOutlineWrenchScrewdriver } from 'react-icons/hi2';
import { RiBuilding2Line } from 'react-icons/ri';
import { BsShieldCheck } from 'react-icons/bs';

// ─── CSS ───────────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500;600&family=DM+Sans:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes fadeUp  { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
  @keyframes spin    { to { transform: rotate(360deg); } }

  .st-wrap { font-family: 'DM Sans', sans-serif; animation: fadeUp .28s ease; }

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

  .field-label {
    font-family: 'DM Mono', monospace;
    font-size: 10px; font-weight: 600;
    letter-spacing: .08em; text-transform: uppercase;
    color: #888; display: block; margin-bottom: 7px;
  }

  .st-input, .st-select {
    width: 100%; background: #fafafa;
    border: 1.5px solid #ebebeb; border-radius: 10px;
    padding: 9px 12px 9px 36px;
    font-family: 'DM Sans', sans-serif; font-size: 13px;
    color: #0a0a0a; outline: none; transition: all .15s;
  }
  .st-input:focus, .st-select:focus {
    border-color: #0a0a0a; background: #fff;
    box-shadow: 0 0 0 3px #f5f5f5;
  }
  .st-input::placeholder { color: #ccc; }
  .st-select {
    appearance: none; cursor: pointer;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23aaa' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 10px center;
    background-size: 14px;
    padding-right: 32px;
  }
  .st-input.no-icon, .st-select.no-icon { padding-left: 12px; }
  .st-input:disabled { opacity: .45; cursor: not-allowed; }

  .display-val {
    font-family: 'DM Serif Display', serif;
    font-size: 20px; color: #0a0a0a; line-height: 1;
  }
  .display-sub {
    font-family: 'DM Mono', monospace;
    font-size: 11px; color: #aaa; margin-top: 3px;
  }

  /* Toggle */
  .toggle-track {
    width: 42px; height: 24px; border-radius: 99px;
    border: 1.5px solid #ebebeb; background: #f5f5f5;
    position: relative; cursor: pointer; transition: all .2s; flex-shrink: 0;
  }
  .toggle-track.on  { background: #0a0a0a; border-color: #0a0a0a; }
  .toggle-track.off-red { background: #fef2f2; border-color: #fecaca; }
  .toggle-knob {
    width: 16px; height: 16px; border-radius: 50%;
    background: #ccc; position: absolute;
    top: 3px; left: 3px; transition: all .2s;
  }
  .toggle-track.on .toggle-knob { background: #fff; left: 19px; }
  .toggle-track.off-red .toggle-knob { background: #fca5a5; }
  .toggle-track[data-disabled="true"] { opacity: .45; pointer-events: none; }

  /* Buttons */
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

  .cancel-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 10px 18px; background: transparent; color: #888;
    border: 1.5px solid #ebebeb; border-radius: 10px;
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
    cursor: pointer; transition: all .14s;
  }
  .cancel-btn:hover { border-color: #0a0a0a; color: #0a0a0a; }

  /* System info pill */
  .sys-pill {
    display: inline-flex; align-items: center; gap: 6px;
    fontFamily: 'DM Mono', monospace; font-size: 10px; font-weight: 700;
    letter-spacing: .08em; text-transform: uppercase;
    padding: '4px 10px'; border-radius: 20px;
  }
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const Toggle = ({ checked, onChange, disabled, danger }) => {
  let cls = 'toggle-track';
  if (checked) cls += ' on';
  else if (danger) cls += ' off-red';
  return (
    <div className={cls} data-disabled={disabled ? 'true' : 'false'} onClick={!disabled ? onChange : undefined}>
      <div className="toggle-knob" />
    </div>
  );
};

const Field = ({ label, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <span className="field-label">{label}</span>
    {children}
  </div>
);

const InputIcon = ({ icon: Icon, children }) => (
  <div style={{ position: 'relative' }}>
    <div style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#ccc', pointerEvents: 'none', zIndex: 1 }}>
      <Icon size={13} />
    </div>
    {children}
  </div>
);

// Section card matching the rest of the app
const SectionCard = ({ title, subtitle, Icon, iconBg, iconColor, children }) => (
  <div className="db-card" style={{ overflow: 'hidden', marginBottom: 14 }}>
    <div style={{ padding: '16px 20px', borderBottom: '1px solid #f5f5f5', display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ width: 34, height: 34, borderRadius: 9, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon style={{ color: iconColor, fontSize: 15 }} />
      </div>
      <div>
        <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 16, fontStyle: 'italic', color: '#0a0a0a' }}>{title}</div>
        {subtitle && <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: '#aaa', marginTop: 2, letterSpacing: '.03em' }}>{subtitle}</div>}
      </div>
    </div>
    <div style={{ padding: '20px 24px' }}>{children}</div>
  </div>
);

// ─── Main ─────────────────────────────────────────────────────────────────────
const Settings = () => {
  const [isEditing, setIsEditing] = useState(false);

  const DEFAULTS = {
    appName: 'Vehicle Parking Management',
    logoUrl: '',
    currency: 'USD',
    taxEnabled: true,
    taxRate: 8.5,
    maintenanceMode: false,
    contactEmail: 'admin@parkingapp.com',
    timezone: 'UTC',
  };

  const [saved,    setSaved]    = useState(DEFAULTS);
  const [draft,    setDraft]    = useState(DEFAULTS);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setDraft(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const toggleField = name => setDraft(p => ({ ...p, [name]: !p[name] }));

  const handleSave = e => {
    e.preventDefault();
    setSaved(draft);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setDraft(saved);
    setIsEditing(false);
  };

  const data = isEditing ? draft : saved;

  return (
    <>
      <style>{css}</style>
      <div className="st-wrap" style={{ padding: '28px 32px', minHeight: '100vh', background: '#f7f7f7' }}>

        {/* ── Header ── */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <span className="section-label">System</span>
            <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 28, letterSpacing: '-0.02em', color: '#0a0a0a', lineHeight: 1, fontStyle: 'italic' }}>
              Settings
            </div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#aaa', marginTop: 4, letterSpacing: '.04em' }}>
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>
          {!isEditing && (
            <button className="edit-btn" onClick={() => setIsEditing(true)}>
              <FiEdit2 size={12} /> Edit Settings
            </button>
          )}
        </div>

        <form onSubmit={handleSave}>

          {/* ── General ── */}
          <SectionCard title="General" subtitle="App name, branding and contact" Icon={RiBuilding2Line} iconBg="#eff6ff" iconColor="#1d4ed8">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>
              <Field label="App Name">
                {isEditing
                  ? <InputIcon icon={RiBuilding2Line}><input className="st-input" name="appName" value={draft.appName} onChange={handleChange} required /></InputIcon>
                  : <div className="display-val">{saved.appName}</div>
                }
              </Field>
              <Field label="Contact Email">
                {isEditing
                  ? <InputIcon icon={MdOutlineMail}><input className="st-input" name="contactEmail" type="email" value={draft.contactEmail} onChange={handleChange} required /></InputIcon>
                  : <div className="display-val" style={{ fontSize: 15 }}>{saved.contactEmail}</div>
                }
              </Field>
            </div>

            <Field label="Company Logo">
              {isEditing ? (
                <div style={{ display: 'flex', gap: 0 }}>
                  <input
                    className="st-input no-icon"
                    name="logoUrl"
                    value={draft.logoUrl}
                    onChange={handleChange}
                    placeholder="Paste logo URL…"
                    style={{ borderRadius: '10px 0 0 10px', borderRight: 'none' }}
                  />
                  <button type="button" style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '9px 14px', background: '#f5f5f5',
                    border: '1.5px solid #ebebeb', borderRadius: '0 10px 10px 0',
                    fontFamily: 'DM Mono, monospace', fontSize: 11, fontWeight: 600,
                    color: '#555', cursor: 'pointer', whiteSpace: 'nowrap',
                  }}>
                    <FiUpload size={11} /> Upload
                  </button>
                </div>
              ) : (
                saved.logoUrl
                  ? <img src={saved.logoUrl} alt="Logo" style={{ height: 40, objectFit: 'contain' }} />
                  : <div style={{ width: 44, height: 44, background: '#f5f5f5', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: '#bbb', textTransform: 'uppercase', letterSpacing: '.06em' }}>No Logo</span>
                    </div>
              )}
            </Field>
          </SectionCard>

          {/* ── Localisation ── */}
          <SectionCard title="Localisation" subtitle="Currency and timezone" Icon={MdOutlineWatchLater} iconBg="#fffbeb" iconColor="#d97706">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
              <Field label="Currency">
                {isEditing
                  ? <InputIcon icon={MdOutlineAttachMoney}>
                      <select className="st-select" name="currency" value={draft.currency} onChange={handleChange}>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="INR">INR (₹)</option>
                      </select>
                    </InputIcon>
                  : <div className="display-val">{saved.currency}</div>
                }
              </Field>
              <Field label="Timezone">
                {isEditing
                  ? <InputIcon icon={MdOutlineWatchLater}>
                      <select className="st-select" name="timezone" value={draft.timezone} onChange={handleChange}>
                        <option value="UTC">UTC</option>
                        <option value="EST">EST</option>
                        <option value="PST">PST</option>
                        <option value="GMT">GMT</option>
                        <option value="IST">IST (India)</option>
                      </select>
                    </InputIcon>
                  : <div className="display-val">{saved.timezone}</div>
                }
              </Field>
            </div>
          </SectionCard>

          {/* ── Tax ── */}
          <SectionCard title="Tax Settings" subtitle="GST / VAT configuration" Icon={MdOutlinePercent} iconBg="#f0fdf4" iconColor="#059669">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

              {/* Tax enabled toggle row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 0', borderBottom: '1px solid #f5f5f5' }}>
                <div>
                  <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 700, color: '#0a0a0a' }}>Enable Tax Calculation</div>
                  <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: '#bbb', marginTop: 2 }}>Apply tax to all parking charges</div>
                </div>
                <Toggle
                  checked={data.taxEnabled}
                  onChange={() => isEditing && toggleField('taxEnabled')}
                  disabled={!isEditing}
                />
              </div>

              {/* Tax rate row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 0' }}>
                <div>
                  <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 700, color: '#0a0a0a' }}>Tax Rate</div>
                  <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: '#bbb', marginTop: 2 }}>Applied on total fare</div>
                </div>
                {isEditing
                  ? <InputIcon icon={MdOutlinePercent}>
                      <input
                        className="st-input" name="taxRate" type="number"
                        step="0.01" min="0" max="100"
                        value={draft.taxRate} onChange={handleChange}
                        disabled={!draft.taxEnabled}
                        style={{ width: 120 }}
                      />
                    </InputIcon>
                  : <div className="display-val">
                      {saved.taxRate}
                      <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 13, color: '#bbb', marginLeft: 2 }}>%</span>
                    </div>
                }
              </div>
            </div>
          </SectionCard>

          {/* ── Maintenance ── */}
          <SectionCard title="Maintenance Mode" subtitle="Take the system offline for non-admins" Icon={HiOutlineWrenchScrewdriver} iconBg="#fef2f2" iconColor="#dc2626">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 700, color: '#0a0a0a' }}>Enable Maintenance Mode</div>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: '#bbb', marginTop: 3, lineHeight: 1.6 }}>
                  Non-admin users will see a maintenance message. Admins can still log in.
                </div>
              </div>
              <Toggle
                checked={data.maintenanceMode}
                onChange={() => isEditing && toggleField('maintenanceMode')}
                disabled={!isEditing}
                danger
              />
            </div>

            {data.maintenanceMode && (
              <div style={{ marginTop: 14, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <HiOutlineWrenchScrewdriver style={{ color: '#dc2626', fontSize: 13, flexShrink: 0 }} />
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: '#dc2626', fontWeight: 600, letterSpacing: '.04em' }}>
                  Maintenance mode is currently active
                </span>
              </div>
            )}
          </SectionCard>

          {/* ── Action Bar ── */}
          {isEditing && (
            <div className="db-card" style={{ padding: '14px 20px', display: 'flex', justifyContent: 'flex-end', gap: 10, marginBottom: 14 }}>
              <button type="button" className="cancel-btn" onClick={handleCancel}>
                <FiX size={12} /> Cancel
              </button>
              <button type="submit" className="save-btn">
                <FiSave size={12} /> Save Settings
              </button>
            </div>
          )}
        </form>

        {/* ── System Info ── */}
        <div className="db-card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f5f5f5', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <BsShieldCheck style={{ color: '#7c3aed', fontSize: 15 }} />
            </div>
            <div>
              <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 16, fontStyle: 'italic', color: '#0a0a0a' }}>System Information</div>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: '#aaa', marginTop: 2 }}>Runtime environment status</div>
            </div>
          </div>
          <div style={{ padding: '16px 24px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {[
              { label: 'Version',  value: 'v1.0.0',    sub: 'Latest stable', dot: '#059669' },
              { label: 'Database', value: 'Connected',  sub: 'MongoDB',       dot: '#059669' },
              { label: 'Server',   value: 'Online',     sub: 'Node.js',       dot: '#059669' },
            ].map(({ label, value, sub, dot }) => (
              <div key={label} style={{ background: '#fafafa', borderRadius: 10, border: '1px solid #ebebeb', padding: '14px 16px' }}>
                <span className="section-label">{label}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 4 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: dot, flexShrink: 0 }} />
                  <span style={{ fontFamily: 'DM Serif Display, serif', fontSize: 16, color: '#0a0a0a' }}>{value}</span>
                </div>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: '#bbb', marginTop: 3 }}>{sub}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  );
};

export default Settings;