import React from 'react';
import { useQuery } from '@tanstack/react-query';
import DataTable from '@/components/tables/DataTable';
import { getParkings } from '../api';

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500;600&family=DM+Sans:wght@400;500;600;700&display=swap');

  @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }

  .parkings-wrap { font-family: 'DM Sans', sans-serif; animation: fadeUp .28s ease; }

  .section-label {
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    font-weight: 600;
    letter-spacing: .14em;
    text-transform: uppercase;
    color: #aaa;
    display: block;
    margin-bottom: 6px;
  }

  .status-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: .06em;
    text-transform: uppercase;
    padding: 3px 9px;
    border-radius: 20px;
  }

  .status-active   { background: #f0fdf4; color: #059669; }
  .status-inactive { background: #f5f5f5; color: #888; }
`;

const StatusDot = ({ active }) => (
  <span style={{
    width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
    background: active ? '#22c55e' : '#d1d5db',
    display: 'inline-block',
  }} />
);

const Parkings = () => {
  const { data: parkings, isLoading } = useQuery({
    queryKey: ['parkings'],
    queryFn: getParkings,
  });

  const columns = [
    {
      key: 'vehicleNumber',
      label: 'Vehicle Number',
      render: (val) => (
        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 12.5, fontWeight: 600, color: '#0a0a0a' }}>
          {val}
        </span>
      ),
    },
    {
      key: 'entryTime',
      label: 'Entry Time',
      render: (val) => (
        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, color: '#555' }}>
          {val}
        </span>
      ),
    },
    {
      key: 'duration',
      label: 'Duration',
      render: (val) => (
        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, color: '#555' }}>
          {isNaN(val) ? '0h' : val}
        </span>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (val) => (
        <span style={{ fontFamily: 'DM Serif Display, serif', fontSize: 15, color: '#0a0a0a' }}>
          ₹{isNaN(val) ? '0' : val}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (status) => {
        const active = status === 'active';
        return (
          <span className={`status-badge ${active ? 'status-active' : 'status-inactive'}`}>
            <StatusDot active={active} />
            {status}
          </span>
        );
      },
    },
  ];

  return (
    <>
      <style>{css}</style>
      <div className="parkings-wrap" style={{ padding: '28px 32px', minHeight: '100vh', background: '#f7f7f7' }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <span className="section-label">Records</span>
          <div style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 28, letterSpacing: '-0.02em',
            color: '#0a0a0a', lineHeight: 1, fontStyle: 'italic',
          }}>
            Parking Records
          </div>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#aaa', marginTop: 4, letterSpacing: '.04em' }}>
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>

        {/* Table Card */}
        <div style={{
          background: '#fff',
          borderRadius: 16,
          border: '1px solid #ebebeb',
          overflow: 'hidden',
        }}>
          <DataTable
            columns={columns}
            data={parkings || []}
            loading={isLoading}
          />
        </div>

      </div>
    </>
  );
};

export default Parkings;