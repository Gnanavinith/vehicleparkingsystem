import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import api from '../../../config/axios';

import { FaPlus, FaSearch } from 'react-icons/fa';
import { FiEdit2, FiTrash2, FiAlertTriangle } from 'react-icons/fi';
import { HiOutlineBuildingOffice2 } from 'react-icons/hi2';
import { RiParkingBoxLine } from 'react-icons/ri';
import { MdOutlineCheckCircle, MdOutlineSpeed } from 'react-icons/md';
import { BsPeopleFill } from 'react-icons/bs';

const CURRENCY_SYMBOLS = {
  USD: '$', EUR: '€', GBP: '£', INR: '₹', JPY: '¥',
  CAD: 'C$', AUD: 'A$', CHF: 'CHF', CNY: '¥', SGD: 'S$',
};

// ─── CSS ───────────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500;600&family=DM+Sans:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes fadeUp  { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
  @keyframes countUp { from { opacity: 0; transform: translateY(6px);  } to { opacity: 1; transform: none; } }
  @keyframes spin    { to { transform: rotate(360deg); } }
  @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }

  .vs-wrap { font-family: 'DM Sans', sans-serif; animation: fadeUp .28s ease; }

  .section-label {
    font-family: 'DM Mono', monospace;
    font-size: 9px; font-weight: 600;
    letter-spacing: .14em; text-transform: uppercase;
    color: #aaa; display: block; margin-bottom: 4px;
  }

  .db-card {
    background: #fff;
    border-radius: 16px;
    border: 1px solid #ebebeb;
    transition: box-shadow .18s;
  }
  .db-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,.06); }

  /* ── KPI: compact ── */
  .kpi-card {
    background: #fff; border-radius: 14px; border: 1px solid #ebebeb;
    padding: 14px 16px;
    display: flex; flex-direction: column; gap: 8px;
    transition: box-shadow .18s;
  }
  .kpi-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,.06); }
  .kpi-num {
    font-family: 'DM Serif Display', serif;
    font-size: 24px; letter-spacing: -0.03em;
    line-height: 1; color: #0a0a0a;
    animation: countUp .4s ease;
  }

  .create-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 10px 18px; background: #0a0a0a; color: #fff;
    border: none; border-radius: 10px;
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 700;
    cursor: pointer; transition: all .14s;
  }
  .create-btn:hover { background: #222; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,.18); }

  .icon-btn {
    width: 28px; height: 28px; border-radius: 8px; border: none;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: all .14s; flex-shrink: 0;
  }
  .icon-btn:hover { transform: scale(1.08); }

  .cancel-btn {
    padding: 10px 20px; background: transparent;
    border: 1.5px solid #ebebeb; border-radius: 10px;
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
    color: #888; cursor: pointer; transition: all .14s;
  }
  .cancel-btn:hover { border-color: #0a0a0a; color: #0a0a0a; }

  .delete-confirm-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 10px 20px; background: #dc2626; color: #fff;
    border: none; border-radius: 10px;
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 700;
    cursor: pointer; transition: all .14s;
  }
  .delete-confirm-btn:hover:not(:disabled) { background: #b91c1c; }
  .delete-confirm-btn:disabled { background: #d4d4d4; cursor: not-allowed; }

  .table-search {
    display: flex; align-items: center; gap: 8px;
    padding: 7px 12px;
    background: #f7f7f7; border: 1.5px solid #ebebeb; border-radius: 9px;
    transition: border-color .14s;
  }
  .table-search:focus-within { border-color: #0a0a0a; background: #fff; }
  .table-search input {
    border: none; background: transparent; outline: none;
    font-family: 'DM Sans', sans-serif; font-size: 12px; color: #0a0a0a;
    width: 200px;
  }
  .table-search input::placeholder { color: #ccc; }

  /* ── Native table: full control over alignment ── */
  .vs-table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
  }
  .vs-table thead tr {
    border-bottom: 1px solid #f0f0f0;
  }
  .vs-table thead th {
    padding: 10px 16px;
    font-family: 'DM Mono', monospace;
    font-size: 9px; font-weight: 600;
    letter-spacing: .14em; text-transform: uppercase;
    color: #ccc; text-align: left;
  }
  .vs-table tbody tr {
    border-bottom: 1px solid #f7f7f7;
    transition: background .12s;
  }
  .vs-table tbody tr:last-child { border-bottom: none; }
  .vs-table tbody tr:hover { background: #fafafa; }
  .vs-table tbody td {
    padding: 13px 16px;
    vertical-align: middle;
  }
  .vs-table .col-name     { width: 34%; }
  .vs-table .col-capacity { width: 13%; }
  .vs-table .col-rate     { width: 14%; }
  .vs-table .col-admin    { width: 19%; }
  .vs-table .col-status   { width: 14%; }
  .vs-table .col-actions  { width: 6%;  }

  .empty-row td {
    padding: 48px 0; text-align: center;
    font-family: 'DM Mono', monospace; font-size: 11px;
    color: #ccc; letter-spacing: .06em;
  }
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const Spinner = ({ color = '#fff', size = 14 }) => (
  <div style={{ width: size, height: size, border: `2px solid ${color}33`, borderTopColor: color, borderRadius: '50%', animation: 'spin .6s linear infinite', flexShrink: 0 }} />
);

const Badge = ({ bg, color, children }) => (
  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, fontWeight: 700, letterSpacing: '.10em', textTransform: 'uppercase', background: bg, color, padding: '4px 10px', borderRadius: 20, whiteSpace: 'nowrap' }}>
    {children}
  </span>
);

// ─── KPI Card ─────────────────────────────────────────────────────────────────
const KPI = ({ label, value, icon: Icon, color }) => (
  <div className="kpi-card">
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span className="section-label" style={{ marginBottom: 0 }}>{label}</span>
      <div style={{ width: 26, height: 26, borderRadius: 7, background: `${color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon style={{ color, fontSize: 12 }} />
      </div>
    </div>
    <div className="kpi-num">{value}</div>
  </div>
);

// ─── Delete Modal ─────────────────────────────────────────────────────────────
const DeleteModal = ({ stand, onConfirm, onCancel, isPending }) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, animation: 'fadeIn .15s ease' }}>
    <div className="db-card" style={{ padding: '32px', maxWidth: 400, width: '90%' }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <FiAlertTriangle size={20} color="#dc2626" />
        </div>
        <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 20, fontStyle: 'italic', color: '#0a0a0a', marginBottom: 8 }}>Delete Stand</div>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#888', lineHeight: 1.7 }}>
          Are you sure you want to delete <span style={{ color: '#0a0a0a', fontWeight: 600 }}>{stand?.name}</span>?<br />This action cannot be undone.
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button className="cancel-btn" onClick={onCancel}>Cancel</button>
        <button className="delete-confirm-btn" onClick={onConfirm} disabled={isPending}>
          {isPending ? <><Spinner /> Deleting…</> : <><FiTrash2 size={11} /> Delete</>}
        </button>
      </div>
    </div>
  </div>
);

// ─── Main ─────────────────────────────────────────────────────────────────────
const VehicleStands = () => {
  const navigate    = useNavigate();
  const queryClient = useQueryClient();
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [search, setSearch] = useState('');

  const { data: stands, isLoading, error } = useQuery({
    queryKey: ['superadmin-stands'],
    queryFn: async () => {
      const res = await api.get('/stands');
      return res.data.data.map(s => ({
        id:         s._id,
        name:       s.name,
        location:   s.location,
        capacity:   s.capacity || 0,
        hourlyRate: s.hourlyRate || 0,
        currency:   s.currency || 'INR',
        admin:      s.admin ? s.admin.name : 'Unassigned',
        status:     s.isActive ? 'Active' : 'Inactive',
      }));
    },
    staleTime: 300000,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => { const r = await api.delete(`/stands/${id}`); return r.data; },
    onSuccess: () => { queryClient.invalidateQueries(['superadmin-stands']); setDeleteTarget(null); },
    onError:   () => setDeleteTarget(null),
  });

  const totalCapacity = stands?.reduce((s, x) => s + x.capacity, 0) || 0;
  const activeCount   = stands?.filter(s => s.status === 'Active').length || 0;
  const avgRate       = stands?.length ? (stands.reduce((s, x) => s + x.hourlyRate, 0) / stands.length).toFixed(2) : '0.00';
  const sym           = CURRENCY_SYMBOLS[stands?.[0]?.currency] || '₹';

  const filtered = (stands || []).filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.location.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) return (
    <><style>{css}</style>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 260 }}>
        <Spinner color="#0a0a0a" size={32} />
      </div>
    </>
  );

  if (error) return (
    <><style>{css}</style>
      <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 12, padding: '14px 18px', color: '#dc2626', fontSize: 13, fontFamily: 'DM Mono, monospace' }}>
        <strong>Error:</strong> {error.message}
      </div>
    </>
  );

  return (
    <>
      <style>{css}</style>
      <div className="vs-wrap" style={{ padding: '28px 32px', minHeight: '100vh', background: '#f7f7f7' }}>

        {deleteTarget && (
          <DeleteModal
            stand={deleteTarget}
            onConfirm={() => deleteMutation.mutate(deleteTarget.id)}
            onCancel={() => setDeleteTarget(null)}
            isPending={deleteMutation.isPending}
          />
        )}

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <span className="section-label">Network</span>
            <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 28, letterSpacing: '-0.02em', color: '#0a0a0a', lineHeight: 1, fontStyle: 'italic' }}>
              Vehicle Stands
            </div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#aaa', marginTop: 4, letterSpacing: '.04em' }}>
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>
          <button className="create-btn" onClick={() => navigate('/superadmin/stands/create')}>
            <FaPlus size={11} /> Add Stand
          </button>
        </div>

        {/* KPI Strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 16 }}>
          <KPI label="Total Stands"    value={stands?.length || 0}                  icon={HiOutlineBuildingOffice2} color="#1d4ed8" />
          <KPI label="Active Stands"   value={activeCount}                           icon={MdOutlineCheckCircle}     color="#059669" />
          <KPI label="Total Capacity"  value={totalCapacity.toLocaleString('en-IN')} icon={BsPeopleFill}             color="#d97706" />
          <KPI label="Avg Hourly Rate" value={`${sym}${avgRate}`}                   icon={MdOutlineSpeed}           color="#7c3aed" />
        </div>

        {/* Table Card */}
        <div className="db-card" style={{ overflow: 'hidden' }}>

          {/* Card header */}
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="section-label" style={{ marginBottom: 0 }}>All Stands</span>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: '#d4d4d4' }}>
                {filtered.length}/{stands?.length || 0}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div className="table-search">
                <FaSearch size={9} color="#ccc" />
                <input type="text" placeholder="Search by name or location…" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <Badge bg="#f0fdf4" color="#059669">{activeCount} Active</Badge>
              <Badge bg="#fef2f2" color="#dc2626">{(stands?.length || 0) - activeCount} Inactive</Badge>
            </div>
          </div>

          {/* Native table — eliminates DataTable alignment issues */}
          <table className="vs-table">
            <colgroup>
              <col className="col-name" />
              <col className="col-capacity" />
              <col className="col-rate" />
              <col className="col-admin" />
              <col className="col-status" />
              <col className="col-actions" />
            </colgroup>
            <thead>
              <tr>
                <th>Stand Name</th>
                <th>Capacity</th>
                <th>Rate</th>
                <th>Admin</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0
                ? <tr className="empty-row"><td colSpan={6}>No stands found</td></tr>
                : filtered.map(row => {
                    const active = row.status === 'Active';
                    return (
                      <tr key={row.id}>

                        {/* Name + location subtitle */}
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <RiParkingBoxLine style={{ color: '#999', fontSize: 14 }} />
                            </div>
                            <div>
                              <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 700, color: '#0a0a0a' }}>{row.name}</div>
                              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: '#bbb', marginTop: 1 }}>{row.location}</div>
                            </div>
                          </div>
                        </td>

                        {/* Capacity */}
                        <td>
                          <span style={{ fontFamily: 'DM Serif Display, serif', fontSize: 15, color: '#0a0a0a' }}>{row.capacity}</span>
                          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: '#ccc', marginLeft: 4 }}>spots</span>
                        </td>

                        {/* Rate */}
                        <td>
                          <span style={{ fontFamily: 'DM Serif Display, serif', fontSize: 15, color: '#059669' }}>
                            {CURRENCY_SYMBOLS[row.currency] || '₹'}{row.hourlyRate.toFixed(2)}
                          </span>
                          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: '#ccc', marginLeft: 3 }}>/hr</span>
                        </td>

                        {/* Admin */}
                        <td>
                          <span style={{
                            fontFamily: 'DM Mono, monospace', fontSize: 10, fontWeight: 600, letterSpacing: '.04em',
                            background: row.admin === 'Unassigned' ? '#f5f5f5' : '#f0fdf4',
                            color:      row.admin === 'Unassigned' ? '#bbb'    : '#059669',
                            padding: '3px 9px', borderRadius: 20, display: 'inline-block',
                          }}>
                            {row.admin}
                          </span>
                        </td>

                        {/* Status */}
                        <td>
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: 5,
                            fontFamily: 'DM Mono, monospace', fontSize: 9, fontWeight: 700,
                            letterSpacing: '.06em', textTransform: 'uppercase',
                            background: active ? '#f0fdf4' : '#f5f5f5',
                            color:      active ? '#059669' : '#aaa',
                            padding: '3px 9px', borderRadius: 20,
                          }}>
                            <span style={{ width: 5, height: 5, borderRadius: '50%', background: active ? '#22c55e' : '#d1d5db', flexShrink: 0 }} />
                            {row.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td>
                          <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                            <button className="icon-btn" style={{ background: '#f5f5f5' }}
                              onClick={() => navigate(`/superadmin/stands/edit/${row.id}`)}
                              onMouseEnter={e => e.currentTarget.style.background = '#ebebeb'}
                              onMouseLeave={e => e.currentTarget.style.background = '#f5f5f5'}
                              title="Edit">
                              <FiEdit2 style={{ color: '#555', fontSize: 12 }} />
                            </button>
                            <button className="icon-btn" style={{ background: '#fef2f2' }}
                              onClick={() => setDeleteTarget({ id: row.id, name: row.name })}
                              onMouseEnter={e => e.currentTarget.style.background = '#fecaca'}
                              onMouseLeave={e => e.currentTarget.style.background = '#fef2f2'}
                              title="Delete">
                              <FiTrash2 style={{ color: '#dc2626', fontSize: 12 }} />
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })
              }
            </tbody>
          </table>

        </div>
      </div>
    </>
  );
};

export default VehicleStands;