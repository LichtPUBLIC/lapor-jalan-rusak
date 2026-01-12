import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, ArrowRight, AlertCircle, CheckCircle } from "lucide-react";
import { colors, glass, borderRadius, shadows, transitions, buttons, inputs } from "../designSystem";
import config from "../config";

function Register() {
  const [form, setForm] = useState({ nama: "", email: "", password: "" });
  const [focusedField, setFocusedField] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleReg = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // ... inside handleReg
      await axios.post(`${config.apiUrl}/api/auth/register`, form);
      // Show success and redirect
      alert("✅ Registrasi Berhasil! Silakan login.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registrasi gagal. Silakan coba lagi.");
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
            <h2 style={titleStyle}>Buat Akun Baru</h2>
            <p style={subtitleStyle}>Bergabung dengan LaporJalan</p>
          </div>

          {error && (
            <div style={errorStyle}>
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleReg}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>
                <User size={16} />
                Nama Lengkap
              </label>
              <div style={inputWrapperStyle}>
                <div style={iconWrapperStyle}>
                  <User size={20} color={focusedField === 'nama' ? colors.primary : colors.textSecondary} />
                </div>
                <input
                  type="text"
                  value={form.nama}
                  onChange={(e) => setForm({ ...form, nama: e.target.value })}
                  onFocus={() => setFocusedField('nama')}
                  onBlur={() => setFocusedField(null)}
                  required
                  placeholder="Nama Anda"
                  style={inputStyle('nama')}
                />
              </div>
            </div>

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
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
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
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  required
                  placeholder="Minimal 6 karakter"
                  style={inputStyle('password')}
                />
              </div>
            </div>

            <button
              type="submit"
              style={submitButtonStyle}
              disabled={isLoading}
            >
              <span>{isLoading ? 'Memproses...' : 'Daftar'}</span>
              <ArrowRight size={20} />
            </button>
          </form>

          <div style={footerStyle}>
            Sudah punya akun?{' '}
            <Link to="/login" style={linkStyle}>
              Masuk sekarang
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;