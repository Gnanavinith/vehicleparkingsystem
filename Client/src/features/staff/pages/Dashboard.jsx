import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getAllParkings, getTodayParkings, getActiveParkings } from '../api';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { FaCar, FaMotorcycle, FaBicycle, FaRupeeSign, FaArrowUp, FaArrowDown } from 'react-icons/fa';

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500;600&family=DM+Sans:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

  @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
  @keyframes countUp { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:none} }

  .db-wrap { font-family:'DM Sans',sans-serif; animation:fadeUp .28s ease; }

  .db-card {
    background:#fff; border-radius:16px;
    border:1px solid #ebebeb;
    transition:box-shadow .18s;
  }
  .db-card:hover { box-shadow:0 4px 20px rgba(0,0,0,.06); }

  .kpi-num {
    font-family:'DM Serif Display',serif;
    font-size:36px; letter-spacing:'-0.03em';
    line-height:1; animation:countUp .4s ease;
  }

  .chart-tooltip {
    background:#0a0a0a; border:none; border-radius:8px;
    padding:8px 12px; font-family:'DM Mono',monospace; font-size:11px; color:#fff;
  }

  .activity-dot {
    width:8px; height:8px; border-radius:50%; flex-shrink:0; margin-top:4px;
  }

  .quick-btn {
    display:flex; align-items:center; gap:12px;
    padding:14px 16px; border-radius:12px;
    text-decoration:none; border:1.5px solid #ebebeb;
    background:#fff; cursor:pointer; transition:all .14s;
    font-family:'DM Sans',sans-serif;
  }
  .quick-btn:hover { border-color:#0a0a0a; background:#fafafa; transform:translateY(-1px); box-shadow:0 4px 12px rgba(0,0,0,.08); }

  .shimmer {
    background:linear-gradient(90deg,#f5f5f5 25%,#ebebeb 50%,#f5f5f5 75%);
    background-size:200% 100%; animation:shimmer 1.2s infinite; border-radius:8px;
  }
  @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }

  .section-label {
    font-family:'DM Mono',monospace; font-size:9px; font-weight:600;
    letter-spacing:.14em; text-transform:uppercase; color:#aaa;
    margin-bottom:14px; display:block;
  }
`;

const VEHICLE_RATE = { car: 20, bike: 10, motorcycle: 10, cycle: 5 };
const VCOLORS = { car: '#1d4ed8', bike: '#d97706', motorcycle: '#d97706', cycle: '#0d9488' };
const PIE_COLORS = ['#0a0a0a', '#d97706', '#0d9488', '#1d4ed8'];

const fmt = (n) => new Intl.NumberFormat('en-IN').format(n);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      {label && <div style={{ color:'#888', marginBottom:4 }}>{label}</div>}
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || '#fff' }}>{p.name}: {p.value}</div>
      ))}
    </div>
  );
};

const Shimmer = ({ h = 200 }) => <div className="shimmer" style={{ height: h }} />;

export default function StaffDashboard() {
  const { data: allParkings = [], isLoading: loadingAll } = useQuery({
    queryKey: ['all-parkings'],
    queryFn: getAllParkings,
    refetchInterval: 30000,
  });

  const { data: todayParkings = [], isLoading: loadingToday } = useQuery({
    queryKey: ['today-parkings'],
    queryFn: getTodayParkings,
    refetchInterval: 30000,
  });

  const { data: activeParkings = [], isLoading: loadingActive } = useQuery({
    queryKey: ['active-parkings'],
    queryFn: getActiveParkings,
    refetchInterval: 15000,
  });

  const loading = loadingAll || loadingToday || loadingActive;

  // ── Derived metrics ──────────────────────────────────────────────
  const metrics = useMemo(() => {
    const today = todayParkings.length ? todayParkings : allParkings;
    const active = Array.isArray(activeParkings)
      ? activeParkings.length
      : allParkings.filter(p => p.status === 'active').length;
    const completed = today.filter(p => p.status === 'completed' || p.status === 'checked_out');
    const collection = completed.reduce((sum, p) => {
      const hrs = Math.max(1, Math.floor((new Date(p.updatedAt || Date.now()) - new Date(p.createdAt)) / 3600000));
      return sum + hrs * (VEHICLE_RATE[p.vehicleType] || 10);
    }, 0);
    return { active, total: today.length, completed: completed.length, collection };
  }, [allParkings, todayParkings, activeParkings]);

  // ── Hourly entry chart ────────────────────────────────────────────
  const hourlyData = useMemo(() => {
    const hours = Array.from({ length: 12 }, (_, i) => ({
      hour: `${(i + 7) % 24}:00`, entries: 0, exits: 0,
    }));
    const source = todayParkings.length ? todayParkings : allParkings;
    source.forEach(p => {
      const h = new Date(p.createdAt).getHours();
      const idx = h - 7;
      if (idx >= 0 && idx < 12) hours[idx].entries++;
      if ((p.status === 'completed' || p.status === 'checked_out') && p.updatedAt) {
        const eh = new Date(p.updatedAt).getHours();
        const ei = eh - 7;
        if (ei >= 0 && ei < 12) hours[ei].exits++;
      }
    });
    return hours;
  }, [allParkings, todayParkings]);

  // ── Vehicle type breakdown ────────────────────────────────────────
  const vehicleBreakdown = useMemo(() => {
    const counts = {};
    const source = todayParkings.length ? todayParkings : allParkings;
    source.forEach(p => { counts[p.vehicleType] = (counts[p.vehicleType] || 0) + 1; });
    return Object.entries(counts).map(([type, value]) => ({ name: type, value }));
  }, [allParkings, todayParkings]);

  // ── Revenue by vehicle type ───────────────────────────────────────
  const revenueByType = useMemo(() => {
    const rev = {};
    const source = todayParkings.length ? todayParkings : allParkings;
    source.filter(p => p.status === 'completed' || p.status === 'checked_out').forEach(p => {
      const hrs = Math.max(1, Math.floor((new Date(p.updatedAt || Date.now()) - new Date(p.createdAt)) / 3600000));
      rev[p.vehicleType] = (rev[p.vehicleType] || 0) + hrs * (VEHICLE_RATE[p.vehicleType] || 10);
    });
    return Object.entries(rev).map(([name, amount]) => ({ name, amount }));
  }, [allParkings, todayParkings]);

  // ── Duration distribution ─────────────────────────────────────────
  const durationData = useMemo(() => {
    const bins = { '<30m': 0, '30m-1h': 0, '1-2h': 0, '2-4h': 0, '>4h': 0 };
    const source = todayParkings.length ? todayParkings : allParkings;
    source.filter(p => p.status === 'completed' || p.status === 'checked_out').forEach(p => {
      const mins = Math.floor((new Date(p.updatedAt || Date.now()) - new Date(p.createdAt)) / 60000);
      if (mins < 30) bins['<30m']++;
      else if (mins < 60) bins['30m-1h']++;
      else if (mins < 120) bins['1-2h']++;
      else if (mins < 240) bins['2-4h']++;
      else bins['>4h']++;
    });
    return Object.entries(bins).map(([range, count]) => ({ range, count }));
  }, [allParkings, todayParkings]);

  // ── Recent activity ───────────────────────────────────────────────
  const recentActivity = useMemo(() => {
    const source = todayParkings.length ? todayParkings : allParkings;
    return [...source]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 6);
  }, [allParkings, todayParkings]);

  // ── Occupancy trend (rolling 15-min buckets) ──────────────────────
  const occupancyTrend = useMemo(() => {
    const source = todayParkings.length ? todayParkings : allParkings;
    const buckets = Array.from({ length: 8 }, (_, i) => ({
      t: `${7 + i * 1}:00`, active: 0,
    }));
    source.forEach(p => {
      const h = new Date(p.createdAt).getHours();
      const idx = h - 7;
      if (idx >= 0 && idx < 8) buckets[idx].active++;
    });
    // cumulative active
    let running = 0;
    return buckets.map(b => { running += b.active; return { ...b, active: running }; });
  }, [allParkings, todayParkings]);

  const KPI = ({ label, value, sub, icon: Icon, color, prefix = '' }) => (
    <div className="db-card" style={{ padding:'22px 24px' }}>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:12 }}>
        <span className="section-label" style={{ marginBottom:0 }}>{label}</span>
        <div style={{ width:34, height:34, borderRadius:9, background:`${color}12`, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <Icon size={15} color={color} />
        </div>
      </div>
      {loading ? <Shimmer h={42} /> : (
        <div className="kpi-num" style={{ color:'#0a0a0a' }}>{prefix}{fmt(value)}</div>
      )}
      {sub && <div style={{ fontSize:11.5, color:'#aaa', marginTop:6, fontFamily:'DM Mono,monospace' }}>{sub}</div>}
    </div>
  );

  return (
    <>
      <style>{css}</style>
      <div className="db-wrap" style={{ padding:'28px 32px', minHeight:'100vh', background:'#f7f7f7' }}>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:28 }}>
          <div>
            <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:28, letterSpacing:'-0.02em', color:'#0a0a0a', lineHeight:1, fontStyle:'italic' }}>
              Dashboard
            </div>
            <div style={{ fontFamily:'DM Mono,monospace', fontSize:11, color:'#aaa', marginTop:4, letterSpacing:'.04em' }}>
              {new Date().toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}
            </div>
          </div>
          <Link to="/staff/new-parking" style={{
            display:'flex', alignItems:'center', gap:8,
            padding:'10px 18px', background:'#0a0a0a', color:'#fff',
            borderRadius:10, textDecoration:'none', fontWeight:700, fontSize:13,
            fontFamily:'DM Sans,sans-serif', transition:'all .14s',
          }}>
            + New Entry
          </Link>
        </div>

        {/* KPIs */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:20 }}>
          <KPI label="Active Now"       value={metrics.active}     icon={FaCar}        color="#059669" sub={`of ${metrics.total} total today`} />
          <KPI label="Total Entries"    value={metrics.total}      icon={FaCar}        color="#1d4ed8" sub="today" />
          <KPI label="Checked Out"      value={metrics.completed}  icon={FaMotorcycle} color="#7c3aed" sub="completed today" />
          <KPI label="Revenue"          value={metrics.collection} icon={FaRupeeSign}  color="#d97706" prefix="₹" sub="collected today" />
        </div>

        {/* Row 2: Area chart + Pie */}
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:14, marginBottom:14 }}>
          {/* Hourly traffic */}
          <div className="db-card" style={{ padding:'22px 24px' }}>
            <span className="section-label">Hourly Traffic — Entries vs Exits</span>
            {loading ? <Shimmer h={200} /> : (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={hourlyData} margin={{ top:4, right:4, left:-20, bottom:0 }}>
                  <defs>
                    <linearGradient id="gEntry" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#0a0a0a" stopOpacity={.15}/>
                      <stop offset="95%" stopColor="#0a0a0a" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="gExit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#d97706" stopOpacity={.12}/>
                      <stop offset="95%" stopColor="#d97706" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="hour" tick={{ fontFamily:'DM Mono,monospace', fontSize:10, fill:'#aaa' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontFamily:'DM Mono,monospace', fontSize:10, fill:'#aaa' }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="entries" name="Entries" stroke="#0a0a0a" strokeWidth={2} fill="url(#gEntry)" />
                  <Area type="monotone" dataKey="exits"   name="Exits"   stroke="#d97706" strokeWidth={2} fill="url(#gExit)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Vehicle type pie */}
          <div className="db-card" style={{ padding:'22px 24px' }}>
            <span className="section-label">Vehicle Mix</span>
            {loading ? <Shimmer h={200} /> : vehicleBreakdown.length === 0 ? (
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:200, color:'#ccc', fontSize:13, fontFamily:'DM Mono,monospace' }}>No data yet</div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={vehicleBreakdown} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                      {vehicleBreakdown.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display:'flex', flexWrap:'wrap', gap:'6px 14px', justifyContent:'center' }}>
                  {vehicleBreakdown.map((v, i) => (
                    <div key={v.name} style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, fontFamily:'DM Mono,monospace', color:'#555' }}>
                      <span style={{ width:8, height:8, borderRadius:2, background:PIE_COLORS[i % PIE_COLORS.length], flexShrink:0 }} />
                      {v.name} ({v.value})
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Row 3: Bar chart + Line chart */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
          {/* Revenue by type */}
          <div className="db-card" style={{ padding:'22px 24px' }}>
            <span className="section-label">Revenue by Vehicle Type (₹)</span>
            {loading ? <Shimmer h={180} /> : revenueByType.length === 0 ? (
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:180, color:'#ccc', fontSize:13, fontFamily:'DM Mono,monospace' }}>No checkouts yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={revenueByType} margin={{ top:4, right:4, left:-16, bottom:0 }} barCategoryGap="40%">
                  <XAxis dataKey="name" tick={{ fontFamily:'DM Mono,monospace', fontSize:10, fill:'#aaa', textTransform:'capitalize' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontFamily:'DM Mono,monospace', fontSize:10, fill:'#aaa' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="amount" name="₹ Revenue" radius={[6,6,0,0]}>
                    {revenueByType.map((entry, i) => (
                      <Cell key={i} fill={VCOLORS[entry.name] || '#0a0a0a'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Duration distribution */}
          <div className="db-card" style={{ padding:'22px 24px' }}>
            <span className="section-label">Parking Duration Distribution</span>
            {loading ? <Shimmer h={180} /> : (
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={durationData} margin={{ top:4, right:4, left:-16, bottom:0 }} barCategoryGap="30%">
                  <XAxis dataKey="range" tick={{ fontFamily:'DM Mono,monospace', fontSize:9.5, fill:'#aaa' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontFamily:'DM Mono,monospace', fontSize:10, fill:'#aaa' }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Vehicles" radius={[6,6,0,0]} fill="#0a0a0a" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Row 4: Occupancy trend + Recent activity */}
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:14 }}>
          {/* Cumulative occupancy line chart */}
          <div className="db-card" style={{ padding:'22px 24px' }}>
            <span className="section-label">Cumulative Occupancy Trend</span>
            {loading ? <Shimmer h={180} /> : (
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={occupancyTrend} margin={{ top:4, right:4, left:-20, bottom:0 }}>
                  <XAxis dataKey="t" tick={{ fontFamily:'DM Mono,monospace', fontSize:10, fill:'#aaa' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontFamily:'DM Mono,monospace', fontSize:10, fill:'#aaa' }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="active" name="Vehicles" stroke="#0d9488" strokeWidth={2.5} dot={{ r:4, fill:'#0d9488', strokeWidth:0 }} activeDot={{ r:6, fill:'#0d9488' }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Recent activity */}
          <div className="db-card" style={{ padding:'22px 24px', overflow:'hidden' }}>
            <span className="section-label">Recent Entries</span>
            {loading ? (
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {[...Array(5)].map((_,i) => <Shimmer key={i} h={36} />)}
              </div>
            ) : recentActivity.length === 0 ? (
              <div style={{ color:'#ccc', fontSize:12, fontFamily:'DM Mono,monospace' }}>No activity yet</div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
                {recentActivity.map((p, i) => {
                  const Icon = p.vehicleType === 'car' ? FaCar : p.vehicleType === 'cycle' ? FaBicycle : FaMotorcycle;
                  const color = VCOLORS[p.vehicleType] || '#555';
                  const mins = Math.floor((Date.now() - new Date(p.createdAt)) / 60000);
                  const timeAgo = mins < 60 ? `${mins}m ago` : `${Math.floor(mins/60)}h ago`;
                  return (
                    <div key={p._id || i} style={{
                      display:'flex', alignItems:'center', gap:10,
                      padding:'9px 0', borderBottom: i < recentActivity.length-1 ? '1px solid #f5f5f5' : 'none',
                    }}>
                      <div style={{ width:28, height:28, borderRadius:8, background:`${color}12`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                        <Icon size={12} color={color} />
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:12.5, fontWeight:600, color:'#0a0a0a', fontFamily:'DM Mono,monospace', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                          {p.vehicleNumber}
                        </div>
                        <div style={{ fontSize:10.5, color:'#aaa', fontFamily:'DM Mono,monospace', textTransform:'capitalize' }}>{p.vehicleType}</div>
                      </div>
                      <div style={{ fontSize:10, color:'#bbb', fontFamily:'DM Mono,monospace', flexShrink:0 }}>{timeAgo}</div>
                      <div style={{
                        width:6, height:6, borderRadius:'50%', flexShrink:0,
                        background: p.status === 'active' ? '#22c55e' : '#e5e5e5',
                      }} />
                    </div>
                  );
                })}
                <Link to="/staff/today-list" style={{ display:'block', marginTop:12, fontSize:11.5, fontWeight:700, color:'#0a0a0a', textDecoration:'none', fontFamily:'DM Mono,monospace', letterSpacing:'.04em' }}>
                  View all →
                </Link>
              </div>
            )}
          </div>
        </div>

      </div>
    </>
  );
}