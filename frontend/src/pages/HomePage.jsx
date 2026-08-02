import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Activity, Shield, Zap, ArrowRight, CheckCircle, Brain, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const FEATURES = [
  {
    icon: <Brain className="w-7 h-7" />,
    title: 'AI-Powered Analysis',
    description: 'Our trained ML model analyzes 11 clinical parameters to deliver high-accuracy cardiac risk predictions.',
    color: 'text-medical-400',
    bg: 'bg-medical-500/10 border-medical-500/20',
    glow: 'hover:shadow-glow-blue',
  },
  {
    icon: <Zap className="w-7 h-7" />,
    title: 'Instant Results',
    description: 'Get your risk assessment in under a second with confidence indicators and clinical recommendations.',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10 border-yellow-500/20',
    glow: 'hover:shadow-[0_0_25px_rgba(234,179,8,0.35)]',
  },
  {
    icon: <Lock className="w-7 h-7" />,
    title: 'Secure & Private',
    description: 'JWT-secured endpoints, encrypted storage, and role-based access keep patient data protected.',
    color: 'text-green-400',
    bg: 'bg-green-500/10 border-green-500/20',
    glow: 'hover:shadow-glow-green',
  },
];

// Animated counter hook
const useCounter = (target, duration = 1500, start = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(ease * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
};

const StatItem = ({ value, label, rawValue, animate }) => {
  const isNumeric = typeof rawValue === 'number';
  const count = useCounter(isNumeric ? rawValue : 0, 1400, animate && isNumeric);
  const display = isNumeric ? (value.includes('%') ? `${count}%` : count) : value;
  return (
    <div className="text-center animate-fade-in-up">
      <div className="text-3xl sm:text-4xl font-extrabold text-gradient font-display">{display}</div>
      <div className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 font-medium">{label}</div>
    </div>
  );
};

const HomePage = () => {
  const { user } = useAuth();
  const statsRef = useRef(null);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex-1">

      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden bg-gradient-hero min-h-[92vh] flex items-center py-24 sm:py-32">

        {/* Animated orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/5 w-[500px] h-[500px] bg-medical-500/8 rounded-full blur-[80px] animate-orb-float" />
          <div className="absolute bottom-1/4 right-1/5 w-[350px] h-[350px] bg-cyan-500/8 rounded-full blur-[60px] animate-orb-float" style={{ animationDelay: '2s', animationDuration: '7s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cardiac-500/4 rounded-full blur-[100px] animate-pulse-slow" />
          {/* Grid */}
          <div className="absolute inset-0 grid-pattern opacity-40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">

          {/* Status badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-medical-300 text-sm font-semibold mb-10 animate-fade-in backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ripple absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
            </span>
            AI System Operational
          </div>

          {/* Heart icon */}
          <div className="animate-heartbeat inline-block mb-8">
            <div className="relative inline-flex p-6 rounded-3xl bg-cardiac-500/15 border border-cardiac-500/25">
              <Heart className="w-20 h-20 text-cardiac-400 fill-cardiac-400" />
              <div className="absolute inset-0 rounded-3xl bg-cardiac-500/10 blur-xl animate-pulse-slow" />
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight mb-6 animate-fade-in-up font-display leading-[1.1]">
            CardioSense{' '}
            <span className="text-gradient">AI</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-12 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Predict cardiac risk in seconds using advanced machine learning.
            Professional-grade diagnostics — accessible to every healthcare provider.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <Link
              to={user ? '/predict' : '/register'}
              id="hero-cta-primary"
              className="group relative inline-flex items-center justify-center gap-3 px-10 py-4 rounded-2xl font-bold text-base text-white overflow-hidden transition-all duration-300 hover:-translate-y-1 active:translate-y-0"
              style={{
                background: 'linear-gradient(135deg, #0a84ff 0%, #06b6d4 100%)',
                boxShadow: '0 8px 32px rgba(10, 132, 255, 0.45), 0 2px 8px rgba(10, 132, 255, 0.3)',
              }}
            >
              {/* Hover shimmer */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <Heart className="w-5 h-5 fill-white relative z-10" />
              <span className="relative z-10">Start Prediction</span>
              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>

            {!user && (
              <Link
                to="/login"
                id="hero-cta-secondary"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold text-base text-white border border-white/20 bg-white/8 backdrop-blur-sm hover:bg-white/15 hover:border-white/30 hover:-translate-y-1 transition-all duration-300"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Scroll hint */}
          <div className="mt-16 animate-float hidden sm:block">
            <div className="w-6 h-10 rounded-full border-2 border-white/20 mx-auto flex items-start justify-center p-1.5">
              <div className="w-1 h-2.5 rounded-full bg-white/40 animate-bounce" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section ref={statsRef} className="bg-white dark:bg-dark-900 border-b border-slate-100 dark:border-dark-800 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <StatItem value="84%" rawValue={84} label="Test Accuracy" animate={statsVisible} />
            <StatItem value="11" rawValue={11} label="Clinical Parameters" animate={statsVisible} />
            <StatItem value="< 1s" rawValue={null} label="Prediction Speed" animate={statsVisible} />
            <StatItem value="HIPAA" rawValue={null} label="Compliant Design" animate={statsVisible} />
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-24 bg-slate-50 dark:bg-dark-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="section-label">Why CardioSense AI</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-display">
              Everything you need for cardiac risk assessment
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURES.map((feature, i) => (
              <div
                key={feature.title}
                className={`card-hover p-8 animate-fade-in-up border ${feature.bg} ${feature.glow} transition-all duration-300`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className={`inline-flex p-3.5 rounded-2xl border ${feature.bg} ${feature.color} mb-6`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 font-display">{feature.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-24 bg-white dark:bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="section-label">Simple Process</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-display">
              How it works
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-8 left-1/4 right-1/4 h-px bg-gradient-to-r from-medical-200 via-cyan-300 to-medical-200 dark:from-dark-700 dark:via-medical-800 dark:to-dark-700" />
            {[
              { step: '01', title: 'Enter Patient Data', desc: 'Input 11 clinical parameters including vitals, ECG results, and symptoms through our guided 3-step form.' },
              { step: '02', title: 'AI Analysis', desc: 'Our Machine Learning model processes the data, identifying patterns across clinical parameters for risk assessment.' },
              { step: '03', title: 'Get Results', desc: 'Receive an instant risk assessment with clinical recommendations and save results to the patient\'s history.' },
            ].map((item, i) => (
              <div key={item.step} className="text-center relative animate-fade-in-up" style={{ animationDelay: `${i * 0.12}s` }}>
                <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5">
                  <div className="absolute inset-0 bg-gradient-to-br from-medical-500 to-cyan-500 rounded-2xl shadow-glow-blue" />
                  <span className="relative z-10 text-white font-extrabold text-xl font-display">{item.step}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 font-display">{item.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Benefits strip ── */}
      <section className="py-16 bg-slate-50 dark:bg-dark-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: '⚡', title: 'Lightning Fast', desc: 'Results in under 1 second' },
              { icon: '🔒', title: 'Fully Secure', desc: 'JWT & encrypted storage' },
              { icon: '📊', title: 'Visual Reports', desc: 'Clear risk visualization' },
              { icon: '🏥', title: 'Clinical Grade', desc: 'Professional-level analysis' },
            ].map((item, i) => (
              <div key={item.title} className="card p-5 flex items-center gap-4 animate-fade-in-up" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="text-3xl flex-shrink-0">{item.icon}</div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white text-sm">{item.title}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-br from-medical-700 via-medical-600 to-cyan-600">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-medical-300/10 rounded-full blur-3xl" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-heartbeat inline-block mb-6">
            <Heart className="w-12 h-12 text-white/80 fill-white/80 mx-auto" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 font-display">
            Ready to get started?
          </h2>
          <p className="text-medical-100 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Join healthcare professionals using CardioSense AI for faster, more accurate cardiac risk assessment.
          </p>
          <Link
            to={user ? '/predict' : '/register'}
            id="cta-bottom"
            className="group inline-flex items-center gap-3 px-10 py-4 bg-white text-medical-700 font-bold rounded-2xl hover:bg-medical-50 transition-all duration-300 shadow-2xl hover:-translate-y-1 hover:shadow-white/20 text-base"
          >
            <Heart className="w-5 h-5 fill-cardiac-500 text-cardiac-500 animate-heartbeat" />
            {user ? 'Run a Prediction' : 'Get Started Free'}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
