import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { FaHome, FaBuilding, FaChartBar, FaDollarSign, FaCog, FaSignOutAlt } from 'react-icons/fa';

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500;600&family=DM+Sans:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; }

  @keyframes sf-in  { from{opacity:0;transform:translateX(-16px)} to{opacity:1;transform:none} }
  @keyframes blink  { 0%,100%{opacity:1} 50%{opacity:0} }

  .sa-root { animation: sf-in .28s cubic-bezier(.22,1,.36,1); font-family:'DM Sans',sans-serif; }

  .pn {
    display:flex; align-items:center; gap:10px;
    padding:9px 14px; border-radius:100px;
    text-decoration:none; border:none; background:transparent;
    cursor:pointer; transition:background .13s; width:100%;
    font-family:'DM Sans',sans-serif; position:relative;
  }
  .pn:hover { background:#f0f0f0; }
  .pn.pn-active { background:#0a0a0a; }
  .pn .pn-label { font-size:13px; font-weight:600; color:#555; transition:color .13s; flex:1; text-align:left; }
  .pn.pn-active .pn-label { color:#fff; }
  .pn .pn-icon { color:#aaa; transition:color .13s; display:flex; align-items:center; }
  .pn.pn-active .pn-icon { color:rgba(255,255,255,.6); }
  .pn .pn-live {
    font-size:8.5px; font-weight:700; letter-spacing:.07em;
    padding:1px 6px; border-radius:3px;
    background:#0a0a0a; color:#fff;
    font-family:'DM Mono',monospace; text-transform:uppercase;
  }
  .pn.pn-active .pn-live { background:rgba(255,255,255,.2); color:#fff; }
  .pn-danger:hover { background:#fff0f0; }
  .pn-danger:hover .pn-label { color:#cc0000; }
  .pn-danger:hover .pn-icon { color:#cc0000; }
`;

const NAV_SECTIONS = [
  {
    label: 'Management',
    items: [
      { title:'Dashboard',      path:'/superadmin/dashboard', icon:FaHome },
      { title:'Vehicle Stands', path:'/superadmin/stands',    icon:FaBuilding },
    ],
  },
  {
    label: 'Analytics',
    items: [
      { title:'Reports', path:'/superadmin/reports', icon:FaChartBar, live:true },
    ],
  },
  {
    label: 'System',
    items: [
      { title:'Pricing',  path:'/superadmin/pricing',  icon:FaDollarSign },
      { title:'Settings', path:'/superadmin/settings', icon:FaCog },
    ],
  },
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
      <span style={{ fontFamily:"'DM Mono',monospace", fontSize:10.5, color:'#e5e5e5', letterSpacing:'.04em' }}>{time}</span>
      <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:'#555', letterSpacing:'.06em', textTransform:'uppercase' }}>System</span>
    </div>
  );
};

export default function SuperAdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isActive = p => location.pathname === p;
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
            Super Admin
          </div>
          <LiveClock />
        </div>

        {/* Nav */}
        <nav style={{ flex:1, overflowY:'auto', padding:'12px 10px' }}>
          {NAV_SECTIONS.map(({ label, items }) => (
            <React.Fragment key={label}>
              <div style={{
                padding:'12px 14px 6px',
                fontFamily:"'DM Mono',monospace", fontSize:8.5, fontWeight:600,
                letterSpacing:'.14em', textTransform:'uppercase', color:'#c0c0c0',
              }}>
                {label}
              </div>
              {items.map(item => (
                <Link key={item.path} to={item.path} className={`pn${isActive(item.path) ? ' pn-active' : ''}`}>
                  <span className="pn-icon"><item.icon size={13} /></span>
                  <span className="pn-label">{item.title}</span>
                  {item.live && <span className="pn-live">Live</span>}
                </Link>
              ))}
            </React.Fragment>
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
            }}>SA</div>
            <div style={{ minWidth:0 }}>
              <div style={{ fontSize:12.5, fontWeight:700, color:'#0a0a0a', fontFamily:"'DM Sans',sans-serif" }}>
                Super Admin
              </div>
              <div style={{ fontSize:10, color:'#aaa', fontFamily:"'DM Mono',monospace" }}>
                admin@parkingpro
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