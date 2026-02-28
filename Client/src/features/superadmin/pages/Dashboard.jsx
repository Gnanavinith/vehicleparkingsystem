import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  AreaChart, Area, BarChart, Bar, ComposedChart,
  PieChart, Pie, Cell, Line,
  XAxis, YAxis, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { FaBuilding, FaUsers, FaMoneyBillWave, FaChartLine, FaPlus, FaSearch } from 'react-icons/fa';
import { FiTrendingUp, FiTrendingDown, FiActivity, FiBarChart2, FiSettings, FiUserPlus, FiCheckCircle, FiAlertTriangle, FiAward } from 'react-icons/fi';
import { HiOutlineBuildingOffice2 } from 'react-icons/hi2';
import { MdOutlineAdminPanelSettings } from 'react-icons/md';
import { RiParkingBoxLine } from 'react-icons/ri';
import api from '../../../config/axios';

// ─── Mock API ──────────────────────────────────────────────────────────────────
const superAdminApi = {
  getDashboardStats: async () => {
    try {
      const response = await api.get('/dashboard/stats');
return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Fallback to mock data if API fails
      return {
        totalStands: 0,
        totalStandAdmins: 0,
        totalStaff: 0,
        activeParkings: 0,
        todayRevenue: 0,
        monthlyRevenue: 0,
      };
    }
  },
  getRevenueChart: async () => ([
    { date: 'Jan', revenue: 35000, expenses: 12000, profit: 23000 },
    { date: 'Feb', revenue: 42000, expenses: 14000, profit: 28000 },
    { date: 'Mar', revenue: 38000, expenses: 13000, profit: 25000 },
    { date: 'Apr', revenue: 51000, expenses: 16000, profit: 35000 },
    { date: 'May', revenue: 48000, expenses: 15000, profit: 33000 },
    { date: 'Jun', revenue: 53000, expenses: 17000, profit: 36000 },
    { date: 'Jul', revenue: 61000, expenses: 19000, profit: 42000 },
    { date: 'Aug', revenue: 58000, expenses: 18000, profit: 40000 },
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
  getStandDistribution: async () => ([
    { name: 'Downtown', value: 35 },
    { name: 'Suburbs',  value: 25 },
    { name: 'Airport',  value: 20 },
    { name: 'Mall',     value: 20 },
  ]),
  getHourlyActivity: async () => ([
    { hour: '6am',  vehicles: 12 },
    { hour: '8am',  vehicles: 48 },
    { hour: '10am', vehicles: 65 },
    { hour: '12pm', vehicles: 82 },
    { hour: '2pm',  vehicles: 74 },
    { hour: '4pm',  vehicles: 91 },
    { hour: '6pm',  vehicles: 78 },
    { hour: '8pm',  vehicles: 43 },
    { hour: '10pm', vehicles: 21 },
  ]),
};

// ─── Design Tokens ─────────────────────────────────────────────────────────────
const PIE_COLORS = ['#0a0a0a', '#d97706', '#0d9488', '#1d4ed8'];

// ─── Global CSS ────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500;600&family=DM+Sans:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes fadeUp  { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
  @keyframes countUp { from { opacity: 0; transform: translateY(6px);  } to { opacity: 1; transform: none; } }
  @keyframes spin    { to   { transform: rotate(360deg); } }
  @keyframes shimmer {
    0%   { background-position: -200% 0; }
    100% { background-position:  200% 0; }
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
    font-size: 32px;
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
    font-size: 10px;
    font-weight: 600;
    font-family: 'DM Mono', monospace;
    padding: 2px 7px;
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
  <div className="db-card" style={{ padding: '20px 22px' }}>
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
      <span className="section-label" style={{ marginBottom: 0 }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        {trend !== undefined && (
          <span
            className="trend-badge"
            style={{
              color: trend >= 0 ? '#059669' : '#dc2626',
              background: trend >= 0 ? '#f0fdf4' : '#fef2f2',
            }}
          >
            {trend >= 0 ? <FiTrendingUp size={10} /> : <FiTrendingDown size={10} />}
            {Math.abs(trend)}%
          </span>
        )}
        <div style={{
          width: 32, height: 32, borderRadius: 9,
          background: `${color}12`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={14} color={color} />
        </div>
      </div>
    </div>
    <div className="kpi-num" style={{ color: '#0a0a0a' }}>{value}</div>
    {sub && (
      <div style={{ fontSize: 11, color: '#aaa', marginTop: 6, fontFamily: 'DM Mono, monospace' }}>{sub}</div>
    )}
  </div>
);

// ─── Chart Card ───────────────────────────────────────────────────────────────
const ChartCard = ({ title, badge, badgeColor = 'default', children, style = {} }) => {
  const badgeStyles = {
    green:  { bg: '#f0fdf4', color: '#059669' },
    amber:  { bg: '#fffbeb', color: '#d97706' },
    teal:   { bg: '#f0fdfa', color: '#0d9488' },
    default:{ bg: '#f5f5f5', color: '#555' },
  };
  const bs = badgeStyles[badgeColor] || badgeStyles.default;
  return (
    <div className="db-card" style={{ padding: '22px 24px', ...style }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <span className="section-label" style={{ marginBottom: 0 }}>{title}</span>
        {badge && (
          <span style={{
            fontSize: 9, fontWeight: 700,
            fontFamily: 'DM Mono, monospace',
            letterSpacing: '.10em',
            textTransform: 'uppercase',
            background: bs.bg,
            color: bs.color,
            padding: '3px 9px', borderRadius: 20,
          }}>
            {badge}
          </span>
        )}
      </div>
      {children}
    </div>
  );
};

// ─── Dashboard ─────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const navigate = useNavigate();
  let role;
  try { const auth = useSelector(s => s.auth); role = auth?.role; }
  catch { role = 'super_admin'; }

  useEffect(() => {
    if (role && role !== 'super_admin') navigate('/login');
  }, [role, navigate]);

  const { data: stats, isLoading, error } = useQuery({ queryKey: ['sa-stats'],    queryFn: superAdminApi.getDashboardStats,    staleTime: 30000, refetchInterval: 30000  });
  const { data: revenueData }              = useQuery({ queryKey: ['sa-revenue'],  queryFn: superAdminApi.getRevenueChart,       staleTime: 300000 });
  const { data: occupancyData }            = useQuery({ queryKey: ['sa-occ'],      queryFn: superAdminApi.getOccupancyData,      staleTime: 300000 });
  const { data: distributionData }         = useQuery({ queryKey: ['sa-dist'],     queryFn: superAdminApi.getStandDistribution,  staleTime: 300000 });
  const { data: activityData }             = useQuery({ queryKey: ['sa-activity'], queryFn: superAdminApi.getHourlyActivity,     staleTime: 60000, refetchInterval: 60000 });

  const fmt = (n) => new Intl.NumberFormat('en-IN').format(n);

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

  return (
    <>
      <style>{css}</style>
      <div className="db-wrap" style={{ padding: '28px 32px', minHeight: '100vh', background: '#f7f7f7' }}>

        {/* ── Header ── */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <div style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 28, letterSpacing: '-0.02em',
              color: '#0a0a0a', lineHeight: 1, fontStyle: 'italic',
            }}>
              Overview
            </div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#aaa', marginTop: 4, letterSpacing: '.04em' }}>
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <FaSearch style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#bbb', fontSize: 12, pointerEvents: 'none' }} />
              <input
                placeholder="Search stands, admins…"
                style={{
                  background: '#fff', border: '1px solid #ebebeb', borderRadius: 10,
                  padding: '9px 14px 9px 32px', fontSize: 13, color: '#0a0a0a',
                  width: 220, fontFamily: 'DM Sans, sans-serif', transition: 'all 0.15s',
                }}
              />
            </div>
            <button
              onClick={() => navigate('/superadmin/stands/create')}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 18px', background: '#0a0a0a', color: '#fff',
                border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 13,
                fontFamily: 'DM Sans, sans-serif', cursor: 'pointer', transition: 'all .14s',
              }}
            >
              <FaPlus size={11} /> Add Stand
            </button>
          </div>
        </div>

        {/* ── KPI Row — 6 columns ── */}
        <span className="section-label">Performance Summary</span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12, marginBottom: 20 }}>
          <KPI label="Total Stands"    value={fmt(stats?.totalStands || 0)}      icon={FaBuilding}                    color="#1d4ed8" trend={8.2}  sub="2 new this month" />
          <KPI label="Stand Admins"    value={fmt(stats?.totalStandAdmins || 0)} icon={MdOutlineAdminPanelSettings}   color="#059669" trend={4.1}  sub="all active" />
          <KPI label="Total Staff"     value={fmt(stats?.totalStaff || 0)}        icon={FaUsers}                       color="#d97706" trend={-1.2} sub="3 on leave" />
          <KPI label="Active Parkings" value={fmt(stats?.activeParkings || 0)}    icon={RiParkingBoxLine}              color="#0d9488" trend={15.3} sub="live right now" />
          <KPI
            label="Today's Revenue"
            value={`₹${stats?.todayRevenue?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}`}
            icon={FaMoneyBillWave} color="#7c3aed" trend={12.4} sub="vs yesterday"
          />
          <KPI
            label="Monthly Revenue"
            value={`₹${((stats?.monthlyRevenue || 0) / 1000).toFixed(1)}k`}
            icon={FaChartLine} color="#0a0a0a" trend={22.1} sub="on record pace"
          />
        </div>

        {/* ── Financial Charts ── */}
        <span className="section-label">Financial Analytics</span>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14, marginBottom: 14 }}>

          {/* Revenue Area */}
          <ChartCard title="Revenue, Profit & Expenses" badge="All Stands">
            <ResponsiveContainer width="100%" height={268}>
              <AreaChart data={revenueData || []} margin={{ top: 8, right: 4, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="gRev2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#0a0a0a" stopOpacity={.12} />
                    <stop offset="95%" stopColor="#0a0a0a" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gPro2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#0d9488" stopOpacity={.12} />
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gExp2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#d97706" stopOpacity={.10} />
                    <stop offset="95%" stopColor="#d97706" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontFamily: 'DM Mono, monospace', fontSize: 10, fill: '#aaa' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontFamily: 'DM Mono, monospace', fontSize: 10, fill: '#aaa' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip prefix="₹" />} />
                <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 11, color: '#aaa', paddingTop: 12, fontFamily: 'DM Mono, monospace' }} />
                <Area type="monotone" dataKey="revenue"  name="Revenue"  stroke="#0a0a0a" strokeWidth={2.5} fill="url(#gRev2)" dot={false} activeDot={{ r: 5, strokeWidth: 0 }} />
                <Area type="monotone" dataKey="profit"   name="Profit"   stroke="#0d9488" strokeWidth={2.5} fill="url(#gPro2)" dot={false} activeDot={{ r: 5, strokeWidth: 0 }} />
                <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#d97706" strokeWidth={2}   fill="url(#gExp2)" dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Donut — Stand Distribution */}
          <ChartCard title="Stand Distribution">
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

          {/* Weekly Occupancy */}
          <ChartCard title="Weekly Occupancy Rate" badge="This Week" badgeColor="teal">
            <ResponsiveContainer width="100%" height={228}>
              <BarChart data={occupancyData || []} margin={{ top: 8, right: 4, left: -22, bottom: 0 }} barSize={28}>
                <defs>
                  <linearGradient id="barG2" x1="0" y1="0" x2="0" y2="1">
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
                <Bar dataKey="value" name="Occupancy %" fill="url(#barG2)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Hourly Activity */}
          <ChartCard title="Today's Vehicle Activity" badge="Live" badgeColor="green">
            <ResponsiveContainer width="100%" height={228}>
              <ComposedChart data={activityData || []} margin={{ top: 8, right: 4, left: -22, bottom: 0 }}>
                <defs>
                  <linearGradient id="actG2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#0d9488" stopOpacity={.15} />
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="hour" tick={{ fontFamily: 'DM Mono, monospace', fontSize: 10, fill: '#aaa' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontFamily: 'DM Mono, monospace', fontSize: 10, fill: '#aaa' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="vehicles" fill="url(#actG2)" stroke="none" />
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
              { Icon: FiCheckCircle,   iconColor: '#059669', bg: '#f0fdf4', title: 'New stand created',      sub: 'Main Street Parking · 2 hours ago' },
              { Icon: FiUserPlus,      iconColor: '#1d4ed8', bg: '#eff6ff', title: 'New admin added',         sub: 'John Doe · Downtown Mall · 4 hours ago' },
              { Icon: FiAward,         iconColor: '#d97706', bg: '#fffbeb', title: 'Revenue milestone hit',   sub: '₹50,000 reached this month · 1 day ago' },
              { Icon: FiActivity,      iconColor: '#0d9488', bg: '#f0fdfa', title: 'Peak occupancy reached',  sub: 'Airport Stand · 95% · 1 day ago' },
              { Icon: FiAlertTriangle, iconColor: '#dc2626', bg: '#fef2f2', title: 'Staff alert resolved',    sub: 'Suburban East · 2 days ago' },
            ].map((item, i, arr) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: 12,
                padding: '11px 0',
                borderBottom: i < arr.length - 1 ? '1px solid #f5f5f5' : 'none',
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 9,
                  background: item.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
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
                { Icon: HiOutlineBuildingOffice2, label: 'Add Stand',    desc: 'Register a new parking stand', color: '#1d4ed8', bg: '#eff6ff' },
                { Icon: FiUserPlus,               label: 'Add Admin',    desc: 'Assign stand administrator',  color: '#059669', bg: '#f0fdf4' },
                { Icon: FiBarChart2,              label: 'View Reports', desc: 'Export financial reports',     color: '#d97706', bg: '#fffbeb' },
                { Icon: FiSettings,               label: 'Settings',     desc: 'System configuration',        color: '#7c3aed', bg: '#f5f3ff' },
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