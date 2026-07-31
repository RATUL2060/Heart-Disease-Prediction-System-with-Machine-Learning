import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Moon, Sun, LogOut, Bell, Shield, ChevronRight, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const SettingsPage = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => document.documentElement.classList.contains('dark'));
  const [notifications, setNotifications] = useState(true);
  const [nameInput, setNameInput] = useState(user?.full_name || '');
  const [isSaving, setIsSaving] = useState(false);

  // Sync dark mode with document class
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('cardiocare_dark', '1');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('cardiocare_dark', '0');
    }
  };

  const handleSaveProfile = async () => {
    if (!nameInput.trim()) { toast.error('Name cannot be empty.'); return; }
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    updateUser({ ...user, full_name: nameInput });
    toast.success('Profile updated!');
    setIsSaving(false);
  };

  const handleLogout = () => {
    logout();
    toast.success('Signed out successfully.');
    navigate('/login');
  };

  const initials = user?.full_name
    ?.split(' ')
    .map(n => n.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase() || '?';

  return (
    <div className="flex-1 py-10">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="section-label">Account</p>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Settings</h1>
        </div>

        {/* Profile Section */}
        <div className="card p-6 mb-4">
          <div className="flex items-center gap-2 mb-5">
            <User className="w-5 h-5 text-medical-500" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Profile</h2>
          </div>

          {/* Avatar */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-medical-500 to-medical-600 flex items-center justify-center text-white font-extrabold text-2xl shadow-glow-blue">
              {initials}
            </div>
            <div>
              <div className="font-bold text-slate-900 dark:text-white">{user?.full_name}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">{user?.email}</div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="input-label">Display Name</label>
              <input
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                className="input-field mt-1"
                placeholder="Your name"
                id="settings-name"
              />
            </div>
            <div>
              <label className="input-label">Email address</label>
              <input
                value={user?.email || ''}
                className="input-field mt-1 opacity-60 cursor-not-allowed"
                disabled
                title="Email cannot be changed"
              />
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Email address cannot be changed.</p>
            </div>
            <button
              id="save-profile"
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="btn-primary gap-2"
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving...
                </>
              ) : (
                <><Save className="w-4 h-4" />Save Changes</>
              )}
            </button>
          </div>
        </div>

        {/* Appearance */}
        <div className="card p-6 mb-4">
          <div className="flex items-center gap-2 mb-5">
            {darkMode ? <Moon className="w-5 h-5 text-medical-500" /> : <Sun className="w-5 h-5 text-medical-500" />}
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Appearance</h2>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-slate-900 dark:text-white">Dark Mode</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">Switch between light and dark theme</div>
            </div>
            <button
              id="dark-mode-toggle"
              onClick={toggleDarkMode}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 focus:outline-none ${darkMode ? 'bg-medical-600' : 'bg-slate-200 dark:bg-dark-600'}`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ${darkMode ? 'translate-x-6' : 'translate-x-1'}`}
              />
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="card p-6 mb-4">
          <div className="flex items-center gap-2 mb-5">
            <Bell className="w-5 h-5 text-medical-500" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Notifications</h2>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-slate-900 dark:text-white">Prediction Alerts</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">Show toast notifications on prediction completion</div>
            </div>
            <button
              id="notifications-toggle"
              onClick={() => setNotifications(!notifications)}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 ${notifications ? 'bg-medical-600' : 'bg-slate-200 dark:bg-dark-600'}`}
            >
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ${notifications ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>

        {/* Security & Info */}
        <div className="card p-6 mb-4">
          <div className="flex items-center gap-2 mb-5">
            <Shield className="w-5 h-5 text-medical-500" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Security</h2>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-dark-700">
            {[
              { label: 'Account Created', value: user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A' },
              { label: 'Authentication', value: 'JWT Bearer Token' },
              { label: 'Session Duration', value: '7 days' },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between py-3">
                <span className="text-sm text-slate-600 dark:text-slate-400">{label}</span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="card p-6 border-cardiac-200 dark:border-cardiac-900">
          <h2 className="text-lg font-bold text-cardiac-600 dark:text-cardiac-400 mb-4">Sign Out</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
            You'll be redirected to the login page. Your data is safely stored on the server.
          </p>
          <button
            id="logout-btn"
            onClick={handleLogout}
            className="btn-danger gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
