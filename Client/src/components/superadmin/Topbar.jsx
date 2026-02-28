import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '@/redux/slices/authSlice';
import { FaSearch, FaChevronDown, FaBell, FaUser, FaShieldAlt, FaKey, FaCog, FaSignOutAlt } from 'react-icons/fa';

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500;600&family=DM+Sans:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing:border-box; }

  @keyframes tb-drop { from{opacity:0;transform:translateY(-5px)} to{opacity:1;transform:none} }

  .tb-root {
    font-family:'DM Sans',sans-serif;
    position:sticky; top:0; z-index:40;
    height:54px; background:#fff;
    border-bottom:1px solid #e5e5e5;
    display:flex; align-items:center;
    padding:0 28px; gap:12px;
  }

  .tb-search { position:relative; flex:1; max-width:260px; }
  .tb-search-input {
    width:100%; height:32px; padding:0 10px 0 33px;
    background:#f7f7f7; border:1px solid #e5e5e5; border-radius:8px;
    font-size:12.5px; color:#0a0a0a; font-family:'DM Sans',sans-serif;
    outline:none; transition:all .15s;
  }
  .tb-search-input::placeholder { color:#bbb; font-family:'DM Mono',monospace; font-size:11.5px; }
  .tb-search-input:focus { background:#fff; border-color:#0a0a0a; box-shadow:0 0 0 3px rgba(10,10,10,.06); }
  .tb-search-input:focus + .tb-search-icon { color:#0a0a0a; }
  .tb-search-icon { position:absolute; left:10px; top:50%; transform:translateY(-50%); color:#bbb; pointer-events:none; transition:color .15s; }

  .tb-select-wrap { position:relative; }
  .tb-select {
    height:32px; padding:0 26px 0 10px;
    background:#f7f7f7; border:1px solid #e5e5e5; border-radius:8px;
    font-size:12px; font-weight:600; color:#555;
    font-family:'DM Mono',monospace; outline:none; cursor:pointer;
    appearance:none; -webkit-appearance:none; transition:all .15s; letter-spacing:.02em;
  }
  .tb-select:focus { background:#fff; border-color:#0a0a0a; box-shadow:0 0 0 3px rgba(10,10,10,.06); color:#0a0a0a; }
  .tb-select-caret { position:absolute; right:8px; top:50%; transform:translateY(-50%); color:#bbb; pointer-events:none; }

  .tb-divider { width:1px; height:20px; background:#e5e5e5; flex-shrink:0; }
  .tb-right { margin-left:auto; display:flex; align-items:center; gap:6px; }

  .tb-icon-btn {
    position:relative; width:32px; height:32px;
    display:flex; align-items:center; justify-content:center;
    border:1px solid transparent; background:transparent; cursor:pointer;
    border-radius:8px; color:#aaa; transition:all .14s;
  }
  .tb-icon-btn:hover { background:#f5f5f5; color:#0a0a0a; border-color:#e5e5e5; }
  .tb-icon-btn.tb-active { background:#0a0a0a; color:#fff; border-color:#0a0a0a; }

  .tb-badge {
    position:absolute; top:2px; right:2px;
    min-width:14px; height:14px; padding:0 3px;
    background:#0a0a0a; color:#fff;
    font-size:8.5px; font-weight:700; font-family:'DM Mono',monospace;
    border-radius:7px; display:flex; align-items:center; justify-content:center;
    border:1.5px solid #fff;
  }
  .tb-icon-btn.tb-active .tb-badge { background:#fff; color:#0a0a0a; }

  .tb-dropdown {
    position:absolute; right:0; top:calc(100% + 8px);
    background:#fff; border:1px solid #e5e5e5; border-radius:12px;
    z-index:200; animation:tb-drop .16s cubic-bezier(.22,1,.36,1);
    overflow:hidden; box-shadow:0 8px 32px rgba(0,0,0,.1), 0 2px 8px rgba(0,0,0,.06);
  }
  .tb-notif-dd { width:300px; }

  .tb-dd-header {
    display:flex; align-items:center; justify-content:space-between;
    padding:12px 16px 10px; border-bottom:1px solid #f0f0f0;
  }
  .tb-dd-title { font-family:'DM Serif Display',serif; font-style:italic; font-size:15px; color:#0a0a0a; }
  .tb-clear-btn {
    font-size:10.5px; font-weight:600; color:#888; background:none; border:none;
    cursor:pointer; font-family:'DM Mono',monospace; letter-spacing:.04em;
    text-transform:uppercase; transition:color .13s;
  }
  .tb-clear-btn:hover { color:#0a0a0a; }

  .tb-notif-list { max-height:240px; overflow-y:auto; }
  .tb-notif-list::-webkit-scrollbar { width:2px; }
  .tb-notif-list::-webkit-scrollbar-thumb { background:#e5e5e5; }

  .tb-notif-item {
    display:flex; align-items:flex-start; gap:10px;
    padding:10px 16px; border-bottom:1px solid #f5f5f5;
    transition:background .1s; cursor:pointer;
  }
  .tb-notif-item:last-child { border-bottom:none; }
  .tb-notif-item:hover { background:#fafafa; }

  .tb-notif-dot { width:6px; height:6px; border-radius:50%; flex-shrink:0; margin-top:5px; }
  .tb-notif-dot.info    { background:#0a0a0a; }
  .tb-notif-dot.success { background:#22c55e; }
  .tb-notif-dot.warning { background:#d97706; }

  .tb-notif-msg { font-size:12px; font-weight:500; color:#0a0a0a; line-height:1.45; font-family:'DM Sans',sans-serif; }
  .tb-notif-time { font-size:10px; color:#bbb; margin-top:2px; font-family:'DM Mono',monospace; }

  .tb-dd-footer { padding:9px 16px; border-top:1px solid #f0f0f0; display:flex; justify-content:center; }
  .tb-view-all {
    font-size:10.5px; font-weight:700; color:#888; background:none; border:none;
    cursor:pointer; font-family:'DM Mono',monospace; letter-spacing:.06em;
    text-transform:uppercase; transition:color .13s;
  }
  .tb-view-all:hover { color:#0a0a0a; }

  .tb-profile-btn {
    display:flex; align-items:center; gap:8px;
    height:32px; padding:0 10px 0 4px;
    border:1px solid #e5e5e5; border-radius:8px;
    background:#f7f7f7; cursor:pointer; transition:all .14s;
  }
  .tb-profile-btn:hover { background:#f0f0f0; border-color:#d0d0d0; }
  .tb-profile-btn.tb-open { background:#0a0a0a; border-color:#0a0a0a; }

  .tb-avatar {
    width:24px; height:24px; border-radius:50%;
    display:flex; align-items:center; justify-content:center;
    font-size:9.5px; font-weight:700; font-family:'DM Mono',monospace;
    background:#0a0a0a; color:#fff; flex-shrink:0; letter-spacing:.04em;
  }
  .tb-profile-btn.tb-open .tb-avatar { background:#fff; color:#0a0a0a; }

  .tb-profile-name {
    font-size:12px; font-weight:700; color:#0a0a0a;
    white-space:nowrap; max-width:110px;
    overflow:hidden; text-overflow:ellipsis; font-family:'DM Sans',sans-serif;
  }
  .tb-profile-btn.tb-open .tb-profile-name { color:#fff; }

  .tb-profile-dd { width:210px; }
  .tb-profile-info { padding:12px 14px 10px; border-bottom:1px solid #f0f0f0; }
  .tb-profile-info-name { font-family:'DM Serif Display',serif; font-style:italic; font-size:15px; color:#0a0a0a; line-height:1.2; }
  .tb-profile-info-email { font-size:10px; color:#bbb; margin-top:3px; font-family:'DM Mono',monospace; }
  .tb-role-chip {
    display:inline-flex; align-items:center; gap:4px;
    font-size:8.5px; font-weight:700; letter-spacing:.08em;
    padding:2px 7px; border-radius:3px; margin-top:7px;
    background:#0a0a0a; color:#fff;
    font-family:'DM Mono',monospace; text-transform:uppercase;
  }

  .tb-menu { padding:5px; }
  .tb-menu-item {
    display:flex; align-items:center; gap:9px;
    padding:8px 10px; border-radius:7px;
    font-size:12.5px; font-weight:500; color:#555;
    cursor:pointer; text-decoration:none; transition:all .12s;
    border:none; background:transparent; width:100%; font-family:'DM Sans',sans-serif;
  }
  .tb-menu-item:hover { background:#f5f5f5; color:#0a0a0a; }
  .tb-menu-item.danger:hover { background:#fff0f0; color:#cc0000; }
  .tb-menu-sep { height:1px; background:#f0f0f0; margin:4px 5px; }
`;

const NOTIFS = [
  { id:1, message:'New parking stand created successfully', time:'2h ago',  type:'info' },
  { id:2, message:'Revenue exceeded ₹50,000 this month',   time:'1d ago',  type:'success' },
  { id:3, message:'Stand maintenance scheduled tomorrow',    time:'3d ago', type:'warning' },
];

const ROLE_LABELS = { super_admin:'Super Admin', stand_admin:'Stand Admin', staff:'Staff' };

export default function SuperAdminTopbar() {
  const { user }   = useSelector(s => s.auth);
  const dispatch   = useDispatch();
  const navigate   = useNavigate();

  const [showNotifs,  setShowNotifs]  = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifs, setNotifs] = useState(NOTIFS);

  const notifsRef  = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const h = e => {
      if (notifsRef.current  && !notifsRef.current.contains(e.target))  setShowNotifs(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const initials  = user?.name?.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase() || 'SA';
  const roleLabel = ROLE_LABELS[user?.role] || 'Super Admin';
  const handleLogout = () => { dispatch(logout()); navigate('/login'); };

  return (
    <>
      <style>{css}</style>
      <header className="tb-root">

        {/* Search */}
        <div className="tb-search">
          <input className="tb-search-input" placeholder="Search stands, admins…" />
          <span className="tb-search-icon"><FaSearch size={12} /></span>
        </div>

        {/* Period */}
        <div className="tb-select-wrap">
          <select className="tb-select">
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
            <option>This Year</option>
          </select>
          <span className="tb-select-caret"><FaChevronDown size={10} /></span>
        </div>

        <div className="tb-right">

          {/* Notifications */}
          <div style={{ position:'relative' }} ref={notifsRef}>
            <button
              className={`tb-icon-btn${showNotifs ? ' tb-active' : ''}`}
              onClick={() => { setShowNotifs(v => !v); setShowProfile(false); }}
            >
              <FaBell size={14} />
              {notifs.length > 0 && <span className="tb-badge">{notifs.length}</span>}
            </button>

            {showNotifs && (
              <div className="tb-dropdown tb-notif-dd">
                <div className="tb-dd-header">
                  <span className="tb-dd-title">Notifications</span>
                  <button className="tb-clear-btn" onClick={() => setNotifs([])}>Clear all</button>
                </div>
                <div className="tb-notif-list">
                  {notifs.length === 0 ? (
                    <div style={{ padding:'24px 16px', textAlign:'center', fontSize:11.5, color:'#bbb', fontFamily:'DM Mono,monospace' }}>All caught up ✓</div>
                  ) : notifs.map(n => (
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
                  <div className="tb-dd-footer">
                    <button className="tb-view-all">View all</button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="tb-divider" />

          {/* Profile */}
          <div style={{ position:'relative' }} ref={profileRef}>
            <button
              className={`tb-profile-btn${showProfile ? ' tb-open' : ''}`}
              onClick={() => { setShowProfile(v => !v); setShowNotifs(false); }}
            >
              <div className="tb-avatar">{initials}</div>
              <span className="tb-profile-name">{user?.name || 'Super Admin'}</span>
              <FaChevronDown size={10} style={{ color: showProfile ? 'rgba(255,255,255,.4)' : '#aaa', transition:'transform .18s', transform: showProfile ? 'rotate(180deg)' : 'none', flexShrink:0 }} />
            </button>

            {showProfile && (
              <div className="tb-dropdown tb-profile-dd">
                <div className="tb-profile-info">
                  <div className="tb-profile-info-name">{user?.name || 'Super Admin'}</div>
                  <div className="tb-profile-info-email">{user?.email || 'admin@parkingpro'}</div>
                  <span className="tb-role-chip"><FaShieldAlt size={7} /> {roleLabel}</span>
                </div>
                <div className="tb-menu">
                  {[
                    { label:'My Profile',      icon:FaUser, href:'#' },
                    { label:'Change Password', icon:FaKey,  href:'#' },
                    { label:'Settings',        icon:FaCog,  href:'#' },
                  ].map(item => (
                    <a key={item.label} href={item.href} className="tb-menu-item">
                      <item.icon size={12} /> {item.label}
                    </a>
                  ))}
                  <div className="tb-menu-sep" />
                  <button onClick={handleLogout} className="tb-menu-item danger">
                    <FaSignOutAlt size={12} /> Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}