import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getStaff, getStaffStats, deleteStaff } from '../api';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
  bg: '#f8f9fb',
  card: '#ffffff',
  border: '#e5e7eb',
  borderLight: '#f0f0f0',
  text: '#0f172a',
  sub: '#6b7280',
  muted: '#9ca3af',
  accent: '#0f172a',
  accentLight: '#f3f4f6',
  red: '#ef4444',
  redLight: '#fee2e2',
  green: '#16a34a',
  greenLight: '#f0fdf4',
};

const AVATAR_BG   = ['#e0f2fe', '#fce7f3', '#d1fae5', '#fef3c7', '#ede9fe'];
const AVATAR_TEXT = ['#0369a1', '#9d174d', '#065f46', '#92400e', '#5b21b6'];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getInitials = (name = '') =>
  name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

// ─── Sub-components ───────────────────────────────────────────────────────────
const Avatar = ({ initials, index }) => (
  <div style={{
    width: '34px', height: '34px', borderRadius: '10px', flexShrink: 0,
    background: AVATAR_BG[index % AVATAR_BG.length],
    color: AVATAR_TEXT[index % AVATAR_TEXT.length],
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '12px', fontWeight: '600', letterSpacing: '0.02em',
  }}>
    {initials}
  </div>
);

const StatusBadge = ({ status }) => {
  const active = status === 'active';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      padding: '3px 10px', borderRadius: '20px',
      fontSize: '12px', fontWeight: '500', letterSpacing: '0.01em',
      background: active ? C.greenLight : '#fafafa',
      color: active ? C.green : C.muted,
      border: `1px solid ${active ? '#bbf7d0' : C.border}`,
    }}>
      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: active ? '#22c55e' : '#d1d5db' }} />
      {active ? 'Active' : 'Inactive'}
    </span>
  );
};

const IconBtn = ({ onClick, title, bg, hoverBg, icon: Icon, iconColor }) => (
  <button
    onClick={onClick}
    title={title}
    style={{ width: '32px', height: '32px', borderRadius: '8px', background: bg, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}
    onMouseEnter={e => { e.currentTarget.style.background = hoverBg; e.currentTarget.style.transform = 'scale(1.05)'; }}
    onMouseLeave={e => { e.currentTarget.style.background = bg; e.currentTarget.style.transform = 'scale(1)'; }}
  >
    <Icon size={13} style={{ color: iconColor }} />
  </button>
);

const Spinner = () => (
  <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 0.8s linear infinite', flexShrink: 0 }} />
);

const SkeletonRow = () => (
  <tr>
    {[200, 90, 170, 80, 70].map((w, i) => (
      <td key={i} style={{ padding: '14px 20px' }}>
        <div style={{ height: '12px', background: C.accentLight, borderRadius: '4px', width: w, animation: 'pulse 1.5s ease-in-out infinite' }} />
      </td>
    ))}
  </tr>
);

// ─── Delete Modal ─────────────────────────────────────────────────────────────
const DeleteModal = ({ staff, onConfirm, onCancel, isPending }) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
    <div style={{ background: C.card, borderRadius: '16px', padding: '32px', maxWidth: '400px', width: '90%', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: C.redLight, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <FaTrash size={20} style={{ color: C.red }} />
        </div>
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: C.text, marginBottom: '8px' }}>Delete Staff Member</h3>
        <p style={{ fontSize: '14px', color: C.sub, lineHeight: 1.6 }}>
          Are you sure you want to delete <strong>{staff.name}</strong>? This action cannot be undone.
        </p>
      </div>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
        <button
          onClick={onCancel}
          style={{ padding: '10px 20px', borderRadius: '8px', border: `1px solid ${C.border}`, background: C.card, color: C.sub, fontSize: '14px', fontWeight: '500', cursor: 'pointer', transition: 'background 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
          onMouseLeave={e => e.currentTarget.style.background = C.card}
        >
          Cancel
        </button>
        <button
          onClick={() => onConfirm(staff._id)}
          disabled={isPending}
          style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: C.red, color: 'white', fontSize: '14px', fontWeight: '500', cursor: isPending ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px', opacity: isPending ? 0.7 : 1, transition: 'background 0.15s' }}
          onMouseEnter={e => !isPending && (e.currentTarget.style.background = '#dc2626')}
          onMouseLeave={e => (e.currentTarget.style.background = C.red)}
        >
          {isPending ? <><Spinner /> Deleting...</> : <><FaTrash size={13} /> Delete</>}
        </button>
      </div>
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const Staff = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [search, setSearch]               = useState('');
  const [filter, setFilter]               = useState('all');
  const [deletingStaff, setDeletingStaff] = useState(null);

  const { data: staff = [], isLoading } = useQuery({
    queryKey: ['staff'],
    queryFn: getStaff,
  });

  const { data: stats = {} } = useQuery({
    queryKey: ['staff-stats'],
    queryFn: getStaffStats,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteStaff,
    onSuccess: () => {
      queryClient.invalidateQueries(['staff']);
      queryClient.invalidateQueries(['staff-stats']);
      setDeletingStaff(null);
    },
    onError: () => alert('Failed to delete staff member'),
  });

  const filtered = staff.filter(s => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || s.status === filter;
    return matchSearch && matchFilter;
  });

  const statsData = [
    { label: 'Total Staff', value: stats.total    ?? staff.length },
    { label: 'Active',      value: stats.active   ?? staff.filter(s => s.status === 'active').length },
    { label: 'Inactive',    value: stats.inactive ?? staff.filter(s => s.status !== 'active').length },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Geist', -apple-system, sans-serif; }
        .row-hover { transition: background 0.12s; }
        .row-hover:hover { background: #fafafa !important; }
        .btn-create { transition: all 0.15s; }
        .btn-create:hover { background: #111827 !important; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important; }
        .search-input:focus { outline: none; border-color: #374151 !important; box-shadow: 0 0 0 3px rgba(55,65,81,0.06) !important; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 2px; }
        @keyframes spin  { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:.45; } }
      `}</style>

      <div style={{ minHeight: '100vh', background: C.bg, padding: '32px', fontFamily: "'Geist', -apple-system, sans-serif" }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
            <div>
              <p style={{ fontSize: '12px', color: C.muted, letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: '500', marginBottom: '4px' }}>Stand Admin</p>
              <h1 style={{ fontSize: '26px', fontWeight: '600', color: C.text, letterSpacing: '-0.02em' }}>Staff Management</h1>
            </div>
            <button
              className="btn-create"
              onClick={() => navigate('/standadmin/create-staff')}
              style={{ display: 'flex', alignItems: 'center', gap: '7px', background: C.accent, color: 'white', border: 'none', borderRadius: '10px', padding: '10px 18px', fontSize: '13.5px', fontWeight: '500', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}
            >
              <FaPlus size={13} /> Create Staff
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
            {statsData.map((s, i) => (
              <div key={i} style={{ background: C.card, borderRadius: '12px', padding: '16px 24px', border: `1px solid ${C.borderLight}`, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <p style={{ fontSize: '11px', color: C.muted, letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: '500', marginBottom: '6px' }}>{s.label}</p>
                <p style={{ fontSize: '24px', fontWeight: '600', color: C.text, letterSpacing: '-0.03em', lineHeight: 1 }}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Table Card */}
          <div style={{ background: C.card, borderRadius: '14px', border: '1px solid #ebebeb', boxShadow: '0 1px 4px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)', overflow: 'hidden' }}>

            {/* Toolbar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '16px 20px', borderBottom: `1px solid ${C.accentLight}` }}>
              <div style={{ position: 'relative', flex: 1, maxWidth: '280px' }}>
                <span style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: C.muted, fontSize: '14px' }}>⌕</span>
                <input
                  className="search-input"
                  type="text"
                  placeholder="Search staff..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px 8px 30px', border: `1px solid ${C.border}`, borderRadius: '8px', fontSize: '13px', color: C.sub, background: '#fafafa', transition: 'border 0.15s, box-shadow 0.15s' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '6px', marginLeft: 'auto' }}>
                {['all', 'active', 'inactive'].map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    style={{ padding: '6px 13px', borderRadius: '7px', fontSize: '12.5px', fontWeight: '500', cursor: 'pointer', border: 'none', background: filter === f ? C.accent : 'transparent', color: filter === f ? 'white' : C.sub, transition: 'all 0.15s' }}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
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
                      <th key={i} style={{ padding: '10px 20px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: C.muted, letterSpacing: '0.05em', textTransform: 'uppercase', borderBottom: `1px solid ${C.borderLight}`, whiteSpace: 'nowrap', ...(i === 4 ? { width: '90px' } : {}) }}>
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
                        <p style={{ color: C.muted, fontSize: '14px' }}>No staff found</p>
                      </td>
                    </tr>
                  ) : filtered.map((member, idx) => (
                    <tr key={member._id || member.id} className="row-hover" style={{ borderBottom: idx < filtered.length - 1 ? '1px solid #f8f8f8' : 'none' }}>
                      <td style={{ padding: '13px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
                          <Avatar initials={member.avatar || getInitials(member.name)} index={idx} />
                          <div>
                            <p style={{ fontSize: '13.5px', fontWeight: '500', color: '#111827', letterSpacing: '-0.01em' }}>{member.name}</p>
                            <p style={{ fontSize: '12px', color: C.muted, marginTop: '1px' }}>
                              {member.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '13px 20px' }}>
                        <span style={{ fontSize: '12.5px', fontWeight: '500', color: C.sub, background: C.accentLight, padding: '3px 9px', borderRadius: '5px' }}>{member.role}</span>
                      </td>
                      <td style={{ padding: '13px 20px' }}>
                        <p style={{ fontSize: '13px', color: '#374151' }}>{member.email}</p>
                        <p style={{ fontSize: '12px', color: C.muted, marginTop: '1px', fontFamily: "'Geist Mono', monospace" }}>{member.phone}</p>
                      </td>
                      <td style={{ padding: '13px 20px' }}>
                        <StatusBadge status={member.status} />
                      </td>
                      <td style={{ padding: '13px 20px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <IconBtn
                            onClick={() => navigate(`/standadmin/staff/edit/${member._id}`)}
                            title="Edit Staff"
                            bg={C.accentLight} hoverBg={C.border}
                            icon={FaEdit} iconColor={C.sub}
                          />
                          <IconBtn
                            onClick={() => setDeletingStaff(member)}
                            title="Delete Staff"
                            bg={C.redLight} hoverBg="#fecaca"
                            icon={FaTrash} iconColor={C.red}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div style={{ padding: '12px 20px', borderTop: `1px solid ${C.accentLight}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <p style={{ fontSize: '12px', color: C.muted }}>Showing {filtered.length} of {staff.length} members</p>
              <div style={{ display: 'flex', gap: '4px' }}>
                {['←', '→'].map((arrow, i) => (
                  <button key={i} style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${C.border}`, borderRadius: '6px', background: C.card, cursor: 'pointer', fontSize: '12px', color: C.sub }}>
                    {arrow}
                  </button>
                ))}
              </div>
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