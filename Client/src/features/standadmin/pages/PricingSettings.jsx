import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../config/axios';
import { FaCar, FaMotorcycle, FaBicycle, FaSave } from 'react-icons/fa';
import { FiCheck } from 'react-icons/fi';

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500;600&family=DM+Sans:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes fadeUp  { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
  @keyframes fadeIn  { from { opacity: 0; transform: translateY(4px); }  to { opacity: 1; transform: none; } }

  .ps-wrap { font-family: 'DM Sans', sans-serif; animation: fadeUp .28s ease; }

  .section-label {
    font-family: 'DM Mono', monospace;
    font-size: 9px; font-weight: 600;
    letter-spacing: .14em; text-transform: uppercase;
    color: #aaa; display: block; margin-bottom: 6px;
  }

  .db-card {
    background: #fff; border-radius: 16px;
    border: 1px solid #ebebeb;
    transition: box-shadow .18s;
  }
  .db-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,.06); }

  .rate-input {
    width: 100%;
    background: #fafafa;
    border: 1.5px solid #ebebeb;
    border-radius: 10px;
    padding: 11px 14px 11px 38px;
    font-family: 'DM Mono', monospace;
    font-size: 18px;
    font-weight: 600;
    color: #0a0a0a;
    outline: none;
    transition: all .15s;
    -moz-appearance: textfield;
  }
  .rate-input::-webkit-outer-spin-button,
  .rate-input::-webkit-inner-spin-button { -webkit-appearance: none; }
  .rate-input:focus {
    border-color: #0a0a0a;
    background: #fff;
    box-shadow: 0 0 0 3px #f5f5f5;
  }

  .save-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 11px 22px;
    background: #0a0a0a; color: #fff;
    border: none; border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 700;
    cursor: pointer; transition: all .14s;
  }
  .save-btn:hover { background: #222; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,.18); }
  .save-btn:active { transform: none; }
  .save-btn:disabled { background: #d4d4d4; cursor: not-allowed; transform: none; box-shadow: none; }

  .toast {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 9px 16px;
    background: #f0fdf4; color: #059669;
    border: 1px solid #bbf7d0;
    border-radius: 10px;
    font-family: 'DM Mono', monospace;
    font-size: 11px; font-weight: 600;
    letter-spacing: .04em;
    animation: fadeIn .2s ease;
  }

  .per-hour-tag {
    font-family: 'DM Mono', monospace;
    font-size: 9px; font-weight: 600;
    letter-spacing: .12em; text-transform: uppercase;
    color: #bbb;
    background: #f5f5f5;
    padding: 2px 7px; border-radius: 6px;
  }
`;

const VEHICLES = [
  {
    key: 'car',
    label: 'Car',
    icon: FaCar,
    color: '#1d4ed8',
    bg: '#eff6ff',
    default: 20,
    desc: 'Standard 4-wheeler rate',
  },
  {
    key: 'bike', // API uses 'bike' but UI shows as 'Motorcycle'
    label: 'Motorcycle',
    icon: FaMotorcycle,
    color: '#d97706',
    bg: '#fffbeb',
    default: 10,
    desc: 'Bike & scooter rate',
  },
  {
    key: 'cycle',
    label: 'Bicycle',
    icon: FaBicycle,
    color: '#0d9488',
    bg: '#f0fdfa',
    default: 5,
    desc: 'Pedal cycle rate',
  },
];

const PricingSettings = () => {
  const queryClient = useQueryClient();
  
  // Fetch current pricing
  const { data: pricingData, isLoading, error } = useQuery({
    queryKey: ['stand-pricing'],
    queryFn: async () => {
      try {
        console.log('Fetching pricing data...');
        const response = await api.get('/pricing/stand');
        console.log('Pricing API response:', response.data);
        return response.data.data;
      } catch (error) {
        console.error('Pricing API error:', error.response?.data || error.message);
        throw error;
      }
    },
    staleTime: 300000, // 5 minutes
    retry: false, // No retry to avoid spam
  });
  
  const [rates, setRates] = useState(
    Object.fromEntries(VEHICLES.map(v => [v.key, parseFloat(v.default) || 0]))
  );
  
  // Debug: Log rates changes
  useEffect(() => {
    console.log('Rates updated:', rates);
  }, [rates]);
  const [saved, setSaved] = useState(false);
  
  // Update rates when pricing data loads
  useEffect(() => {
    console.log('Pricing data received:', pricingData);
    if (pricingData) {
      // Handle both simple numeric values and object structure
      const newRates = {
        car: typeof pricingData.car === 'object' ? (pricingData.car.firstHourRate || 20) : (pricingData.car || 20),
        bike: typeof pricingData.bike === 'object' ? (pricingData.bike.firstHourRate || 10) : (pricingData.bike || 10),
        cycle: typeof pricingData.cycle === 'object' ? (pricingData.cycle.firstHourRate || 5) : (pricingData.cycle || 5),
      };
      
      // Ensure all values are numbers
      const numericRates = {
        car: parseFloat(newRates.car) || 20,
        bike: parseFloat(newRates.bike) || 10,
        cycle: parseFloat(newRates.cycle) || 5,
      };
      
      console.log('Setting rates to:', numericRates);
      setRates(numericRates);
    }
  }, [pricingData]);
  
  const [saving, setSaving] = useState(false);

  const handleChange = (key, val) => {
    setSaved(false);
    // Ensure we store the value as a number
    const numericValue = parseFloat(val) || 0;
    setRates(prev => ({ ...prev, [key]: numericValue }));
  };

  const updatePricingMutation = useMutation({
    mutationFn: async (pricingData) => {
      console.log('Sending pricing update request:', pricingData);
      const response = await api.put('/pricing/stand', {
        pricing: pricingData
      });
      console.log('Pricing update response:', response.data);
      return response.data;
    },
    onSuccess: (data) => {
      setSaving(false);
      setSaved(true);
      console.log('Pricing updated successfully:', data);
      queryClient.invalidateQueries(['stand-pricing']);
      setTimeout(() => setSaved(false), 3000);
    },
    onError: (error) => {
      setSaving(false);
      console.error('Error updating pricing:', error);
      console.error('Error response:', error.response?.data);
      
      let errorMessage = 'Failed to update pricing';
      if (error.response?.data?.message) {
        errorMessage += ': ' + error.response.data.message;
      } else if (error.message) {
        errorMessage += ': ' + error.message;
      }
      
      alert(errorMessage);
    }
  });
  
  const handleSave = async () => {
    setSaving(true);
    
    // Prepare pricing data to match API expectations
    const pricingData = {
      cycle: parseFloat(rates.cycle) || 0,
      bike: parseFloat(rates.bike) || 0,
      car: parseFloat(rates.car) || 0,
    };
    
    console.log('Saving pricing data:', pricingData);
    
    updatePricingMutation.mutate(pricingData);
  };

  if (isLoading) return (
    <>
      <style>{css}</style>
      <div className="ps-wrap" style={{ padding: '28px 32px', minHeight: '100vh', background: '#f7f7f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          width: 32, height: 32,
          border: '3px solid #f3f4f6',
          borderTopColor: '#0a0a0a',
          borderRadius: '50%',
          animation: 'spin .8s linear infinite',
        }} />
      </div>
    </>
  );
  
  if (error) return (
    <>
      <style>{css}</style>
      <div className="ps-wrap" style={{ padding: '28px 32px', minHeight: '100vh', background: '#f7f7f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          padding: '20px',
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '10px',
          color: '#dc2626',
          fontFamily: 'DM Mono, monospace',
          fontSize: '14px',
          maxWidth: '500px',
        }}>
          <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>Error loading pricing data</div>
          <div>Message: {error.message}</div>
          {error.response?.data?.message && (
            <div style={{ marginTop: '8px', fontSize: '12px' }}>
              Backend Message: {error.response.data.message}
            </div>
          )}
          <div style={{ marginTop: '12px', fontSize: '12px', color: '#999' }}>
            Status: {error.response?.status || 'Unknown'}
          </div>
        </div>
      </div>
    </>
  );
  
  return (
    <>
      <style>{css}</style>
      <div className="ps-wrap" style={{ padding: '28px 32px', minHeight: '100vh', background: '#f7f7f7' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <span className="section-label">Configuration</span>
            <div style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 28, letterSpacing: '-0.02em',
              color: '#0a0a0a', lineHeight: 1, fontStyle: 'italic',
            }}>
              Pricing Settings
            </div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#aaa', marginTop: 4, letterSpacing: '.04em' }}>
              Set hourly rates per vehicle type
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {saved && (
              <span className="toast">
                <FiCheck size={12} /> Rates saved
              </span>
            )}
            <button className="save-btn" onClick={handleSave} disabled={saving || updatePricingMutation.isPending}>
              {(saving || updatePricingMutation.isPending) ? (
                <>
                  <span style={{
                    width: 13, height: 13,
                    border: '2px solid #fff4',
                    borderTopColor: '#fff',
                    borderRadius: '50%',
                    display: 'inline-block',
                    animation: 'spin .6s linear infinite',
                  }} />
                  Saving…
                </>
              ) : (
                <><FaSave size={12} /> Save Rates</>
              )}
            </button>
          </div>
        </div>

        {/* Rate Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 20 }}>
          {VEHICLES.map(({ key, label, icon: Icon, color, bg, desc }) => (
            <div key={key} className="db-card" style={{ padding: '24px' }}>

              {/* Icon + label */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 11,
                  background: bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Icon size={18} color={color} />
                </div>
                <div>
                  <div style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: 14, color: '#0a0a0a' }}>
                    {label}
                  </div>
                  <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: '#aaa', marginTop: 1 }}>
                    {desc}
                  </div>
                </div>
                <span className="per-hour-tag" style={{ marginLeft: 'auto' }}>/ hr</span>
              </div>

              {/* Input */}
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)',
                  fontFamily: 'DM Serif Display, serif',
                  fontSize: 17, color: '#aaa', pointerEvents: 'none',
                  userSelect: 'none',
                }}>₹</span>
                <input
                  className="rate-input"
                  type="number"
                  min={0}
                  value={typeof rates[key] === 'object' ? rates[key].firstHourRate : rates[key]}
                  onChange={e => handleChange(key, e.target.value)}
                />
              </div>

              {/* Preview */}
              <div style={{
                marginTop: 14,
                padding: '10px 14px',
                background: '#f7f7f7',
                borderRadius: 9,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: '#aaa', letterSpacing: '.06em', textTransform: 'uppercase' }}>
                  2 hrs cost
                </span>
                <span style={{ fontFamily: 'DM Serif Display, serif', fontSize: 16, color: '#0a0a0a' }}>
                  ₹{(typeof rates[key] === 'object' ? rates[key].firstHourRate * 2 : rates[key] * 2) || 0}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Card */}
        <div className="db-card" style={{ padding: '22px 24px' }}>
          <span className="section-label">Rate Summary</span>
          <div style={{ display: 'flex', gap: 0 }}>
            {VEHICLES.map(({ key, label, icon: Icon, color, bg }, i) => (
              <div key={key} style={{
                flex: 1,
                padding: '14px 20px',
                borderRight: i < VEHICLES.length - 1 ? '1px solid #f5f5f5' : 'none',
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 9,
                  background: bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Icon size={14} color={color} />
                </div>
                <div>
                  <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: '#aaa', textTransform: 'uppercase', letterSpacing: '.12em' }}>
                    {label}
                  </div>
                  <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, color: '#0a0a0a', marginTop: 2 }}>
                    ₹{typeof rates[key] === 'object' ? rates[key].firstHourRate : rates[key]}<span style={{ fontSize: 11, color: '#bbb', fontFamily: 'DM Mono, monospace' }}>/hr</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
};

export default PricingSettings;