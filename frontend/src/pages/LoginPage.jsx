import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
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
    <div className="min-h-screen flex bg-gradient-to-br from-dark-950 via-medical-900 to-dark-900">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute text-medical-400"
              style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, fontSize: `${Math.random() * 40 + 10}px`, opacity: Math.random() * 0.5 }}
            >+</div>
          ))}
        </div>
        <div className="relative z-10 text-center">
          <div className="animate-heartbeat inline-flex p-6 rounded-full bg-cardiac-500/20 border border-cardiac-500/30 mb-8">
            <Heart className="w-16 h-16 text-cardiac-400 fill-cardiac-400" />
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-4">CardioCare AI</h1>
          <p className="text-slate-300 text-lg max-w-md leading-relaxed">
            Professional heart disease prediction powered by advanced machine learning.
          </p>
          <div className="mt-12 grid grid-cols-3 gap-6 text-center">
            {[['95%', 'Accuracy'], ['10K+', 'Predictions'], ['< 1s', 'Response']].map(([val, label]) => (
              <div key={label} className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-2xl font-bold text-medical-400">{val}</div>
                <div className="text-slate-400 text-sm mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="glass rounded-3xl p-8 shadow-2xl border border-white/10">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center gap-3 mb-8">
              <div className="p-2 rounded-xl bg-cardiac-500/20 border border-cardiac-500/30">
                <Heart className="w-6 h-6 text-cardiac-400 fill-cardiac-400" />
              </div>
              <span className="text-white font-bold text-xl">CardioCare AI</span>
            </div>

            <h2 className="text-2xl font-bold text-white mb-1">Welcome back</h2>
            <p className="text-slate-400 text-sm mb-8">Sign in to your account</p>

            {error && (
              <div className="mb-6 flex items-start gap-3 p-3 rounded-xl bg-cardiac-900/50 border border-cardiac-700 text-cardiac-300 text-sm animate-fade-in">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="input-label text-slate-300">Email address</label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    id="login-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field pl-10 bg-white/5 border-white/10 text-white placeholder-slate-500 focus:border-medical-500"
                    placeholder="doctor@hospital.com"
                    disabled={isLoading}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="input-label text-slate-300">Password</label>
                  <Link to="/forgot-password" className="text-xs text-medical-400 hover:text-medical-300 transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="login-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder-slate-500 focus:border-medical-500"
                    placeholder="••••••••"
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                id="login-submit"
                disabled={isLoading}
                className="w-full btn-primary py-3.5 text-base"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Signing in...
                  </>
                ) : 'Sign In'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-medical-400 hover:text-medical-300 font-semibold transition-colors">
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
