import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Activity, Shield } from 'lucide-react';

const Footer = () => (
  <footer className="bg-white dark:bg-dark-900 border-t border-slate-100 dark:border-dark-800">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">

        {/* Brand */}
        <div className="flex flex-col gap-3">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="p-1.5 rounded-xl bg-cardiac-500/10 border border-cardiac-500/20 group-hover:shadow-glow-red transition-all duration-300">
              <Heart className="w-4 h-4 text-cardiac-500 fill-cardiac-500" />
            </div>
            <span className="font-extrabold text-slate-800 dark:text-white font-display">
              CardioSense <span className="text-gradient">AI</span>
            </span>
          </Link>
          <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs leading-relaxed">
            Professional cardiac risk assessment powered by machine learning.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">Navigation</p>
            <nav className="flex flex-col gap-2">
              {[
                { to: '/', label: 'Home' },
                { to: '/predict', label: 'Prediction' },
                { to: '/about', label: 'About' },
              ].map(({ to, label }) => (
                <Link key={to} to={to} className="text-sm text-slate-500 dark:text-slate-400 hover:text-medical-600 dark:hover:text-medical-400 transition-colors">
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">Features</p>
            <nav className="flex flex-col gap-2">
              {[
                { icon: <Activity className="w-3.5 h-3.5" />, label: 'AI Analysis' },
                { icon: <Shield className="w-3.5 h-3.5" />, label: 'Secure Data' },
                { icon: <Heart className="w-3.5 h-3.5" />, label: 'Risk Assessment' },
              ].map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                  <span className="text-medical-500">{icon}</span>
                  {label}
                </div>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="mt-8 pt-6 border-t border-slate-100 dark:border-dark-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-slate-400 dark:text-slate-500">
          © {new Date().getFullYear()} CardioSense AI. For educational use only.
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500 text-center max-w-lg leading-relaxed">
          ⚠️ <strong>Disclaimer:</strong> For educational and portfolio purposes only. Not a substitute for professional medical advice.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
