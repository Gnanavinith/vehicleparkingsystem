import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '@/redux/slices/authSlice';
import api from '@/config/axios';

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=Playfair+Display:wght@400;500;600&display=swap');

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  :root {
    --ink: #0f1117;
    --ink-soft: #2a2d35;
    --ink-muted: #6b7280;
    --ink-faint: #9ca3af;
    --accent: #059669;
    --accent-light: rgba(5,150,105,0.12);
    --accent-dark: #047857;
    --surface: #ffffff;
    --surface-tint: #fafaf8;
    --border: #e8e4de;
    --border-soft: #f0ece6;
    --error: #dc2626;
    --error-bg: #fef2f2;
    --error-border: #fecaca;
    --success: #16a34a;
    --radius: 10px;
    --radius-lg: 16px;
    --radius-xl: 24px;
    --font-display: 'Playfair Display', Georgia, serif;
    --font-body: 'DM Sans', -apple-system, sans-serif;
    --transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    --shadow-card: 0 0 0 1px rgba(0,0,0,0.04), 0 24px 48px -12px rgba(0,0,0,0.12), 0 8px 16px -8px rgba(0,0,0,0.06);
  }

  @keyframes pageIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes cardIn {
    from { opacity: 0; transform: translateY(20px) scale(0.98); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-6px); }
    40% { transform: translateX(6px); }
    60% { transform: translateX(-4px); }
    80% { transform: translateX(4px); }
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(-6px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .sl-wrap {
    width: 100%;
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    font-family: var(--font-body);
    animation: pageIn 0.4s ease;
    overflow-x: hidden;
  }

  /* ── Left panel ─────────────────────────────────────── */
  .sl-panel {
    position: relative;
    background: #0a1628;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 2rem;
    overflow: hidden;
  }

  .sl-panel-bg {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 55% 45% at 15% 85%, rgba(5,150,105,0.2) 0%, transparent 55%),
      radial-gradient(ellipse 40% 35% at 85% 15%, rgba(5,150,105,0.08) 0%, transparent 50%);
    pointer-events: none;
  }

  .sl-dots {
    position: absolute;
    inset: 0;
    background-image: radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px);
    background-size: 28px 28px;
    pointer-events: none;
  }

  /* Decorative circles */
  .sl-circle-1 {
    position: absolute;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    border: 1px solid rgba(5,150,105,0.12);
    top: -30px;
    right: -40px;
    pointer-events: none;
  }

  .sl-circle-2 {
    position: absolute;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    border: 1px solid rgba(5,150,105,0.08);
    top: -15px;
    right: -20px;
    pointer-events: none;
  }

  .sl-brand {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .sl-brand-icon {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(5,150,105,0.3);
  }

  .sl-brand-name {
    font-family: var(--font-display);
    font-size: 1.25rem;
    font-weight: 600;
    color: white;
    letter-spacing: -0.01em;
  }

  .sl-role-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    background: rgba(5,150,105,0.15);
    border: 1px solid rgba(5,150,105,0.35);
    border-radius: 100px;
    padding: 0.25rem 0.75rem;
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #6ee7b7;
    margin-left: 0.5rem;
  }

  .sl-panel-body {
    position: relative;
    z-index: 1;
  }

  .sl-panel-heading {
    font-family: var(--font-display);
    font-size: 2.5rem;
    font-weight: 500;
    color: white;
    line-height: 1.2;
    letter-spacing: -0.02em;
    margin-bottom: 1.25rem;
  }

  .sl-panel-heading em {
    font-style: italic;
    color: #6ee7b7;
  }

  .sl-panel-desc {
    font-size: 0.9375rem;
    color: rgba(255,255,255,0.45);
    line-height: 1.65;
    max-width: 300px;
    margin-bottom: 2.5rem;
  }

  .sl-features {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .sl-feature {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .sl-feature-icon {
    width: 32px;
    height: 32px;
    background: rgba(5,150,105,0.15);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .sl-feature-text {
    font-size: 0.875rem;
    color: rgba(255,255,255,0.6);
  }

  .sl-panel-footer {
    position: relative;
    z-index: 1;
  }

  .sl-shift-card {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: var(--radius-lg);
    padding: 1.25rem 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .sl-shift-label {
    font-size: 0.75rem;
    color: rgba(255,255,255,0.4);
    letter-spacing: 0.05em;
    text-transform: uppercase;
    margin-bottom: 0.375rem;
  }

  .sl-shift-value {
    font-size: 1.1rem;
    font-weight: 600;
    color: white;
    letter-spacing: -0.01em;
  }

  .sl-shift-dot {
    width: 8px;
    height: 8px;
    background: #34d399;
    border-radius: 50%;
    box-shadow: 0 0 0 3px rgba(52,211,153,0.2);
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { box-shadow: 0 0 0 3px rgba(52,211,153,0.2); }
    50% { box-shadow: 0 0 0 6px rgba(52,211,153,0.1); }
  }

  /* ── Right form panel ───────────────────────────────── */
  .sl-form-side {
    background: var(--surface-tint);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2.5rem;
    min-height: 100vh;
  }

  .sl-card {
    width: 100%;
    max-width: 420px;
    animation: cardIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.1s both;
  }

  .sl-card-inner {
    background: var(--surface);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-card);
    overflow: hidden;
  }

  .sl-card-head {
    padding: 2rem 2rem 1.75rem;
    border-bottom: 1px solid var(--border-soft);
  }

  .sl-card-eyebrow {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.6875rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 0.75rem;
  }

  .sl-card-eyebrow-dot {
    width: 6px;
    height: 6px;
    background: var(--accent);
    border-radius: 50%;
  }

  .sl-card-title {
    font-family: var(--font-display);
    font-size: 1.625rem;
    font-weight: 500;
    color: var(--ink);
    letter-spacing: -0.02em;
    margin-bottom: 0.375rem;
  }

  .sl-card-sub {
    font-size: 0.875rem;
    color: var(--ink-muted);
  }

  .sl-card-body {
    padding: 1.75rem 2rem 2rem;
  }

  /* Form */
  .sl-field {
    margin-bottom: 1.125rem;
  }

  .sl-label {
    display: block;
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--ink-soft);
    margin-bottom: 0.5rem;
    letter-spacing: 0.005em;
  }

  .sl-input-wrap {
    position: relative;
  }

  .sl-input {
    width: 100%;
    padding: 0.6875rem 0.875rem 0.6875rem 2.625rem;
    border: 1.5px solid var(--border);
    border-radius: var(--radius);
    font-size: 0.9rem;
    font-family: var(--font-body);
    color: var(--ink);
    background: var(--surface);
    transition: var(--transition);
    box-shadow: 0 1px 2px 0 rgba(0,0,0,0.04);
    -webkit-appearance: none;
  }

  .sl-input::placeholder {
    color: var(--ink-faint);
  }

  .sl-input:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(5,150,105,0.1), 0 1px 2px rgba(0,0,0,0.04);
  }

  .sl-input.has-error {
    border-color: var(--error);
    box-shadow: 0 0 0 3px rgba(220,38,38,0.08);
  }

  .sl-input-icon {
    position: absolute;
    left: 0.875rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--ink-faint);
    width: 15px;
    height: 15px;
    pointer-events: none;
    transition: color 0.2s ease;
  }

  .sl-input:focus ~ .sl-input-icon {
    color: var(--accent);
  }

  .sl-pw-toggle {
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: var(--ink-faint);
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition);
  }

  .sl-pw-toggle:hover {
    color: var(--ink-muted);
    background: var(--surface-tint);
  }

  /* Error */
  .sl-error {
    display: flex;
    align-items: flex-start;
    gap: 0.625rem;
    padding: 0.75rem 1rem;
    background: var(--error-bg);
    border: 1px solid var(--error-border);
    border-radius: var(--radius);
    margin-bottom: 1.25rem;
    animation: fadeSlideIn 0.3s ease;
  }

  .sl-error-icon {
    flex-shrink: 0;
    margin-top: 1px;
    color: var(--error);
    width: 15px;
    height: 15px;
  }

  .sl-error-text {
    font-size: 0.845rem;
    color: #991b1b;
    line-height: 1.4;
  }

  /* Options */
  .sl-options {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.5rem;
  }

  .sl-remember {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
  }

  .sl-check {
    width: 16px;
    height: 16px;
    border: 1.5px solid var(--border);
    border-radius: 4px;
    appearance: none;
    -webkit-appearance: none;
    cursor: pointer;
    position: relative;
    transition: var(--transition);
    flex-shrink: 0;
  }

  .sl-check:checked {
    background: var(--accent);
    border-color: var(--accent);
  }

  .sl-check:checked::after {
    content: '';
    position: absolute;
    left: 4px;
    top: 2px;
    width: 4px;
    height: 7px;
    border: solid white;
    border-width: 0 1.5px 1.5px 0;
    transform: rotate(45deg);
  }

  .sl-remember-label {
    font-size: 0.84rem;
    color: var(--ink-muted);
    user-select: none;
  }

  .sl-forgot {
    font-size: 0.84rem;
    color: var(--accent-dark);
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s ease;
  }

  .sl-forgot:hover {
    color: var(--accent);
  }

  /* Submit */
  .sl-submit {
    width: 100%;
    padding: 0.8125rem 1rem;
    background: linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%);
    color: white;
    border: none;
    border-radius: var(--radius);
    font-size: 0.9rem;
    font-weight: 500;
    font-family: var(--font-body);
    letter-spacing: 0.01em;
    cursor: pointer;
    transition: var(--transition);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    box-shadow: 0 1px 2px rgba(0,0,0,0.1), 0 4px 12px rgba(5,150,105,0.3);
    position: relative;
    overflow: hidden;
  }

  .sl-submit::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 100%);
  }

  .sl-submit:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0,0,0,0.1), 0 8px 20px rgba(5,150,105,0.4);
  }

  .sl-submit:active:not(:disabled) {
    transform: translateY(0);
  }

  .sl-submit:disabled {
    opacity: 0.65;
    cursor: not-allowed;
    transform: none;
  }

  .sl-spinner {
    width: 15px;
    height: 15px;
    border: 2px solid rgba(255,255,255,0.35);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  /* Footer */
  .sl-card-footer {
    padding: 1rem 2rem;
    border-top: 1px solid var(--border-soft);
    background: var(--surface-tint);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .sl-secure-text {
    font-size: 0.75rem;
    color: var(--ink-faint);
    letter-spacing: 0.01em;
  }

  .sl-secure-icon {
    color: var(--success);
    width: 13px;
    height: 13px;
    flex-shrink: 0;
  }

  .shake-card {
    animation: shake 0.45s cubic-bezier(0.36, 0.07, 0.19, 0.97);
  }

  /* Responsive */
  @media (max-width: 900px) {
    .sl-wrap { grid-template-columns: 1fr; width: 100%; }
    .sl-panel { display: none; }
    .sl-form-side { min-height: 100vh; padding: 1.5rem; }
  }

  @media (max-width: 480px) {
    .sl-form-side { padding: 1rem; align-items: flex-start; padding-top: 2rem; }
    .sl-card-head, .sl-card-body { padding: 1.5rem; }
    .sl-card-footer { padding: 1rem 1.5rem; }
  }
`;

const IconEmail = ({ cls }) => (
  <svg className={cls} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
);

const IconLock = ({ cls }) => (
  <svg className={cls} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h7.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
  </svg>
);

const EyeOpen = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const EyeClosed = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
  </svg>
);

const StaffLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [shakeError, setShakeError] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

  const mutation = useMutation({
    mutationFn: async (loginData) => {
      dispatch(loginStart());
      const response = await api.post('/auth/login', loginData);
      return response.data;
    },
    onSuccess: (data) => {
      dispatch(loginSuccess({ user: data.user, token: data.token }));
      navigate('/staff/dashboard');
    },
    onError: (error) => {
      dispatch(loginFailure(error.message || 'Login failed'));
      setShakeError(true);
      setTimeout(() => setShakeError(false), 500);
    },
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = (e) => { e.preventDefault(); mutation.mutate(formData); };

  const { error } = mutation;

  return (
    <>
      <style>{css}</style>
      <div className="sl-wrap">

        {/* Left panel */}
        <div className="sl-panel">
          <div className="sl-panel-bg" />
          <div className="sl-dots" />
          <div className="sl-circle-1" />
          <div className="sl-circle-2" />

          <div className="sl-brand">
            <div className="sl-brand-icon">
              <svg width="20" height="20" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
              </svg>
            </div>
            <span className="sl-brand-name">ParkingPro</span>
            <span className="sl-role-badge">Staff Portal</span>
          </div>

          <div className="sl-panel-body">
            <h2 className="sl-panel-heading">
              Your shift,<br/>your <em>tools</em>,<br/>your dashboard.
            </h2>
            <p className="sl-panel-desc">
              Everything staff need to manage vehicle entries, exits, payments, and reports — all in one place.
            </p>
            <div className="sl-features">
              {[
                { icon: '⚡', text: 'Real-time vehicle tracking' },
                { icon: '📋', text: 'Instant entry & exit logging' },
                { icon: '💳', text: 'Payment collection & receipts' },
              ].map((f, i) => (
                <div className="sl-feature" key={i}>
                  <div className="sl-feature-icon">
                    <span style={{ fontSize: '0.875rem' }}>{f.icon}</span>
                  </div>
                  <span className="sl-feature-text">{f.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="sl-panel-footer">
            <div className="sl-shift-card">
              <div>
                <div className="sl-shift-label">Current Time</div>
                <div className="sl-shift-value">{timeStr}</div>
              </div>
              <div>
                <div className="sl-shift-label">System Status</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                  <div className="sl-shift-dot" />
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#34d399' }}>Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right form */}
        <div className="sl-form-side">
          <div className="sl-card">
            <div className={`sl-card-inner ${shakeError ? 'shake-card' : ''}`}>

              <div className="sl-card-head">
                <div className="sl-card-eyebrow">
                  <span className="sl-card-eyebrow-dot" />
                  Staff Access
                </div>
                <h1 className="sl-card-title">Staff Login</h1>
                <p className="sl-card-sub">Sign in to access your dashboard</p>
              </div>

              <div className="sl-card-body">

                {error && (
                  <div className="sl-error">
                    <svg className="sl-error-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9.303 3.376c.866 1.5-.217 3.374-1.948 3.374H4.645c-1.73 0-2.813-1.874-1.948-3.374L10.052 3.378c.866-1.5 3.032-1.5 3.898 0l7.353 12.748zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                    <span className="sl-error-text">{error?.message || String(error)}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="sl-field">
                    <label className="sl-label" htmlFor="email">Email address</label>
                    <div className="sl-input-wrap">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        className={`sl-input ${error ? 'has-error' : ''}`}
                        placeholder="staff@company.com"
                        value={formData.email}
                        onChange={handleChange}
                      />
                      <IconEmail cls="sl-input-icon" />
                    </div>
                  </div>

                  <div className="sl-field">
                    <label className="sl-label" htmlFor="password">Password</label>
                    <div className="sl-input-wrap">
                      <input
                        id="password"
                        name="password"
                        required
                        autoComplete="current-password"
                        type={showPassword ? 'text' : 'password'}
                        className={`sl-input ${error ? 'has-error' : ''}`}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                      />
                      <IconLock cls="sl-input-icon" />
                      <button
                        type="button"
                        className="sl-pw-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeClosed /> : <EyeOpen />}
                      </button>
                    </div>
                  </div>

                  <div className="sl-options">
                    <label className="sl-remember">
                      <input type="checkbox" className="sl-check" id="remember" name="remember" />
                      <span className="sl-remember-label">Keep me signed in</span>
                    </label>
                    <a href="/forgot-password" className="sl-forgot">Forgot password?</a>
                  </div>

                  <button type="submit" className="sl-submit" disabled={mutation.isPending}>
                    {mutation.isPending ? (
                      <>
                        <span className="sl-spinner" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign in to Dashboard
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </>
                    )}
                  </button>
                </form>

              </div>

              <div className="sl-card-footer">
                <svg className="sl-secure-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
                <span className="sl-secure-text">256-bit SSL encrypted · Secured by ParkingPro</span>
              </div>

            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default StaffLogin;