import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, Mail, Lock, Eye, EyeOff, User, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.password || !form.confirmPassword) {
      setError('Please fill in all fields.'); return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.'); return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.'); return;
    }
    setError('');
    setIsLoading(true);
    try {
      await register(form.email, form.fullName, form.password);
      toast.success('Account created! Welcome to CardioCare AI 🎉');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "input-field bg-white/5 border-white/10 text-white placeholder-slate-500 focus:border-medical-500";

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-dark-950 via-medical-900 to-dark-900">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12">
        <div className="relative z-10 text-center">
          <div className="animate-heartbeat inline-flex p-6 rounded-full bg-cardiac-500/20 border border-cardiac-500/30 mb-8">
            <Heart className="w-16 h-16 text-cardiac-400 fill-cardiac-400" />
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-4">Join CardioCare AI</h1>
          <p className="text-slate-300 text-lg max-w-md leading-relaxed">
            Create your account and start predicting heart disease risk with our AI-powered platform.
          </p>
          <div className="mt-12 space-y-4 text-left">
            {[
              ['🔒', 'Secure & Private', 'Your patient data is encrypted and never shared.'],
              ['⚡', 'Instant Results', 'Get predictions in under a second.'],
              ['📊', 'Full History', 'Track predictions over time with full analytics.'],
            ].map(([icon, title, desc]) => (
              <div key={title} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-2xl">{icon}</span>
                <div>
                  <div className="text-white font-semibold text-sm">{title}</div>
                  <div className="text-slate-400 text-xs mt-0.5">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel — Register Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="glass rounded-3xl p-8 shadow-2xl border border-white/10">
            <div className="lg:hidden flex items-center gap-3 mb-8">
              <div className="p-2 rounded-xl bg-cardiac-500/20 border border-cardiac-500/30">
                <Heart className="w-6 h-6 text-cardiac-400 fill-cardiac-400" />
              </div>
              <span className="text-white font-bold text-xl">CardioCare AI</span>
            </div>

            <h2 className="text-2xl font-bold text-white mb-1">Create an account</h2>
            <p className="text-slate-400 text-sm mb-8">Start your free account today</p>

            {error && (
              <div className="mb-6 flex items-start gap-3 p-3 rounded-xl bg-cardiac-900/50 border border-cardiac-700 text-cardiac-300 text-sm animate-fade-in">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="input-label text-slate-300">Full Name</label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input type="text" name="fullName" id="reg-name" value={form.fullName} onChange={handleChange}
                    className={`${inputClass} pl-10`} placeholder="Dr. John Smith" disabled={isLoading} />
                </div>
              </div>

              <div>
                <label className="input-label text-slate-300">Email address</label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input type="email" name="email" id="reg-email" value={form.email} onChange={handleChange}
                    className={`${inputClass} pl-10`} placeholder="doctor@hospital.com" disabled={isLoading} />
                </div>
              </div>

              <div>
                <label className="input-label text-slate-300">Password</label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input type={showPassword ? 'text' : 'password'} name="password" id="reg-password" value={form.password} onChange={handleChange}
                    className={`${inputClass} pl-10 pr-10`} placeholder="Min. 6 characters" disabled={isLoading} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="input-label text-slate-300">Confirm Password</label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input type="password" name="confirmPassword" id="reg-confirm" value={form.confirmPassword} onChange={handleChange}
                    className={`${inputClass} pl-10`} placeholder="••••••••" disabled={isLoading} />
                </div>
              </div>

              <button type="submit" id="register-submit" disabled={isLoading} className="w-full btn-primary py-3.5 text-base mt-2">
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Creating account...
                  </>
                ) : 'Create Account'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="text-medical-400 hover:text-medical-300 font-semibold transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
