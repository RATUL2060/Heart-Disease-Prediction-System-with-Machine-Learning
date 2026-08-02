import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, Activity, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back! 👋');
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-hero">

      {/* ── Left Panel ── */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12 relative overflow-hidden">
        {/* Background orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-medical-500/10 rounded-full blur-[60px] animate-orb-float" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-cyan-500/10 rounded-full blur-[40px] animate-orb-float" style={{ animationDelay: '2s' }} />
          <div className="absolute inset-0 grid-pattern opacity-30" />
        </div>

        <div className="relative z-10 text-center max-w-md">
          {/* Logo */}
          <div className="animate-heartbeat inline-flex p-6 rounded-3xl bg-cardiac-500/15 border border-cardiac-500/25 mb-8">
            <Heart className="w-16 h-16 text-cardiac-400 fill-cardiac-400" />
          </div>

          <h1 className="text-4xl font-extrabold text-white mb-3 font-display">CardioSense AI</h1>
          <p className="text-slate-300 text-lg max-w-sm mx-auto leading-relaxed mb-12">
            Professional cardiac risk prediction powered by advanced machine learning.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { val: '84%', label: 'Accuracy' },
              { val: '< 1s', label: 'Response' },
              { val: '11', label: 'Parameters' },
            ].map(({ val, label }) => (
              <div key={label} className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/8 transition-colors">
                <div className="text-2xl font-bold text-gradient font-display">{val}</div>
                <div className="text-slate-400 text-sm mt-1">{label}</div>
              </div>
            ))}
          </div>

          {/* Features list */}
          <div className="mt-10 space-y-3 text-left">
            {[
              { icon: <Activity className="w-4 h-4" />, text: 'AI-powered cardiac risk analysis' },
              { icon: <Shield className="w-4 h-4" />, text: 'HIPAA-compliant secure data storage' },
              { icon: <Heart className="w-4 h-4" />, text: 'Instant clinical recommendations' },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-slate-300 text-sm">
                <div className="p-1.5 rounded-lg bg-medical-500/20 text-medical-400 flex-shrink-0">{icon}</div>
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Panel — Login Form ── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">

          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="p-2.5 rounded-2xl bg-cardiac-500/20 border border-cardiac-500/30 animate-heartbeat">
              <Heart className="w-7 h-7 text-cardiac-400 fill-cardiac-400" />
            </div>
            <span className="text-white font-extrabold text-2xl font-display">CardioSense AI</span>
          </div>

          <div className="glass rounded-3xl p-8 shadow-2xl border border-white/10">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white font-display">Welcome back</h2>
              <p className="text-slate-400 text-sm mt-1">Sign in to your account to continue</p>
            </div>

            {error && (
              <div className="mb-6 flex items-start gap-3 p-3.5 rounded-xl bg-cardiac-900/60 border border-cardiac-700/60 text-cardiac-300 text-sm animate-scale-in">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    id="login-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm font-medium bg-white/6 border border-white/12 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-medical-500/50 focus:border-medical-500/50 transition-all duration-200"
                    placeholder="doctor@hospital.com"
                    disabled={isLoading}
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                    Password
                  </label>
                  <Link to="/forgot-password" className="text-xs text-medical-400 hover:text-medical-300 transition-colors font-semibold">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="login-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 rounded-xl text-sm font-medium bg-white/6 border border-white/12 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-medical-500/50 focus:border-medical-500/50 transition-all duration-200"
                    placeholder="••••••••"
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                id="login-submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-base text-white transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                style={{
                  background: isLoading ? '#0064db' : 'linear-gradient(135deg, #0a84ff 0%, #06b6d4 100%)',
                  boxShadow: '0 6px 24px rgba(10, 132, 255, 0.4)',
                }}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-medical-400 hover:text-medical-300 font-bold transition-colors">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
