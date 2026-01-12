import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Map, Shield, LogOut, LogIn, UserPlus } from 'lucide-react';
import { colors, glass, borderRadius, shadows, transitions } from '../designSystem';

function Navbar() {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState(null);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const navbarStyle = {
    position: 'fixed',
    top: '30px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 1000,
    ...glass.navbar,
    padding: '12px 24px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: transitions.normal,
  };

  const logoStyle = {
    fontSize: '20px',
    fontWeight: '700',
    background: colors.gradientPrimary,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginRight: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const navItemStyle = (isActive, itemKey) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    borderRadius: borderRadius.pill,
    textDecoration: 'none',
    color: isActive ? colors.primary : colors.text,
    fontWeight: isActive ? '600' : '500',
    fontSize: '15px',
    transition: transitions.fast,
    cursor: 'pointer',
    background: isActive
      ? 'rgba(0, 122, 255, 0.1)'
      : hoveredItem === itemKey
        ? 'rgba(0, 0, 0, 0.05)'
        : 'transparent',
    transform: hoveredItem === itemKey ? 'scale(1.05)' : 'scale(1)',
  });

  const iconStyle = (isActive, itemKey) => ({
    transition: transitions.fast,
    transform: hoveredItem === itemKey ? 'scale(1.15)' : 'scale(1)',
    color: isActive ? colors.primary : colors.textSecondary,
  });

  const buttonStyle = (itemKey) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    borderRadius: borderRadius.pill,
    border: 'none',
    background: hoveredItem === itemKey
      ? colors.gradientDanger
      : 'rgba(255, 59, 48, 0.1)',
    color: hoveredItem === itemKey ? colors.white : colors.danger,
    fontWeight: '600',
    fontSize: '15px',
    cursor: 'pointer',
    transition: transitions.normal,
    transform: hoveredItem === itemKey ? 'scale(1.05)' : 'scale(1)',
    boxShadow: hoveredItem === itemKey ? shadows.danger : 'none',
  });

  const adminBadgeStyle = (itemKey) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    borderRadius: borderRadius.pill,
    background: hoveredItem === itemKey
      ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)'
      : 'rgba(255, 215, 0, 0.15)',
    color: hoveredItem === itemKey ? colors.text : '#B8860B',
    fontWeight: '700',
    fontSize: '14px',
    textDecoration: 'none',
    transition: transitions.normal,
    transform: hoveredItem === itemKey ? 'scale(1.05)' : 'scale(1)',
    boxShadow: hoveredItem === itemKey ? '0 4px 12px rgba(255, 215, 0, 0.4)' : 'none',
  });

  const dividerStyle = {
    width: '1px',
    height: '24px',
    background: 'rgba(0, 0, 0, 0.1)',
    margin: '0 8px',
  };

  return (
    <nav style={navbarStyle}>
      <div style={logoStyle}>
        <span>🚧</span>
        <span>LaporJalan</span>
      </div>

      {token ? (
        <>
          <Link
            to="/"
            style={navItemStyle(location.pathname === '/', 'home')}
            onMouseEnter={() => setHoveredItem('home')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <Home size={18} style={iconStyle(location.pathname === '/', 'home')} />
            <span>Laporan</span>
          </Link>

          <Link
            to="/dashboard"
            style={navItemStyle(location.pathname === '/dashboard', 'dashboard')}
            onMouseEnter={() => setHoveredItem('dashboard')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <Map size={18} style={iconStyle(location.pathname === '/dashboard', 'dashboard')} />
            <span>Peta</span>
          </Link>

          {role === 'admin' && (
            <>
              <div style={dividerStyle} />
              <Link
                to="/admin"
                style={adminBadgeStyle('admin')}
                onMouseEnter={() => setHoveredItem('admin')}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <Shield size={18} />
                <span>Admin</span>
              </Link>
            </>
          )}

          <div style={dividerStyle} />

          <button
            onClick={handleLogout}
            style={buttonStyle('logout')}
            onMouseEnter={() => setHoveredItem('logout')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </>
      ) : (
        <>
          <Link
            to="/login"
            style={navItemStyle(location.pathname === '/login', 'login')}
            onMouseEnter={() => setHoveredItem('login')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <LogIn size={18} style={iconStyle(location.pathname === '/login', 'login')} />
            <span>Login</span>
          </Link>

          <Link
            to="/register"
            style={navItemStyle(location.pathname === '/register', 'register')}
            onMouseEnter={() => setHoveredItem('register')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <UserPlus size={18} style={iconStyle(location.pathname === '/register', 'register')} />
            <span>Register</span>
          </Link>
        </>
      )}
    </nav>
  );
}

export default Navbar;