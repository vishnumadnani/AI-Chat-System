import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Lock,
  Mail,
  User,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  Zap,
  Cpu,
  Layers,
  X,
  Eye,
  EyeOff,
  AlertCircle
} from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const { loginWithGoogle, loginWithEmail } = useAuth();
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      if (!credentialResponse?.credential) {
        throw new Error('No credential received from Google.');
      }
      const loggedInUser = await loginWithGoogle(credentialResponse.credential);
      if (onLoginSuccess) {
        onLoginSuccess(loggedInUser);
      }
      onClose();
    } catch (err) {
      setErrorMessage(err.message || 'Google sign-in failed. Please verify server configuration.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setErrorMessage('Google Sign-In was cancelled or failed to initialize.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    setIsLoading(true);
    try {
      const loggedInUser = await loginWithEmail(email.trim(), name.trim() || email.split('@')[0]);
      if (onLoginSuccess) {
        onLoginSuccess(loggedInUser);
      }
      onClose();
    } catch (err) {
      setErrorMessage(err.message || 'Login failed. Please check backend connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-overlay">
      <div className="auth-modal-card">
        {/* Top Header */}
        <div className="auth-modal-header">
          <div className="auth-logo-badge">
            <Cpu size={24} className="text-indigo-400" />
          </div>
          <button
            type="button"
            className="auth-close-btn"
            onClick={onClose}
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="auth-modal-body">
          <div className="auth-title-section">
            <h2 className="auth-main-title">
              Sign In to AI Hub
            </h2>
            <p className="auth-subtitle">
              Sign in with your Google account to instantly unlock all developer AI providers: Claude 3.7, Gemini 3.8, DeepSeek R1, GPT-4o, Mistral & Groq.
            </p>
          </div>

          {errorMessage && (
            <div className="auth-error-banner" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={16} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Direct One-Click Email Login (100% works on any IP / domain / local network without origin_mismatch) */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px', margin: '14px 0 20px 0' }}>
            <div>
              <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <User size={15} className="text-indigo-400" />
                <span>Your Name:</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Vishnu Madnani"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  background: 'rgba(255, 255, 255, 0.07)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '0.92rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <Mail size={15} className="text-indigo-400" />
                <span>Your Google / Gmail Address:</span>
              </label>
              <input
                type="email"
                placeholder="you@gmail.com"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  background: 'rgba(255, 255, 255, 0.07)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '0.92rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !email.trim()}
              style={{
                width: '100%',
                padding: '12px',
                marginTop: '6px',
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '0.95rem',
                fontWeight: 600,
                cursor: isLoading || !email.trim() ? 'not-allowed' : 'pointer',
                opacity: isLoading || !email.trim() ? 0.6 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(79, 70, 229, 0.4)',
                transition: 'all 0.2s'
              }}
            >
              <Zap size={16} />
              <span>{isLoading ? 'Signing In...' : 'Sign In With Email'}</span>
            </button>
          </form>

          {/* Separator */}
          <div className="auth-separator" style={{ display: 'flex', alignItems: 'center', margin: '14px 0', color: '#64748b', fontSize: '0.8rem' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
            <span style={{ padding: '0 10px' }}>OR OFFICIAL GOOGLE SIGN-IN</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
          </div>

          {/* Official Google OAuth Login Button */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, margin: '6px 0 16px 0' }}>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                theme="filled_black"
                size="large"
                shape="rectangular"
                text="continue_with"
                width="340"
              />
            </div>
            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
              *Note: For Google popup on LAN IP, add your IP in Google Cloud Console.
            </span>
          </div>

          {/* Quick Perks Indicator */}
          <div className="auth-features-strip">
            <div className="auth-feature-pill">
              <CheckCircle size={13} className="text-emerald-400" />
              <span>Gemini 3.8 & Flash</span>
            </div>
            <div className="auth-feature-pill">
              <CheckCircle size={13} className="text-emerald-400" />
              <span>Claude 3.7 & GPT-4o</span>
            </div>
            <div className="auth-feature-pill">
              <CheckCircle size={13} className="text-emerald-400" />
              <span>DeepSeek R1 & Groq</span>
            </div>
          </div>

          {/* Footer note */}
          <div className="auth-modal-footer">
            <ShieldCheck size={14} className="text-indigo-400" />
            <span>Zero API keys required in browser. Unified secure developer session.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
