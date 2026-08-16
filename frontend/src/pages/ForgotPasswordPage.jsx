import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, ArrowLeft, CheckCircle } from 'lucide-react';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
    setSent(true);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-6">
      <div className="w-full max-w-md">
        <div className="glass rounded-3xl p-8 shadow-2xl border border-white/10">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 rounded-2xl bg-cardiac-500/20 border border-cardiac-500/30 animate-heartbeat">
              <Heart className="w-6 h-6 text-cardiac-400 fill-cardiac-400" />
            </div>
            <span className="text-white font-extrabold text-xl font-display">CardioSense AI</span>
          </div>

          {sent ? (
            <div className="text-center animate-bounce-in">
              <div className="inline-flex p-5 rounded-full bg-green-500/20 border border-green-500/30 mb-6">
                <CheckCircle className="w-12 h-12 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Check your email</h2>
              <p className="text-slate-400 text-sm mb-8">
                If an account exists for <strong className="text-slate-200">{email}</strong>, 
                you'll receive a password reset link shortly.
              </p>
              <Link to="/login" className="btn-primary w-full justify-center">
                <ArrowLeft className="w-4 h-4" />
                Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-white mb-1">Reset your password</h2>
              <p className="text-slate-400 text-sm mb-8">
                Enter your email address and we'll send you a reset link.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="input-label text-slate-300">Email address</label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      id="forgot-email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-field pl-10"
                      placeholder="doctor@hospital.com"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <button type="submit" id="forgot-submit" disabled={isLoading || !email} className="w-full btn-primary py-3.5 text-base">
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Sending link...
                    </>
                  ) : 'Send Reset Link'}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-400">
                Remember your password?{' '}
                <Link to="/login" className="text-medical-400 hover:text-medical-300 font-semibold transition-colors">
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
