import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, Legend,
  ResponsiveContainer,
} from 'recharts';
import { FiDownload, FiTrendingUp, FiTrendingDown, FiCalendar } from 'react-icons/fi';
import { FaMoneyBillWave } from 'react-icons/fa';
import { MdOutlineStorefront, MdOutlineShowChart } from 'react-icons/md';
import { RiParkingBoxLine } from 'react-icons/ri';

// ─── Mock API ──────────────────────────────────────────────────────────────────
const superAdminApi = {
  getGlobalReports: async () => ({
    totalRevenue: 45678.90,
    monthGrowth: 8.78,
    dailyRevenue: [
      { date: '02-19', revenue: 1250.75 },
      { date: '02-20', revenue: 1320.50 },
      { date: '02-21', revenue: 1180.25 },
      { date: '02-22', revenue: 1450.80 },
      { date: '02-23', revenue: 1380.60 },
      { date: '02-24', revenue: 1520.90 },
      { date: '02-25', revenue: 1610.40 },
    ],
    standWiseRevenue: [
      { stand: 'Main Street',       revenue: 12500.75 },
      { stand: 'Downtown Mall',     revenue: 9800.50  },
      { stand: 'Airport Terminal',  revenue: 8200.25  },
      { stand: 'City Center',       revenue: 7650.80  },
      { stand: 'Shopping District', revenue: 7526.60  },
    ],
    monthlyComparison: [
      { month: 'Sep', revenue: 36000 },
      { month: 'Oct', revenue: 39500 },
      { month: 'Nov', revenue: 37200 },
      { month: 'Dec', revenue: 41800 },
      { month: 'Jan', revenue: 42000 },
      { month: 'Feb', revenue: 45679 },
    ],
    hourlyPeak: [
      { hour: '6am',  vehicles: 18  },
      { hour: '8am',  vehicles: 72  },
      { hour: '10am', vehicles: 95  },
      { hour: '12pm', vehicles: 110 },
      { hour: '2pm',  vehicles: 98  },
      { hour: '4pm',  vehicles: 130 },
      { hour: '6pm',  vehicles: 115 },
      { hour: '8pm',  vehicles: 60  },
      { hour: '10pm', vehicles: 28  },
    ],
  }),
};

// ─── Bar colors ────────────────────────────────────────────────────────────────
const BAR_COLORS = ['#0a0a0a', '#1d4ed8', '#0d9488', '#d97706', '#7c3aed'];

// ─── Global CSS ────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500;600&family=DM+Sans:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes fadeUp  { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
  @keyframes countUp { from { opacity: 0; transform: translateY(6px);  } to { opacity: 1; transform: none; } }
  @keyframes spin    { to { transform: rotate(360deg); } }
  @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }

  .rep-wrap { font-family: 'DM Sans', sans-serif; animation: fadeUp .28s ease; }

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

  .kpi-num {
    font-family: 'DM Serif Display', serif;
    font-size: 30px; letter-spacing: -0.03em;
    line-height: 1; animation: countUp .4s ease;
  }

  .chart-tooltip {
    background: #0a0a0a; border: none; border-radius: 8px;
    padding: 8px 12px; font-family: 'DM Mono', monospace;
    font-size: 11px; color: #fff; min-width: 130px;
  }

  .export-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 9px 16px; background: #0a0a0a; color: #fff;
    border: none; border-radius: 10px;
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 700;
    cursor: pointer; transition: all .14s;
  }
  .export-btn:hover { background: #222; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,.18); }

  .period-select {
    appearance: none;
    background: #fff;
    border: 1.5px solid #ebebeb; border-radius: 10px;
    padding: 8px 32px 8px 32px;
    font-family: 'DM Mono', monospace; font-size: 11px; font-weight: 600;
    color: #0a0a0a; letter-spacing: .06em;
    cursor: pointer; transition: all .15s; outline: none;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23aaa' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
    background-position: right 10px center;
    background-repeat: no-repeat; background-size: 14px;
  }
  .period-select:focus { border-color: #0a0a0a; box-shadow: 0 0 0 3px #f5f5f5; }

  .trend-badge {
    display: inline-flex; align-items: center; gap: 4px;
    font-size: 10px; font-weight: 600;
    font-family: 'DM Mono', monospace;
    padding: 2px 7px; border-radius: 20px;
  }

  .bar-track {
    flex: 1; height: 6px; background: #f5f5f5;
    border-radius: 99px; overflow: hidden;
  }
  .bar-fill {
    height: 100%; border-radius: 99px;
    transition: width .6s ease;
  }
`;

// ─── Custom Tooltip ────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label, prefix = '' }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      {label && <div style={{ color: '#888', marginBottom: 4 }}>{label}</div>}
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || '#fff' }}>
          {p.name}: {prefix}{typeof p.value === 'number' && p.value > 999 ? p.value.toLocaleString() : p.value}
        </div>
      ))}
    </div>
  );
};

// ─── Spinner ───────────────────────────────────────────────────────────────────
const Spinner = ({ color = '#0a0a0a', size = 32 }) => (
  <div style={{
    width: size, height: size,
    border: `3px solid ${color}22`, borderTopColor: color,
    borderRadius: '50%', animation: 'spin .7s linear infinite',
  }} />
);

// ─── KPI Card ─────────────────────────────────────────────────────────────────
const KPI = ({ label, value, icon: Icon, color, trend, sub }) => (
  <div className="db-card" style={{ padding: '20px 22px' }}>
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
      <span className="section-label" style={{ marginBottom: 0 }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        {trend !== undefined && (
          <span className="trend-badge" style={{
            color: trend >= 0 ? '#059669' : '#dc2626',
            background: trend >= 0 ? '#f0fdf4' : '#fef2f2',
          }}>
            {trend >= 0 ? <FiTrendingUp size={10} /> : <FiTrendingDown size={10} />}
            {Math.abs(trend)}%
          </span>
        )}
        <div style={{ width: 32, height: 32, borderRadius: 9, background: `${color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon style={{ color, fontSize: 14 }} />
        </div>
      </div>
    </div>
    <div className="kpi-num" style={{ color: '#0a0a0a' }}>{value}</div>
    {sub && <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: '#bbb', marginTop: 6 }}>{sub}</div>}
  </div>
);

// ─── Chart Card ───────────────────────────────────────────────────────────────
const ChartCard = ({ title, badge, badgeColor = 'default', children, style = {} }) => {
  const badges = {
    green:  { bg: '#f0fdf4', color: '#059669' },
    amber:  { bg: '#fffbeb', color: '#d97706' },
    teal:   { bg: '#f0fdfa', color: '#0d9488' },
    default:{ bg: '#f5f5f5', color: '#555' },
  };
  const bs = badges[badgeColor] || badges.default;
  return (
    <div className="db-card" style={{ padding: '22px 24px', ...style }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <span className="section-label" style={{ marginBottom: 0 }}>{title}</span>
        {badge && (
          <span style={{
            fontFamily: 'DM Mono, monospace', fontSize: 9, fontWeight: 700,
            letterSpacing: '.10em', textTransform: 'uppercase',
            background: bs.bg, color: bs.color,
            padding: '3px 9px', borderRadius: 20,
          }}>{badge}</span>
        )}
      </div>
      {children}
    </div>
  );
};

// ─── Stand Bar Row ─────────────────────────────────────────────────────────────
const StandBarRow = ({ stand, revenue, maxRevenue, color, rank, isLast }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '10px 0',
    borderBottom: isLast ? 'none' : '1px solid #f5f5f5',
  }}>
    <span style={{
      width: 20, height: 20, borderRadius: 6,
      background: `${color}18`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'DM Mono, monospace', fontSize: 9, fontWeight: 700, color,
      flexShrink: 0,
    }}>
      #{rank}
    </span>
    <span style={{
      fontFamily: 'DM Sans, sans-serif', fontSize: 12.5, fontWeight: 600,
      color: '#0a0a0a', width: 130, flexShrink: 0,
      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
    }}>
      {stand}
    </span>
    <div className="bar-track">
      <div className="bar-fill" style={{ width: `${(revenue / maxRevenue) * 100}%`, background: color }} />
    </div>
    <span style={{
      fontFamily: 'DM Serif Display, serif', fontSize: 15, color: '#0a0a0a',
      width: 80, textAlign: 'right', flexShrink: 0,
    }}>
      ₹{revenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
    </span>
  </div>
);

// ─── Main Component ────────────────────────────────────────────────────────────
const Reports = () => {
  const [dateRange, setDateRange] = useState('month');

  const { data: reports, isLoading, error } = useQuery({
    queryKey: ['superadmin-reports', dateRange],
    queryFn: superAdminApi.getGlobalReports,
    staleTime: 300000,
  });

  const avgDailyRev = reports?.dailyRevenue?.length
    ? reports.dailyRevenue.reduce((s, d) => s + d.revenue, 0) / reports.dailyRevenue.length
    : 0;
  const topStand    = reports?.standWiseRevenue?.[0];
  const maxStandRev = Math.max(...(reports?.standWiseRevenue || [{ revenue: 1 }]).map(s => s.revenue));

  if (isLoading) return (
    <>
      <style>{css}</style>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 260 }}>
        <Spinner />
      </div>
    </>
  );

  if (error) return (
    <>
      <style>{css}</style>
      <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 12, padding: '14px 18px', color: '#dc2626', fontSize: 13, fontFamily: 'DM Mono, monospace' }}>
        <strong>Error:</strong> {error.message}
      </div>
    </>
  );

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
              Global Reports
            </div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#aaa', marginTop: 4, letterSpacing: '.04em' }}>
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {/* Period selector */}
            <div style={{ position: 'relative' }}>
              <FiCalendar style={{
                position: 'absolute', left: 11, top: '50%',
                transform: 'translateY(-50%)', color: '#bbb', fontSize: 13, pointerEvents: 'none',
              }} />
              <select
                className="period-select"
                value={dateRange}
                onChange={e => setDateRange(e.target.value)}
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>
            <button className="export-btn">
              <FiDownload size={13} /> Export CSV
            </button>
          </div>
        </div>

        {/* KPI strip */}
        <span className="section-label">Summary</span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
          <KPI
            label="Total Revenue"
            value={`₹${reports?.totalRevenue?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}`}
            icon={FaMoneyBillWave} color="#1d4ed8"
            trend={reports?.monthGrowth} sub="vs last month"
          />
          <KPI
            label="Avg Daily Revenue"
            value={`₹${avgDailyRev.toFixed(2)}`}
            icon={MdOutlineShowChart} color="#0d9488"
            trend={5.4} sub="7-day average"
          />
          <KPI
            label="Top Stand"
            value={topStand?.stand || 'N/A'}
            icon={RiParkingBoxLine} color="#d97706"
            sub={topStand ? `₹${topStand.revenue.toLocaleString('en-IN')} earned` : ''}
          />
          <KPI
            label="Reporting Stands"
            value={reports?.standWiseRevenue?.length || 0}
            icon={MdOutlineStorefront} color="#7c3aed"
            trend={0} sub="all stands active"
          />
        </div>

        {/* Row 1 — Monthly trend + Stand-wise */}
        <span className="section-label">Revenue Trends</span>
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 14, marginBottom: 14 }}>

          {/* Monthly area */}
          <ChartCard title="6-Month Revenue Trend" badge="Area View">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={reports?.monthlyComparison || []} margin={{ top: 8, right: 4, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="rGrad3" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#0a0a0a" stopOpacity={.12} />
                    <stop offset="95%" stopColor="#0a0a0a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontFamily: 'DM Mono, monospace', fontSize: 10, fill: '#aaa' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontFamily: 'DM Mono, monospace', fontSize: 10, fill: '#aaa' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip prefix="₹" />} />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#0a0a0a" strokeWidth={2.5} fill="url(#rGrad3)"
                  dot={{ fill: '#0a0a0a', r: 4, strokeWidth: 0 }} activeDot={{ r: 6, fill: '#0a0a0a', strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Stand-wise bars */}
          <ChartCard title="Stand-wise Revenue">
            <div style={{ padding: '4px 0' }}>
              {(reports?.standWiseRevenue || []).map((item, i) => (
                <StandBarRow
                  key={i}
                  stand={item.stand}
                  revenue={item.revenue}
                  maxRevenue={maxStandRev}
                  color={BAR_COLORS[i % BAR_COLORS.length]}
                  rank={i + 1}
                  isLast={i === (reports?.standWiseRevenue?.length || 0) - 1}
                />
              ))}
            </div>
          </ChartCard>
        </div>

        {/* Row 2 — Daily bar + Hourly area */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>

          {/* Daily Revenue */}
          <ChartCard title="Daily Revenue" badge="This Week" badgeColor="green">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={reports?.dailyRevenue || []} margin={{ top: 8, right: 4, left: -20, bottom: 0 }} barSize={28}>
                <defs>
                  <linearGradient id="dBar3" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#0a0a0a" />
                    <stop offset="100%" stopColor="#555" />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontFamily: 'DM Mono, monospace', fontSize: 10, fill: '#aaa' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontFamily: 'DM Mono, monospace', fontSize: 10, fill: '#aaa' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(1)}k`} />
                <Tooltip content={<CustomTooltip prefix="₹" />} />
                <Bar dataKey="revenue" name="Revenue" fill="url(#dBar3)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Hourly peak */}
          <ChartCard title="Today's Peak Hours" badge="Live" badgeColor="amber">
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={reports?.hourlyPeak || []} margin={{ top: 8, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="hGrad3" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#d97706" stopOpacity={.15} />
                    <stop offset="95%" stopColor="#d97706" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="hour" tick={{ fontFamily: 'DM Mono, monospace', fontSize: 10, fill: '#aaa' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontFamily: 'DM Mono, monospace', fontSize: 10, fill: '#aaa' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="vehicles" name="Vehicles" stroke="#d97706" strokeWidth={2.5} fill="url(#hGrad3)"
                  dot={{ fill: '#d97706', r: 4, strokeWidth: 0 }} activeDot={{ r: 6, fill: '#d97706', strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

      </div>
    </>
  );
};

export default Reports;