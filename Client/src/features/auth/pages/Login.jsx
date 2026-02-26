import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
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
    --gold: #c9a96e;
    --gold-light: #e8d5b0;
    --gold-dark: #a07840;
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
    --shadow-input: 0 1px 2px 0 rgba(0,0,0,0.04);
    --shadow-button: 0 1px 2px 0 rgba(0,0,0,0.08), 0 4px 12px -2px rgba(201,169,110,0.32);
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

  @keyframes errorPulse {
    0% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.15); }
    70% { box-shadow: 0 0 0 6px rgba(220, 38, 38, 0); }
    100% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0); }
  }

  .lp-wrap {
    width: 100%;
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    font-family: var(--font-body);
    animation: pageIn 0.4s ease;
    overflow-x: hidden;
  }

  /* ── Left panel ─────────────────────────────────────── */
  .lp-panel {
    position: relative;
    background: var(--ink);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 2rem;
    overflow: hidden;
  }

  .lp-panel-bg {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 60% 50% at 20% 80%, rgba(201,169,110,0.18) 0%, transparent 60%),
      radial-gradient(ellipse 50% 40% at 80% 20%, rgba(201,169,110,0.08) 0%, transparent 50%);
    pointer-events: none;
  }

  .lp-panel-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
  }

  .lp-brand {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .lp-brand-icon {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .lp-brand-name {
    font-family: var(--font-display);
    font-size: 1.25rem;
    font-weight: 600;
    color: white;
    letter-spacing: -0.01em;
  }

  .lp-panel-body {
    position: relative;
    z-index: 1;
  }

  .lp-panel-tag {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(201,169,110,0.15);
    border: 1px solid rgba(201,169,110,0.3);
    border-radius: 100px;
    padding: 0.3rem 0.875rem;
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--gold-light);
    letter-spacing: 0.04em;
    text-transform: uppercase;
    margin-bottom: 1.5rem;
  }

  .lp-panel-tag-dot {
    width: 6px;
    height: 6px;
    background: var(--gold);
    border-radius: 50%;
  }

  .lp-panel-heading {
    font-family: var(--font-display);
    font-size: 2.6rem;
    font-weight: 500;
    color: white;
    line-height: 1.18;
    letter-spacing: -0.02em;
    margin-bottom: 1.25rem;
  }

  .lp-panel-heading em {
    font-style: italic;
    color: var(--gold-light);
  }

  .lp-panel-desc {
    font-size: 0.9375rem;
    color: rgba(255,255,255,0.5);
    line-height: 1.6;
    max-width: 320px;
    margin-bottom: 2.5rem;
  }

  .lp-stats {
    display: flex;
    gap: 2rem;
  }

  .lp-stat-value {
    font-family: var(--font-display);
    font-size: 1.75rem;
    font-weight: 500;
    color: white;
    letter-spacing: -0.03em;
  }

  .lp-stat-label {
    font-size: 0.75rem;
    color: rgba(255,255,255,0.4);
    margin-top: 0.15rem;
    letter-spacing: 0.02em;
  }

  .lp-panel-footer {
    position: relative;
    z-index: 1;
  }

  .lp-testimonial {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: var(--radius-lg);
    padding: 1.25rem 1.5rem;
    backdrop-filter: blur(8px);
  }

  .lp-testimonial-text {
    font-size: 0.875rem;
    color: rgba(255,255,255,0.7);
    line-height: 1.6;
    font-style: italic;
    margin-bottom: 1rem;
  }

  .lp-testimonial-author {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .lp-avatar {
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 600;
    color: white;
    flex-shrink: 0;
  }

  .lp-author-name {
    font-size: 0.8125rem;
    font-weight: 500;
    color: rgba(255,255,255,0.85);
  }

  .lp-author-role {
    font-size: 0.75rem;
    color: rgba(255,255,255,0.4);
  }

  /* ── Right panel / Form ─────────────────────────────── */
  .lp-form-side {
    background: var(--surface-tint);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2.5rem;
    min-height: 100vh;
  }

  .lp-card {
    width: 100%;
    max-width: 420px;
    animation: cardIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.1s both;
  }

  .lp-card-inner {
    background: var(--surface);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-card);
    overflow: hidden;
  }

  .lp-card-head {
    padding: 2rem 2rem 1.75rem;
    border-bottom: 1px solid var(--border-soft);
  }

  .lp-card-eyebrow {
    font-size: 0.6875rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--gold-dark);
    margin-bottom: 0.75rem;
  }

  .lp-card-title {
    font-family: var(--font-display);
    font-size: 1.625rem;
    font-weight: 500;
    color: var(--ink);
    letter-spacing: -0.02em;
    margin-bottom: 0.375rem;
  }

  .lp-card-sub {
    font-size: 0.875rem;
    color: var(--ink-muted);
  }

  .lp-card-body {
    padding: 1.75rem 2rem 2rem;
  }

  /* Role tabs */
  .lp-tabs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.375rem;
    background: var(--surface-tint);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 0.3rem;
    margin-bottom: 1.75rem;
  }

  .lp-tab {
    padding: 0.5625rem 0.75rem;
    border-radius: calc(var(--radius-lg) - 2px);
    font-size: 0.8125rem;
    font-weight: 500;
    text-align: center;
    cursor: pointer;
    border: none;
    background: transparent;
    color: var(--ink-muted);
    transition: var(--transition);
    font-family: var(--font-body);
    letter-spacing: 0.01em;
  }

  .lp-tab:hover:not(.active) {
    color: var(--ink-soft);
    background: rgba(0,0,0,0.03);
  }

  .lp-tab.active {
    background: var(--ink);
    color: white;
    box-shadow: 0 1px 3px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.1);
  }

  .lp-tab.active.super {
    background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%);
  }

  /* Form fields */
  .lp-field {
    margin-bottom: 1.125rem;
  }

  .lp-label {
    display: block;
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--ink-soft);
    margin-bottom: 0.5rem;
    letter-spacing: 0.005em;
  }

  .lp-input-wrap {
    position: relative;
  }

  .lp-input {
    width: 100%;
    padding: 0.6875rem 0.875rem 0.6875rem 2.625rem;
    border: 1.5px solid var(--border);
    border-radius: var(--radius);
    font-size: 0.9rem;
    font-family: var(--font-body);
    color: var(--ink);
    background: var(--surface);
    transition: var(--transition);
    box-shadow: var(--shadow-input);
    -webkit-appearance: none;
  }

  .lp-input::placeholder {
    color: var(--ink-faint);
  }

  .lp-input:focus {
    outline: none;
    border-color: var(--gold);
    box-shadow: 0 0 0 3px rgba(201,169,110,0.12), var(--shadow-input);
  }

  .lp-input.has-error {
    border-color: var(--error);
    box-shadow: 0 0 0 3px rgba(220,38,38,0.08);
    animation: errorPulse 0.5s ease;
  }

  .lp-input-icon {
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

  .lp-input:focus ~ .lp-input-icon {
    color: var(--gold-dark);
  }

  .lp-pw-toggle {
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

  .lp-pw-toggle:hover {
    color: var(--ink-muted);
    background: var(--surface-tint);
  }

  /* Error */
  .lp-error {
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

  .lp-error-icon {
    flex-shrink: 0;
    margin-top: 1px;
    color: var(--error);
    width: 15px;
    height: 15px;
  }

  .lp-error-text {
    font-size: 0.845rem;
    color: #991b1b;
    line-height: 1.4;
  }

  /* Options row */
  .lp-options {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.5rem;
  }

  .lp-remember {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
  }

  .lp-check {
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

  .lp-check:checked {
    background: var(--ink);
    border-color: var(--ink);
  }

  .lp-check:checked::after {
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

  .lp-check:focus-visible {
    outline: 2px solid var(--gold);
    outline-offset: 2px;
  }

  .lp-remember-label {
    font-size: 0.84rem;
    color: var(--ink-muted);
    user-select: none;
  }

  .lp-forgot {
    font-size: 0.84rem;
    color: var(--gold-dark);
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s ease;
  }

  .lp-forgot:hover {
    color: var(--gold);
  }

  /* Submit */
  .lp-submit {
    width: 100%;
    padding: 0.8125rem 1rem;
    background: var(--ink);
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
    box-shadow: 0 1px 2px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.12);
    position: relative;
    overflow: hidden;
  }

  .lp-submit::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 100%);
  }

  .lp-submit:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0,0,0,0.1), 0 8px 20px rgba(0,0,0,0.18);
  }

  .lp-submit:active:not(:disabled) {
    transform: translateY(0);
  }

  .lp-submit:disabled {
    opacity: 0.65;
    cursor: not-allowed;
    transform: none;
  }

  .lp-submit.gold {
    background: linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%);
    box-shadow: var(--shadow-button);
    color: #fff;
  }

  .lp-submit.gold:hover:not(:disabled) {
    box-shadow: 0 2px 4px rgba(0,0,0,0.1), 0 8px 20px rgba(201,169,110,0.4);
  }

  .lp-submit.super {
    background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%);
    box-shadow: 0 1px 2px rgba(0,0,0,0.1), 0 4px 12px rgba(124,58,237,0.3);
  }

  .lp-submit.super:hover:not(:disabled) {
    box-shadow: 0 2px 4px rgba(0,0,0,0.1), 0 8px 20px rgba(124,58,237,0.4);
  }

  .lp-spinner {
    width: 15px;
    height: 15px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  /* Divider */
  .lp-divider {
    display: flex;
    align-items: center;
    gap: 0.875rem;
    margin: 1.5rem 0;
  }

  .lp-divider-line {
    flex: 1;
    height: 1px;
    background: var(--border-soft);
  }

  .lp-divider-text {
    font-size: 0.78rem;
    color: var(--ink-faint);
    white-space: nowrap;
    letter-spacing: 0.02em;
  }

  .lp-signup {
    text-align: center;
    font-size: 0.875rem;
    color: var(--ink-muted);
  }

  .lp-signup a {
    color: var(--ink-soft);
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s ease;
  }

  .lp-signup a:hover {
    color: var(--ink);
  }

  /* Footer */
  .lp-card-footer {
    padding: 1rem 2rem;
    border-top: 1px solid var(--border-soft);
    background: var(--surface-tint);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .lp-secure-text {
    font-size: 0.75rem;
    color: var(--ink-faint);
    letter-spacing: 0.01em;
  }

  .lp-secure-icon {
    color: var(--success);
    width: 13px;
    height: 13px;
  }

  /* Shake */
  .shake-card {
    animation: shake 0.45s cubic-bezier(0.36, 0.07, 0.19, 0.97);
  }

  /* Responsive */
  @media (max-width: 900px) {
    .lp-wrap {
      grid-template-columns: 1fr;
      width: 100%;
    }
    .lp-panel {
      display: none;
    }
    .lp-form-side {
      min-height: 100vh;
      padding: 1.5rem;
    }
  }

  @media (max-width: 480px) {
    .lp-form-side {
      padding: 1rem;
      align-items: flex-start;
      padding-top: 2rem;
    }
    .lp-card-head, .lp-card-body {
      padding: 1.5rem;
    }
    .lp-card-footer {
      padding: 1rem 1.5rem;
    }
  }
`;

const IconEmail = () => (
  <svg className="lp-input-icon" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
);

const IconLock = () => (
  <svg className="lp-input-icon" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
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

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loginType, setLoginType] = useState('general');
  const [showPassword, setShowPassword] = useState(false);
  const [shakeError, setShakeError] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const res = await api.post('/auth/login', formData);
      dispatch(loginSuccess(res.data.data));
      const role = res.data.data.user.role;
      if (role === 'super_admin') navigate('/superadmin/dashboard');
      else if (role === 'stand_admin') navigate('/standadmin/dashboard');
      else navigate('/staff/dashboard');
    } catch (err) {
      dispatch(loginFailure(err.response?.data?.message || 'Login failed'));
      setShakeError(true);
      setTimeout(() => setShakeError(false), 500);
    }
  };

  return (
    <>
      <style>{css}</style>
      <div className="lp-wrap">

        {/* Left decorative panel */}
        <div className="lp-panel">
          <div className="lp-panel-bg" />
          <div className="lp-panel-grid" />

          <div className="lp-brand">
            <div className="lp-brand-icon">
              <svg width="20" height="20" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
              </svg>
            </div>
            <span className="lp-brand-name">ParkingPro</span>
          </div>

          <div className="lp-panel-body">
            <div className="lp-panel-tag">
              <div className="lp-panel-tag-dot" />
              Parking Management
            </div>
            <h2 className="lp-panel-heading">
              Manage your<br/>operations<br/><em>effortlessly.</em>
            </h2>
            <p className="lp-panel-desc">
              A unified platform for parking stand managers, staff, and administrators to streamline operations in real time.
            </p>
            <div className="lp-stats">
              <div>
                <div className="lp-stat-value">99.9%</div>
                <div className="lp-stat-label">Uptime SLA</div>
              </div>
              <div>
                <div className="lp-stat-value">500+</div>
                <div className="lp-stat-label">Active stands</div>
              </div>
              <div>
                <div className="lp-stat-value">24/7</div>
                <div className="lp-stat-label">Support</div>
              </div>
            </div>
          </div>

          <div className="lp-panel-footer">
            <div className="lp-testimonial">
              <p className="lp-testimonial-text">
                "ParkingPro cut our manual check-in time by 70%. The dashboard gives us everything we need at a glance."
              </p>
              <div className="lp-testimonial-author">
                <div className="lp-avatar">RA</div>
                <div>
                  <div className="lp-author-name">Ravi Arjun</div>
                  <div className="lp-author-role">Stand Manager, Chennai Hub</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right form panel */}
        <div className="lp-form-side">
          <div className="lp-card">
            <div className={`lp-card-inner ${shakeError ? 'shake-card' : ''}`}>

              <div className="lp-card-head">
                <div className="lp-card-eyebrow">Secure Access</div>
                <h1 className="lp-card-title">Welcome back</h1>
                <p className="lp-card-sub">Sign in to continue to your dashboard</p>
              </div>

              <div className="lp-card-body">

                {/* Tabs */}
                <div className="lp-tabs">
                  <button
                    type="button"
                    className={`lp-tab ${loginType === 'general' ? 'active' : ''}`}
                    onClick={() => setLoginType('general')}
                  >
                    General Login
                  </button>
                  <button
                    type="button"
                    className={`lp-tab super ${loginType === 'super' ? 'active' : ''}`}
                    onClick={() => setLoginType('super')}
                  >
                    Super Admin
                  </button>
                </div>

                {/* Error */}
                {error && (
                  <div className="lp-error">
                    <svg className="lp-error-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9.303 3.376c.866 1.5-.217 3.374-1.948 3.374H4.645c-1.73 0-2.813-1.874-1.948-3.374L10.052 3.378c.866-1.5 3.032-1.5 3.898 0l7.353 12.748zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                    <span className="lp-error-text">{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="lp-field">
                    <label className="lp-label" htmlFor="email">Email address</label>
                    <div className="lp-input-wrap">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        className={`lp-input ${error ? 'has-error' : ''}`}
                        placeholder="you@company.com"
                        value={formData.email}
                        onChange={handleChange}
                      />
                      <IconEmail />
                    </div>
                  </div>

                  <div className="lp-field">
                    <label className="lp-label" htmlFor="password">Password</label>
                    <div className="lp-input-wrap">
                      <input
                        id="password"
                        name="password"
                        required
                        autoComplete="current-password"
                        type={showPassword ? 'text' : 'password'}
                        className={`lp-input ${error ? 'has-error' : ''}`}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                      />
                      <IconLock />
                      <button
                        type="button"
                        className="lp-pw-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeClosed /> : <EyeOpen />}
                      </button>
                    </div>
                  </div>

                  <div className="lp-options">
                    <label className="lp-remember">
                      <input type="checkbox" className="lp-check" id="remember" name="remember" />
                      <span className="lp-remember-label">Keep me signed in</span>
                    </label>
                    <Link to="/forgot-password" className="lp-forgot">Forgot password?</Link>
                  </div>

                  <button
                    type="submit"
                    className={`lp-submit ${loginType === 'super' ? 'super' : 'gold'}`}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="lp-spinner" />
                        {loginType === 'super' ? 'Authenticating...' : 'Signing in...'}
                      </>
                    ) : (
                      <>
                        {loginType === 'super' ? 'Sign in as Super Admin' : 'Sign in'}
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </>
                    )}
                  </button>
                </form>

                <div className="lp-divider">
                  <div className="lp-divider-line" />
                  <span className="lp-divider-text">New to ParkingPro?</span>
                  <div className="lp-divider-line" />
                </div>

                <div className="lp-signup">
                  <Link to="/register">Create an account →</Link>
                </div>

              </div>

              <div className="lp-card-footer">
                <svg className="lp-secure-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
                <span className="lp-secure-text">256-bit SSL encrypted · Secured by ParkingPro</span>
              </div>

            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default Login;