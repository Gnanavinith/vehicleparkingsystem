import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getStaff, getStaffStats, deleteStaff } from '../api';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaUsers } from 'react-icons/fa';
import { FiAlertTriangle } from 'react-icons/fi';

// ─── Global CSS ───────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500;600&family=DM+Sans:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes fadeUp  { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
  @keyframes countUp { from { opacity: 0; transform: translateY(6px);  } to { opacity: 1; transform: none; } }
  @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
  @keyframes spin    { to { transform: rotate(360deg); } }
  @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }

  .st-wrap { font-family: 'DM Sans', sans-serif; animation: fadeUp .28s ease; }

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
  .db-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,.06); }

  .kpi-num {
    font-family: 'DM Serif Display', serif;
    font-size: 32px; letter-spacing: -0.03em;
    line-height: 1; animation: countUp .4s ease;
  }

  .shimmer {
    background: linear-gradient(90deg, #f5f5f5 25%, #ebebeb 50%, #f5f5f5 75%);
    background-size: 200% 100%;
    animation: shimmer 1.2s infinite;
    border-radius: 6px;
  }

  .row-tr { transition: background .12s; }
  .row-tr:hover { background: #fafafa !important; }

  .search-input {
    width: 100%; padding: 9px 12px 9px 34px;
    background: #fafafa; border: 1.5px solid #ebebeb;
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif; font-size: 13px; color: #0a0a0a;
    outline: none; transition: all .15s;
  }
  .search-input:focus { border-color: #0a0a0a; background: #fff; box-shadow: 0 0 0 3px #f5f5f5; }

  .filter-btn {
    padding: 7px 14px; border-radius: 8px; border: none;
    font-family: 'DM Mono', monospace; font-size: 9.5px; font-weight: 700;
    letter-spacing: .10em; text-transform: uppercase;
    cursor: pointer; transition: all .14s;
  }
  .filter-btn.active   { background: #0a0a0a; color: #fff; }
  .filter-btn.inactive { background: transparent; color: #aaa; }
  .filter-btn.inactive:hover { background: #f5f5f5; color: #555; }

  .icon-btn {
    width: 30px; height: 30px; border-radius: 8px; border: none;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all .14s;
  }
  .icon-btn:hover { transform: scale(1.08); }

  .create-btn {
    display: flex; align-items: center; gap: 8px;
    padding: 10px 18px; background: #0a0a0a; color: #fff;
    border: none; border-radius: 10px;
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 700;
    cursor: pointer; transition: all .14s;
  }
  .create-btn:hover { background: #222; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,.18); }

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
  .delete-confirm-btn:hover:not(:disabled) { background: #b91c1c; transform: translateY(-1px); }
  .delete-confirm-btn:disabled { background: #d4d4d4; cursor: not-allowed; }

  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-thumb { background: #ebebeb; border-radius: 2px; }
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const AVATAR_COLORS = [
  { bg: '#eff6ff', text: '#1d4ed8' },
  { bg: '#fdf4ff', text: '#7c3aed' },
  { bg: '#f0fdfa', text: '#0d9488' },
  { bg: '#fffbeb', text: '#d97706' },
  { bg: '#fef2f2', text: '#dc2626' },
];

const getInitials = (name = '') =>
  name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

// ─── Sub-components ───────────────────────────────────────────────────────────
const Shimmer = ({ h = 12, w = 120 }) => (
  <div className="shimmer" style={{ height: h, width: w }} />
);

const Avatar = ({ name, index }) => {
  const { bg, text } = AVATAR_COLORS[index % AVATAR_COLORS.length];
  return (
    <div style={{
      width: 34, height: 34, borderRadius: 9, flexShrink: 0,
      background: bg, color: text,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'DM Mono, monospace', fontSize: 11, fontWeight: 700,
      letterSpacing: '.04em',
    }}>
      {getInitials(name)}
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const active = status === 'active';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 9px', borderRadius: 20,
      fontFamily: 'DM Mono, monospace', fontSize: 10, fontWeight: 700,
      letterSpacing: '.06em', textTransform: 'uppercase',
      background: active ? '#f0fdf4' : '#f5f5f5',
      color: active ? '#059669' : '#aaa',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: active ? '#22c55e' : '#d1d5db' }} />
      {active ? 'Active' : 'Inactive'}
    </span>
  );
};

const RoleBadge = ({ role }) => (
  <span style={{
    fontFamily: 'DM Mono, monospace', fontSize: 10, fontWeight: 600,
    letterSpacing: '.06em', textTransform: 'capitalize',
    background: '#f5f5f5', color: '#555',
    padding: '3px 9px', borderRadius: 6,
  }}>
    {role}
  </span>
);

const SkeletonRow = () => (
  <tr>
    <td style={{ padding: '14px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div className="shimmer" style={{ width: 34, height: 34, borderRadius: 9 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Shimmer h={12} w={120} />
          <Shimmer h={10} w={160} />
        </div>
      </div>
    </td>
    {[60, 160, 80, 70].map((w, i) => (
      <td key={i} style={{ padding: '14px 20px' }}><Shimmer h={12} w={w} /></td>
    ))}
  </tr>
);

const Spinner = ({ color = '#fff', size = 14 }) => (
  <div style={{
    width: size, height: size,
    border: `2px solid ${color}33`, borderTopColor: color,
    borderRadius: '50%', animation: 'spin .6s linear infinite', flexShrink: 0,
  }} />
);

// ─── Delete Modal ─────────────────────────────────────────────────────────────
const DeleteModal = ({ staff, onConfirm, onCancel, isPending }) => (
  <div style={{
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000, animation: 'fadeIn .15s ease',
  }}>
    <div className="db-card" style={{ padding: '32px', maxWidth: 400, width: '90%' }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{
          width: 48, height: 48, borderRadius: '50%',
          background: '#fef2f2',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px',
        }}>
          <FiAlertTriangle size={20} color="#dc2626" />
        </div>
        <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 20, fontStyle: 'italic', color: '#0a0a0a', marginBottom: 8 }}>
          Delete Staff Member
        </div>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#888', lineHeight: 1.7 }}>
          Are you sure you want to delete{' '}
          <span style={{ color: '#0a0a0a', fontWeight: 600 }}>{staff.name}</span>?
          <br />This action cannot be undone.
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button className="cancel-btn" onClick={onCancel}>Cancel</button>
        <button
          className="delete-confirm-btn"
          onClick={() => onConfirm(staff._id)}
          disabled={isPending}
        >
          {isPending ? <><Spinner /> Deleting…</> : <><FaTrash size={11} /> Delete</>}
        </button>
      </div>
    </div>
  </div>
);

// ─── Main Component ────────────────────────────────────────────────────────────
const Staff = () => {
  const navigate    = useNavigate();
  const queryClient = useQueryClient();

  const [search, setSearch]               = useState('');
  const [filter, setFilter]               = useState('all');
  const [deletingStaff, setDeletingStaff] = useState(null);

  const { data: staff = [], isLoading } = useQuery({ queryKey: ['staff'],       queryFn: getStaff      });
  const { data: stats = {} }            = useQuery({ queryKey: ['staff-stats'], queryFn: getStaffStats });

  const deleteMutation = useMutation({
    mutationFn: deleteStaff,
    onSuccess: () => {
      queryClient.invalidateQueries(['staff']);
      queryClient.invalidateQueries(['staff-stats']);
      setDeletingStaff(null);
    },
  });

  const filtered = staff.filter(s => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || s.status === filter;
    return matchSearch && matchFilter;
  });

  const kpis = [
    { label: 'Total Staff', value: stats.total    ?? staff.length,                               color: '#1d4ed8' },
    { label: 'Active',      value: stats.active   ?? staff.filter(s => s.status === 'active').length,   color: '#059669' },
    { label: 'Inactive',    value: stats.inactive ?? staff.filter(s => s.status !== 'active').length,  color: '#d97706' },
  ];

  return (
    <>
      <style>{css}</style>
      <div className="st-wrap" style={{ padding: '28px 32px', minHeight: '100vh', background: '#f7f7f7' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <span className="section-label">Management</span>
            <div style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 28, letterSpacing: '-0.02em',
              color: '#0a0a0a', lineHeight: 1, fontStyle: 'italic',
            }}>
              Staff
            </div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#aaa', marginTop: 4, letterSpacing: '.04em' }}>
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>
          <button className="create-btn" onClick={() => navigate('/standadmin/create-staff')}>
            <FaPlus size={11} /> Create Staff
          </button>
        </div>

        {/* KPI strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
          {kpis.map(({ label, value, color }) => (
            <div key={label} className="db-card" style={{ padding: '20px 22px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                <span className="section-label" style={{ marginBottom: 0 }}>{label}</span>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: `${color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FaUsers size={12} color={color} />
                </div>
              </div>
              {isLoading
                ? <Shimmer h={32} w={60} />
                : <div className="kpi-num" style={{ color: '#0a0a0a' }}>{value}</div>
              }
            </div>
          ))}
        </div>

        {/* Table card */}
        <div className="db-card" style={{ overflow: 'hidden' }}>

          {/* Toolbar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 20px', borderBottom: '1px solid #f5f5f5' }}>
            <div style={{ position: 'relative', flex: 1, maxWidth: 280 }}>
              <FaSearch style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#bbb', fontSize: 12, pointerEvents: 'none' }} />
              <input
                className="search-input"
                type="text"
                placeholder="Search staff…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', gap: 6, marginLeft: 'auto' }}>
              {['all', 'active', 'inactive'].map(f => (
                <button
                  key={f}
                  className={`filter-btn ${filter === f ? 'active' : 'inactive'}`}
                  onClick={() => setFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#fafafa' }}>
                  {['Staff Member', 'Role', 'Contact', 'Status', ''].map((h, i) => (
                    <th key={i} style={{
                      padding: '10px 20px', textAlign: 'left',
                      fontFamily: 'DM Mono, monospace', fontSize: 9, fontWeight: 700,
                      color: '#bbb', letterSpacing: '.14em', textTransform: 'uppercase',
                      borderBottom: '1px solid #f5f5f5',
                      ...(i === 4 ? { width: 80 } : {}),
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '56px', textAlign: 'center' }}>
                      <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#ccc' }}>
                        No staff found
                      </div>
                    </td>
                  </tr>
                ) : filtered.map((member, idx) => (
                  <tr
                    key={member._id || idx}
                    className="row-tr"
                    style={{ borderBottom: idx < filtered.length - 1 ? '1px solid #f9f9f9' : 'none' }}
                  >
                    {/* Name */}
                    <td style={{ padding: '13px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Avatar name={member.name} index={idx} />
                        <div>
                          <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 700, color: '#0a0a0a' }}>
                            {member.name}
                          </div>
                          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: '#aaa', marginTop: 1 }}>
                            {member.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td style={{ padding: '13px 20px' }}>
                      <RoleBadge role={member.role} />
                    </td>

                    {/* Contact */}
                    <td style={{ padding: '13px 20px' }}>
                      <div style={{ fontFamily: 'DM Sans, monospace', fontSize: 12.5, color: '#555' }}>{member.email}</div>
                      <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#bbb', marginTop: 2 }}>{member.phone}</div>
                    </td>

                    {/* Status */}
                    <td style={{ padding: '13px 20px' }}>
                      <StatusBadge status={member.status} />
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '13px 20px' }}>
                      <div style={{ display: 'flex', gap: 7 }}>
                        <button
                          className="icon-btn"
                          style={{ background: '#f5f5f5' }}
                          onClick={() => navigate(`/standadmin/staff/edit/${member._id}`)}
                          title="Edit"
                          onMouseEnter={e => e.currentTarget.style.background = '#ebebeb'}
                          onMouseLeave={e => e.currentTarget.style.background = '#f5f5f5'}
                        >
                          <FaEdit size={11} color="#555" />
                        </button>
                        <button
                          className="icon-btn"
                          style={{ background: '#fef2f2' }}
                          onClick={() => setDeletingStaff(member)}
                          title="Delete"
                          onMouseEnter={e => e.currentTarget.style.background = '#fecaca'}
                          onMouseLeave={e => e.currentTarget.style.background = '#fef2f2'}
                        >
                          <FaTrash size={11} color="#dc2626" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div style={{
            padding: '12px 20px', borderTop: '1px solid #f5f5f5',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: '#bbb', letterSpacing: '.04em' }}>
              Showing {filtered.length} of {staff.length} members
            </span>
            <div style={{ display: 'flex', gap: 4 }}>
              {['←', '→'].map((arrow, i) => (
                <button key={i} style={{
                  width: 28, height: 28,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '1px solid #ebebeb', borderRadius: 7,
                  background: '#fff', cursor: 'pointer',
                  fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#aaa',
                  transition: 'all .14s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#0a0a0a'; e.currentTarget.style.color = '#0a0a0a'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#ebebeb'; e.currentTarget.style.color = '#aaa'; }}
                >
                  {arrow}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {deletingStaff && (
        <DeleteModal
          staff={deletingStaff}
          onConfirm={id => deleteMutation.mutate(id)}
          onCancel={() => setDeletingStaff(null)}
          isPending={deleteMutation.isPending}
        />
      )}
    </>
  );
};

export default Staff;