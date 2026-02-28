import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '@/redux/slices/authSlice';
import { FaHome, FaCar, FaSignOutAlt, FaUser, FaHistory, FaBicycle, FaMotorcycle } from 'react-icons/fa';
import { MdPayment, MdReceipt } from 'react-icons/md';

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500;600&family=DM+Sans:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; }

  @keyframes sf-in { from{opacity:0;transform:translateX(-16px)} to{opacity:1;transform:none} }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes entry-pop { 0%{transform:scale(1)} 40%{transform:scale(.94)} 100%{transform:scale(1)} }

  .sf-root { animation: sf-in .28s cubic-bezier(.22,1,.36,1); font-family:'DM Sans',sans-serif; }

  .eb {
    flex:1; display:flex; flex-direction:column; align-items:center;
    justify-content:center; gap:5px; padding:11px 4px 9px;
    border-radius:0; text-decoration:none; border:none;
    border-right:1px solid #e5e5e5; background:#fff;
    cursor:pointer; transition:background .12s; user-select:none;
  }
  .eb:last-child { border-right:none; }
  .eb:hover { background:#f5f5f5; }
  .eb:active { animation:entry-pop .15s ease; }
  .eb.eb-active { background:#0a0a0a; }
  .eb .eb-icon {
    width:32px; height:32px; border-radius:50%;
    display:flex; align-items:center; justify-content:center;
    background:#f0f0f0; transition:background .12s;
  }
  .eb.eb-active .eb-icon { background:rgba(255,255,255,.12); }
  .eb .eb-label {
    font-size:10px; font-weight:700; letter-spacing:.06em;
    text-transform:uppercase; color:#888;
    font-family:'DM Mono',monospace; transition:color .12s;
  }
  .eb.eb-active .eb-label { color:rgba(255,255,255,.6); }
  .eb .eb-kbd {
    font-size:8.5px; font-family:'DM Mono',monospace; color:#bbb;
    background:#f5f5f5; border:1px solid #e5e5e5; border-radius:3px;
    padding:0 4px; line-height:14px; transition:all .12s;
  }
  .eb.eb-active .eb-kbd { background:rgba(255,255,255,.1); border-color:rgba(255,255,255,.15); color:rgba(255,255,255,.4); }

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
  .pn .pn-badge { font-size:9px; font-weight:700; padding:1px 6px; border-radius:20px; background:#0a0a0a; color:#fff; font-family:'DM Mono',monospace; }
  .pn.pn-active .pn-badge { background:rgba(255,255,255,.2); }
  .pn-danger:hover { background:#fff0f0; }
  .pn-danger:hover .pn-label { color:#cc0000; }
  .pn-danger:hover .pn-icon { color:#cc0000; }

  .cursor { animation:blink 1s step-end infinite; }
`;

const ENTRY_TYPES = [
  { title:'Cycle', path:'/staff/new-parking/cycle', icon:FaBicycle,    shortcut:'1', iconColor:'#0d9488' },
  { title:'Bike',  path:'/staff/new-parking/bike',  icon:FaMotorcycle, shortcut:'2', iconColor:'#b45309' },
  { title:'Car',   path:'/staff/new-parking/car',   icon:FaCar,        shortcut:'3', iconColor:'#1d4ed8' },
];

const NAV_ITEMS = [
  { title:'Dashboard',    path:'/staff/dashboard',  icon:FaHome },
  { title:'Checkout',     path:'/staff/checkout',   icon:MdPayment },
  { title:'Paid',         path:'/staff/paid',       icon:MdReceipt },
  { title:"Today's List", path:'/staff/today-list', icon:FaHistory },
  { title:'Profile',      path:'/staff/profile',    icon:FaUser },
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
      <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:'#555', letterSpacing:'.06em', textTransform:'uppercase' }}>On shift</span>
    </div>
  );
};

export default function StaffSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(s => s.auth);
  const isActive = p => location.pathname === p;
  const initials = user?.name?.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase() || 'ST';
  const handleLogout = () => { dispatch(logout()); navigate('/login'); };

  return (
    <>
      <style>{css}</style>
      <aside className="sf-root" style={{
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
            Staff Terminal
          </div>

          <LiveClock />
        </div>

        {/* New Entry Strip */}
        <div>
          <div style={{
            padding:'9px 20px 5px',
            fontFamily:"'DM Mono',monospace", fontSize:8.5, fontWeight:600,
            letterSpacing:'.14em', textTransform:'uppercase', color:'#c0c0c0',
          }}>
            New Entry
          </div>
          <div style={{ display:'flex', borderTop:'1px solid #e5e5e5', borderBottom:'1px solid #e5e5e5' }}>
            {ENTRY_TYPES.map(({ title, path, icon:Icon, shortcut, iconColor }) => (
              <Link key={path} to={path} className={`eb${isActive(path) ? ' eb-active' : ''}`}>
                <div className="eb-icon">
                  <Icon size={14} color={isActive(path) ? iconColor : '#555'} />
                </div>
                <span className="eb-label">{title}</span>
                <span className="eb-kbd">{shortcut}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex:1, overflowY:'auto', padding:'12px 10px' }}>
          <div style={{
            padding:'4px 14px 8px',
            fontFamily:"'DM Mono',monospace", fontSize:8.5, fontWeight:600,
            letterSpacing:'.14em', textTransform:'uppercase', color:'#c0c0c0',
          }}>
            Navigate
          </div>
          {NAV_ITEMS.map(item => (
            <Link key={item.path} to={item.path} className={`pn${isActive(item.path) ? ' pn-active' : ''}`}>
              <span className="pn-icon"><item.icon size={13} /></span>
              <span className="pn-label">{item.title}</span>
              {item.badge && <span className="pn-badge">{item.badge}</span>}
            </Link>
          ))}
        </nav>

        {/* Divider rule */}
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
                {user?.name || 'Staff Member'}
              </div>
              <div style={{
                fontSize:10, color:'#aaa', fontFamily:"'DM Mono',monospace",
                overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
              }}>
                {user?.email || 'staff@parkingpro'}
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