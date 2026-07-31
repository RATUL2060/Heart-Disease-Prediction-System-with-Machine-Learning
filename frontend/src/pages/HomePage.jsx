import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Activity, Shield, Zap, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const FEATURES = [
  {
    icon: <Activity className="w-6 h-6" />,
    title: 'AI-Powered Analysis',
    description: 'Our trained ML model analyzes 11 clinical parameters to deliver high-accuracy predictions.',
    color: 'text-medical-400',
    bg: 'bg-medical-500/10 border-medical-500/20',
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Instant Results',
    description: 'Get your risk assessment in under a second with confidence indicators and recommendations.',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10 border-yellow-500/20',
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Secure & Private',
    description: 'JWT-secured endpoints, encrypted storage, and role-based access keep patient data safe.',
    color: 'text-green-400',
    bg: 'bg-green-500/10 border-green-500/20',
  },
];

const STATS = [
  { value: '95%', label: 'Model Accuracy' },
  { value: '11', label: 'Clinical Parameters' },
  { value: '< 1s', label: 'Prediction Speed' },
  { value: 'HIPAA', label: 'Compliant Design' },
];

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-dark-950 via-medical-900 to-dark-800 py-24 sm:py-32">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-medical-500/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cardiac-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-medical-500/15 border border-medical-500/25 text-medical-300 text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            AI System Operational
          </div>

          <div className="animate-heartbeat inline-block mb-8">
            <div className="p-5 rounded-full bg-cardiac-500/20 border border-cardiac-500/30 inline-flex">
              <Heart className="w-16 h-16 text-cardiac-400 fill-cardiac-400" />
            </div>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight mb-6 animate-fade-in-up">
            Heart Disease{' '}
            <span className="bg-gradient-to-r from-medical-400 to-medical-300 bg-clip-text text-transparent">
              Prediction
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Predict heart disease risk in seconds using our advanced Machine Learning model. 
            Professional-grade diagnostics accessible to every healthcare provider.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <Link
              to={user ? '/predict' : '/register'}
              id="hero-cta-primary"
              className="btn-primary text-base px-8 py-4 shadow-glow-blue"
            >
              <Heart className="w-5 h-5" />
              Start Prediction
              <ArrowRight className="w-5 h-5" />
            </Link>
            {!user && (
              <Link to="/login" id="hero-cta-secondary" className="btn-secondary text-base px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white dark:bg-dark-900 border-b border-slate-100 dark:border-dark-700 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {STATS.map((stat) => (
              <div key={stat.label} className="animate-fade-in-up">
                <div className="text-3xl font-extrabold text-gradient">{stat.value}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-slate-50 dark:bg-dark-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="section-label">Why CardioCare AI</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Everything you need for cardiac risk assessment
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURES.map((feature, i) => (
              <div
                key={feature.title}
                className="card-hover p-8 animate-fade-in-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className={`inline-flex p-3 rounded-2xl border ${feature.bg} ${feature.color} mb-5`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-white dark:bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="section-label">Simple Process</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              How it works
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {[
              { step: '01', title: 'Enter Patient Data', desc: 'Input 11 clinical parameters including vitals, ECG results, and symptoms through our guided 3-step form.' },
              { step: '02', title: 'AI Analysis', desc: 'Our Random Forest model processes the data, trained on thousands of patient records for high accuracy.' },
              { step: '03', title: 'Get Results', desc: 'Receive an instant risk assessment with recommendations and save results to the patient\'s history.' },
            ].map((item, i) => (
              <div key={item.step} className="text-center relative animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-medical-500 to-medical-600 text-white font-extrabold text-xl mb-5 shadow-glow-blue">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{item.title}</h3>
                <p className="text-slate-500 dark:text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-medical-700 to-medical-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-medical-100 text-lg mb-8">
            Join healthcare professionals using CardioCare AI for faster, more accurate cardiac risk assessment.
          </p>
          <Link to={user ? '/predict' : '/register'} id="cta-bottom" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-medical-700 font-bold rounded-xl hover:bg-medical-50 transition-colors shadow-lg">
            <Heart className="w-5 h-5 fill-cardiac-500 text-cardiac-500" />
            {user ? 'Run a Prediction' : 'Get Started Free'}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
