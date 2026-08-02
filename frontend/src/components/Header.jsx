import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Heart, Home, Activity, Clock, Info, LayoutDashboard,
  Users, Settings, LogOut, Sun, Moon, Menu, X, ChevronDown, Zap
} from 'lucide-react';
import toast from 'react-hot-toast';

const NAV_LINKS = [
  { to: '/', label: 'Home', icon: <Home className="w-4 h-4" /> },
  { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" />, protected: true },
  { to: '/predict', label: 'Prediction', icon: <Activity className="w-4 h-4" />, protected: true },
  { to: '/patients', label: 'Patients', icon: <Users className="w-4 h-4" />, protected: true },
  { to: '/history', label: 'History', icon: <Clock className="w-4 h-4" />, protected: true },
  { to: '/about', label: 'About', icon: <Info className="w-4 h-4" /> },
];

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => document.documentElement.classList.contains('dark'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);

  // Initialize dark mode from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('cardiocare_dark');
    if (stored === '1' && !darkMode) {
      document.documentElement.classList.add('dark');
      setDarkMode(true);
    } else if (stored === '0' && darkMode) {
      document.documentElement.classList.remove('dark');
      setDarkMode(false);
    }
  }, []);

  // Scroll shadow
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggleDark = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('cardiocare_dark', next ? '1' : '0');
  };

  const handleLogout = () => {
    logout();
    toast.success('Signed out successfully.');
    navigate('/login');
    setDropdownOpen(false);
    setMobileOpen(false);
  };

  const visibleLinks = NAV_LINKS.filter(l => !l.protected || user);

  const initials = user?.full_name
    ?.split(' ')
    .map(n => n.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase() || '?';

  const linkClass = ({ isActive }) =>
    `text-sm font-semibold flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all duration-200 ${
      isActive
        ? 'text-medical-600 dark:text-medical-400 bg-medical-50 dark:bg-medical-900/25 shadow-sm'
        : 'text-slate-600 dark:text-slate-400 hover:text-medical-600 dark:hover:text-medical-300 hover:bg-slate-100 dark:hover:bg-dark-700'
    }`;

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white/95 dark:bg-dark-900/95 backdrop-blur-xl shadow-lg shadow-black/5 border-b border-slate-200/80 dark:border-dark-700'
        : 'bg-white/90 dark:bg-dark-900/90 backdrop-blur-md border-b border-slate-100 dark:border-dark-800'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group" id="nav-logo">
            <div className="relative p-2 rounded-xl bg-gradient-to-br from-cardiac-500/20 to-cardiac-600/10 border border-cardiac-500/25 group-hover:shadow-glow-red transition-all duration-300 animate-heartbeat">
              <Heart className="w-5 h-5 text-cardiac-500 fill-cardiac-500" />
            </div>
            <span className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight font-display">
              CardioSense <span className="text-gradient">AI</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {visibleLinks.map(link => (
              <NavLink key={link.to} to={link.to} end={link.to === '/'} className={linkClass} id={`nav-${link.label.toLowerCase()}`}>
                {link.icon}
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Dark mode toggle */}
            <button
              onClick={toggleDark}
              id="header-dark-toggle"
              className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-dark-700 hover:text-slate-700 dark:hover:text-slate-200 transition-all duration-200"
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode
                ? <Sun className="w-4.5 h-4.5" />
                : <Moon className="w-4.5 h-4.5" />
              }
            </button>

            {user ? (
              /* User Dropdown */
              <div className="relative" ref={dropdownRef}>
                <button
                  id="user-dropdown-btn"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-dark-700 transition-all duration-200"
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-medical-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow-glow-blue">
                    {initials}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 card shadow-2xl border border-slate-100 dark:border-dark-600 py-2 animate-slide-down">
                    {/* User info */}
                    <div className="px-4 py-3 mb-1 border-b border-slate-100 dark:border-dark-700">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-medical-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow-sm flex-shrink-0">
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.full_name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                        </div>
                      </div>
                    </div>
                    {[
                      { to: '/settings', label: 'Profile & Settings', icon: <Settings className="w-4 h-4" /> },
                      { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
                    ].map(item => (
                      <Link
                        key={item.to}
                        to={item.to}
                        id={`dropdown-${item.label.toLowerCase().replace(/ & /g, '-')}`}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-dark-700 transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <span className="text-slate-400 dark:text-slate-500">{item.icon}</span>
                        {item.label}
                      </Link>
                    ))}
                    <div className="border-t border-slate-100 dark:border-dark-700 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        id="dropdown-logout"
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-cardiac-600 dark:text-cardiac-400 hover:bg-cardiac-50 dark:hover:bg-cardiac-900/20 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" id="nav-login" className="btn-ghost text-sm">Sign In</Link>
                <Link to="/register" id="nav-register" className="btn-primary py-2 px-4 text-sm">
                  <Zap className="w-3.5 h-3.5" />
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-dark-700 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              id="mobile-menu-btn"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-100 dark:border-dark-700 bg-white dark:bg-dark-900 animate-slide-down">
          <nav className="px-4 py-3 space-y-1">
            {visibleLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-medical-50 dark:bg-medical-900/25 text-medical-600 dark:text-medical-400'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-dark-700'
                  }`
                }
                onClick={() => setMobileOpen(false)}
                id={`mobile-nav-${link.label.toLowerCase()}`}
              >
                {link.icon}
                {link.label}
              </NavLink>
            ))}
            {!user && (
              <div className="flex gap-2 pt-3 border-t border-slate-100 dark:border-dark-700">
                <Link to="/login" className="btn-secondary flex-1 text-center py-2.5" onClick={() => setMobileOpen(false)}>Sign In</Link>
                <Link to="/register" className="btn-primary flex-1 text-center py-2.5" onClick={() => setMobileOpen(false)}>Register</Link>
              </div>
            )}
            {user && (
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-cardiac-600 dark:text-cardiac-400 hover:bg-cardiac-50 dark:hover:bg-cardiac-900/20 rounded-xl transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
