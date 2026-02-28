import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getParkingById, checkoutParking, getAllParkings, searchParkingByVehicleNumber, getProfile } from '../api';
import { FaSearch, FaCar, FaMotorcycle, FaBicycle, FaWhatsapp, FaTimes, FaCheckCircle } from 'react-icons/fa';
import { FiAlertTriangle } from 'react-icons/fi';
import { MdOutlineCheckCircle } from 'react-icons/md';
import { RiParkingBoxLine } from 'react-icons/ri';

// ─── CSS ───────────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500;600&family=DM+Sans:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes fadeUp   { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
  @keyframes slideDown { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: none; } }
  @keyframes fadeIn   { from { opacity: 0; } to { opacity: 1; } }
  @keyframes modalIn  { from { opacity: 0; transform: scale(.97); } to { opacity: 1; transform: scale(1); } }
  @keyframes spin     { to { transform: rotate(360deg); } }
  @keyframes shimmer  { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }

  .co-wrap { font-family: 'DM Sans', sans-serif; animation: fadeUp .28s ease; }

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

  /* KPI */
  .kpi-card {
    background: #fff; border-radius: 14px; border: 1px solid #ebebeb;
    padding: 14px 16px; display: flex; flex-direction: column; gap: 8px;
    transition: box-shadow .18s; flex: 1; min-width: 100px;
  }
  .kpi-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,.06); }
  .kpi-num {
    font-family: 'DM Serif Display', serif;
    font-size: 24px; letter-spacing: -0.03em; line-height: 1; color: #0a0a0a;
  }

  /* Search */
  .co-search {
    display: flex; align-items: center; gap: 8px;
    background: #f7f7f7; border: 1.5px solid #ebebeb; border-radius: 10px;
    padding: 8px 12px; flex: 1; transition: border-color .14s;
  }
  .co-search:focus-within { border-color: #0a0a0a; background: #fff; }
  .co-search input {
    border: none; background: transparent; outline: none;
    font-family: 'DM Sans', sans-serif; font-size: 13px; color: #0a0a0a; width: 100%;
  }
  .co-search input::placeholder { color: #ccc; }

  .search-btn {
    padding: 9px 18px; background: #0a0a0a; color: #fff;
    border: none; border-radius: 10px; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 700;
    transition: all .14s; white-space: nowrap;
  }
  .search-btn:hover { background: #222; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,.18); }

  /* Vehicle filter pills */
  .vtype-pill {
    flex: 1; display: flex; align-items: center; justify-content: space-between;
    padding: 10px 14px; border-radius: 12px; cursor: pointer;
    border: 1.5px solid #ebebeb; background: #fff;
    transition: all .14s; outline: none;
  }

  /* Status filter tabs */
  .st-tab {
    padding: 5px 14px; border-radius: 20px;
    font-family: 'DM Mono', monospace; font-size: 9px; font-weight: 700;
    letter-spacing: .10em; text-transform: uppercase;
    border: none; cursor: pointer; transition: all .13s;
    background: transparent; color: #aaa;
  }
  .st-tab:hover { background: #f5f5f5; color: #555; }
  .st-tab.active { background: #0a0a0a; color: #fff; }
  .st-tab.active-active { background: #059669; color: #fff; }

  /* Table */
  .co-table { width: 100%; border-collapse: collapse; table-layout: auto; }
  .co-table thead tr { border-bottom: 1px solid #f0f0f0; }
  .co-table th {
    padding: 10px 14px; text-align: left;
    font-family: 'DM Mono', monospace; font-size: 9px; font-weight: 600;
    letter-spacing: .14em; text-transform: uppercase; color: #ccc;
    white-space: nowrap;
  }
  .co-table tbody tr { border-bottom: 1px solid #f7f7f7; transition: background .1s; }
  .co-table tbody tr:last-child { border-bottom: none; }
  .co-table tbody tr:hover { background: #fafafa; }
  .co-table tbody tr.active-row { background: #f0fdf4; }
  .co-table td { padding: 11px 14px; vertical-align: middle; white-space: nowrap; }

  /* Checkout row button */
  .checkout-btn {
    padding: 5px 14px; background: #0a0a0a; color: #fff;
    font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 700;
    border: none; border-radius: 7px; cursor: pointer; transition: all .13s;
  }
  .checkout-btn:hover { background: #222; transform: translateY(-1px); box-shadow: 0 2px 8px rgba(0,0,0,.2); }

  /* Modal */
  .co-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,.4);
    display: flex; align-items: center; justify-content: center;
    z-index: 1000; padding: 16px; animation: fadeIn .15s ease;
  }
  .co-modal {
    background: #fff; border-radius: 20px; width: 100%; max-width: 430px;
    border: 1px solid #ebebeb;
    box-shadow: 0 24px 60px rgba(0,0,0,.18);
    animation: modalIn .2s cubic-bezier(.22,1,.36,1); overflow: hidden;
  }

  /* Payment options */
  .pay-opt {
    display: flex; align-items: center; gap: 10px;
    padding: 11px 14px; border-radius: 10px; border: 1.5px solid #ebebeb;
    cursor: pointer; transition: all .13s; background: #fff;
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
    color: #0a0a0a; width: 100%;
  }
  .pay-opt:hover { border-color: #0a0a0a; background: #fafafa; }
  .pay-opt.sel-cash     { border-color: #0a0a0a; background: #0a0a0a; color: #fff; }
  .pay-opt.sel-upi      { border-color: #7c3aed; background: #7c3aed; color: #fff; }
  .pay-opt.sel-whatsapp { border-color: #059669; background: #059669; color: #fff; }

  .confirm-btn {
    width: 100%; padding: 13px; background: #0a0a0a; color: #fff;
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 700;
    border: none; border-radius: 10px; cursor: pointer; transition: all .14s;
    letter-spacing: .01em;
  }
  .confirm-btn:hover:not(:disabled) { background: #222; }
  .confirm-btn:disabled { background: #d4d4d4; cursor: not-allowed; }

  .shimmer {
    background: linear-gradient(90deg, #f5f5f5 25%, #ebebeb 50%, #f5f5f5 75%);
    background-size: 200% 100%; animation: shimmer 1.2s infinite; border-radius: 6px; height: 14px;
  }
`;

// ─── Constants ────────────────────────────────────────────────────────────────
const VEHICLE_ICONS  = { car: FaCar, motorcycle: FaMotorcycle, bike: FaMotorcycle, cycle: FaBicycle };
const VEHICLE_COLORS = { car: '#1d4ed8', motorcycle: '#d97706', bike: '#d97706', cycle: '#0d9488' };

// ─── Helpers ──────────────────────────────────────────────────────────────────
const Spinner = ({ color = '#fff', size = 14 }) => (
  <div style={{ width: size, height: size, border: `2px solid ${color}33`, borderTopColor: color, borderRadius: '50%', animation: 'spin .6s linear infinite', flexShrink: 0 }} />
);

const Badge = ({ children, bg, color }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: 'DM Mono, monospace', fontSize: 9, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', background: bg, color, padding: '3px 9px', borderRadius: 20 }}>
    {children}
  </span>
);

// ─── Main ─────────────────────────────────────────────────────────────────────
const Checkout = () => {
  const navigate    = useNavigate();
  const queryClient = useQueryClient();

  const [searchTerm,      setSearchTerm]      = useState('');
  const [selectedParking, setSelectedParking] = useState(null);
  const [showModal,       setShowModal]       = useState(false);
  const [paymentMethod,   setPaymentMethod]   = useState('');
  const [whatsappNumber,  setWhatsappNumber]  = useState('');
  const [filterStatus,    setFilterStatus]    = useState('all');
  const [filterVehicle,   setFilterVehicle]   = useState('all');
  const [standPricing,    setStandPricing]    = useState(null);

  useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
    onSuccess: d => { if (d?.stand?.pricing) setStandPricing(d.stand.pricing); },
  });

  const { data: allParkings = [], isLoading } = useQuery({
    queryKey: ['all-parkings'],
    queryFn: getAllParkings,
  });

  const checkoutMutation = useMutation({
    mutationFn: d => checkoutParking(d.id, d),
    onSuccess: () => {
      setSelectedParking(null); setShowModal(false);
      setPaymentMethod(''); setWhatsappNumber('');
      queryClient.invalidateQueries({ queryKey: ['all-parkings'] });
      navigate('/staff/paid');
    },
  });

  const calculateAmount = () => {
    if (!selectedParking) return 0;
    const rates = { cycle: standPricing?.cycle || 5, bike: standPricing?.bike || 10, car: standPricing?.car || 20 };
    const entry = new Date(selectedParking.createdAt);
    if (isNaN(entry.getTime())) return 0;
    const hours = Math.max(1, Math.floor((new Date() - entry) / 3600000));
    const rate  = rates[selectedParking.vehicleType] || rates.bike;
    const amt   = hours * rate;
    return isNaN(amt) ? 0 : amt;
  };

  const handleSearch = async e => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    const term = searchTerm.trim().toLowerCase();
    const local = allParkings.find(p => p.vehicleNumber?.toLowerCase().includes(term) && p.status === 'active');
    if (local) { setSelectedParking(local); setShowModal(true); return; }
    try {
      const res  = await searchParkingByVehicleNumber(searchTerm.trim());
      const found = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
      const active = found.filter(p => p.status === 'active');
      const pick   = active[0] || found[0];
      if (pick) { setSelectedParking(pick); setShowModal(true); }
      else alert(`No parking found for: "${searchTerm}"`);
    } catch { alert('Error searching for vehicle'); }
  };

  const processCheckout = () => {
    if (!paymentMethod) return;
    if (paymentMethod === 'whatsapp') {
      const msg = `Hello, please pay ₹${calculateAmount()} for parking vehicle ${selectedParking?.vehicleNumber}. Thank you!`;
      window.open(`https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
    }
    checkoutMutation.mutate({ id: selectedParking?._id, paymentMethod, whatsappNumber: paymentMethod === 'whatsapp' ? whatsappNumber : null });
  };

  const closeModal = () => { setShowModal(false); setPaymentMethod(''); setWhatsappNumber(''); };

  const filtered = allParkings.filter(p => {
    const matchStatus  = filterStatus  === 'all' || p.status      === filterStatus;
    const matchVehicle = filterVehicle === 'all' || p.vehicleType === filterVehicle;
    const matchSearch  = !searchTerm.trim() ||
      p.vehicleNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.tokenId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.customerName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchVehicle && matchSearch;
  });

  const activeCount    = allParkings.filter(p => p.status === 'active').length;
  const completedCount = allParkings.filter(p => p.status === 'completed').length;

  const VTYPES = [
    { value: 'all',   label: 'All',   Icon: null,          color: '#0a0a0a', bg: '#f7f7f7', border: '#ebebeb' },
    { value: 'cycle', label: 'Cycle', Icon: FaBicycle,     color: '#0d9488', bg: '#f0fdfa', border: '#99f6e4' },
    { value: 'bike',  label: 'Bike',  Icon: FaMotorcycle,  color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
    { value: 'car',   label: 'Car',   Icon: FaCar,         color: '#1d4ed8', bg: '#eff6ff', border: '#bfdbfe' },
  ];

  return (
    <>
      <style>{css}</style>
      <div className="co-wrap" style={{ padding: '28px 32px', minHeight: '100vh', background: '#f7f7f7' }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: 20 }}>
          <span className="section-label">Staff</span>
          <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 28, letterSpacing: '-0.02em', color: '#0a0a0a', lineHeight: 1, fontStyle: 'italic' }}>
            Checkout
          </div>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#aaa', marginTop: 4, letterSpacing: '.04em' }}>
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>

        {/* ── KPI Strip ── */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          {[
            { label: 'Total Today', value: allParkings.length, color: '#1d4ed8' },
            { label: 'Active',      value: activeCount,        color: '#059669' },
            { label: 'Checked Out', value: completedCount,     color: '#7c3aed' },
          ].map(({ label, value, color }) => (
            <div key={label} className="kpi-card">
              <span className="section-label" style={{ marginBottom: 0 }}>{label}</span>
              <div className="kpi-num" style={{ color }}>{value}</div>
            </div>
          ))}
        </div>

        {/* ── Search ── */}
        <div className="db-card" style={{ padding: '14px 16px', marginBottom: 12 }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8 }}>
            <div className="co-search">
              <FaSearch size={11} color="#ccc" />
              <input
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search by vehicle number, token or name…"
              />
            </div>
            <button className="search-btn" type="submit">Search</button>
          </form>
        </div>

        {/* ── Vehicle Type Filter ── */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
          {VTYPES.map(({ value, label, Icon, color, bg, border }) => {
            const sel   = filterVehicle === value;
            const count = value === 'all' ? allParkings.length : allParkings.filter(p => p.vehicleType === value).length;
            return (
              <button
                key={value}
                className="vtype-pill"
                onClick={() => setFilterVehicle(value)}
                style={{
                  border: `1.5px solid ${sel ? color : border}`,
                  background: sel ? color : bg,
                  boxShadow: sel ? `0 3px 10px ${color}28` : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  {Icon
                    ? <Icon size={13} color={sel ? '#fff' : color} />
                    : <RiParkingBoxLine style={{ color: sel ? '#fff' : color, fontSize: 13 }} />
                  }
                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: sel ? '#fff' : color }}>
                    {label}
                  </span>
                </div>
                <span style={{ fontFamily: 'DM Serif Display, serif', fontSize: 18, color: sel ? 'rgba(255,255,255,.9)' : color }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Table Card ── */}
        <div className="db-card" style={{ overflow: 'hidden' }}>
          {/* card header */}
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="section-label" style={{ marginBottom: 0 }}>Entries</span>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: '#d4d4d4' }}>{filtered.length}/{allParkings.length}</span>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[['all', 'All', 'active'], ['active', 'Active', 'active-active']].map(([val, label, activeClass]) => (
                <button
                  key={val}
                  className={`st-tab${filterStatus === val ? ` ${activeClass}` : ''}`}
                  onClick={() => setFilterStatus(val)}
                >{label}</button>
              ))}
              <button
                className={`st-tab${filterStatus === 'completed' ? ' active' : ''}`}
                onClick={() => setFilterStatus('completed')}
              >Done</button>
            </div>
          </div>

          {/* table */}
          <div style={{ overflowX: 'auto' }}>
            {isLoading ? (
              <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[...Array(5)].map((_, i) => <div key={i} className="shimmer" style={{ width: `${85 - i * 8}%` }} />)}
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: '44px 0', textAlign: 'center', fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#ccc', letterSpacing: '.06em' }}>
                No entries found
              </div>
            ) : (
              <table className="co-table">
                <thead>
                  <tr>
                    <th>Vehicle</th>
                    <th>Number</th>
                    <th>Token</th>
                    <th>Entry</th>
                    <th>Duration</th>
                    <th>Status</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {[...filtered]
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .map(p => {
                      const Icon  = VEHICLE_ICONS[p.vehicleType]  || FaCar;
                      const color = VEHICLE_COLORS[p.vehicleType] || '#555';
                      const mins  = Math.floor((new Date() - new Date(p.createdAt)) / 60000);
                      const dur   = mins < 60 ? `${mins}m` : `${Math.floor(mins / 60)}h ${mins % 60}m`;
                      const active = p.status === 'active';
                      return (
                        <tr key={p._id} className={active ? 'active-row' : ''}>

                          {/* Vehicle type */}
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div style={{ width: 30, height: 30, borderRadius: 8, background: `${color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <Icon size={12} style={{ color }} />
                              </div>
                              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 700, color: '#0a0a0a', textTransform: 'capitalize' }}>{p.vehicleType}</span>
                            </div>
                          </td>

                          {/* Number plate */}
                          <td>
                            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, fontWeight: 600, color: '#0a0a0a', background: '#f5f5f5', padding: '2px 8px', borderRadius: 5 }}>
                              {p.vehicleNumber}
                            </span>
                          </td>

                          {/* Token */}
                          <td style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#bbb' }}>{p.tokenId || '—'}</td>

                          {/* Entry time */}
                          <td style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#888' }}>
                            {new Date(p.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>

                          {/* Duration */}
                          <td style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#888' }}>
                            {active ? dur : '—'}
                          </td>

                          {/* Status badge */}
                          <td>
                            {active
                              ? <Badge bg="#f0fdf4" color="#059669"><span style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />Active</Badge>
                              : <Badge bg="#f5f5f5" color="#aaa">Done</Badge>
                            }
                          </td>

                          {/* Action */}
                          <td>
                            {active
                              ? <button className="checkout-btn" onClick={() => { setSelectedParking(p); setShowModal(true); }}>Checkout</button>
                              : <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: '#ccc' }}>✓ paid</span>
                            }
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

      {/* ── Checkout Modal ── */}
      {showModal && selectedParking && (
        <div className="co-overlay" onClick={e => { if (e.target === e.currentTarget) closeModal(); }}>
          <div className="co-modal">

            {/* modal header */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 18, fontStyle: 'italic', color: '#0a0a0a' }}>Complete Checkout</div>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: '#aaa', marginTop: 2, letterSpacing: '.04em' }}>{selectedParking.vehicleNumber}</div>
              </div>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#bbb', padding: 4, borderRadius: 6, display: 'flex' }}>
                <FaTimes size={13} />
              </button>
            </div>

            <div style={{ padding: '18px 20px' }}>
              {/* Summary */}
              <div style={{ background: '#f7f7f7', borderRadius: 12, border: '1px solid #ebebeb', padding: '14px 16px', marginBottom: 18 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 20px' }}>
                  {[
                    ['Vehicle',  <span style={{ textTransform: 'capitalize', fontWeight: 700 }}>{selectedParking.vehicleType}</span>],
                    ['Number',   <span style={{ fontFamily: 'DM Mono, monospace', fontWeight: 700 }}>{selectedParking.vehicleNumber}</span>],
                    ['Entry',    new Date(selectedParking.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })],
                    ['Amount',   <span style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, color: '#059669' }}>₹{calculateAmount()}</span>],
                  ].map(([label, val]) => (
                    <div key={label}>
                      <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, fontWeight: 600, color: '#aaa', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 3 }}>{label}</div>
                      <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: '#0a0a0a' }}>{val}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment method */}
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, fontWeight: 600, color: '#aaa', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 10 }}>
                Payment Method
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 16 }}>
                {[
                  { val: 'cash',     label: 'Cash',     emoji: '💵' },
                  { val: 'upi',      label: 'UPI',      emoji: '📱' },
                  { val: 'whatsapp', label: 'WhatsApp', emoji: null },
                ].map(({ val, label, emoji }) => (
                  <button
                    key={val}
                    className={`pay-opt${paymentMethod === val ? ` sel-${val}` : ''}`}
                    onClick={() => setPaymentMethod(val)}
                  >
                    {emoji
                      ? <span style={{ fontSize: 15 }}>{emoji}</span>
                      : <FaWhatsapp style={{ color: paymentMethod === val ? '#fff' : '#22c55e', fontSize: 15 }} />
                    }
                    <span>{label}</span>
                    {paymentMethod === val && <MdOutlineCheckCircle size={15} style={{ marginLeft: 'auto', opacity: .85 }} />}
                  </button>
                ))}
              </div>

              {/* WhatsApp number input */}
              {paymentMethod === 'whatsapp' && (
                <div style={{ marginBottom: 16, animation: 'slideDown .15s ease' }}>
                  <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, fontWeight: 600, color: '#aaa', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 7 }}>
                    WhatsApp Number
                  </div>
                  <input
                    type="tel"
                    value={whatsappNumber}
                    onChange={e => setWhatsappNumber(e.target.value)}
                    placeholder="e.g. 9876543210"
                    style={{
                      width: '100%', padding: '9px 12px',
                      border: '1.5px solid #ebebeb', borderRadius: 10,
                      fontFamily: 'DM Mono, monospace', fontSize: 13,
                      outline: 'none', color: '#0a0a0a', background: '#fafafa',
                      transition: 'border-color .14s',
                    }}
                    onFocus={e => { e.target.style.borderColor = '#0a0a0a'; e.target.style.background = '#fff'; }}
                    onBlur={e => { e.target.style.borderColor = '#ebebeb'; e.target.style.background = '#fafafa'; }}
                  />
                </div>
              )}

              <button
                className="confirm-btn"
                onClick={processCheckout}
                disabled={!paymentMethod || checkoutMutation.isPending || (paymentMethod === 'whatsapp' && !whatsappNumber)}
              >
                {checkoutMutation.isPending
                  ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}><Spinner /> Processing…</span>
                  : `Confirm & Collect ₹${calculateAmount()}`
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Checkout;