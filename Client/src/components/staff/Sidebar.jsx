import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '@/redux/slices/authSlice';
import { FaHome, FaCar, FaSignOutAlt, FaUser, FaHistory, FaCog } from 'react-icons/fa';
import { MdPayment } from 'react-icons/md';

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.35} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
  .sf-sidebar { animation: fadeUp 0.3s ease; }
  .sf-nav::-webkit-scrollbar { width: 3px; }
  .sf-nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; }
  .sf-nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 11px; border-radius: 10px;
    font-size: 13px; font-weight: 500; color: #64748b;
    text-decoration: none; transition: all 0.18s ease;
    position: relative; white-space: nowrap; width: 100%;
    border: none; background: transparent; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
  }
  .sf-nav-item:hover { background: #f1f5f9; color: #475569; }
  .sf-nav-item.active { background: rgba(124,58,237,0.1); color: #7c3aed; }
  .sf-nav-item.active svg { stroke: #7c3aed; }
  .sf-nav-item.active::before {
    content: ''; position: absolute; left: 0; top: 50%;
    transform: translateY(-50%); width: 3px; height: 58%;
    background: #7c3aed; border-radius: 0 3px 3px 0;
  }
  .sf-nav-item.danger:hover { background: #fee2e2; color: #ef4444; }
  .sf-nav-item.danger:hover svg { stroke: #ef4444; }
  .sf-badge {
    margin-left: auto; font-size: 10px; font-weight: 600;
    padding: 1px 6px; border-radius: 20px;
    background: #7c3aed; color: #fff;
    font-family: 'DM Mono', monospace;
  }
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
    width: 32, height: 32, borderRadius: 9, background: '#7c3aed',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    boxShadow: '0 1px 3px 0 rgba(124, 58, 237, 0.3)'
  },
  brandName: { fontSize: 13.5, fontWeight: 700, color: '#1e293b', letterSpacing: '-0.02em', lineHeight: 1.2 },
  chip: {
    display: 'inline-flex', fontSize: 9.5, fontWeight: 600, letterSpacing: '0.03em',
    padding: '2px 7px', borderRadius: 20, marginTop: 3,
    background: 'rgba(124,58,237,0.1)', color: '#7c3aed',
    fontFamily: "'DM Mono', monospace",
  },
  shiftBar: {
    padding: '10px 14px',
    borderBottom: '1px solid #e2e8f0',
    background: '#f8fafc'
  },
  shiftInner: {
    background: '#ffffff', borderRadius: 8, padding: '8px 12px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    border: '1px solid #e2e8f0',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
  },
  shiftLabel: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 500, color: '#64748b' },
  shiftTime: { fontFamily: "'DM Mono', monospace", fontSize: 11, color: '#94a3b8' },
  liveDot: { width: 6, height: 6, borderRadius: '50%', background: '#34d399', flexShrink: 0, animation: 'pulse 2s infinite' },
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
    background: 'rgba(124,58,237,0.1)', color: '#7c3aed',
    border: '1px solid rgba(124,58,237,0.2)'
  },
  userName: { fontSize: 12.5, fontWeight: 600, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  userEmail: { fontSize: 10.5, color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
};

const NavIcon = ({ icon: Icon, badge }) => (
  <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <Icon size={15} />
    {badge && (
      <span style={{
        position: 'absolute',
        top: '-5px',
        right: '-8px',
        background: '#7c3aed',
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
    section: 'Actions',
    items: [
      { title: 'Dashboard',    path: '/staff/dashboard',   icon: FaHome },
      { title: 'New Parking',  path: '/staff/new-parking', icon: FaCar },
      { title: 'Checkout',     path: '/staff/checkout',    icon: MdPayment, badge: '3' },
      { title: "Today's List", path: '/staff/today-list',  icon: FaHistory },
      { title: 'Profile',      path: '/staff/profile',     icon: FaUser },
    ],
  },
];

const StaffSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const isActive = (p) => location.pathname === p;

  const initials = user?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'ST';

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <>
      <style>{css}</style>
      <aside style={S.sidebar} className="sf-sidebar">

        {/* Header */}
        <div style={S.header}>
          <div style={S.logoMark}>
            <svg width="17" height="17" fill="none" stroke="#fff" strokeWidth="2.2"
              strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <path d="M9 12h3a3 3 0 000-6H9v12" />
            </svg>
          </div>
          <div>
            <div style={S.brandName}>ParkingPro</div>
            <span style={S.chip}>Staff Portal</span>
          </div>
        </div>

        {/* Shift Status */}
        <div style={S.shiftBar}>
          <div style={S.shiftInner}>
            <div style={S.shiftLabel}>
              <span style={S.liveDot} />
              Shift active
            </div>
            <span style={S.shiftTime}>08:00 AM</span>
          </div>
        </div>

        {/* Nav */}
        <nav style={S.nav} className="sf-nav">
          {MENU.map(({ section, items }) => (
            <React.Fragment key={section}>
              <span style={S.sectionLabel}>{section}</span>
              {items.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`sf-nav-item${isActive(item.path) ? ' active' : ''}`}
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
            <div style={S.avatar}>{initials}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={S.userName}>{user?.name || 'Staff Member'}</div>
              <div style={S.userEmail}>{user?.email || 'staff@parking.com'}</div>
            </div>
          </div>
          <button onClick={handleLogout} className="sf-nav-item danger">
            <NavIcon icon={FaSignOutAlt} />
            Sign out
          </button>
        </div>

      </aside>
    </>
  );
};

export default StaffSidebar;