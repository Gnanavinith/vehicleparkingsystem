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
import { BiTrendingUp } from 'react-icons/bi';

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
    { name: 'Zone A', value: 35, color: '#6366f1' },
    { name: 'Zone B', value: 25, color: '#22d3ee' },
    { name: 'Zone C', value: 20, color: '#f59e0b' },
    { name: 'Zone D', value: 20, color: '#10b981' },
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

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
  bg: '#f1f5f9',
  card: '#ffffff',
  border: '#e2e8f0',
  text: '#0f172a',
  sub: '#475569',
  muted: '#94a3b8',
  accent: '#6366f1',
  accentLight: '#eef2ff',
  green: '#10b981',
  greenLight: '#d1fae5',
  amber: '#f59e0b',
  amberLight: '#fef3c7',
  red: '#ef4444',
  redLight: '#fee2e2',
  cyan: '#0ea5e9',
  cyanLight: '#e0f2fe',
  purple: '#8b5cf6',
  purpleLight: '#ede9fe',
  teal: '#14b8a6',
  tealLight: '#ccfbf1',
};

// ─── Custom Tooltip ────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label, prefix = '' }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: C.card, border: `1px solid ${C.border}`, borderRadius: 10,
      padding: '10px 14px', boxShadow: '0 8px 24px rgba(15,23,42,0.1)',
      fontFamily: 'Inter, sans-serif', minWidth: 140,
    }}>
      <p style={{ color: C.muted, fontSize: 11, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
      {payload.map((p, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: p.color, flexShrink: 0 }} />
          <span style={{ color: C.sub, fontSize: 12 }}>{p.name}:</span>
          <span style={{ color: C.text, fontSize: 12, fontWeight: 700 }}>
            {prefix}{typeof p.value === 'number' && p.value > 999 ? p.value.toLocaleString() : p.value}
          </span>
        </div>
      ))}
    </div>
  );
};

// ─── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, Icon, iconBg, iconColor, trend, trendLabel, accentBar }) => (
  <div style={{
    background: C.card, border: `1px solid ${C.border}`, borderRadius: 14,
    padding: '20px', display: 'flex', flexDirection: 'column', gap: 14,
    boxShadow: '0 1px 3px rgba(15,23,42,0.06)',
    transition: 'box-shadow 0.18s, transform 0.18s',
    cursor: 'default', overflow: 'hidden', position: 'relative',
    fontFamily: 'Inter, sans-serif',
  }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(15,23,42,0.1)'; }}
    onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 1px 3px rgba(15,23,42,0.06)'; }}
  >
    {/* top accent stripe */}
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: accentBar, borderRadius: '14px 14px 0 0' }} />
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ width: 40, height: 40, borderRadius: 11, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon style={{ color: iconColor, fontSize: 17 }} />
      </div>
      {trend !== undefined && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600,
          color: trend >= 0 ? C.green : C.red,
          background: trend >= 0 ? C.greenLight : C.redLight,
          padding: '3px 8px', borderRadius: 20,
        }}>
          {trend >= 0 ? <FiTrendingUp size={12} /> : <FiTrendingDown size={12} />}
          {Math.abs(trend)}%
        </div>
      )}
    </div>
    <div>
      <p style={{ fontSize: 24, fontWeight: 700, color: C.text, letterSpacing: '-0.025em', margin: 0 }}>{value}</p>
      <p style={{ fontSize: 12.5, color: C.sub, marginTop: 3, margin: 0 }}>{label}</p>
    </div>
    {trendLabel && <p style={{ fontSize: 11, color: C.muted, margin: 0 }}>{trendLabel}</p>}
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
        <span style={{ fontSize: 11, fontWeight: 600, background: badgeColor, color: badgeText, padding: '3px 10px', borderRadius: 20 }}>
          {badge}
        </span>
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
  const { data: revenueData }      = useQuery({ queryKey: ['stand-revenue'], queryFn: standAdminApi.getRevenueChart, staleTime: 300000 });
  const { data: occupancyData }    = useQuery({ queryKey: ['stand-occupancy'], queryFn: standAdminApi.getOccupancyData, staleTime: 300000 });
  const { data: distributionData } = useQuery({ queryKey: ['stand-dist'], queryFn: standAdminApi.getZoneDistribution, staleTime: 300000 });
  const { data: activityData }     = useQuery({ queryKey: ['stand-activity'], queryFn: standAdminApi.getHourlyActivity, staleTime: 300000 });

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
        .qa-btn:hover { background: ${C.accentLight} !important; border-color: ${C.accent}55 !important; transform: translateY(-1px); box-shadow: 0 4px 14px rgba(99,102,241,0.1) !important; }
        .qa-btn { transition: all 0.15s ease !important; }
        input:focus { border-color: ${C.accent} !important; box-shadow: 0 0 0 3px ${C.accentLight} !important; outline: none; }
      `}</style>

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: C.text, letterSpacing: '-0.025em', margin: 0 }}>Overview</h1>
          <p style={{ fontSize: 13, color: C.sub, marginTop: 4 }}>Welcome back — here's your parking stand at a glance.</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <FaSearch style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: C.muted, fontSize: 13, pointerEvents: 'none' }} />
            <input placeholder="Search staff, parkings…" style={{
              background: C.card, border: `1px solid ${C.border}`, borderRadius: 10,
              padding: '8px 14px 8px 32px', fontSize: 13, color: C.text, width: 220,
              fontFamily: 'Inter, sans-serif', transition: 'all 0.15s',
            }} />
          </div>
          <button onClick={() => navigate('/standadmin/create-staff')} style={{
            background: C.accent, color: '#fff', border: 'none', borderRadius: 10,
            padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 7,
            boxShadow: '0 2px 8px rgba(99,102,241,0.35)', fontFamily: 'Inter, sans-serif',
          }}>
            <FaPlus size={11} /> Add Staff
          </button>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <SectionLabel>Performance Summary</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        <StatCard label="Total Staff" value={stats?.totalStaff || 0} Icon={FaUsers} iconBg={C.accentLight} iconColor={C.accent} trend={8.2} trendLabel="2 new this month" accentBar={`linear-gradient(90deg, ${C.accent}, #818cf8)`} />
        <StatCard label="Active Parkings" value={stats?.activeParkings || 0} Icon={RiParkingBoxLine} iconBg={C.greenLight} iconColor={C.green} trend={15.3} trendLabel="Live right now" accentBar={`linear-gradient(90deg, ${C.green}, #34d399)`} />
        <StatCard
          label="Today's Revenue"
          value={`$${stats?.todayRevenue?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}`}
          Icon={FaDollarSign} iconBg={C.amberLight} iconColor={C.amber} trend={12.4} trendLabel="vs $1,096 yesterday"
          accentBar={`linear-gradient(90deg, ${C.amber}, #fbbf24)`}
        />
        <StatCard label="Occupancy Rate" value={`${stats?.occupancyRate || 0}%`} Icon={FaChartLine} iconBg={C.cyanLight} iconColor={C.cyan} trend={-3.2} trendLabel="Target: 80%" accentBar={`linear-gradient(90deg, ${C.cyan}, #38bdf8)`} />
      </div>

      {/* ── Financial Charts ── */}
      <SectionLabel>Financial Analytics</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 16 }}>

        {/* Revenue Area */}
        <ChartCard title="Revenue, Profit & Expenses" subtitle="8-month financial overview" badge="Your Stand">
          <ResponsiveContainer width="100%" height={268}>
            <AreaChart data={revenueData || []} margin={{ top: 8, right: 4, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={C.accent} stopOpacity={0.15} />
                  <stop offset="100%" stopColor={C.accent} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gPro" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={C.green} stopOpacity={0.15} />
                  <stop offset="100%" stopColor={C.green} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gExp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={C.amber} stopOpacity={0.12} />
                  <stop offset="100%" stopColor={C.amber} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke={C.border} vertical={false} />
              <XAxis dataKey="date" tick={{ fill: C.muted, fontSize: 11, fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: C.muted, fontSize: 11, fontFamily: 'Inter' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip prefix="$" />} />
              <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 12, color: C.sub, paddingTop: 12, fontFamily: 'Inter' }} />
              <Area type="monotone" dataKey="revenue"  name="Revenue"  stroke={C.accent} strokeWidth={2.5} fill="url(#gRev)" dot={false} activeDot={{ r: 5, strokeWidth: 0 }} />
              <Area type="monotone" dataKey="profit"   name="Profit"   stroke={C.green}  strokeWidth={2.5} fill="url(#gPro)" dot={false} activeDot={{ r: 5, strokeWidth: 0 }} />
              <Area type="monotone" dataKey="expenses" name="Expenses" stroke={C.amber}  strokeWidth={2}   fill="url(#gExp)" dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Donut + legend */}
        <ChartCard title="Zone Distribution" subtitle="By parking area">
          <ResponsiveContainer width="100%" height={170}>
            <PieChart>
              <Pie data={distributionData || []} cx="50%" cy="50%" innerRadius={50} outerRadius={74} paddingAngle={3} dataKey="value">
                {(distributionData || []).map((e, i) => <Cell key={i} fill={e.color} strokeWidth={0} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '7px 14px', marginTop: 8 }}>
            {(distributionData || []).map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <span style={{ width: 9, height: 9, borderRadius: 3, background: item.color, flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: C.sub, flex: 1 }}>{item.name}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{item.value}%</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* ── Operations Charts ── */}
      <SectionLabel>Operational Insights</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>

        {/* Occupancy Bar */}
        <ChartCard title="Weekly Occupancy Rate" subtitle="% capacity used per day" badge="This Week" badgeColor={C.tealLight} badgeText={C.teal}>
          <ResponsiveContainer width="100%" height={228}>
            <BarChart data={occupancyData || []} margin={{ top: 8, right: 4, left: -22, bottom: 0 }} barSize={28}>
              <defs>
                <linearGradient id="barG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={C.accent} />
                  <stop offset="100%" stopColor="#818cf8" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke={C.border} vertical={false} />
              <XAxis dataKey="name" tick={{ fill: C.muted, fontSize: 11, fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: C.muted, fontSize: 11, fontFamily: 'Inter' }} axisLine={false} tickLine={false} domain={[0, 100]} tickFormatter={v => `${v}%`} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={80} stroke={C.red} strokeDasharray="4 3" strokeWidth={1.5}
                label={{ value: 'Target 80%', fill: C.red, fontSize: 10, position: 'insideTopRight', fontFamily: 'Inter' }} />
              <Bar dataKey="value" name="Occupancy %" fill="url(#barG)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Hourly Activity */}
        <ChartCard title="Today's Vehicle Activity" subtitle="Hourly inflow at your stand" badge="Live" badgeColor={C.greenLight} badgeText={C.green}>
          <ResponsiveContainer width="100%" height={228}>
            <ComposedChart data={activityData || []} margin={{ top: 8, right: 4, left: -22, bottom: 0 }}>
              <defs>
                <linearGradient id="actG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={C.cyan} stopOpacity={0.18} />
                  <stop offset="100%" stopColor={C.cyan} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke={C.border} vertical={false} />
              <XAxis dataKey="hour" tick={{ fill: C.muted, fontSize: 11, fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: C.muted, fontSize: 11, fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              {/* Area fill under the line */}
              <Area type="monotone" dataKey="vehicles" fill="url(#actG)" stroke="none" />
              <Line type="monotone" dataKey="vehicles" name="Vehicles" stroke={C.cyan} strokeWidth={2.5}
                dot={{ fill: C.cyan, r: 4, strokeWidth: 0 }} activeDot={{ r: 6, fill: C.cyan, strokeWidth: 0 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* ── Bottom: Activity + Quick Actions ── */}
      <SectionLabel>Activity & Actions</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        {/* Activity Feed */}
        <ChartCard title="Recent Activity" subtitle="Latest events at your stand">
          {[
            { Icon: FiCheckCircle,  iconBg: C.greenLight,  iconColor: C.green,  title: 'New staff member added',    sub: 'Sarah Johnson · 2 hours ago' },
            { Icon: FiUserPlus,     iconBg: C.accentLight, iconColor: C.accent, title: 'Parking space assigned',     sub: 'Vehicle #ABC123 · 4 hours ago' },
            { Icon: FiAward,        iconBg: C.amberLight,  iconColor: C.amber,  title: 'Revenue milestone hit',     sub: '$1,000 reached today · 1 day ago' },
            { Icon: FiActivity,     iconBg: C.cyanLight,   iconColor: C.cyan,   title: 'Peak occupancy reached',    sub: 'Zone B · 95% · 1 day ago' },
            { Icon: FiAlertTriangle,iconBg: C.redLight,    iconColor: C.red,    title: 'Maintenance required',      sub: 'Zone C lighting · 2 days ago' },
          ].map((item, i, arr) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: 12,
              padding: '11px 0',
              borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none',
            }}>
              <div style={{ width: 35, height: 35, borderRadius: 10, background: item.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <item.Icon style={{ color: item.iconColor, fontSize: 15 }} />
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: C.text, margin: 0 }}>{item.title}</p>
                <p style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{item.sub}</p>
              </div>
            </div>
          ))}
        </ChartCard>

        {/* Quick Actions */}
        <ChartCard title="Quick Actions" subtitle="Common tasks for stand admin">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 4 }}>
            {[
              { Icon: FaUsers,        label: 'Add Staff',     desc: 'Register new staff member',     iconBg: C.accentLight, iconColor: C.accent },
              { Icon: RiParkingBoxLine, label: 'New Parking', desc: 'Create parking record',         iconBg: C.greenLight,  iconColor: C.green  },
              { Icon: FiBarChart2,    label: 'View Reports',  desc: 'Export daily reports',          iconBg: C.amberLight,  iconColor: C.amber  },
              { Icon: FiSettings,     label: 'Settings',      desc: 'Stand configuration',          iconBg: C.purpleLight, iconColor: C.purple },
            ].map((a, i) => (
              <button key={i} className="qa-btn" style={{
                background: C.bg, border: `1px solid ${C.border}`, borderRadius: 12,
                padding: '16px', textAlign: 'left', cursor: 'pointer', width: '100%',
                boxShadow: '0 1px 2px rgba(15,23,42,0.04)',
                fontFamily: 'Inter, sans-serif',
              }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: a.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                  <a.Icon style={{ color: a.iconColor, fontSize: 17 }} />
                </div>
                <p style={{ fontSize: 13, fontWeight: 600, color: C.text, margin: '0 0 3px' }}>{a.label}</p>
                <p style={{ fontSize: 11.5, color: C.muted, margin: 0, lineHeight: 1.4 }}>{a.desc}</p>
              </button>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  );
};

export default Dashboard;