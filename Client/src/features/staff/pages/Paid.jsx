import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllParkings, getProfile } from '../api';
import { FaSearch, FaCar, FaMotorcycle, FaBicycle, FaReceipt, FaUser, FaCalendar, FaRupeeSign } from 'react-icons/fa';
import { format } from 'date-fns';

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500;600&family=DM+Sans:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

  @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
  @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
  @keyframes slideDown { from{opacity:0;transform:translateY(-4px)} to{opacity:1;transform:none} }

  .paid-wrap { font-family:'DM Sans',sans-serif; animation:fadeUp .28s ease; }

  .db-card {
    background:#fff; border-radius:16px;
    border:1px solid #ebebeb;
    transition:box-shadow .18s;
  }
  .db-card:hover { box-shadow:0 4px 20px rgba(0,0,0,.06); }

  .section-label {
    font-family:'DM Mono',monospace; font-size:9px; font-weight:600;
    letter-spacing:.14em; text-transform:uppercase; color:#aaa;
    margin-bottom:14px; display:block;
  }

  /* Search */
  .paid-search-input {
    width:100%; padding:10px 10px 10px 36px;
    font-size:13px; font-family:'DM Sans',sans-serif;
    border:1.5px solid #ebebeb; border-radius:10px;
    outline:none; color:#0a0a0a; background:#fff;
    transition:border-color .14s, box-shadow .14s;
  }
  .paid-search-input:focus { border-color:#0a0a0a; box-shadow:0 0 0 3px rgba(10,10,10,.05); }
  .paid-search-input::placeholder { color:#bbb; font-family:'DM Mono',monospace; font-size:12px; }

  .paid-search-btn {
    padding:10px 20px; background:#0a0a0a; color:#fff;
    font-size:13px; font-weight:700; font-family:'DM Sans',sans-serif;
    border:none; border-radius:10px; cursor:pointer;
    transition:all .14s; white-space:nowrap;
  }
  .paid-search-btn:hover { background:#222; }
  .paid-search-btn:active { transform:scale(.97); }

  /* Filter tabs */
  .paid-tab {
    padding:5px 14px; border-radius:20px; font-size:11px; font-weight:600;
    font-family:'DM Mono',monospace; border:1.5px solid #ebebeb;
    cursor:pointer; transition:all .13s;
    background:transparent; color:#aaa; letter-spacing:.04em;
  }
  .paid-tab:hover { border-color:#0a0a0a; color:#0a0a0a; }
  .paid-tab.t-active-all { background:#0a0a0a; color:#fff; border-color:#0a0a0a; }
  .paid-tab.t-active-cash { background:#059669; color:#fff; border-color:#059669; }
  .paid-tab.t-active-upi { background:#7c3aed; color:#fff; border-color:#7c3aed; }
  .paid-tab.t-active-whatsapp { background:#0d9488; color:#fff; border-color:#0d9488; }

  /* Table */
  .paid-table { width:100%; border-collapse:collapse; font-family:'DM Sans',sans-serif; }
  .paid-table th {
    padding:10px 16px; text-align:left; font-size:9px; font-weight:600;
    color:#aaa; letter-spacing:.14em; text-transform:uppercase;
    border-bottom:1px solid #ebebeb; white-space:nowrap;
    font-family:'DM Mono',monospace;
  }
  .paid-table td { padding:11px 16px; font-size:13px; color:#444; border-bottom:1px solid #f5f5f5; white-space:nowrap; }
  .paid-table tr:last-child td { border-bottom:none; }
  .paid-table tbody tr { transition:background .1s; animation:slideDown .16s ease; }
  .paid-table tbody tr:hover { background:#fafafa; }

  .paid-status-paid {
    display:inline-flex; align-items:center; gap:4px;
    padding:2px 9px; border-radius:20px; font-size:10.5px; font-weight:600;
    background:#dcfce7; color:#15803d; font-family:'DM Mono',monospace;
  }

  /* KPI stats */
  .kpi-num {
    font-family:'DM Serif Display',serif;
    font-size:32px; letter-spacing:-0.03em;
    line-height:1;
  }

  /* Payment badges */
  .payment-badge {
    display:inline-flex; align-items:center; gap:4px;
    padding:2px 9px; border-radius:16px; font-size:10.5px; font-weight:600;
    font-family:'DM Mono',monospace;
  }
  .payment-badge.cash { background:#d1fae5; color:#047857; }
  .payment-badge.upi { background:#ede9fe; color:#6d28d9; }
  .payment-badge.whatsapp { background:#ccfbf1; color:#0f766e; }

  .shimmer {
    background:linear-gradient(90deg,#f5f5f5 25%,#ebebeb 50%,#f5f5f5 75%);
    background-size:200% 100%; animation:shimmer 1.2s infinite; border-radius:8px;
  }
`;

const VEHICLE_ICONS = { car: FaCar, motorcycle: FaMotorcycle, cycle: FaBicycle, bike: FaMotorcycle };
const VEHICLE_COLORS = { car:'#1d4ed8', motorcycle:'#d97706', cycle:'#0d9488', bike:'#d97706' };

const Shimmer = ({ h = 14, w = '100%' }) => (
  <div className="shimmer" style={{ height: h, width: w, borderRadius: 8 }} />
);

const calcAmount = (p, pricing) => {
  const checkoutDate = new Date(p.checkoutTime);
  const createdDate = new Date(p.createdAt);
  if (isNaN(checkoutDate.getTime()) || isNaN(createdDate.getTime())) return 0;
  const hours = Math.max(1, Math.floor((checkoutDate - createdDate) / 3600000));
  const rate = p.vehicleType === 'car' ? (pricing?.car || 20)
             : p.vehicleType === 'cycle' ? (pricing?.cycle || 5)
             : (pricing?.bike || 10);
  return hours * rate;
};

const fmt = (n) => new Intl.NumberFormat('en-IN').format(n);

export default function Paid() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPaymentMethod, setFilterPaymentMethod] = useState('all');

  const { data: profileData } = useQuery({ queryKey: ['profile'], queryFn: getProfile });
  const standPricing = profileData?.stand?.pricing || null;

  const { data: allParkings = [], isLoading } = useQuery({
    queryKey: ['all-parkings'],
    queryFn: getAllParkings,
  });

  const paidParkings = allParkings.filter(p => p.status === 'completed' && p.paymentMethod);

  const filtered = paidParkings.filter(p => {
    const matchesPM = filterPaymentMethod === 'all' || p.paymentMethod === filterPaymentMethod;
    const q = searchTerm.trim().toLowerCase();
    const matchesSearch = !q ||
      p.vehicleNumber?.toLowerCase().includes(q) ||
      p.tokenId?.toLowerCase().includes(q) ||
      p.customerName?.toLowerCase().includes(q) ||
      p.customerPhone?.toLowerCase().includes(q);
    return matchesPM && matchesSearch;
  });

  const totalAmount   = paidParkings.reduce((s, p) => s + calcAmount(p, standPricing), 0);
  const cashAmount    = paidParkings.filter(p => p.paymentMethod === 'cash').reduce((s, p) => s + calcAmount(p, standPricing), 0);
  const upiAmount     = paidParkings.filter(p => p.paymentMethod === 'upi').reduce((s, p) => s + calcAmount(p, standPricing), 0);
  const whatsappAmount = paidParkings.filter(p => p.paymentMethod === 'whatsapp').reduce((s, p) => s + calcAmount(p, standPricing), 0);

  const TABS = [['all','All'],['cash','Cash'],['upi','UPI'],['whatsapp','WhatsApp']];

  return (
    <>
      <style>{css}</style>
      <div className="paid-wrap" style={{ padding:'28px 32px', minHeight:'100vh', background:'#f7f7f7' }}>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:28 }}>
          <div>
            <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:28, letterSpacing:'-0.02em', color:'#0a0a0a', lineHeight:1, fontStyle:'italic' }}>
              Paid Transactions
            </div>
            <div style={{ fontFamily:'DM Mono,monospace', fontSize:11, color:'#aaa', marginTop:4, letterSpacing:'.04em' }}>
              All completed payments &amp; customer details
            </div>
          </div>
          <div style={{ width:40, height:40, borderRadius:10, background:'#0a0a0a', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <FaReceipt size={16} color="#fff" />
          </div>
        </div>

        {/* KPI Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:20 }}>
          {[
            { label:'Total Collected', value: totalAmount, color:'#059669', prefix:'₹' },
            { label:'Cash Payments',   value: cashAmount,  color:'#059669', prefix:'₹' },
            { label:'UPI Payments',    value: upiAmount,   color:'#7c3aed', prefix:'₹' },
            { label:'WhatsApp Payments', value: whatsappAmount, color:'#0d9488', prefix:'₹' },
          ].map(({ label, value, color, prefix }) => (
            <div key={label} className="db-card" style={{ padding:'22px 24px' }}>
              <span className="section-label">{label}</span>
              {isLoading
                ? <Shimmer h={38} />
                : <div className="kpi-num" style={{ color:'#0a0a0a' }}>{prefix}{fmt(value)}</div>
              }
            </div>
          ))}
        </div>

        {/* Search + Filters */}
        <div className="db-card" style={{ padding:'18px 20px', marginBottom:14 }}>
          <div style={{ display:'flex', gap:12, marginBottom:14 }}>
            <div style={{ flex:1, position:'relative' }}>
              <FaSearch size={12} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#bbb' }} />
              <input
                className="paid-search-input"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search vehicle no, token, customer…"
              />
            </div>
            <button className="paid-search-btn">Search</button>
          </div>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            {TABS.map(([val, label]) => (
              <button
                key={val}
                className={`paid-tab${filterPaymentMethod === val ? ` t-active-${val}` : ''}`}
                onClick={() => setFilterPaymentMethod(val)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Table card */}
        <div className="db-card" style={{ overflow:'hidden' }}>
          {/* Toolbar */}
          <div style={{ padding:'12px 20px', borderBottom:'1px solid #ebebeb', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <span className="section-label" style={{ marginBottom:0 }}>
              {filtered.length} transaction{filtered.length === 1 ? '' : 's'}
            </span>
          </div>

          <div style={{ overflowX:'auto' }}>
            {isLoading ? (
              <div style={{ padding:'20px 20px', display:'flex', flexDirection:'column', gap:10 }}>
                {[...Array(5)].map((_, i) => <Shimmer key={i} h={20} w={`${90 - i * 8}%`} />)}
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ padding:'48px 20px', textAlign:'center', color:'#bbb', fontSize:13, fontFamily:'DM Mono,monospace' }}>
                No paid transactions found
              </div>
            ) : (
              <table className="paid-table">
                <thead>
                  <tr>
                    <th>Vehicle</th>
                    <th>Details</th>
                    <th>Customer</th>
                    <th>Payment</th>
                    <th>Amount</th>
                    <th>Timing</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[...filtered]
                    .sort((a, b) => new Date(b.checkoutTime) - new Date(a.checkoutTime))
                    .map(p => {
                      const Icon = VEHICLE_ICONS[p.vehicleType] || FaCar;
                      const color = VEHICLE_COLORS[p.vehicleType] || '#555';
                      const amount = calcAmount(p, standPricing);
                      const checkoutDate = new Date(p.checkoutTime);
                      const validDate = !isNaN(checkoutDate.getTime());

                      return (
                        <tr key={p._id}>
                          {/* Vehicle type icon */}
                          <td>
                            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                              <div style={{ width:30, height:30, borderRadius:8, background:`${color}12`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                                <Icon size={13} color={color} />
                              </div>
                              <span style={{ fontSize:12.5, fontWeight:600, color:'#0a0a0a', textTransform:'capitalize' }}>{p.vehicleType}</span>
                            </div>
                          </td>

                          {/* Vehicle number + token */}
                          <td>
                            <div style={{ fontFamily:'DM Mono,monospace', fontSize:12.5, fontWeight:600, color:'#0a0a0a', background:'#f5f5f5', padding:'2px 8px', borderRadius:6, display:'inline-block', marginBottom:4 }}>
                              {p.vehicleNumber}
                            </div>
                            <div style={{ fontSize:10.5, color:'#aaa', fontFamily:'DM Mono,monospace' }}>
                              Token: {p.tokenId}
                            </div>
                          </td>

                          {/* Customer */}
                          <td>
                            <div style={{ display:'flex', alignItems:'center', gap:5, marginBottom:2 }}>
                              <FaUser size={11} color="#bbb" />
                              <span style={{ fontSize:12.5, fontWeight:500, color:'#0a0a0a' }}>{p.customerName || '—'}</span>
                            </div>
                            {p.customerPhone && (
                              <div style={{ fontSize:11, color:'#aaa', fontFamily:'DM Mono,monospace' }}>{p.customerPhone}</div>
                            )}
                          </td>

                          {/* Payment badge */}
                          <td>
                            <span className={`payment-badge ${p.paymentMethod}`}>
                              {p.paymentMethod === 'cash' ? '💵 Cash'
                               : p.paymentMethod === 'upi' ? '📱 UPI'
                               : '💬 WhatsApp'}
                            </span>
                          </td>

                          {/* Amount */}
                          <td>
                            <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                              <FaRupeeSign size={11} color="#059669" />
                              <span style={{ fontFamily:'DM Serif Display,serif', fontSize:18, color:'#0a0a0a' }}>{fmt(amount)}</span>
                            </div>
                          </td>

                          {/* Timing */}
                          <td>
                            <div style={{ display:'flex', alignItems:'center', gap:5, marginBottom:2 }}>
                              <FaCalendar size={10} color="#bbb" />
                              <span style={{ fontSize:11, color:'#555', fontFamily:'DM Mono,monospace' }}>
                                {validDate ? format(checkoutDate, 'MMM dd, yyyy') : 'Invalid Date'}
                              </span>
                            </div>
                            <div style={{ fontSize:11, color:'#aaa', fontFamily:'DM Mono,monospace' }}>
                              {validDate ? format(checkoutDate, 'hh:mm a') : '—'}
                            </div>
                          </td>

                          {/* Status */}
                          <td>
                            <span className="paid-status-paid">● Paid</span>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>
    </>
  );
}