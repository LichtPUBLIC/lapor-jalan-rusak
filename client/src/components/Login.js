import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";
import { colors, glass, borderRadius, shadows, transitions, buttons, inputs } from "../designSystem";
import config from "../config";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focusedField, setFocusedField] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // ... inside handleLogin
      const res = await axios.post(`${config.apiUrl}/api/auth/login`, { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("nama", res.data.nama);

      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || "Login gagal. Silakan coba lagi.");
      setIsLoading(false);
    }
  };

  const containerStyle = {
    minHeight: 'calc(100vh - 190px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    animation: 'fadeIn 0.6s ease-out',
  };

  const cardStyle = {
    ...glass.card,
    maxWidth: '440px',
    width: '100%',
    padding: '48px',
    animation: 'scaleIn 0.5s ease-out',
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '40px',
  };

  const titleStyle = {
    fontSize: '36px',
    fontWeight: '700',
    background: colors.gradientPrimary,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '8px',
  };

  const subtitleStyle = {
    fontSize: '15px',
    color: colors.textSecondary,
    fontWeight: '400',
  };

  const formGroupStyle = {
    marginBottom: '24px',
    position: 'relative',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: colors.text,
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const inputWrapperStyle = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  };

  const iconWrapperStyle = {
    position: 'absolute',
    left: '20px',
    color: colors.textSecondary,
    pointerEvents: 'none',
    transition: transitions.fast,
  };

  const inputStyle = (fieldName) => ({
    ...inputs.base,
    paddingLeft: '52px',
    ...(focusedField === fieldName ? inputs.focus : {}),
  });

  const submitButtonStyle = {
    ...buttons.primary,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    marginTop: '32px',
    opacity: isLoading ? 0.7 : 1,
    cursor: isLoading ? 'not-allowed' : 'pointer',
  };

  const errorStyle = {
    background: 'rgba(255, 59, 48, 0.1)',
    border: `1px solid ${colors.danger}`,
    borderRadius: borderRadius.md,
    padding: '12px 16px',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    color: colors.danger,
    fontSize: '14px',
    animation: 'slideDown 0.3s ease-out',
  };

  const footerStyle = {
    textAlign: 'center',
    marginTop: '32px',
    fontSize: '14px',
    color: colors.textSecondary,
  };

  const linkStyle = {
    color: colors.primary,
    textDecoration: 'none',
    fontWeight: '600',
    transition: transitions.fast,
  };

  return (
    <>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes scaleIn {
            from { transform: scale(0.95); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          
          @keyframes slideDown {
            from { transform: translateY(-10px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        `}
      </style>

      <div style={containerStyle}>
        <div style={cardStyle}>
          <div style={headerStyle}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚧</div>
            <h2 style={titleStyle}>Selamat Datang</h2>
            <p style={subtitleStyle}>Masuk ke akun LaporJalan Anda</p>
          </div>

          {error && (
            <div style={errorStyle}>
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>
                <Mail size={16} />
                Email
              </label>
              <div style={inputWrapperStyle}>
                <div style={iconWrapperStyle}>
                  <Mail size={20} color={focusedField === 'email' ? colors.primary : colors.textSecondary} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  required
                  placeholder="nama@email.com"
                  style={inputStyle('email')}
                />
              </div>
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>
                <Lock size={16} />
                Password
              </label>
              <div style={inputWrapperStyle}>
                <div style={iconWrapperStyle}>
                  <Lock size={20} color={focusedField === 'password' ? colors.primary : colors.textSecondary} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  required
                  placeholder="Masukkan password"
                  style={inputStyle('password')}
                />
              </div>
            </div>

            <button
              type="submit"
              style={submitButtonStyle}
              disabled={isLoading}
            >
              <span>{isLoading ? 'Memproses...' : 'Masuk'}</span>
              <ArrowRight size={20} />
            </button>
          </form>

          <div style={footerStyle}>
            Belum punya akun?{' '}
            <Link to="/register" style={linkStyle}>
              Daftar sekarang
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;