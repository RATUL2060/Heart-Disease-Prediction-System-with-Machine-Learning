import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

const Footer = () => (
  <footer className="bg-white dark:bg-dark-900 border-t border-slate-100 dark:border-dark-700">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cardiac-500/10 border border-cardiac-500/20">
            <Heart className="w-4 h-4 text-cardiac-500 fill-cardiac-500" />
          </div>
          <span className="font-bold text-slate-700 dark:text-slate-300">CardioCare AI</span>
        </Link>

        {/* Links */}
        <nav className="flex items-center gap-6">
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

        {/* Copyright */}
        <p className="text-xs text-slate-400 dark:text-slate-500 text-center">
          &copy; {new Date().getFullYear()} CardioCare AI. For educational use only.
        </p>
      </div>

      {/* Disclaimer */}
      <div className="mt-6 pt-6 border-t border-slate-100 dark:border-dark-700">
        <p className="text-xs text-slate-400 dark:text-slate-500 text-center max-w-3xl mx-auto">
          ⚠️ <strong>Disclaimer:</strong> This system is for educational and portfolio purposes only. 
          It should not be used as a substitute for professional medical advice, diagnosis, or treatment. 
          Always consult a qualified healthcare professional.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
