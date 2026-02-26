import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '@/redux/slices/authSlice';
import { FaSearch, FaChevronDown, FaBell, FaUser, FaShieldAlt, FaKey, FaCog, FaSignOutAlt } from 'react-icons/fa';

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

  :root {
    --tb-bg:        #ffffff;
    --tb-border:    #e8ecf0;
    --tb-surface:   #f8fafc;
    --tb-surface2:  #f1f5f9;
    --tb-text:      #0f172a;
    --tb-muted:     #64748b;
    --tb-subtle:    #94a3b8;
    --tb-accent:    #6366f1;
    --tb-accent-bg: rgba(99,102,241,0.07);
    --tb-accent-bd: rgba(99,102,241,0.18);
    --tb-hover:     #f1f5f9;
    --tb-danger:    #ef4444;
    --tb-danger-bg: #fef2f2;
    --tb-success:   #10b981;
    --tb-amber:     #f59e0b;
    --tb-font:      'DM Sans', sans-serif;
    --tb-mono:      'DM Mono', monospace;
    --tb-radius:    9px;
    --tb-t:         all 0.17s cubic-bezier(0.4,0,0.2,1);
    --tb-shadow:    0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
    --tb-shadow-lg: 0 8px 24px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06);
  }

  @keyframes tb-fade-down { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:none} }
  @keyframes tb-pulse { 0%,100%{opacity:1} 50%{opacity:.5} }

  .topbar-root {
    font-family: var(--tb-font);
    position: sticky; top: 0; z-index: 40;
    height: 56px;
    background: var(--tb-bg);
    display: flex; align-items: center;
    padding: 0 20px; gap: 12px;
  }

  /* ── Search ── */
  .tb-search {
    position: relative; flex: 1; max-width: 280px;
  }
  .tb-search-input {
    width: 100%; height: 34px;
    padding: 0 12px 0 35px;
    background: var(--tb-surface);
    border: 1px solid var(--tb-border);
    border-radius: var(--tb-radius);
    font-size: 13px; color: var(--tb-text);
    font-family: var(--tb-font); outline: none;
    transition: var(--tb-t);
  }
  .tb-search-input::placeholder { color: var(--tb-subtle); }
  .tb-search-input:focus {
    border-color: var(--tb-accent);
    background: var(--tb-accent-bg);
    box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
  }
  .tb-search-icon {
    position: absolute; left: 10px; top: 50%; transform: translateY(-50%);
    color: var(--tb-subtle); pointer-events: none; transition: var(--tb-t);
  }
  .tb-search-input:focus ~ .tb-search-icon { color: var(--tb-accent); }

  /* ── Select ── */
  .tb-select-wrap { position: relative; }
  .tb-select {
    height: 34px; padding: 0 28px 0 10px;
    background: var(--tb-surface);
    border: 1px solid var(--tb-border); border-radius: var(--tb-radius);
    font-size: 12.5px; font-weight: 500; color: var(--tb-muted);
    font-family: var(--tb-font); outline: none; cursor: pointer;
    appearance: none; -webkit-appearance: none;
    transition: var(--tb-t);
  }
  .tb-select:focus {
    border-color: var(--tb-accent);
    box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
    color: var(--tb-text);
  }
  .tb-select-caret {
    position: absolute; right: 8px; top: 50%; transform: translateY(-50%);
    color: var(--tb-subtle); pointer-events: none;
  }

  /* ── Divider ── */
  .tb-divider {
    width: 1px; height: 22px;
    background: var(--tb-border); flex-shrink: 0;
  }

  /* ── Right group ── */
  .tb-right {
    margin-left: auto; display: flex;
    align-items: center; gap: 6px;
  }

  /* ── Icon button ── */
  .tb-icon-btn {
    position: relative; width: 34px; height: 34px;
    display: flex; align-items: center; justify-content: center;
    border: none; background: transparent; cursor: pointer;
    border-radius: var(--tb-radius); color: var(--tb-muted);
    transition: var(--tb-t);
  }
  .tb-icon-btn:hover { background: var(--tb-hover); color: var(--tb-text); }
  .tb-icon-btn.active { background: var(--tb-accent-bg); color: var(--tb-accent); border: 1px solid var(--tb-accent-bd); }

  /* Notification badge */
  .tb-badge {
    position: absolute; top: 3px; right: 3px;
    min-width: 16px; height: 16px; padding: 0 4px;
    background: var(--tb-danger); color: #fff;
    font-size: 9.5px; font-weight: 700; font-family: var(--tb-mono);
    border-radius: 8px; display: flex; align-items: center; justify-content: center;
    border: 2px solid var(--tb-bg);
    animation: tb-pulse 2.5s infinite;
  }

  /* ── Dropdown base ── */
  .tb-dropdown {
    position: absolute; right: 0; top: calc(100% + 6px);
    background: var(--tb-bg);
    border: 1px solid var(--tb-border);
    border-radius: 12px;
    z-index: 100;
    animation: tb-fade-down 0.18s ease;
    overflow: hidden;
  }

  /* ── Notifications dropdown ── */
  .tb-notif-dropdown { width: 320px; }

  .tb-dropdown-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 13px 16px 11px;
    border-bottom: 1px solid var(--tb-border);
  }
  .tb-dropdown-title {
    font-size: 13px; font-weight: 700; color: var(--tb-text); letter-spacing: -0.01em;
  }
  .tb-clear-btn {
    font-size: 11px; font-weight: 600; color: var(--tb-accent);
    background: none; border: none; cursor: pointer; padding: 0;
    font-family: var(--tb-font); transition: var(--tb-t);
  }
  .tb-clear-btn:hover { color: #4338ca; }

  .tb-notif-list { max-height: 260px; overflow-y: auto; }
  .tb-notif-list::-webkit-scrollbar { width: 3px; }
  .tb-notif-list::-webkit-scrollbar-thumb { background: var(--tb-border); border-radius: 2px; }

  .tb-notif-item {
    display: flex; align-items: flex-start; gap: 10px;
    padding: 11px 16px; border-bottom: 1px solid var(--tb-surface2);
    transition: var(--tb-t); cursor: pointer;
  }
  .tb-notif-item:last-child { border-bottom: none; }
  .tb-notif-item:hover { background: var(--tb-hover); }

  .tb-notif-dot {
    width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; margin-top: 5px;
  }
  .tb-notif-dot.info    { background: var(--tb-accent); }
  .tb-notif-dot.success { background: var(--tb-success); }
  .tb-notif-dot.warning { background: var(--tb-amber); }

  .tb-notif-msg { font-size: 12.5px; font-weight: 500; color: var(--tb-text); line-height: 1.4; }
  .tb-notif-time { font-size: 11px; color: var(--tb-subtle); margin-top: 2px; font-family: var(--tb-mono); }

  .tb-dropdown-footer {
    padding: 10px 16px;
    border-top: 1px solid var(--tb-border);
    display: flex; justify-content: center;
  }
  .tb-view-all {
    font-size: 12px; font-weight: 600; color: var(--tb-accent);
    background: none; border: none; cursor: pointer;
    font-family: var(--tb-font); transition: var(--tb-t);
  }
  .tb-view-all:hover { color: #4338ca; }

  /* ── Profile button ── */
  .tb-profile-btn {
    display: flex; align-items: center; gap: 8px;
    height: 34px; padding: 0 10px 0 4px;
    border: 1px solid var(--tb-border); border-radius: var(--tb-radius);
    background: var(--tb-surface); cursor: pointer; transition: var(--tb-t);
  }
  .tb-profile-btn:hover { background: var(--tb-hover); border-color: #d1d5db; }
  .tb-profile-btn.open { border-color: var(--tb-accent); background: var(--tb-accent-bg); }

  .tb-avatar {
    width: 26px; height: 26px; border-radius: 7px;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700; font-family: var(--tb-mono);
    background: var(--tb-accent); color: #fff; flex-shrink: 0;
  }
  .tb-profile-name {
    font-size: 12.5px; font-weight: 600; color: var(--tb-text);
    white-space: nowrap; max-width: 120px;
    overflow: hidden; text-overflow: ellipsis;
  }
  .tb-profile-chevron {
    color: var(--tb-subtle); transition: transform 0.2s;
    flex-shrink: 0;
  }
  .tb-profile-chevron.open { transform: rotate(180deg); }

  /* ── Profile dropdown ── */
  .tb-profile-dropdown { width: 220px; }

  .tb-profile-info {
    padding: 13px 15px 11px;
    border-bottom: 1px solid var(--tb-border);
  }
  .tb-profile-info-name { font-size: 13px; font-weight: 700; color: var(--tb-text); letter-spacing: -0.01em; }
  .tb-profile-info-email { font-size: 11px; color: var(--tb-subtle); margin-top: 2px; font-family: var(--tb-mono); }

  .tb-role-chip {
    display: inline-flex; align-items: center; gap: 4px;
    font-size: 9.5px; font-weight: 700; letter-spacing: 0.05em;
    padding: 2px 7px; border-radius: 20px; margin-top: 6px;
    background: var(--tb-accent-bg); color: var(--tb-accent);
    border: 1px solid var(--tb-accent-bd); font-family: var(--tb-mono);
    text-transform: uppercase;
  }

  .tb-menu-list { padding: 6px; }
  .tb-menu-item {
    display: flex; align-items: center; gap: 9px;
    padding: 8px 10px; border-radius: 7px;
    font-size: 12.5px; font-weight: 500; color: var(--tb-muted);
    cursor: pointer; text-decoration: none; transition: var(--tb-t);
    border: none; background: transparent; width: 100%; font-family: var(--tb-font);
  }
  .tb-menu-item:hover { background: var(--tb-hover); color: var(--tb-text); }
  .tb-menu-item.danger { color: var(--tb-danger); }
  .tb-menu-item.danger:hover { background: var(--tb-danger-bg); color: #dc2626; }

  .tb-menu-sep { height: 1px; background: var(--tb-border); margin: 4px 6px; }
`;

const NOTIFS = [
  { id: 1, message: 'New parking stand created successfully', time: '2h ago', type: 'info' },
  { id: 2, message: 'Revenue exceeded ₹50,000 this month', time: '1d ago', type: 'success' },
  { id: 3, message: 'Stand maintenance scheduled for tomorrow', time: '3d ago', type: 'warning' },
];

const ROLE_LABELS = {
  super_admin: 'Super Admin',
  stand_admin: 'Stand Admin',
  staff: 'Staff',
};

const NavIcon = ({ icon: Icon, size = 15 }) => <Icon size={size} />;

const Topbar = () => {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifs, setNotifs] = useState(NOTIFS);

  const notifsRef = useRef(null);
  const profileRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifsRef.current && !notifsRef.current.contains(e.target)) setShowNotifs(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const initials = user?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'SA';
  const roleLabel = ROLE_LABELS[user?.role] || 'Admin';

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <>
      <style>{css}</style>
      <header className="topbar-root">

        {/* Search */}
        <div className="tb-search">
          <input
            type="text"
            className="tb-search-input"
            placeholder="Search stands, admins..."
          />
          <span className="tb-search-icon">
            <NavIcon icon={FaSearch} />
          </span>
        </div>

        {/* Period filter */}
        <div className="tb-select-wrap">
          <select className="tb-select">
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
            <option>This Year</option>
          </select>
          <span className="tb-select-caret">
            <NavIcon icon={FaChevronDown} size={12} />
          </span>
        </div>

        {/* Right group */}
        <div className="tb-right">

          {/* Notifications */}
          <div style={{ position: 'relative' }} ref={notifsRef}>
            <button
              className={`tb-icon-btn${showNotifs ? ' active' : ''}`}
              onClick={() => { setShowNotifs(!showNotifs); setShowProfile(false); }}
              title="Notifications"
            >
              <NavIcon icon={FaBell} />
              {notifs.length > 0 && (
                <span className="tb-badge">{notifs.length}</span>
              )}
            </button>

            {showNotifs && (
              <div className="tb-dropdown tb-notif-dropdown">
                <div className="tb-dropdown-header">
                  <span className="tb-dropdown-title">Notifications</span>
                  <button className="tb-clear-btn" onClick={() => setNotifs([])}>
                    Mark all read
                  </button>
                </div>
                <div className="tb-notif-list">
                  {notifs.length === 0 ? (
                    <div style={{ padding: '24px 16px', textAlign: 'center', fontSize: 12.5, color: '#94a3b8' }}>
                      All caught up!
                    </div>
                  ) : notifs.map((n) => (
                    <div key={n.id} className="tb-notif-item">
                      <span className={`tb-notif-dot ${n.type}`} />
                      <div>
                        <div className="tb-notif-msg">{n.message}</div>
                        <div className="tb-notif-time">{n.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
                {notifs.length > 0 && (
                  <div className="tb-dropdown-footer">
                    <button className="tb-view-all">View all notifications</button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="tb-divider" />

          {/* Profile */}
          <div style={{ position: 'relative' }} ref={profileRef}>
            <button
              className={`tb-profile-btn${showProfile ? ' open' : ''}`}
              onClick={() => { setShowProfile(!showProfile); setShowNotifs(false); }}
            >
              <div className="tb-avatar">{initials}</div>
              <span className="tb-profile-name">{user?.name || 'Super Admin'}</span>
              <span className={`tb-profile-chevron${showProfile ? ' open' : ''}`}>
                <NavIcon icon={FaChevronDown} size={12} />
              </span>
            </button>

            {showProfile && (
              <div className="tb-dropdown tb-profile-dropdown">
                <div className="tb-profile-info">
                  <div className="tb-profile-info-name">{user?.name || 'Super Admin'}</div>
                  <div className="tb-profile-info-email">{user?.email || 'admin@parkingpro.com'}</div>
                  <span className="tb-role-chip">
                    <NavIcon icon={FaShieldAlt} size={8} />
                    {roleLabel}
                  </span>
                </div>

                <div className="tb-menu-list">
                  {[
                    { label: 'My Profile',       href: '#', icon: FaUser },
                    { label: 'Change Password',  href: '#', icon: FaKey },
                    { label: 'Settings',         href: '#', icon: FaCog },
                  ].map(item => (
                    <a key={item.label} href={item.href} className="tb-menu-item">
                      <NavIcon icon={item.icon} size={14} />
                      {item.label}
                    </a>
                  ))}
                  <div className="tb-menu-sep" />
                  <button onClick={handleLogout} className="tb-menu-item danger">
                    <NavIcon icon={FaSignOutAlt} size={14} />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Topbar;