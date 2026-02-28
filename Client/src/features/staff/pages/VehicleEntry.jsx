import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { createParking } from '../api';
import { FaCar, FaMotorcycle, FaBicycle, FaArrowLeft, FaCheck } from 'react-icons/fa';

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500;600&family=DM+Sans:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

  @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
  @keyframes spin { to{transform:rotate(360deg)} }

  .ve-wrap { font-family:'DM Sans',sans-serif; animation:fadeUp .28s ease; }

  .db-card {
    background:#fff; border-radius:16px;
    border:1px solid #ebebeb;
    transition:box-shadow .18s;
  }

  .section-label {
    font-family:'DM Mono',monospace; font-size:9px; font-weight:600;
    letter-spacing:.14em; text-transform:uppercase; color:#aaa;
    display:block; margin-bottom:8px;
  }

  .field-label {
    font-family:'DM Mono',monospace; font-size:10px; font-weight:600;
    letter-spacing:.1em; text-transform:uppercase; color:#aaa;
    display:block; margin-bottom:7px;
  }

  .ve-input {
    width:100%; padding:10px 13px;
    font-size:13.5px; font-family:'DM Sans',sans-serif; color:#0a0a0a;
    background:#fff; border:1.5px solid #ebebeb; border-radius:10px;
    outline:none; transition:border-color .14s, box-shadow .14s;
  }
  .ve-input:focus { border-color:#0a0a0a; box-shadow:0 0 0 3px rgba(10,10,10,.05); }
  .ve-input::placeholder { color:#bbb; font-size:13px; }

  .ve-input-highlight {
    width:100%; padding:10px 13px;
    font-size:14px; font-weight:600; font-family:'DM Mono',monospace; color:#0a0a0a;
    background:#fafafa; border:1.5px solid #ebebeb; border-radius:10px;
    outline:none; transition:border-color .14s, box-shadow .14s;
    text-transform:uppercase; letter-spacing:.08em;
  }
  .ve-input-highlight:focus { border-color:#0a0a0a; box-shadow:0 0 0 3px rgba(10,10,10,.05); background:#fff; }
  .ve-input-highlight::placeholder { color:#bbb; font-weight:400; letter-spacing:normal; text-transform:none; }

  .ve-btn-primary {
    flex:1; padding:11px 20px; background:#0a0a0a; color:#fff;
    font-size:13.5px; font-weight:700; font-family:'DM Sans',sans-serif;
    border:none; border-radius:10px; cursor:pointer; transition:all .14s;
    display:flex; align-items:center; justify-content:center; gap:8px;
  }
  .ve-btn-primary:hover:not(:disabled) { background:#222; transform:translateY(-1px); box-shadow:0 4px 12px rgba(0,0,0,.18); }
  .ve-btn-primary:active:not(:disabled) { transform:scale(.97); }
  .ve-btn-primary:disabled { opacity:.5; cursor:not-allowed; }

  .ve-btn-ghost {
    flex:1; padding:11px 20px; background:transparent; color:#555;
    font-size:13.5px; font-weight:600; font-family:'DM Sans',sans-serif;
    border:1.5px solid #ebebeb; border-radius:10px; cursor:pointer; transition:all .14s;
    display:flex; align-items:center; justify-content:center; gap:8px;
  }
  .ve-btn-ghost:hover { border-color:#0a0a0a; color:#0a0a0a; }

  .spinner {
    width:14px; height:14px; border:2px solid rgba(255,255,255,.3);
    border-top-color:#fff; border-radius:50%;
    animation:spin .7s linear infinite; flex-shrink:0;
  }

  .hint-text {
    font-family:'DM Mono',monospace; font-size:10.5px; color:#bbb;
    margin-top:6px; letter-spacing:.03em;
  }
`;

const VEHICLE_CONFIG = {
  car: {
    label:       'Car',
    icon:        FaCar,
    color:       '#1d4ed8',
    placeholder: 'e.g. TN-01-AB-1234',
    hint:        'Enter the car registration number',
  },
  bike: {
    label:       'Bike',
    icon:        FaMotorcycle,
    color:       '#d97706',
    placeholder: 'Enter bike registration number',
    hint:        'Enter the bike registration number',
  },
  motorcycle: {
    label:       'Motorcycle',
    icon:        FaMotorcycle,
    color:       '#d97706',
    placeholder: 'Enter motorcycle number',
    hint:        'Enter the motorcycle registration number',
  },
  cycle: {
    label:       'Cycle',
    icon:        FaBicycle,
    color:       '#0d9488',
    placeholder: 'Enter cycle identification number',
    hint:        'Enter the cycle identification number',
  },
};

export default function VehicleEntry({ vehicleType = 'car' }) {
  const navigate     = useNavigate();
  const queryClient  = useQueryClient();
  const [form, setForm] = useState({ vehicleNumber:'', customerName:'', customerPhone:'' });

  const cfg = VEHICLE_CONFIG[vehicleType] || VEHICLE_CONFIG.car;
  const Icon = cfg.icon;

  const mutation = useMutation({
    mutationFn: createParking,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['all-parkings'] });
      queryClient.invalidateQueries({ queryKey: ['today-parkings'] });
      queryClient.invalidateQueries({ queryKey: ['active-parkings'] });
      navigate('/staff/today-list');
    },
    onError: (err) => {
      alert('Error: ' + (err.response?.data?.message || `Failed to park ${vehicleType}`));
    },
  });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.vehicleNumber.trim()) {
      alert(`Please enter ${cfg.label} number`);
      return;
    }
    mutation.mutate({
      vehicleNumber: form.vehicleNumber.trim().toUpperCase(),
      vehicleType,
      customerName:  form.customerName  || undefined,
      customerPhone: form.customerPhone || undefined,
    });
  };

  return (
    <>
      <style>{css}</style>
      <div className="ve-wrap" style={{ padding:'28px 32px', minHeight:'100vh', background:'#f7f7f7' }}>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:28 }}>
          <div>
            <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:28, letterSpacing:'-0.02em', color:'#0a0a0a', lineHeight:1, fontStyle:'italic' }}>
              New {cfg.label} Entry
            </div>
            <div style={{ fontFamily:'DM Mono,monospace', fontSize:11, color:'#aaa', marginTop:4, letterSpacing:'.04em' }}>
              Register a new {cfg.label.toLowerCase()} parking slot
            </div>
          </div>
          <div style={{ width:42, height:42, borderRadius:11, background:`${cfg.color}12`, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Icon size={18} color={cfg.color} />
          </div>
        </div>

        {/* Form card — centered, constrained width */}
        <div style={{ maxWidth:560, margin:'0 auto' }}>
          <div className="db-card" style={{ padding:'28px 28px' }}>

            {/* Vehicle type badge */}
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:26, paddingBottom:20, borderBottom:'1px solid #f5f5f5' }}>
              <div style={{ width:36, height:36, borderRadius:9, background:`${cfg.color}12`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <Icon size={15} color={cfg.color} />
              </div>
              <div>
                <div style={{ fontFamily:'DM Sans,sans-serif', fontWeight:700, fontSize:14, color:'#0a0a0a' }}>{cfg.label} Parking</div>
                <div style={{ fontFamily:'DM Mono,monospace', fontSize:10.5, color:'#aaa', marginTop:1 }}>Fill in the details below to register entry</div>
              </div>
            </div>

            <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:20 }}>

              {/* Vehicle Number — primary field */}
              <div>
                <span className="field-label">{cfg.label} Number <span style={{ color:'#f87171' }}>*</span></span>
                <input
                  className="ve-input-highlight"
                  name="vehicleNumber"
                  value={form.vehicleNumber}
                  onChange={handleChange}
                  placeholder={cfg.placeholder}
                  required
                  autoFocus
                  autoComplete="off"
                />
                <div className="hint-text">{cfg.hint}</div>
              </div>

              {/* Divider */}
              <div style={{ borderTop:'1px solid #f5f5f5', margin:'0 -4px' }} />

              {/* Optional fields */}
              <div>
                <span className="field-label">Customer Name <span style={{ color:'#ddd' }}>optional</span></span>
                <input
                  className="ve-input"
                  name="customerName"
                  value={form.customerName}
                  onChange={handleChange}
                  placeholder="Enter customer name"
                  autoComplete="off"
                />
              </div>

              <div>
                <span className="field-label">Customer Phone <span style={{ color:'#ddd' }}>optional</span></span>
                <input
                  className="ve-input"
                  name="customerPhone"
                  value={form.customerPhone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  type="tel"
                  autoComplete="off"
                />
              </div>

              {/* Actions */}
              <div style={{ display:'flex', gap:10, paddingTop:6 }}>
                <button
                  type="button"
                  className="ve-btn-ghost"
                  onClick={() => navigate('/staff/today-list')}
                >
                  <FaArrowLeft size={11} /> Back
                </button>
                <button
                  type="submit"
                  className="ve-btn-primary"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending
                    ? <><div className="spinner" /> Processing…</>
                    : <><FaCheck size={11} /> Park {cfg.label}</>
                  }
                </button>
              </div>

            </form>
          </div>
        </div>

      </div>
    </>
  );
}