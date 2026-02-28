import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { getStandPricing } from '../api';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaBicycle, FaMotorcycle, FaCar } from 'react-icons/fa';

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500;600&family=DM+Sans:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

  @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
  @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
  @keyframes slideDown { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:none} }

  .sp-wrap { font-family:'DM Sans',sans-serif; animation:fadeUp .28s ease; }

  .db-card {
    background:#fff; border-radius:16px;
    border:1px solid #ebebeb;
    transition:box-shadow .18s;
  }
  .db-card:hover { box-shadow:0 4px 20px rgba(0,0,0,.06); }

  .section-label {
    font-family:'DM Mono',monospace; font-size:9px; font-weight:600;
    letter-spacing:.14em; text-transform:uppercase; color:#aaa;
    display:block; margin-bottom:14px;
  }

  /* Field label */
  .field-label {
    font-family:'DM Mono',monospace; font-size:10px; font-weight:600;
    letter-spacing:.1em; text-transform:uppercase; color:#aaa;
    display:block; margin-bottom:6px;
  }

  /* Disabled input */
  .sp-input-disabled {
    width:100%; padding:9px 12px;
    font-size:13px; font-family:'DM Sans',sans-serif; color:#0a0a0a;
    background:#fafafa; border:1.5px solid #ebebeb; border-radius:10px;
    outline:none; cursor:default;
  }

  /* Active input */
  .sp-input {
    width:100%; padding:9px 12px;
    font-size:13px; font-family:'DM Sans',sans-serif; color:#0a0a0a;
    background:#fff; border:1.5px solid #ebebeb; border-radius:10px;
    outline:none; transition:border-color .14s, box-shadow .14s;
  }
  .sp-input:focus { border-color:#0a0a0a; box-shadow:0 0 0 3px rgba(10,10,10,.05); }
  .sp-input::placeholder { color:#bbb; }

  /* Buttons */
  .sp-btn-primary {
    padding:9px 20px; background:#0a0a0a; color:#fff;
    font-size:13px; font-weight:700; font-family:'DM Sans',sans-serif;
    border:none; border-radius:10px; cursor:pointer; transition:all .14s;
  }
  .sp-btn-primary:hover { background:#222; transform:translateY(-1px); box-shadow:0 3px 10px rgba(0,0,0,.15); }
  .sp-btn-primary:active { transform:scale(.97); }

  .sp-btn-ghost {
    padding:9px 16px; background:transparent; color:#555;
    font-size:13px; font-weight:600; font-family:'DM Sans',sans-serif;
    border:1.5px solid #ebebeb; border-radius:10px; cursor:pointer; transition:all .14s;
  }
  .sp-btn-ghost:hover { border-color:#0a0a0a; color:#0a0a0a; }

  .sp-btn-link {
    background:none; border:none; cursor:pointer;
    font-family:'DM Mono',monospace; font-size:10.5px; font-weight:600;
    letter-spacing:.06em; color:#0a0a0a; text-decoration:underline;
    text-underline-offset:3px; padding:0; transition:opacity .13s;
  }
  .sp-btn-link:hover { opacity:.6; }

  /* Pricing card */
  .pricing-card {
    border-radius:12px; border:1px solid #ebebeb;
    padding:18px 20px; background:#fafafa;
    transition:box-shadow .16s;
  }
  .pricing-card:hover { box-shadow:0 4px 14px rgba(0,0,0,.06); background:#fff; }

  .pricing-row {
    display:flex; justify-content:space-between; align-items:center;
    padding:5px 0; border-bottom:1px solid #f0f0f0;
  }
  .pricing-row:last-child { border-bottom:none; }

  /* Profile summary item */
  .summary-item {
    display:flex; align-items:center; gap:12px;
    padding:12px 0; border-bottom:1px solid #f5f5f5;
  }
  .summary-item:last-child { border-bottom:none; }

  .shimmer {
    background:linear-gradient(90deg,#f5f5f5 25%,#ebebeb 50%,#f5f5f5 75%);
    background-size:200% 100%; animation:shimmer 1.2s infinite; border-radius:8px;
  }

  /* Password form animation */
  .pw-form { animation:slideDown .2s ease; }

  /* Avatar */
  .sp-avatar {
    width:52px; height:52px; border-radius:14px;
    background:#0a0a0a; display:flex; align-items:center; justify-content:center;
    flex-shrink:0;
  }
`;

const fmt = (amount, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', { style:'currency', currency, minimumFractionDigits:0 }).format(amount);

const Shimmer = ({ h = 14, w = '100%' }) => (
  <div className="shimmer" style={{ height: h, width: w }} />
);

export default function StaffProfile() {
  const { user } = useSelector(s => s.auth);
  const [showPwForm, setShowPwForm] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew]         = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pw, setPw] = useState({ currentPassword:'', newPassword:'', confirmPassword:'' });

  const { data: pricingData, isLoading: pricingLoading, error: pricingError } = useQuery({
    queryKey: ['stand-pricing'],
    queryFn: getStandPricing,
    staleTime: 300000,
  });

  const handlePwChange = e => setPw({ ...pw, [e.target.name]: e.target.value });
  const handlePwSubmit = e => {
    e.preventDefault();
    alert('Password change functionality would be implemented here');
    setShowPwForm(false);
    setPw({ currentPassword:'', newPassword:'', confirmPassword:'' });
  };

  const PRICING_TYPES = [
    { key:'cycle', label:'Cycle',      icon: FaBicycle,    color:'#0d9488' },
    { key:'bike',  label:'Bike',       icon: FaMotorcycle, color:'#d97706' },
    { key:'car',   label:'Car',        icon: FaCar,        color:'#1d4ed8' },
  ];

  const PROFILE_FIELDS = [
    { label:'Full Name',       value: user?.name || '—' },
    { label:'Email Address',   value: user?.email || '—' },
    { label:'Role',            value: 'Staff' },
    { label:'Stand Name',      value: user?.stand?.name || 'Not assigned' },
    { label:'Stand Location',  value: user?.stand?.location || 'Not specified' },
    { label:'Member Since',    value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' }) : '—' },
  ];

  return (
    <>
      <style>{css}</style>
      <div className="sp-wrap" style={{ padding:'28px 32px', minHeight:'100vh', background:'#f7f7f7' }}>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:28 }}>
          <div>
            <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:28, letterSpacing:'-0.02em', color:'#0a0a0a', lineHeight:1, fontStyle:'italic' }}>
              Profile
            </div>
            <div style={{ fontFamily:'DM Mono,monospace', fontSize:11, color:'#aaa', marginTop:4, letterSpacing:'.04em' }}>
              Manage your account information
            </div>
          </div>
          <div className="sp-avatar">
            <FaUser size={22} color="#fff" />
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:16, alignItems:'start' }}>

          {/* ── Left column ─────────────────────────────── */}
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

            {/* Personal Information */}
            <div className="db-card" style={{ padding:'22px 24px' }}>
              <span className="section-label">Personal Information</span>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                {PROFILE_FIELDS.map(({ label, value }) => (
                  <div key={label}>
                    <span className="field-label">{label}</span>
                    <input className="sp-input-disabled" value={value} disabled readOnly />
                  </div>
                ))}
              </div>
            </div>

            {/* Stand Pricing */}
            <div className="db-card" style={{ padding:'22px 24px' }}>
              <span className="section-label">Stand Pricing</span>
              {pricingLoading ? (
                <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
                  {[0,1,2].map(i => <Shimmer key={i} h={100} />)}
                </div>
              ) : pricingError ? (
                <div style={{ padding:'28px 0', textAlign:'center', fontFamily:'DM Mono,monospace', fontSize:12, color:'#f87171' }}>
                  Error loading pricing information
                </div>
              ) : (
                <>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
                    {PRICING_TYPES.map(({ key, label, icon: Icon, color }) => (
                      <div key={key} className="pricing-card">
                        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
                          <div style={{ width:32, height:32, borderRadius:9, background:`${color}12`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                            <Icon size={14} color={color} />
                          </div>
                          <span style={{ fontFamily:'DM Sans,sans-serif', fontWeight:700, fontSize:13.5, color:'#0a0a0a' }}>{label}</span>
                        </div>
                        <div className="pricing-row">
                          <span style={{ fontFamily:'DM Mono,monospace', fontSize:10.5, color:'#aaa' }}>First Hour</span>
                          <span style={{ fontFamily:'DM Serif Display,serif', fontSize:17, color:'#0a0a0a' }}>
                            {fmt(pricingData?.[key]?.firstHourRate || 0)}
                          </span>
                        </div>
                        <div className="pricing-row">
                          <span style={{ fontFamily:'DM Mono,monospace', fontSize:10.5, color:'#aaa' }}>Add'l Hour</span>
                          <span style={{ fontFamily:'DM Serif Display,serif', fontSize:17, color:'#0a0a0a' }}>
                            {fmt(pricingData?.[key]?.additionalHourRate || 0)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Grace & Tax */}
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginTop:12 }}>
                    {[
                      { label:'Grace Period', value:`${pricingData?.gracePeriod || 0} min` },
                      { label:'Tax Rate',     value:`${pricingData?.taxRate || 0}%` },
                    ].map(({ label, value }) => (
                      <div key={label} style={{ background:'#fafafa', borderRadius:10, border:'1px solid #ebebeb', padding:'12px 16px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                        <span style={{ fontFamily:'DM Mono,monospace', fontSize:10.5, color:'#aaa', textTransform:'uppercase', letterSpacing:'.1em' }}>{label}</span>
                        <span style={{ fontFamily:'DM Mono,monospace', fontSize:13, fontWeight:600, color:'#0a0a0a' }}>{value}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Change Password */}
            <div className="db-card" style={{ padding:'22px 24px' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: showPwForm ? 18 : 0 }}>
                <span className="section-label" style={{ marginBottom:0 }}>Change Password</span>
                <button className="sp-btn-link" onClick={() => setShowPwForm(v => !v)}>
                  {showPwForm ? 'Cancel' : 'Change Password'}
                </button>
              </div>

              {showPwForm && (
                <form className="pw-form" onSubmit={handlePwSubmit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
                  {[
                    { name:'currentPassword', label:'Current Password', show:showCurrent, toggle:() => setShowCurrent(v=>!v) },
                    { name:'newPassword',     label:'New Password',     show:showNew,     toggle:() => setShowNew(v=>!v) },
                    { name:'confirmPassword', label:'Confirm Password', show:showConfirm, toggle:() => setShowConfirm(v=>!v) },
                  ].map(({ name, label, show, toggle }) => (
                    <div key={name}>
                      <span className="field-label">{label}</span>
                      <div style={{ position:'relative' }}>
                        <input
                          className="sp-input"
                          type={show ? 'text' : 'password'}
                          name={name}
                          value={pw[name]}
                          onChange={handlePwChange}
                          required
                          minLength="6"
                          style={{ paddingRight:38 }}
                        />
                        <button type="button" onClick={toggle} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#bbb', display:'flex' }}>
                          {show ? <FaEyeSlash size={13} /> : <FaEye size={13} />}
                        </button>
                      </div>
                    </div>
                  ))}
                  <div style={{ display:'flex', gap:10, paddingTop:4 }}>
                    <button type="submit" className="sp-btn-primary">Update Password</button>
                    <button type="button" className="sp-btn-ghost" onClick={() => setShowPwForm(false)}>Cancel</button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* ── Right column ─────────────────────────────── */}
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

            {/* Profile Summary */}
            <div className="db-card" style={{ padding:'22px 24px' }}>
              <span className="section-label">Profile Summary</span>
              {[
                { icon:'📊', color:'#1d4ed8', title:'Performance', sub:'Good' },
                { icon:'✅', color:'#059669', title:'Last Active',  sub:'Today' },
                { icon:'🏆', color:'#d97706', title:'Rank',         sub:'Senior Staff' },
              ].map(({ icon, color, title, sub }) => (
                <div key={title} className="summary-item">
                  <div style={{ width:36, height:36, borderRadius:9, background:`${color}12`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:16 }}>
                    {icon}
                  </div>
                  <div>
                    <div style={{ fontFamily:'DM Sans,sans-serif', fontSize:13, fontWeight:600, color:'#0a0a0a' }}>{title}</div>
                    <div style={{ fontFamily:'DM Mono,monospace', fontSize:10.5, color:'#aaa', marginTop:1 }}>{sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Tips */}
            <div style={{ background:'#0a0a0a', borderRadius:16, padding:'22px 24px' }}>
              <span style={{ fontFamily:'DM Mono,monospace', fontSize:9, fontWeight:600, letterSpacing:'.14em', textTransform:'uppercase', color:'#555', display:'block', marginBottom:14 }}>
                Quick Tips
              </span>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {[
                  'Verify vehicle details before parking',
                  'Keep payment receipts organised',
                  'Report any issues immediately',
                  'Maintain a clean workspace',
                ].map((tip, i) => (
                  <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:10 }}>
                    <span style={{ fontFamily:'DM Mono,monospace', fontSize:10, color:'#444', marginTop:1, flexShrink:0 }}>
                      {String(i+1).padStart(2,'0')}
                    </span>
                    <span style={{ fontFamily:'DM Sans,sans-serif', fontSize:12.5, color:'#aaa', lineHeight:1.5 }}>{tip}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}