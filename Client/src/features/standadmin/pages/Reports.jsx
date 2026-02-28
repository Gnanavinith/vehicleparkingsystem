import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getReports } from '../api';
import { FaCar, FaRupeeSign, FaClock, FaChartBar } from 'react-icons/fa';
import { FiDownload, FiCalendar, FiTrendingUp } from 'react-icons/fi';

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500;600&family=DM+Sans:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes fadeUp  { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
  @keyframes countUp { from { opacity: 0; transform: translateY(6px);  } to { opacity: 1; transform: none; } }
  @keyframes shimmer {
    0%   { background-position: -200% 0; }
    100% { background-position:  200% 0; }
  }

  .rep-wrap { font-family: 'DM Sans', sans-serif; animation: fadeUp .28s ease; }

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

  .stat-num {
    font-family: 'DM Serif Display', serif;
    font-size: 28px; letter-spacing: -0.03em;
    line-height: 1; color: #0a0a0a;
    animation: countUp .4s ease;
  }

  .shimmer {
    background: linear-gradient(90deg, #f5f5f5 25%, #ebebeb 50%, #f5f5f5 75%);
    background-size: 200% 100%;
    animation: shimmer 1.2s infinite;
    border-radius: 8px;
  }

  .row-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 11px 0;
    border-bottom: 1px solid #f5f5f5;
  }
  .row-item:last-child { border-bottom: none; }

  .export-btn {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 8px 16px;
    background: #fff; color: #0a0a0a;
    border: 1.5px solid #ebebeb; border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px; font-weight: 700;
    cursor: pointer; transition: all .14s;
  }
  .export-btn:hover {
    border-color: #0a0a0a; background: #fafafa;
    transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,.08);
  }

  .period-tab {
    padding: 6px 14px;
    border-radius: 8px;
    font-family: 'DM Mono', monospace;
    font-size: 10px; font-weight: 600;
    letter-spacing: .08em; text-transform: uppercase;
    border: none; cursor: pointer; transition: all .14s;
  }
  .period-tab.active  { background: #0a0a0a; color: #fff; }
  .period-tab.inactive { background: transparent; color: #aaa; }
  .period-tab.inactive:hover { background: #f5f5f5; color: #555; }
`;

const Shimmer = ({ h = 28, w = '60%' }) => (
  <div className="shimmer" style={{ height: h, width: w }} />
);

const StatRow = ({ label, value, valueColor = '#0a0a0a', isLoading }) => (
  <div className="row-item">
    <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#888', letterSpacing: '.04em' }}>
      {label}
    </span>
    {isLoading
      ? <Shimmer h={16} w={80} />
      : <span style={{ fontFamily: 'DM Serif Display, serif', fontSize: 17, color: valueColor }}>{value}</span>
    }
  </div>
);

const Reports = () => {
  const { data: reports, isLoading } = useQuery({
    queryKey: ['reports'],
    queryFn: getReports,
  });

  // Use API data if available, fallback to mock
  const daily   = reports?.daily   || { totalParkings: 42,   revenue: 1240,  avgDuration: '2.5 hrs' };
  const monthly = reports?.monthly || { totalParkings: 1240, revenue: 32560, occupancyRate: '78%'   };

  return (
    <>
      <style>{css}</style>
      <div className="rep-wrap" style={{ padding: '28px 32px', minHeight: '100vh', background: '#f7f7f7' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <span className="section-label">Analytics</span>
            <div style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 28, letterSpacing: '-0.02em',
              color: '#0a0a0a', lineHeight: 1, fontStyle: 'italic',
            }}>
              Reports
            </div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#aaa', marginTop: 4, letterSpacing: '.04em' }}>
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>
          <button className="export-btn">
            <FiDownload size={12} /> Export CSV
          </button>
        </div>

        {/* Top KPI strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
          {[
            { label: 'Today Parkings',  value: daily.totalParkings,         icon: FaCar,        color: '#1d4ed8' },
            { label: "Today's Revenue", value: `₹${daily.revenue.toLocaleString('en-IN')}`, icon: FaRupeeSign,  color: '#d97706' },
            { label: 'Avg Duration',    value: daily.avgDuration,           icon: FaClock,      color: '#0d9488' },
            { label: 'Monthly Revenue', value: `₹${monthly.revenue.toLocaleString('en-IN')}`, icon: FiTrendingUp, color: '#7c3aed' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="db-card" style={{ padding: '20px 22px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                <span className="section-label" style={{ marginBottom: 0 }}>{label}</span>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: `${color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={13} color={color} />
                </div>
              </div>
              {isLoading
                ? <Shimmer h={32} w="70%" />
                : <div className="stat-num">{value}</div>
              }
            </div>
          ))}
        </div>

        {/* Summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>

          {/* Daily Summary */}
          <div className="db-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FiCalendar size={14} color="#1d4ed8" />
                </div>
                <div>
                  <span className="section-label" style={{ marginBottom: 0 }}>Today</span>
                  <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 16, color: '#0a0a0a', fontStyle: 'italic' }}>
                    Daily Summary
                  </div>
                </div>
              </div>
              <span style={{
                fontFamily: 'DM Mono, monospace', fontSize: 9, fontWeight: 700,
                letterSpacing: '.10em', textTransform: 'uppercase',
                background: '#f0fdf4', color: '#059669',
                padding: '3px 9px', borderRadius: 20,
              }}>
                Live
              </span>
            </div>

            <StatRow label="Total Parkings"   value={daily.totalParkings}  isLoading={isLoading} />
            <StatRow label="Revenue Collected" value={`₹${daily.revenue.toLocaleString('en-IN')}`} valueColor="#059669" isLoading={isLoading} />
            <StatRow label="Average Duration"  value={daily.avgDuration}   isLoading={isLoading} />
          </div>

          {/* Monthly Summary */}
          <div className="db-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FaChartBar size={13} color="#d97706" />
                </div>
                <div>
                  <span className="section-label" style={{ marginBottom: 0 }}>
                    {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                  </span>
                  <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 16, color: '#0a0a0a', fontStyle: 'italic' }}>
                    Monthly Summary
                  </div>
                </div>
              </div>
              <span style={{
                fontFamily: 'DM Mono, monospace', fontSize: 9, fontWeight: 700,
                letterSpacing: '.10em', textTransform: 'uppercase',
                background: '#f5f5f5', color: '#888',
                padding: '3px 9px', borderRadius: 20,
              }}>
                MTD
              </span>
            </div>

            <StatRow label="Total Parkings"   value={monthly.totalParkings.toLocaleString('en-IN')} isLoading={isLoading} />
            <StatRow label="Revenue Collected" value={`₹${monthly.revenue.toLocaleString('en-IN')}`} valueColor="#059669" isLoading={isLoading} />
            <StatRow label="Occupancy Rate"    value={monthly.occupancyRate} isLoading={isLoading} />
          </div>
        </div>

      </div>
    </>
  );
};

export default Reports;