import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { getTodayParkings } from '../api';
import { FaCar, FaMotorcycle, FaBicycle, FaSearch, FaPlus } from 'react-icons/fa';

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500;600&family=DM+Sans:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

  @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
  @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }

  .tl-wrap { font-family:'DM Sans',sans-serif; animation:fadeUp .28s ease; }

  .db-card {
    background:#fff; border-radius:16px;
    border:1px solid #ebebeb;
    transition:box-shadow .18s;
  }
  .db-card:hover { box-shadow:0 4px 20px rgba(0,0,0,.06); }

  .section-label {
    font-family:'DM Mono',monospace; font-size:9px; font-weight:600;
    letter-spacing:.14em; text-transform:uppercase; color:#aaa;
    display:block;
  }

  .kpi-num {
    font-family:'DM Serif Display',serif;
    font-size:32px; letter-spacing:-0.03em;
    line-height:1; color:#0a0a0a;
  }

  /* Search */
  .tl-search {
    width:100%; padding:9px 10px 9px 34px;
    font-size:12.5px; font-family:'DM Mono',monospace;
    border:1.5px solid #ebebeb; border-radius:10px;
    outline:none; color:#0a0a0a; background:#fff;
    transition:border-color .14s, box-shadow .14s;
  }
  .tl-search:focus { border-color:#0a0a0a; box-shadow:0 0 0 3px rgba(10,10,10,.05); }
  .tl-search::placeholder { color:#bbb; }

  /* Table */
  .tl-table { width:100%; border-collapse:collapse; font-family:'DM Sans',sans-serif; }
  .tl-table th {
    padding:10px 16px; text-align:left;
    font-size:9px; font-weight:600; color:#aaa;
    letter-spacing:.14em; text-transform:uppercase;
    border-bottom:1px solid #ebebeb; white-space:nowrap;
    font-family:'DM Mono',monospace; background:#fafafa;
  }
  .tl-table td { padding:11px 16px; font-size:13px; color:#444; border-bottom:1px solid #f5f5f5; white-space:nowrap; }
  .tl-table tr:last-child td { border-bottom:none; }
  .tl-table tbody tr { transition:background .1s; }
  .tl-table tbody tr:hover { background:#fafafa; }
  .tl-table tbody tr.row-active { background:#f0fdf4; }

  /* Status chips */
  .chip-active {
    display:inline-flex; align-items:center; gap:5px;
    padding:2px 9px; border-radius:20px; font-size:10.5px; font-weight:600;
    background:#dcfce7; color:#15803d; font-family:'DM Mono',monospace;
  }
  .chip-done {
    display:inline-flex; align-items:center; gap:4px;
    padding:2px 9px; border-radius:20px; font-size:10.5px; font-weight:600;
    background:#f5f5f5; color:#aaa; font-family:'DM Mono',monospace;
  }

  /* Action buttons */
  .tl-view-btn {
    padding:4px 12px; font-size:11.5px; font-weight:600;
    border:1.5px solid #ebebeb; border-radius:8px;
    background:#fff; color:#555; cursor:pointer;
    font-family:'DM Sans',sans-serif; transition:all .12s;
    margin-right:6px;
  }
  .tl-view-btn:hover { border-color:#0a0a0a; color:#0a0a0a; }

  .tl-co-btn {
    padding:4px 12px; font-size:11.5px; font-weight:700;
    border:none; border-radius:8px;
    background:#0a0a0a; color:#fff; cursor:pointer;
    font-family:'DM Sans',sans-serif; transition:all .12s;
  }
  .tl-co-btn:hover { background:#222; transform:translateY(-1px); box-shadow:0 3px 8px rgba(0,0,0,.15); }
  .tl-co-btn:active { transform:scale(.96); }

  .shimmer {
    background:linear-gradient(90deg,#f5f5f5 25%,#ebebeb 50%,#f5f5f5 75%);
    background-size:200% 100%; animation:shimmer 1.2s infinite; border-radius:8px;
  }
`;

const VICONS  = { car: FaCar, motorcycle: FaMotorcycle, bike: FaMotorcycle, cycle: FaBicycle };
const VCOLORS = { car:'#1d4ed8', motorcycle:'#d97706', bike:'#d97706', cycle:'#0d9488' };

const Shimmer = ({ h = 14, w = '100%' }) => (
  <div className="shimmer" style={{ height: h, width: w }} />
);

export default function TodayList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const { data: parkings = [], isLoading } = useQuery({
    queryKey: ['today-parkings'],
    queryFn: getTodayParkings,
    refetchInterval: 30000,
  });

  const filtered = parkings.filter(p =>
    !search ||
    p.vehicleNumber?.toLowerCase().includes(search.toLowerCase()) ||
    p.customerName?.toLowerCase().includes(search.toLowerCase())
  );

  const active = parkings.filter(p => p.status === 'active').length;
  const done   = parkings.filter(p => p.status !== 'active').length;
  const cars   = parkings.filter(p => p.vehicleType === 'car').length;

  return (
    <>
      <style>{css}</style>
      <div className="tl-wrap" style={{ padding:'28px 32px', minHeight:'100vh', background:'#f7f7f7' }}>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:28 }}>
          <div>
            <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:28, letterSpacing:'-0.02em', color:'#0a0a0a', lineHeight:1, fontStyle:'italic' }}>
              Today's List
            </div>
            <div style={{ fontFamily:'DM Mono,monospace', fontSize:11, color:'#aaa', marginTop:4, letterSpacing:'.04em' }}>
              {new Date().toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}
            </div>
          </div>
          <Link to="/staff/new-parking" style={{
            display:'flex', alignItems:'center', gap:8,
            padding:'10px 18px', background:'#0a0a0a', color:'#fff',
            borderRadius:10, textDecoration:'none', fontWeight:700, fontSize:13,
            fontFamily:'DM Sans,sans-serif', transition:'all .14s',
          }}>
            <FaPlus size={10} /> New Entry
          </Link>
        </div>

        {/* KPI Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:20 }}>
          {[
            { label:'Total Today',   value: parkings.length, color:'#1d4ed8' },
            { label:'Active Now',    value: active,          color:'#059669' },
            { label:'Checked Out',   value: done,            color:'#7c3aed' },
            { label:'Cars',          value: cars,            color:'#d97706' },
          ].map(({ label, value, color }) => (
            <div key={label} className="db-card" style={{ padding:'22px 24px' }}>
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:10 }}>
                <span className="section-label">{label}</span>
                <div style={{ width:8, height:8, borderRadius:'50%', background: color, marginTop:2 }} />
              </div>
              {isLoading
                ? <Shimmer h={38} />
                : <div className="kpi-num">{value}</div>
              }
            </div>
          ))}
        </div>

        {/* Table card */}
        <div className="db-card" style={{ overflow:'hidden' }}>
          {/* Toolbar */}
          <div style={{ padding:'14px 20px', borderBottom:'1px solid #ebebeb', display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ position:'relative', flex:1, maxWidth:320 }}>
              <FaSearch size={11} style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', color:'#bbb' }} />
              <input
                className="tl-search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search vehicle or customer…"
              />
            </div>
            <span className="section-label" style={{ marginLeft:'auto', marginBottom:0 }}>
              {filtered.length} entr{filtered.length === 1 ? 'y' : 'ies'}
            </span>
          </div>

          {/* Table */}
          <div style={{ overflowX:'auto' }}>
            {isLoading ? (
              <div style={{ padding:'20px 20px', display:'flex', flexDirection:'column', gap:10 }}>
                {[...Array(6)].map((_, i) => <Shimmer key={i} h={20} w={`${90 - i * 7}%`} />)}
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ padding:'52px 20px', textAlign:'center' }}>
                <div style={{ fontSize:32, marginBottom:10 }}>🅿️</div>
                <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:18, color:'#0a0a0a', fontStyle:'italic', marginBottom:4 }}>No entries yet</div>
                <div style={{ fontSize:12, color:'#aaa', fontFamily:'DM Mono,monospace' }}>Use the New Entry button to get started</div>
              </div>
            ) : (
              <table className="tl-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Vehicle</th>
                    <th>Number</th>
                    <th>Customer</th>
                    <th>Entry</th>
                    <th>Duration</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[...filtered]
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .map((p, i) => {
                      const Icon  = VICONS[p.vehicleType]  || FaCar;
                      const color = VCOLORS[p.vehicleType] || '#555';
                      const mins  = Math.floor((new Date() - new Date(p.createdAt)) / 60000);
                      const dur   = mins < 60 ? `${mins}m` : `${Math.floor(mins / 60)}h ${mins % 60}m`;

                      return (
                        <tr key={p._id} className={p.status === 'active' ? 'row-active' : ''}>
                          {/* Row number */}
                          <td style={{ fontFamily:'DM Mono,monospace', fontSize:11, color:'#ccc', width:40 }}>
                            {String(i + 1).padStart(2, '0')}
                          </td>

                          {/* Vehicle icon */}
                          <td>
                            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                              <div style={{ width:30, height:30, borderRadius:8, background:`${color}12`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                                <Icon size={13} color={color} />
                              </div>
                              <span style={{ fontSize:12.5, fontWeight:600, color:'#0a0a0a', textTransform:'capitalize' }}>{p.vehicleType}</span>
                            </div>
                          </td>

                          {/* Vehicle number */}
                          <td>
                            <span style={{ fontFamily:'DM Mono,monospace', fontSize:12.5, fontWeight:600, color:'#0a0a0a', background:'#f5f5f5', padding:'2px 8px', borderRadius:6 }}>
                              {p.vehicleNumber}
                            </span>
                          </td>

                          {/* Customer */}
                          <td style={{ fontFamily:'DM Sans,sans-serif', fontSize:12.5, color:'#555' }}>
                            {p.customerName || <span style={{ color:'#ddd' }}>—</span>}
                          </td>

                          {/* Entry time */}
                          <td style={{ fontFamily:'DM Mono,monospace', fontSize:11.5, color:'#aaa' }}>
                            {new Date(p.createdAt).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })}
                          </td>

                          {/* Duration */}
                          <td style={{ fontFamily:'DM Mono,monospace', fontSize:11.5, color: p.status === 'active' ? '#059669' : '#ccc' }}>
                            {p.status === 'active' ? dur : '—'}
                          </td>

                          {/* Status chip */}
                          <td>
                            {p.status === 'active'
                              ? <span className="chip-active"><span style={{ width:5, height:5, borderRadius:'50%', background:'#22c55e', display:'inline-block' }} />Active</span>
                              : <span className="chip-done">Done</span>
                            }
                          </td>

                          {/* Actions */}
                          <td>
                            <button className="tl-view-btn" onClick={() => {}}>View</button>
                            {p.status === 'active' && (
                              <button className="tl-co-btn" onClick={() => navigate(`/staff/checkout/${p._id}`)}>Checkout</button>
                            )}
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