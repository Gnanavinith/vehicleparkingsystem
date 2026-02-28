import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '@/redux/slices/authSlice';
import { FaHome, FaUsers, FaCar, FaChartBar, FaDollarSign, FaSignOutAlt } from 'react-icons/fa';

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500;600&family=DM+Sans:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; }

  @keyframes sf-in { from{opacity:0;transform:translateX(-16px)} to{opacity:1;transform:none} }
  @keyframes blink  { 0%,100%{opacity:1} 50%{opacity:0} }

  .sa-root { animation: sf-in .28s cubic-bezier(.22,1,.36,1); font-family:'DM Sans',sans-serif; }

  .pn {
    display:flex; align-items:center; gap:10px;
    padding:9px 14px; border-radius:100px;
    text-decoration:none; border:none; background:transparent;
    cursor:pointer; transition:background .13s; width:100%;
    font-family:'DM Sans',sans-serif;
  }
  .pn:hover { background:#f0f0f0; }
  .pn.pn-active { background:#0a0a0a; }
  .pn .pn-label { font-size:13px; font-weight:600; color:#555; transition:color .13s; flex:1; text-align:left; }
  .pn.pn-active .pn-label { color:#fff; }
  .pn .pn-icon { color:#aaa; transition:color .13s; display:flex; align-items:center; }
  .pn.pn-active .pn-icon { color:rgba(255,255,255,.6); }
  .pn-danger:hover { background:#fff0f0; }
  .pn-danger:hover .pn-label { color:#cc0000; }
  .pn-danger:hover .pn-icon { color:#cc0000; }

  .cursor { animation:blink 1s step-end infinite; }
`;

const NAV_ITEMS = [
  { title:'Dashboard',        path:'/standadmin/dashboard', icon:FaHome },
  { title:'Staff Management', path:'/standadmin/staff',     icon:FaUsers },
  { title:'Parkings',         path:'/standadmin/parkings',  icon:FaCar },
  { title:'Reports',          path:'/standadmin/reports',   icon:FaChartBar },
  { title:'Pricing Settings', path:'/standadmin/pricing',   icon:FaDollarSign },
];

const LiveClock = () => {
  const [time, setTime] = useState(() =>
    new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:true })
  );
  useEffect(() => {
    const t = setInterval(() =>
      setTime(new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:true }))
    , 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{
      marginTop:14, display:'inline-flex', alignItems:'center', gap:8,
      background:'#0a0a0a', borderRadius:6, padding:'5px 10px 5px 8px',
    }}>
      <span style={{ width:6, height:6, borderRadius:'50%', background:'#4ade80', flexShrink:0, boxShadow:'0 0 0 3px rgba(74,222,128,.2)' }} />
      <span style={{ fontFamily:"'DM Mono',monospace", fontSize:10.5, color:'#e5e5e5', letterSpacing:'.04em' }}>
        {time}
      </span>
      <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:'#555', letterSpacing:'.06em', textTransform:'uppercase' }}>Admin</span>
    </div>
  );
};

export default function StandAdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(s => s.auth);
  const isActive = p => location.pathname === p;
  const initials = user?.name?.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase() || 'SA';
  const handleLogout = () => { dispatch(logout()); navigate('/login'); };

  return (
    <>
      <style>{css}</style>
      <aside className="sa-root" style={{
        width:240, height:'100vh', background:'#fff',
        borderRight:'1px solid #e5e5e5',
        display:'flex', flexDirection:'column',
        position:'fixed', left:0, top:0, zIndex:50,
      }}>

        {/* Masthead */}
        <div style={{ padding:'22px 20px 18px', borderBottom:'1px solid #e5e5e5' }}>
          <div style={{
            fontFamily:"'DM Serif Display',serif",
            fontSize:22, letterSpacing:'-0.02em', color:'#0a0a0a',
            lineHeight:1, marginBottom:3, fontStyle:'italic',
          }}>
            Parking<span style={{ fontStyle:'normal', fontSize:18 }}>Pro</span>
          </div>
          <div style={{
            fontFamily:"'DM Mono',monospace", fontSize:9, fontWeight:600,
            letterSpacing:'.12em', textTransform:'uppercase', color:'#bbb',
          }}>
            Stand Admin
          </div>
          <LiveClock />
        </div>

        {/* Stand name badge */}
        {user?.standName && (
          <div style={{ padding:'10px 20px', borderBottom:'1px solid #e5e5e5', background:'#fafafa' }}>
            <div style={{
              display:'inline-flex', alignItems:'center', gap:7,
              background:'#fff', border:'1px solid #e5e5e5',
              borderRadius:7, padding:'5px 10px',
            }}>
              <span style={{ width:5, height:5, borderRadius:1, background:'#0a0a0a', flexShrink:0 }} />
              <span style={{ fontFamily:"'DM Mono',monospace", fontSize:10.5, fontWeight:600, color:'#0a0a0a', letterSpacing:'.03em' }}>
                {user.standName}
              </span>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav style={{ flex:1, overflowY:'auto', padding:'12px 10px' }}>
          <div style={{
            padding:'4px 14px 8px',
            fontFamily:"'DM Mono',monospace", fontSize:8.5, fontWeight:600,
            letterSpacing:'.14em', textTransform:'uppercase', color:'#c0c0c0',
          }}>
            Operations
          </div>
          {NAV_ITEMS.map(item => (
            <Link key={item.path} to={item.path} className={`pn${isActive(item.path) ? ' pn-active' : ''}`}>
              <span className="pn-icon"><item.icon size={13} /></span>
              <span className="pn-label">{item.title}</span>
            </Link>
          ))}
        </nav>

        <div style={{ margin:'0 20px', height:1, background:'#e5e5e5' }} />

        {/* Footer */}
        <div style={{ padding:'12px 10px 14px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, padding:'6px 14px 10px' }}>
            <div style={{
              width:30, height:30, borderRadius:'50%',
              background:'#0a0a0a', color:'#fff',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontFamily:"'DM Mono',monospace", fontSize:11, fontWeight:600,
              flexShrink:0, letterSpacing:'.04em',
            }}>
              {initials}
            </div>
            <div style={{ minWidth:0 }}>
              <div style={{
                fontSize:12.5, fontWeight:700, color:'#0a0a0a',
                overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
                fontFamily:"'DM Sans',sans-serif",
              }}>
                {user?.name || 'Stand Admin'}
              </div>
              <div style={{
                fontSize:10, color:'#aaa', fontFamily:"'DM Mono',monospace",
                overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
              }}>
                {user?.email || 'admin@parkingpro'}
              </div>
            </div>
          </div>
          <button onClick={handleLogout} className="pn pn-danger" style={{ width:'100%' }}>
            <span className="pn-icon"><FaSignOutAlt size={13} /></span>
            <span className="pn-label">Sign out</span>
          </button>
        </div>

      </aside>
    </>
  );
}