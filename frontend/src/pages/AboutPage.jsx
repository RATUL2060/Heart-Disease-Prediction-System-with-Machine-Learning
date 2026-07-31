import React from 'react';
import { Heart, Activity, Users, BookOpen, ExternalLink } from 'lucide-react';

const TEAM = [
  { role: 'ML Model', tech: 'Random Forest Classifier', icon: <Activity className="w-6 h-6" /> },
  { role: 'Backend API', tech: 'FastAPI + Python', icon: <Heart className="w-6 h-6" /> },
  { role: 'Database', tech: 'SQLite + SQLAlchemy', icon: <Users className="w-6 h-6" /> },
  { role: 'Frontend', tech: 'React + Tailwind CSS', icon: <BookOpen className="w-6 h-6" /> },
];

const AboutPage = () => (
  <div className="flex-1 py-10">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero */}
      <div className="text-center mb-16">
        <div className="inline-flex p-5 rounded-full bg-cardiac-500/10 border border-cardiac-500/20 mb-6 animate-heartbeat">
          <Heart className="w-12 h-12 text-cardiac-500 fill-cardiac-500" />
        </div>
        <p className="section-label">About</p>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">CardioCare AI</h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          A professional heart disease prediction system powered by machine learning, designed to assist healthcare providers in evaluating cardiac risk using patient vitals and clinical data.
        </p>
      </div>

      {/* Model Info */}
      <div className="card p-8 mb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">🧠 The ML Model</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
          {[
            { label: 'Algorithm', value: 'Random Forest Classifier' },
            { label: 'Dataset', value: 'Cleveland Heart Disease' },
            { label: 'Accuracy', value: '~95%' },
          ].map(({ label, value }) => (
            <div key={label} className="bg-medical-50 dark:bg-medical-900/20 border border-medical-200 dark:border-medical-800 rounded-xl p-4 text-center">
              <div className="text-xl font-extrabold text-medical-600 dark:text-medical-400">{value}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">{label}</div>
            </div>
          ))}
        </div>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          The model is trained on the UCI Cleveland Heart Disease dataset, analyzing 11 features: age, sex, chest pain type, resting blood pressure, cholesterol, fasting blood sugar, ECG results, maximum heart rate, exercise-induced angina, ST depression (oldpeak), and ST slope.
        </p>
      </div>

      {/* Tech Stack */}
      <div className="card p-8 mb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">🛠 Technology Stack</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TEAM.map((item, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-dark-700 border border-slate-100 dark:border-dark-600">
              <div className="p-2 rounded-lg bg-medical-100 dark:bg-medical-900/30 text-medical-600 dark:text-medical-400">
                {item.icon}
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{item.role}</div>
                <div className="font-bold text-slate-900 dark:text-white">{item.tech}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="p-6 rounded-2xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
        <h3 className="font-bold text-yellow-800 dark:text-yellow-300 mb-2">⚠️ Medical Disclaimer</h3>
        <p className="text-sm text-yellow-700 dark:text-yellow-400 leading-relaxed">
          This application is for <strong>educational and portfolio purposes only</strong>. The predictions made by this AI model should <strong>never</strong> be used as a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of a qualified healthcare provider with any questions regarding a medical condition.
        </p>
      </div>
    </div>
  </div>
);

export default AboutPage;
