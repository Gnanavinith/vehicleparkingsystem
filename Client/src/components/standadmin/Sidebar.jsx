import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '@/redux/slices/authSlice';
import { FaHome, FaUsers, FaCar, FaChartBar, FaDollarSign, FaSignOutAlt } from 'react-icons/fa';

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.35} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
  .sta-sidebar { animation: fadeUp 0.3s ease; }
  .sta-nav::-webkit-scrollbar { width: 3px; }
  .sta-nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; }
  .sta-nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 11px; border-radius: 10px;
    font-size: 13px; font-weight: 500; color: #64748b;
    text-decoration: none; transition: all 0.18s ease;
    position: relative; white-space: nowrap; width: 100%;
    border: none; background: transparent; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
  }
  .sta-nav-item:hover { background: #f1f5f9; color: #475569; }
  .sta-nav-item.active { background: rgba(20,184,166,0.1); color: #0f766e; }
  .sta-nav-item.active svg { stroke: #0f766e; }
  .sta-nav-item.active::before {
    content: ''; position: absolute; left: 0; top: 50%;
    transform: translateY(-50%); width: 3px; height: 58%;
    background: #14b8a6; border-radius: 0 3px 3px 0;
  }
  .sta-nav-item.danger:hover { background: #fee2e2; color: #ef4444; }
  .sta-nav-item.danger:hover svg { stroke: #ef4444; }
`;

const S = {
  sidebar: {
    width: 240, height: '100vh', background: '#ffffff',
    borderRight: '1px solid #e2e8f0',
    display: 'flex', flexDirection: 'column',
    position: 'fixed', left: 0, top: 0, zIndex: 50,
    fontFamily: "'DM Sans', sans-serif",
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)'
  },
  header: {
    padding: '18px 14px 14px',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex', alignItems: 'center', gap: 10,
  },
  logoMark: {
    width: 32, height: 32, borderRadius: 9, background: '#0f766e',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    boxShadow: '0 1px 3px 0 rgba(15, 118, 110, 0.3)'
  },
  brandName: { fontSize: 13.5, fontWeight: 700, color: '#1e293b', letterSpacing: '-0.02em', lineHeight: 1.2 },
  chip: {
    display: 'inline-flex', fontSize: 9.5, fontWeight: 600, letterSpacing: '0.03em',
    padding: '2px 7px', borderRadius: 20, marginTop: 3,
    background: 'rgba(20,184,166,0.1)', color: '#0f766e',
    fontFamily: "'DM Mono', monospace",
  },
  metrics: {
    display: 'flex', gap: 8, padding: '10px 14px',
    borderBottom: '1px solid #e2e8f0',
    background: '#f8fafc'
  },
  metric: {
    flex: 1, background: '#ffffff', borderRadius: 8, padding: '7px 10px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
  },
  metricVal: { fontSize: 17, fontWeight: 700, fontFamily: "'DM Mono', monospace", lineHeight: 1, color: '#1e293b' },
  metricLabel: { fontSize: 10, color: '#94a3b8', marginTop: 2 },
  nav: { flex: 1, overflowY: 'auto', padding: '10px 8px', background: '#ffffff' },
  sectionLabel: {
    display: 'block', fontSize: 9.5, fontWeight: 700,
    letterSpacing: '0.09em', textTransform: 'uppercase',
    color: '#94a3b8', padding: '0 11px', margin: '14px 0 3px',
  },
  footer: { padding: '10px 8px', borderTop: '1px solid #e2e8f0', background: '#ffffff' },
  userRow: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '7px 11px', marginBottom: 4,
    background: '#f8fafc', borderRadius: 10,
    border: '1px solid #e2e8f0'
  },
  avatar: {
    width: 28, height: 28, borderRadius: 8, flexShrink: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 11, fontWeight: 700, fontFamily: "'DM Mono', monospace",
    background: 'rgba(20,184,166,0.1)', color: '#0f766e',
    border: '1px solid rgba(20,184,166,0.2)'
  },
  userName: { fontSize: 12.5, fontWeight: 600, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  userEmail: { fontSize: 10.5, color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
};

const NavIcon = ({ icon: Icon }) => <Icon size={15} />;

const MENU = [
  {
    section: 'Operations',
    items: [
      { title: 'Dashboard',       path: '/standadmin/dashboard', icon: FaHome },
      { title: 'Staff Management',path: '/standadmin/staff',     icon: FaUsers },
      { title: 'Parkings',        path: '/standadmin/parkings',  icon: FaCar },
      { title: 'Reports',         path: '/standadmin/reports',   icon: FaChartBar },
      { title: 'Pricing Settings', path: '/standadmin/pricing',  icon: FaDollarSign },
    ],
  },
];

const StandAdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const isActive = (p) => location.pathname === p;

  const initials = user?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'SA';

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <>
      <style>{css}</style>
      <aside style={S.sidebar} className="sta-sidebar">

        {/* Header */}
        <div style={S.header}>
          <div style={S.logoMark}>
            <svg width="17" height="17" fill="none" stroke="#fff" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <div style={S.brandName}>{user?.standName || 'Stand HQ'}</div>
            <span style={S.chip}>Stand Admin</span>
          </div>
        </div>

       

        {/* Nav */}
        <nav style={S.nav} className="sta-nav">
          {MENU.map(({ section, items }) => (
            <React.Fragment key={section}>
              <span style={S.sectionLabel}>{section}</span>
              {items.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`sta-nav-item${isActive(item.path) ? ' active' : ''}`}
                >
                  <NavIcon icon={item.icon} />
                  {item.title}
                </Link>
              ))}
            </React.Fragment>
          ))}
        </nav>

        {/* Footer */}
        <div style={S.footer}>
          <div style={S.userRow}>
            <div style={S.avatar}>{initials}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={S.userName}>{user?.name || 'Admin'}</div>
              <div style={S.userEmail}>{user?.email || 'admin@stand.com'}</div>
            </div>
          </div>
          <button onClick={handleLogout} className="sta-nav-item danger">
            <NavIcon icon={FaSignOutAlt} />
            Sign out
          </button>
        </div>

      </aside>
    </>
  );
};

export default StandAdminSidebar;