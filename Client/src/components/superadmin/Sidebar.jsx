import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { FaHome, FaBuilding, FaUsers, FaChartBar, FaDollarSign, FaCog, FaSignOutAlt } from 'react-icons/fa';

/* ── Inline styles (no Tailwind dependency) ── */
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
    width: 32, height: 32, borderRadius: 9,
    background: '#6366f1', display: 'flex',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    boxShadow: '0 1px 3px 0 rgba(99, 102, 241, 0.3)'
  },
  brandName: {
    fontSize: 13.5, fontWeight: 700, color: '#1e293b',
    letterSpacing: '-0.02em', lineHeight: 1.2,
  },
  chip: {
    display: 'inline-flex', alignItems: 'center',
    fontSize: 9.5, fontWeight: 600, letterSpacing: '0.03em',
    padding: '2px 7px', borderRadius: 20, marginTop: 3,
    background: 'rgba(99,102,241,0.1)', color: '#6366f1',
    fontFamily: "'DM Mono', monospace",
  },
  nav: {
    flex: 1, overflowY: 'auto', padding: '10px 8px',
    background: '#ffffff'
  },
  sectionLabel: {
    display: 'block', fontSize: 9.5, fontWeight: 700,
    letterSpacing: '0.09em', textTransform: 'uppercase',
    color: '#94a3b8', padding: '0 11px', margin: '14px 0 3px',
  },
  footer: {
    padding: '10px 8px',
    borderTop: '1px solid #e2e8f0',
    background: '#ffffff'
  },
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
    background: 'rgba(99,102,241,0.1)', color: '#6366f1',
    border: '1px solid rgba(99,102,241,0.2)'
  },
  userName: { fontSize: 12.5, fontWeight: 600, color: '#1e293b', lineHeight: 1.3 },
  userSub: {
    fontSize: 10.5, color: '#64748b',
    display: 'flex', alignItems: 'center', gap: 5,
  },
  liveDot: {
    width: 6, height: 6, borderRadius: '50%',
    background: '#34d399', flexShrink: 0,
    animation: 'pulse 2s infinite',
  },
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.35} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
  .sa-sidebar { animation: fadeUp 0.3s ease; }
  .sa-nav::-webkit-scrollbar { width: 3px; }
  .sa-nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; }
  .sa-nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 11px; border-radius: 10px;
    font-size: 13px; font-weight: 500; color: #64748b;
    text-decoration: none; transition: all 0.18s ease;
    position: relative; white-space: nowrap; width: 100%;
    border: none; background: transparent; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
  }
  .sa-nav-item:hover { background: #f1f5f9; color: #475569; }
  .sa-nav-item.active {
    background: rgba(99,102,241,0.1); color: #6366f1;
  }
  .sa-nav-item.active svg { stroke: #6366f1; }
  .sa-nav-item.active::before {
    content: ''; position: absolute; left: 0; top: 50%;
    transform: translateY(-50%); width: 3px; height: 58%;
    background: #6366f1; border-radius: 0 3px 3px 0;
  }
  .sa-nav-item.danger:hover { background: #fee2e2; color: #ef4444; }
  .sa-nav-item.danger:hover svg { stroke: #ef4444; }
  .sa-badge {
    margin-left: auto; font-size: 10px; font-weight: 600;
    padding: 1px 6px; border-radius: 20px;
    background: rgba(52,211,153,0.1); color: #059669;
    font-family: 'DM Mono', monospace;
  }
`;

const NavIcon = ({ icon: Icon, badge }) => (
  <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <Icon size={15} />
    {badge && (
      <span style={{
        position: 'absolute',
        top: '-5px',
        right: '-8px',
        background: '#34d399',
        color: 'white',
        fontSize: '9px',
        fontWeight: '600',
        minWidth: '16px',
        height: '16px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 4px',
        fontFamily: "'DM Mono', monospace"
      }}>
        {badge}
      </span>
    )}
  </div>
);

const MENU = [
  {
    section: 'Management',
    items: [
      { title: 'Dashboard',     path: '/superadmin/dashboard', icon: FaHome },
      { title: 'Vehicle Stands',path: '/superadmin/stands',    icon: FaBuilding },
    ],
  },
  {
    section: 'Analytics',
    items: [
      { title: 'Reports', path: '/superadmin/reports', badge: 'Live', icon: FaChartBar },
    ],
  },
  {
    section: 'System',
    items: [
      { title: 'Pricing',  path: '/superadmin/pricing',  icon: FaDollarSign },
      { title: 'Settings', path: '/superadmin/settings', icon: FaCog },
    ],
  },
];

const SuperAdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isActive = (p) => location.pathname === p;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <>
      <style>{css}</style>
      <aside style={S.sidebar} className="sa-sidebar">

        {/* Header */}
        <div style={S.header}>
          <div style={S.logoMark}>
            <svg width="17" height="17" fill="none" stroke="#fff" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <div style={S.brandName}>ParkingPro</div>
            <span style={S.chip}>Super Admin</span>
          </div>
        </div>

        {/* Nav */}
        <nav style={S.nav} className="sa-nav">
          {MENU.map(({ section, items }) => (
            <React.Fragment key={section}>
              <span style={S.sectionLabel}>{section}</span>
              {items.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`sa-nav-item${isActive(item.path) ? ' active' : ''}`}
                >
                  <NavIcon icon={item.icon} badge={item.badge} />
                  {item.title}
                </Link>
              ))}
            </React.Fragment>
          ))}
        </nav>

        {/* Footer */}
        <div style={S.footer}>
          <div style={S.userRow}>
            <div style={S.avatar}>SA</div>
            <div>
              <div style={S.userName}>Super Admin</div>
              <div style={S.userSub}>
                <span style={S.liveDot} />
                System active
              </div>
            </div>
          </div>
          <button onClick={handleLogout} className="sa-nav-item danger">
            <NavIcon icon={FaSignOutAlt} />
            Sign out
          </button>
        </div>

      </aside>
    </>
  );
};

export default SuperAdminSidebar;