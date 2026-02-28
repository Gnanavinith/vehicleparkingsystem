import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  AreaChart, Area, BarChart, Bar, ComposedChart,
  PieChart, Pie, Cell, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { FaUsers, FaParking, FaDollarSign, FaChartLine, FaPlus, FaSearch } from 'react-icons/fa';
import { FiTrendingUp, FiTrendingDown, FiActivity, FiBarChart2, FiSettings, FiUserPlus, FiCheckCircle, FiAlertTriangle, FiAward, FiZap } from 'react-icons/fi';
import { RiParkingBoxLine } from 'react-icons/ri';

// ─── Mock API ──────────────────────────────────────────────────────────────────
const standAdminApi = {
  getDashboardStats: async () => ({
    totalStaff: 8,
    activeParkings: 24,
    todayRevenue: 1240.50,
    monthlyRevenue: 28450.75,
    occupancyRate: 78,
    pendingCheckouts: 5,
  }),
  getRevenueChart: async () => ([
    { date: 'Jan', revenue: 12000, expenses: 4000, profit: 8000 },
    { date: 'Feb', revenue: 14500, expenses: 4500, profit: 10000 },
    { date: 'Mar', revenue: 13800, expenses: 4200, profit: 9600 },
    { date: 'Apr', revenue: 16200, expenses: 5100, profit: 11100 },
    { date: 'May', revenue: 15800, expenses: 4800, profit: 11000 },
    { date: 'Jun', revenue: 17500, expenses: 5400, profit: 12100 },
    { date: 'Jul', revenue: 18900, expenses: 5800, profit: 13100 },
    { date: 'Aug', revenue: 18200, expenses: 5600, profit: 12600 },
  ]),
  getOccupancyData: async () => ([
    { name: 'Mon', value: 72 },
    { name: 'Tue', value: 85 },
    { name: 'Wed', value: 91 },
    { name: 'Thu', value: 88 },
    { name: 'Fri', value: 95 },
    { name: 'Sat', value: 78 },
    { name: 'Sun', value: 60 },
  ]),
  getZoneDistribution: async () => ([
    { name: 'Zone A', value: 35 },
    { name: 'Zone B', value: 25 },
    { name: 'Zone C', value: 20 },
    { name: 'Zone D', value: 20 },
  ]),
  getHourlyActivity: async () => ([
    { hour: '6am',  vehicles: 8 },
    { hour: '8am',  vehicles: 22 },
    { hour: '10am', vehicles: 35 },
    { hour: '12pm', vehicles: 42 },
    { hour: '2pm',  vehicles: 38 },
    { hour: '4pm',  vehicles: 45 },
    { hour: '6pm',  vehicles: 39 },
    { hour: '8pm',  vehicles: 25 },
    { hour: '10pm', vehicles: 12 },
  ]),
};

// ─── Design Tokens (matches Staff dashboard) ──────────────────────────────────
const PIE_COLORS = ['#0a0a0a', '#d97706', '#0d9488', '#1d4ed8'];

// ─── Global CSS ───────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500;600&family=DM+Sans:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
  @keyframes countUp { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }

  .db-wrap { font-family: 'DM Sans', sans-serif; animation: fadeUp .28s ease; }

  .db-card {
    background: #fff;
    border-radius: 16px;
    border: 1px solid #ebebeb;
    transition: box-shadow .18s;
  }
  .db-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,.06); }

  .kpi-num {
    font-family: 'DM Serif Display', serif;
    font-size: 36px;
    letter-spacing: -0.03em;
    line-height: 1;
    animation: countUp .4s ease;
  }

  .chart-tooltip {
    background: #0a0a0a;
    border: none;
    border-radius: 8px;
    padding: 8px 12px;
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: #fff;
  }

  .section-label {
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    font-weight: 600;
    letter-spacing: .14em;
    text-transform: uppercase;
    color: #aaa;
    margin-bottom: 14px;
    display: block;
  }

  .shimmer {
    background: linear-gradient(90deg, #f5f5f5 25%, #ebebeb 50%, #f5f5f5 75%);
    background-size: 200% 100%;
    animation: shimmer 1.2s infinite;
    border-radius: 8px;
  }

  .quick-btn {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    padding: 16px;
    border-radius: 12px;
    border: 1.5px solid #ebebeb;
    background: #fff;
    cursor: pointer;
    transition: all .14s;
    font-family: 'DM Sans', sans-serif;
    text-align: left;
    width: 100%;
  }
  .quick-btn:hover {
    border-color: #0a0a0a;
    background: #fafafa;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0,0,0,.08);
  }

  input:focus { outline: none; border-color: #0a0a0a !important; box-shadow: 0 0 0 3px #f5f5f5 !important; }

  .trend-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    font-weight: 600;
    font-family: 'DM Mono', monospace;
    padding: 3px 8px;
    border-radius: 20px;
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

// ─── Shimmer ──────────────────────────────────────────────────────────────────
const Shimmer = ({ h = 200 }) => <div className="shimmer" style={{ height: h }} />;

// ─── KPI Card ─────────────────────────────────────────────────────────────────
const KPI = ({ label, value, icon: Icon, color, sub, trend }) => (
  <div className="db-card" style={{ padding: '22px 24px' }}>
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
      <span className="section-label" style={{ marginBottom: 0 }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {trend !== undefined && (
          <span
            className="trend-badge"
            style={{
              color: trend >= 0 ? '#059669' : '#dc2626',
              background: trend >= 0 ? '#f0fdf4' : '#fef2f2',
            }}
          >
            {trend >= 0 ? <FiTrendingUp size={11} /> : <FiTrendingDown size={11} />}
            {Math.abs(trend)}%
          </span>
        )}
        <div style={{
          width: 34, height: 34, borderRadius: 9,
          background: `${color}12`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={15} color={color} />
        </div>
      </div>
    </div>
    <div className="kpi-num" style={{ color: '#0a0a0a' }}>{value}</div>
    {sub && (
      <div style={{ fontSize: 11.5, color: '#aaa', marginTop: 6, fontFamily: 'DM Mono, monospace' }}>{sub}</div>
    )}
  </div>
);

// ─── Chart Card ───────────────────────────────────────────────────────────────
const ChartCard = ({ title, badge, badgeColor = '#0a0a0a', children, style = {} }) => (
  <div className="db-card" style={{ padding: '22px 24px', ...style }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
      <span className="section-label" style={{ marginBottom: 0 }}>{title}</span>
      {badge && (
        <span style={{
          fontSize: 9, fontWeight: 700,
          fontFamily: 'DM Mono, monospace',
          letterSpacing: '.10em',
          textTransform: 'uppercase',
          background: badgeColor === 'green' ? '#f0fdf4' : badgeColor === 'amber' ? '#fffbeb' : '#f5f5f5',
          color: badgeColor === 'green' ? '#059669' : badgeColor === 'amber' ? '#d97706' : '#555',
          padding: '3px 9px', borderRadius: 20,
        }}>
          {badge}
        </span>
      )}
    </div>
    {children}
  </div>
);

// ─── Main Dashboard ───────────────────────────────────────────────────────────
const Dashboard = () => {
  const navigate = useNavigate();
  let role;
  try { const auth = useSelector(s => s.auth); role = auth?.role; }
  catch { role = 'stand_admin'; }

  useEffect(() => {
    if (role && role !== 'stand_admin') navigate('/login');
  }, [role, navigate]);

  const { data: stats, isLoading, error } = useQuery({ queryKey: ['stand-stats'], queryFn: standAdminApi.getDashboardStats, staleTime: 60000 });
  const { data: revenueData }      = useQuery({ queryKey: ['stand-revenue'],   queryFn: standAdminApi.getRevenueChart,     staleTime: 300000 });
  const { data: occupancyData }    = useQuery({ queryKey: ['stand-occupancy'], queryFn: standAdminApi.getOccupancyData,    staleTime: 300000 });
  const { data: distributionData } = useQuery({ queryKey: ['stand-dist'],      queryFn: standAdminApi.getZoneDistribution, staleTime: 300000 });
  const { data: activityData }     = useQuery({ queryKey: ['stand-activity'],  queryFn: standAdminApi.getHourlyActivity,   staleTime: 300000 });

  if (isLoading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 260 }}>
      <style>{css}</style>
      <div style={{ width: 32, height: 32, border: '3px solid #ebebeb', borderTopColor: '#0a0a0a', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
    </div>
  );

  if (error) return (
    <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 12, padding: '14px 18px', color: '#dc2626', fontSize: 13, fontFamily: 'DM Mono, monospace' }}>
      <strong>Error:</strong> {error.message}
    </div>
  );

  const fmt = (n) => new Intl.NumberFormat('en-IN').format(n);

  return (
    <>
      <style>{css}</style>
      <div className="db-wrap" style={{ padding: '28px 32px', minHeight: '100vh', background: '#f7f7f7' }}>

        {/* ── Header ── */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <div style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 28,
              letterSpacing: '-0.02em',
              color: '#0a0a0a',
              lineHeight: 1,
              fontStyle: 'italic',
            }}>
              Overview
            </div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#aaa', marginTop: 4, letterSpacing: '.04em' }}>
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <FaSearch style={{
                position: 'absolute', left: 11, top: '50%',
                transform: 'translateY(-50%)', color: '#bbb', fontSize: 12, pointerEvents: 'none',
              }} />
              <input
                placeholder="Search staff, parkings…"
                style={{
                  background: '#fff',
                  border: '1px solid #ebebeb',
                  borderRadius: 10,
                  padding: '9px 14px 9px 32px',
                  fontSize: 13,
                  color: '#0a0a0a',
                  width: 220,
                  fontFamily: 'DM Sans, sans-serif',
                  transition: 'all 0.15s',
                }}
              />
            </div>
            {/* CTA */}
            <button
              onClick={() => navigate('/standadmin/create-staff')}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 18px',
                background: '#0a0a0a', color: '#fff',
                border: 'none', borderRadius: 10,
                textDecoration: 'none', fontWeight: 700, fontSize: 13,
                fontFamily: 'DM Sans, sans-serif',
                cursor: 'pointer',
                transition: 'all .14s',
              }}
            >
              <FaPlus size={11} /> Add Staff
            </button>
          </div>
        </div>

        {/* ── KPI Row ── */}
        <span className="section-label">Performance Summary</span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
          <KPI
            label="Total Staff"
            value={fmt(stats?.totalStaff || 0)}
            icon={FaUsers}
            color="#1d4ed8"
            trend={8.2}
            sub="2 new this month"
          />
          <KPI
            label="Active Parkings"
            value={fmt(stats?.activeParkings || 0)}
            icon={RiParkingBoxLine}
            color="#059669"
            trend={15.3}
            sub="live right now"
          />
          <KPI
            label="Today's Revenue"
            value={`₹${stats?.todayRevenue?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}`}
            icon={FaDollarSign}
            color="#d97706"
            trend={12.4}
            sub="vs yesterday"
          />
          <KPI
            label="Occupancy Rate"
            value={`${stats?.occupancyRate || 0}%`}
            icon={FaChartLine}
            color="#0d9488"
            trend={-3.2}
            sub="target: 80%"
          />
        </div>

        {/* ── Financial Charts ── */}
        <span className="section-label">Financial Analytics</span>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14, marginBottom: 14 }}>

          {/* Revenue Area */}
          <ChartCard title="Revenue, Profit & Expenses" badge="8-month overview">
            <ResponsiveContainer width="100%" height={268}>
              <AreaChart data={revenueData || []} margin={{ top: 8, right: 4, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#0a0a0a" stopOpacity={.12} />
                    <stop offset="95%" stopColor="#0a0a0a" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gPro" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#0d9488" stopOpacity={.12} />
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#d97706" stopOpacity={.10} />
                    <stop offset="95%" stopColor="#d97706" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontFamily: 'DM Mono, monospace', fontSize: 10, fill: '#aaa' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontFamily: 'DM Mono, monospace', fontSize: 10, fill: '#aaa' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip prefix="₹" />} />
                <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 11, color: '#aaa', paddingTop: 12, fontFamily: 'DM Mono, monospace' }} />
                <Area type="monotone" dataKey="revenue"  name="Revenue"  stroke="#0a0a0a" strokeWidth={2.5} fill="url(#gRev)" dot={false} activeDot={{ r: 5, strokeWidth: 0 }} />
                <Area type="monotone" dataKey="profit"   name="Profit"   stroke="#0d9488" strokeWidth={2.5} fill="url(#gPro)" dot={false} activeDot={{ r: 5, strokeWidth: 0 }} />
                <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#d97706" strokeWidth={2}   fill="url(#gExp)" dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Donut — Zone Distribution */}
          <ChartCard title="Zone Distribution">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={distributionData || []} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                  {(distributionData || []).map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 14px', justifyContent: 'center', marginTop: 8 }}>
              {(distributionData || []).map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontFamily: 'DM Mono, monospace', color: '#555' }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: PIE_COLORS[i % PIE_COLORS.length], flexShrink: 0 }} />
                  {item.name} ({item.value}%)
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        {/* ── Operations Charts ── */}
        <span className="section-label">Operational Insights</span>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>

          {/* Weekly Occupancy Bar */}
          <ChartCard title="Weekly Occupancy Rate" badge="This Week">
            <ResponsiveContainer width="100%" height={228}>
              <BarChart data={occupancyData || []} margin={{ top: 8, right: 4, left: -22, bottom: 0 }} barSize={28}>
                <defs>
                  <linearGradient id="barG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#0a0a0a" />
                    <stop offset="100%" stopColor="#555" />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" tick={{ fontFamily: 'DM Mono, monospace', fontSize: 10, fill: '#aaa' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontFamily: 'DM Mono, monospace', fontSize: 10, fill: '#aaa' }} axisLine={false} tickLine={false} domain={[0, 100]} tickFormatter={v => `${v}%`} />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={80} stroke="#d97706" strokeDasharray="4 3" strokeWidth={1.5}
                  label={{ value: 'Target 80%', fill: '#d97706', fontSize: 9, position: 'insideTopRight', fontFamily: 'DM Mono, monospace' }}
                />
                <Bar dataKey="value" name="Occupancy %" fill="url(#barG)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Hourly Activity */}
          <ChartCard title="Today's Vehicle Activity" badge="Live" badgeColor="green">
            <ResponsiveContainer width="100%" height={228}>
              <ComposedChart data={activityData || []} margin={{ top: 8, right: 4, left: -22, bottom: 0 }}>
                <defs>
                  <linearGradient id="actG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#0d9488" stopOpacity={.15} />
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="hour" tick={{ fontFamily: 'DM Mono, monospace', fontSize: 10, fill: '#aaa' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontFamily: 'DM Mono, monospace', fontSize: 10, fill: '#aaa' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="vehicles" fill="url(#actG)" stroke="none" />
                <Line
                  type="monotone" dataKey="vehicles" name="Vehicles"
                  stroke="#0d9488" strokeWidth={2.5}
                  dot={{ fill: '#0d9488', r: 4, strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: '#0d9488', strokeWidth: 0 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* ── Activity + Quick Actions ── */}
        <span className="section-label">Activity & Actions</span>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>

          {/* Activity Feed */}
          <ChartCard title="Recent Activity">
            {[
              { Icon: FiCheckCircle,   iconColor: '#059669', bg: '#f0fdf4', title: 'New staff member added',    sub: 'Sarah Johnson · 2 hours ago' },
              { Icon: FiUserPlus,      iconColor: '#1d4ed8', bg: '#eff6ff', title: 'Parking space assigned',     sub: 'Vehicle #ABC123 · 4 hours ago' },
              { Icon: FiAward,         iconColor: '#d97706', bg: '#fffbeb', title: 'Revenue milestone hit',     sub: '₹1,000 reached today · 1 day ago' },
              { Icon: FiActivity,      iconColor: '#0d9488', bg: '#f0fdfa', title: 'Peak occupancy reached',    sub: 'Zone B · 95% · 1 day ago' },
              { Icon: FiAlertTriangle, iconColor: '#dc2626', bg: '#fef2f2', title: 'Maintenance required',      sub: 'Zone C lighting · 2 days ago' },
            ].map((item, i, arr) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: 12,
                padding: '11px 0',
                borderBottom: i < arr.length - 1 ? '1px solid #f5f5f5' : 'none',
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 9,
                  background: item.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <item.Icon style={{ color: item.iconColor, fontSize: 14 }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: '#0a0a0a', fontFamily: 'DM Sans, sans-serif' }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: 11, color: '#aaa', marginTop: 2, fontFamily: 'DM Mono, monospace' }}>
                    {item.sub}
                  </div>
                </div>
              </div>
            ))}
          </ChartCard>

          {/* Quick Actions */}
          <ChartCard title="Quick Actions">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 4 }}>
              {[
                { Icon: FaUsers,          label: 'Add Staff',    desc: 'Register new member',    color: '#1d4ed8', bg: '#eff6ff' },
                { Icon: RiParkingBoxLine, label: 'New Parking',  desc: 'Create parking record',  color: '#059669', bg: '#f0fdf4' },
                { Icon: FiBarChart2,      label: 'View Reports', desc: 'Export daily reports',   color: '#d97706', bg: '#fffbeb' },
                { Icon: FiSettings,       label: 'Settings',     desc: 'Stand configuration',   color: '#7c3aed', bg: '#f5f3ff' },
              ].map((a, i) => (
                <button key={i} className="quick-btn">
                  <div style={{
                    width: 36, height: 36, borderRadius: 9,
                    background: a.bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <a.Icon style={{ color: a.color, fontSize: 15 }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0a0a0a', fontFamily: 'DM Sans, sans-serif' }}>
                      {a.label}
                    </div>
                    <div style={{ fontSize: 11, color: '#aaa', marginTop: 2, fontFamily: 'DM Mono, monospace', lineHeight: 1.4 }}>
                      {a.desc}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </ChartCard>
        </div>

      </div>
    </>
  );
};

export default Dashboard;