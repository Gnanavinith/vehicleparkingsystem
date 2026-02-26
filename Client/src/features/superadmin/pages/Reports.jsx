import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell,
} from 'recharts';
import { FiDownload, FiTrendingUp, FiTrendingDown, FiCalendar } from 'react-icons/fi';
import { FaMoneyBillWave, FaChartBar } from 'react-icons/fa';
import { MdOutlineStorefront, MdOutlineShowChart } from 'react-icons/md';
import { BsGraphUpArrow } from 'react-icons/bs';
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
      { stand: 'Main Street', revenue: 12500.75, color: '#6366f1' },
      { stand: 'Downtown Mall', revenue: 9800.50, color: '#10b981' },
      { stand: 'Airport Terminal', revenue: 8200.25, color: '#f59e0b' },
      { stand: 'City Center', revenue: 7650.80, color: '#22d3ee' },
      { stand: 'Shopping District', revenue: 7526.60, color: '#8b5cf6' },
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
      { hour: '6am', vehicles: 18 },
      { hour: '8am', vehicles: 72 },
      { hour: '10am', vehicles: 95 },
      { hour: '12pm', vehicles: 110 },
      { hour: '2pm', vehicles: 98 },
      { hour: '4pm', vehicles: 130 },
      { hour: '6pm', vehicles: 115 },
      { hour: '8pm', vehicles: 60 },
      { hour: '10pm', vehicles: 28 },
    ],
  }),
};

// ─── Tokens ────────────────────────────────────────────────────────────────────
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
  cyan:        '#22d3ee',
  cyanLight:   '#cffafe',
  purple:      '#8b5cf6',
  purpleLight: '#ede9fe',
};

// ─── Custom Tooltip ────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label, prefix = '' }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#0f172a', borderRadius: 10, padding: '10px 14px',
      boxShadow: '0 8px 24px rgba(15,23,42,0.2)', border: '1px solid rgba(255,255,255,0.08)',
      fontFamily: 'Inter, sans-serif', minWidth: 130,
    }}>
      <p style={{ color: '#94a3b8', fontSize: 11, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
      {payload.map((p, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: p.color, flexShrink: 0 }} />
          <span style={{ color: '#94a3b8', fontSize: 12 }}>{p.name}:</span>
          <span style={{ color: '#f1f5f9', fontSize: 12, fontWeight: 700 }}>
            {prefix}{typeof p.value === 'number' && p.value > 999 ? p.value.toLocaleString() : p.value}
          </span>
        </div>
      ))}
    </div>
  );
};

// ─── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, Icon, iconBg, iconColor, accentBar, trend, trendLabel }) => (
  <div style={{
    background: C.card, border: `1px solid ${C.border}`, borderRadius: 14,
    padding: '20px', display: 'flex', flexDirection: 'column', gap: 14,
    boxShadow: '0 1px 3px rgba(15,23,42,0.06)', overflow: 'hidden', position: 'relative',
    transition: 'box-shadow 0.18s, transform 0.18s', cursor: 'default',
    fontFamily: 'Inter, sans-serif',
  }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(15,23,42,0.1)'; }}
    onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 1px 3px rgba(15,23,42,0.06)'; }}
  >
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: accentBar, borderRadius: '14px 14px 0 0' }} />
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ width: 40, height: 40, borderRadius: 11, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon style={{ color: iconColor, fontSize: 17 }} />
      </div>
      {trend !== undefined && (
        <span style={{
          fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 20,
          background: trend >= 0 ? C.greenLight : C.redLight,
          color: trend >= 0 ? C.green : C.red,
          display: 'flex', alignItems: 'center', gap: 3,
        }}>
          {trend >= 0 ? <FiTrendingUp size={11} /> : <FiTrendingDown size={11} />}
          {Math.abs(trend)}%
        </span>
      )}
    </div>
    <div>
      <p style={{ fontSize: 24, fontWeight: 700, color: C.text, letterSpacing: '-0.025em', margin: 0 }}>{value}</p>
      <p style={{ fontSize: 12.5, color: C.sub, marginTop: 3 }}>{label}</p>
    </div>
    {trendLabel && <p style={{ fontSize: 11, color: C.muted }}>{trendLabel}</p>}
  </div>
);

// ─── Chart Card ────────────────────────────────────────────────────────────────
const ChartCard = ({ title, subtitle, badge, badgeColor = C.accentLight, badgeText = C.accent, children, style = {} }) => (
  <div style={{
    background: C.card, border: `1px solid ${C.border}`, borderRadius: 14,
    padding: '20px 22px', boxShadow: '0 1px 3px rgba(15,23,42,0.06)',
    fontFamily: 'Inter, sans-serif', ...style,
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
      <div>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: C.text, margin: 0, letterSpacing: '-0.01em' }}>{title}</h2>
        {subtitle && <p style={{ fontSize: 12, color: C.muted, marginTop: 3, margin: 0 }}>{subtitle}</p>}
      </div>
      {badge && (
        <span style={{ fontSize: 11, fontWeight: 600, background: badgeColor, color: badgeText, padding: '3px 10px', borderRadius: 20 }}>{badge}</span>
      )}
    </div>
    {children}
  </div>
);

// ─── Section Label ─────────────────────────────────────────────────────────────
const SectionLabel = ({ children }) => (
  <p style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '28px 0 12px', fontFamily: 'Inter, sans-serif' }}>
    {children}
  </p>
);

// ─── Stand Bar Row ─────────────────────────────────────────────────────────────
const StandBarRow = ({ stand, revenue, maxRevenue, color, rank }) => {
  const pct = (revenue / maxRevenue) * 100;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: `1px solid ${C.border}` }}>
      <span style={{ width: 22, height: 22, borderRadius: 6, background: `${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color, flexShrink: 0 }}>
        #{rank}
      </span>
      <span style={{ fontSize: 13, fontWeight: 500, color: C.text, width: 130, flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{stand}</span>
      <div style={{ flex: 1, height: 7, background: C.border, borderRadius: 99, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 99, transition: 'width 0.6s ease' }} />
      </div>
      <span style={{ fontSize: 13, fontWeight: 700, color: C.text, width: 80, textAlign: 'right', flexShrink: 0 }}>
        ${revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
      </span>
    </div>
  );
};

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
  const topStand = reports?.standWiseRevenue?.[0];
  const maxStandRev = Math.max(...(reports?.standWiseRevenue || []).map(s => s.revenue));

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
        select:focus { outline: none; border-color: ${C.accent} !important; box-shadow: 0 0 0 3px ${C.accentLight} !important; }
      `}</style>

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: C.text, letterSpacing: '-0.025em', margin: 0 }}>Global Reports</h1>
          <p style={{ fontSize: 13, color: C.sub, marginTop: 4 }}>Financial overview across all parking stands.</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <FiCalendar style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: C.muted, fontSize: 14, pointerEvents: 'none' }} />
            <select
              value={dateRange}
              onChange={e => setDateRange(e.target.value)}
              style={{
                background: C.card, border: `1px solid ${C.border}`, borderRadius: 10,
                padding: '8px 14px 8px 32px', fontSize: 13, color: C.text,
                cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                boxShadow: '0 1px 3px rgba(15,23,42,0.04)', transition: 'all 0.15s',
              }}
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
          <button style={{
            background: C.accent, color: '#fff', border: 'none', borderRadius: 10,
            padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 7,
            boxShadow: '0 2px 8px rgba(99,102,241,0.35)', fontFamily: 'Inter, sans-serif',
          }}>
            <FiDownload size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <SectionLabel>Summary</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        <StatCard
          label="Total Revenue" value={`$${reports?.totalRevenue?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}`}
          Icon={FaMoneyBillWave} iconBg={C.accentLight} iconColor={C.accent}
          accentBar={`linear-gradient(90deg, ${C.accent}, #818cf8)`}
          trend={reports?.monthGrowth} trendLabel="vs last month"
        />
        <StatCard
          label="Avg Daily Revenue" value={`$${avgDailyRev.toFixed(2)}`}
          Icon={MdOutlineShowChart} iconBg={C.greenLight} iconColor={C.green}
          accentBar={`linear-gradient(90deg, ${C.green}, #34d399)`}
          trend={5.4} trendLabel="7-day average"
        />
        <StatCard
          label="Top Performing Stand" value={topStand?.stand || 'N/A'}
          Icon={RiParkingBoxLine} iconBg={C.amberLight} iconColor={C.amber}
          accentBar={`linear-gradient(90deg, ${C.amber}, #fbbf24)`}
          trendLabel={topStand ? `$${topStand.revenue.toLocaleString()} earned` : ''}
        />
        <StatCard
          label="Reporting Stands" value={reports?.standWiseRevenue?.length || 0}
          Icon={MdOutlineStorefront} iconBg={C.purpleLight} iconColor={C.purple}
          accentBar={`linear-gradient(90deg, ${C.purple}, #a78bfa)`}
          trend={0} trendLabel="All stands active"
        />
      </div>

      {/* ── Charts Row 1 ── */}
      <SectionLabel>Revenue Trends</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 16, marginBottom: 16 }}>

        {/* Monthly trend area */}
        <ChartCard title="6-Month Revenue Trend" subtitle="Monthly revenue progression" badge="Area View">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={reports?.monthlyComparison || []} margin={{ top: 8, right: 4, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="rGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={C.accent} stopOpacity={0.18} />
                  <stop offset="100%" stopColor={C.accent} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke={C.border} vertical={false} />
              <XAxis dataKey="month" tick={{ fill: C.muted, fontSize: 11, fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: C.muted, fontSize: 11, fontFamily: 'Inter' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip prefix="$" />} />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke={C.accent} strokeWidth={2.5} fill="url(#rGrad)" dot={{ fill: C.accent, r: 4, strokeWidth: 0 }} activeDot={{ r: 6, fill: C.accent, strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Stand wise revenue bars */}
        <ChartCard title="Stand-wise Revenue" subtitle="Ranked by total earnings">
          <div style={{ padding: '4px 0' }}>
            {(reports?.standWiseRevenue || []).map((item, i) => (
              <StandBarRow key={i} stand={item.stand} revenue={item.revenue} maxRevenue={maxStandRev} color={item.color} rank={i + 1} />
            ))}
          </div>
        </ChartCard>
      </div>

      {/* ── Charts Row 2 ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 0 }}>

        {/* Daily Revenue Bar Chart */}
        <ChartCard title="Daily Revenue" subtitle="Last 7 days breakdown" badge="This Week" badgeColor={C.greenLight} badgeText={C.green}>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={reports?.dailyRevenue || []} margin={{ top: 8, right: 4, left: -20, bottom: 0 }} barSize={28}>
              <defs>
                <linearGradient id="dBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={C.accent} />
                  <stop offset="100%" stopColor="#818cf8" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke={C.border} vertical={false} />
              <XAxis dataKey="date" tick={{ fill: C.muted, fontSize: 11, fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: C.muted, fontSize: 11, fontFamily: 'Inter' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(1)}k`} />
              <Tooltip content={<CustomTooltip prefix="$" />} />
              <Bar dataKey="revenue" name="Revenue" fill="url(#dBar)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Peak Hour Line Chart */}
        <ChartCard title="Today's Peak Hours" subtitle="Vehicle inflow by time of day" badge="Live" badgeColor={C.amberLight} badgeText={C.amber}>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={reports?.hourlyPeak || []} margin={{ top: 8, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="hGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={C.amber} stopOpacity={0.2} />
                  <stop offset="100%" stopColor={C.amber} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke={C.border} vertical={false} />
              <XAxis dataKey="hour" tick={{ fill: C.muted, fontSize: 11, fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: C.muted, fontSize: 11, fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip prefix="" />} />
              <Area type="monotone" dataKey="vehicles" name="Vehicles" stroke={C.amber} strokeWidth={2.5} fill="url(#hGrad)" dot={{ fill: C.amber, r: 4, strokeWidth: 0 }} activeDot={{ r: 6, fill: C.amber, strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
};

export default Reports;