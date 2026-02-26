import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import DataTable from '../../../components/tables/DataTable';
import api from '../../../config/axios';

import { FaPlus, FaSearch } from 'react-icons/fa';
import { FiEdit2, FiTrash2, FiAlertTriangle } from 'react-icons/fi';
import { HiOutlineBuildingOffice2 } from 'react-icons/hi2';
import { RiParkingBoxLine } from 'react-icons/ri';
import { MdOutlineCheckCircle, MdOutlineSpeed } from 'react-icons/md';
import { BsPeopleFill } from 'react-icons/bs';

// Currency symbol mapping
const CURRENCY_SYMBOLS = {
  'USD': '$',
  'EUR': '€',
  'GBP': '£',
  'INR': '₹',
  'JPY': '¥',
  'CAD': 'C$',
  'AUD': 'A$',
  'CHF': 'CHF',
  'CNY': '¥',
  'SGD': 'S$'
};

// ─── Design Tokens ─────────────────────────────────────────────────────────────
const C = {
  bg:          '#f1f5f9',
  card:        '#ffffff',
  border:      '#e2e8f0',
  text:        '#0f172a',
  sub:         '#475569',
  muted:       '#94a3b8',
  accent:      '#6366f1',
  accentLight: '#eef2ff',
  green:       '#10b981',
  greenLight:  '#d1fae5',
  amber:       '#f59e0b',
  amberLight:  '#fef3c7',
  red:         '#ef4444',
  redLight:    '#fee2e2',
  purple:      '#8b5cf6',
  purpleLight: '#ede9fe',
};

// ─── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, Icon, iconBg, iconColor, accentBar }) => (
  <div style={{
    background: C.card, border: `1px solid ${C.border}`, borderRadius: 14,
    padding: '20px', display: 'flex', flexDirection: 'column', gap: 14,
    boxShadow: '0 1px 3px rgba(15,23,42,0.06)',
    transition: 'box-shadow 0.18s, transform 0.18s', cursor: 'default',
    overflow: 'hidden', position: 'relative', fontFamily: 'Inter, sans-serif',
  }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(15,23,42,0.1)'; }}
    onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 1px 3px rgba(15,23,42,0.06)'; }}
  >
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: accentBar, borderRadius: '14px 14px 0 0' }} />
    <div style={{ width: 40, height: 40, borderRadius: 11, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Icon style={{ color: iconColor, fontSize: 17 }} />
    </div>
    <div>
      <p style={{ fontSize: 24, fontWeight: 700, color: C.text, letterSpacing: '-0.025em', margin: 0 }}>{value}</p>
      <p style={{ fontSize: 12.5, color: C.sub, marginTop: 3 }}>{label}</p>
    </div>
  </div>
);

// ─── Delete Confirm Modal ──────────────────────────────────────────────────────
const DeleteModal = ({ stand, onConfirm, onCancel, isPending }) => (
  <div style={{
    position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.45)', zIndex: 1000,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: 'Inter, sans-serif',
  }}>
    <div style={{
      background: C.card, borderRadius: 16, padding: '28px 28px 24px',
      width: 400, boxShadow: '0 24px 48px rgba(15,23,42,0.18)',
      border: `1px solid ${C.border}`,
    }}>
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 20 }}>
        <div style={{ width: 42, height: 42, borderRadius: 12, background: C.redLight, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <FiAlertTriangle style={{ color: C.red, fontSize: 20 }} />
        </div>
        <div>
          <p style={{ fontSize: 15, fontWeight: 700, color: C.text, margin: 0 }}>Delete Stand</p>
          <p style={{ fontSize: 13, color: C.sub, marginTop: 4, lineHeight: 1.5 }}>
            Are you sure you want to delete <strong>{stand?.name}</strong>? This action cannot be undone.
          </p>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button onClick={onCancel} style={{
          background: C.bg, border: `1px solid ${C.border}`, borderRadius: 9,
          padding: '8px 16px', fontSize: 13, fontWeight: 600, color: C.sub,
          cursor: 'pointer', fontFamily: 'Inter, sans-serif',
        }}>Cancel</button>
        <button onClick={onConfirm} disabled={isPending} style={{
          background: C.red, border: 'none', borderRadius: 9,
          padding: '8px 18px', fontSize: 13, fontWeight: 600, color: '#fff',
          cursor: isPending ? 'not-allowed' : 'pointer', opacity: isPending ? 0.7 : 1,
          fontFamily: 'Inter, sans-serif',
        }}>
          {isPending ? 'Deleting…' : 'Delete'}
        </button>
      </div>
    </div>
  </div>
);

// ─── Main Component ────────────────────────────────────────────────────────────
const VehicleStands = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleteTarget, setDeleteTarget] = useState(null); // { id, name }

  const { data: stands, isLoading, error } = useQuery({
    queryKey: ['superadmin-stands'],
    queryFn: async () => {
      const response = await api.get('/stands');
      return response.data.data.map(stand => ({
        id: stand._id,
        name: stand.name,
        location: stand.location,
        capacity: stand.capacity,
        hourlyRate: stand.hourlyRate,
        currency: stand.currency || 'USD',
        admin: stand.admin ? stand.admin.name : 'Unassigned',
        status: stand.isActive ? 'Active' : 'Inactive',
      }));
    },
    staleTime: 300000,
  });

  const deleteStandMutation = useMutation({
    mutationFn: async (standId) => {
      const response = await api.delete(`/stands/${standId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['superadmin-stands']);
      setDeleteTarget(null);
    },
    onError: (err) => {
      console.error('Error deleting stand:', err);
      setDeleteTarget(null);
    },
  });

  const totalCapacity = stands?.reduce((sum, s) => sum + s.capacity, 0) || 0;
  const activeCount   = stands?.filter(s => s.status === 'Active').length || 0;
  const avgRate       = stands?.length ? (stands.reduce((sum, s) => sum + s.hourlyRate, 0) / stands.length).toFixed(2) : '0.00';
  const primaryCurrency = stands?.length ? stands[0].currency : 'USD';

  const columns = [
    {
      key: 'name',
      label: 'Stand Name',
      render: (value, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: C.accentLight, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <RiParkingBoxLine style={{ color: C.accent, fontSize: 15 }} />
          </div>
          <div>
            <p style={{ fontSize: 13.5, fontWeight: 600, color: C.text, margin: 0 }}>{value}</p>
            <p style={{ fontSize: 11.5, color: C.muted, margin: 0 }}>{row.location}</p>
          </div>
        </div>
      ),
    },
    { key: 'location', label: 'Location' },
    {
      key: 'capacity',
      label: 'Capacity',
      render: (value) => (
        <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{value} <span style={{ color: C.muted, fontWeight: 400 }}>spots</span></span>
      ),
    },
    {
      key: 'hourlyRate',
      label: 'Rate',
      render: (value, row) => (
        <span style={{ fontSize: 13, fontWeight: 700, color: C.green }}>
          {CURRENCY_SYMBOLS[row.currency] || '$'}{value.toFixed(2)}
        </span>
      ),
    },
    {
      key: 'admin',
      label: 'Admin',
      render: (value) => (
        <span style={{
          fontSize: 12, fontWeight: 500,
          color: value === 'Unassigned' ? C.muted : C.text,
          background: value === 'Unassigned' ? C.bg : C.accentLight,
          padding: '3px 9px', borderRadius: 20,
        }}>{value}</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 20,
          background: value === 'Active' ? C.greenLight : C.redLight,
          color: value === 'Active' ? C.green : C.red,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: value === 'Active' ? C.green : C.red }} />
          {value}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            onClick={() => navigate(`/superadmin/stands/edit/${row.id}`)}
            title="Edit"
            style={{
              width: 32, height: 32, borderRadius: 8,
              background: C.accentLight, border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#ddd6fe'}
            onMouseLeave={e => e.currentTarget.style.background = C.accentLight}
          >
            <FiEdit2 style={{ color: C.accent, fontSize: 14 }} />
          </button>
          <button
            onClick={() => setDeleteTarget({ id: row.id, name: row.name })}
            title="Delete"
            style={{
              width: 32, height: 32, borderRadius: 8,
              background: C.redLight, border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#fecaca'}
            onMouseLeave={e => e.currentTarget.style.background = C.redLight}
          >
            <FiTrash2 style={{ color: C.red, fontSize: 14 }} />
          </button>
        </div>
      ),
    },
  ];

  if (isLoading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 260 }}>
      <div style={{ width: 36, height: 36, border: `3px solid ${C.accentLight}`, borderTopColor: C.accent, borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (error) return (
    <div style={{ background: C.redLight, border: `1px solid #fca5a5`, borderRadius: 12, padding: '14px 18px', color: C.red, fontSize: 14, fontFamily: 'Inter, sans-serif' }}>
      <strong>Error:</strong> {error.message}
    </div>
  );

  return (
    <div style={{ background: C.bg, minHeight: '100vh', padding: '28px 32px', fontFamily: 'Inter, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        input:focus { border-color: ${C.accent} !important; box-shadow: 0 0 0 3px ${C.accentLight} !important; outline: none; }
      `}</style>

      {/* Delete Modal */}
      {deleteTarget && (
        <DeleteModal
          stand={deleteTarget}
          onConfirm={() => deleteStandMutation.mutate(deleteTarget.id)}
          onCancel={() => setDeleteTarget(null)}
          isPending={deleteStandMutation.isPending}
        />
      )}

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: C.text, letterSpacing: '-0.025em', margin: 0 }}>Vehicle Stands</h1>
          <p style={{ fontSize: 13, color: C.sub, marginTop: 4 }}>Manage all parking stands across your network.</p>
        </div>
        <button
          onClick={() => navigate('/superadmin/stands/create')}
          style={{
            background: C.accent, color: '#fff', border: 'none', borderRadius: 10,
            padding: '9px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 7,
            boxShadow: '0 2px 8px rgba(99,102,241,0.38)', fontFamily: 'Inter, sans-serif',
          }}
        >
          <FaPlus size={11} /> Add Stand
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        <StatCard
          label="Total Stands" value={stands?.length || 0}
          Icon={HiOutlineBuildingOffice2} iconBg={C.accentLight} iconColor={C.accent}
          accentBar={`linear-gradient(90deg, ${C.accent}, #818cf8)`}
        />
        <StatCard
          label="Active Stands" value={activeCount}
          Icon={MdOutlineCheckCircle} iconBg={C.greenLight} iconColor={C.green}
          accentBar={`linear-gradient(90deg, ${C.green}, #34d399)`}
        />
        <StatCard
          label="Total Capacity" value={totalCapacity.toLocaleString()}
          Icon={BsPeopleFill} iconBg={C.amberLight} iconColor={C.amber}
          accentBar={`linear-gradient(90deg, ${C.amber}, #fbbf24)`}
        />
        <StatCard
          label="Avg. Hourly Rate" value={`${CURRENCY_SYMBOLS[primaryCurrency] || '$'}${avgRate}`}
          Icon={MdOutlineSpeed} iconBg={C.purpleLight} iconColor={C.purple}
          accentBar={`linear-gradient(90deg, ${C.purple}, #a78bfa)`}
        />
      </div>

      {/* ── Table Card ── */}
      <div style={{
        background: C.card, border: `1px solid ${C.border}`, borderRadius: 14,
        boxShadow: '0 1px 3px rgba(15,23,42,0.06)', overflow: 'hidden',
      }}>
        {/* Table Header Bar */}
        <div style={{
          padding: '16px 22px',
          borderBottom: `1px solid ${C.border}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: C.text, margin: 0 }}>All Stands</p>
            <p style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{stands?.length || 0} total records</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {/* Active/Inactive summary pills */}
            <span style={{ fontSize: 12, fontWeight: 600, background: C.greenLight, color: C.green, padding: '4px 11px', borderRadius: 20 }}>
              {activeCount} Active
            </span>
            <span style={{ fontSize: 12, fontWeight: 600, background: C.redLight, color: C.red, padding: '4px 11px', borderRadius: 20 }}>
              {(stands?.length || 0) - activeCount} Inactive
            </span>

          </div>
        </div>

        <div style={{ padding: '8px 0' }}>
          <DataTable
            columns={columns}
            data={stands || []}
            searchPlaceholder="Search stands by name, location…"
          />
        </div>
      </div>
    </div>
  );
};

export default VehicleStands;