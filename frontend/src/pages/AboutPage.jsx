import React from 'react';
import { Heart, Activity, Users, BookOpen, Brain, Cpu, Database } from 'lucide-react';

const TECH_STACK = [
  { role: 'ML Model', tech: 'Machine Learning Model', icon: <Brain className="w-5 h-5" />, color: 'text-medical-600 dark:text-medical-400', bg: 'bg-medical-50 dark:bg-medical-900/30 border-medical-200 dark:border-medical-800' },
  { role: 'Backend API', tech: 'FastAPI + Python', icon: <Cpu className="w-5 h-5" />, color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-50 dark:bg-cyan-900/30 border-cyan-200 dark:border-cyan-800' },
  { role: 'Database', tech: 'SQLite + SQLAlchemy', icon: <Database className="w-5 h-5" />, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800' },
  { role: 'Frontend', tech: 'React + Tailwind CSS', icon: <BookOpen className="w-5 h-5" />, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800' },
];

const AboutPage = () => (
  <div className="flex-1 py-12 bg-slate-50 dark:bg-dark-950">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

      {/* Hero */}
      <div className="text-center mb-16">
        <div className="inline-flex p-5 rounded-3xl bg-cardiac-500/10 border border-cardiac-500/20 mb-6 animate-heartbeat">
          <Heart className="w-12 h-12 text-cardiac-500 fill-cardiac-500" />
        </div>
        <p className="section-label">About</p>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4 font-display">
          CardioSense AI
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          A professional cardiac risk prediction system powered by machine learning, designed to assist
          healthcare providers in evaluating cardiac risk using patient vitals and clinical data.
        </p>
      </div>

      {/* ML Model Info */}
      <div className="card p-8 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-medical-50 dark:bg-medical-900/30 text-medical-600 dark:text-medical-400">
            <Brain className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display">🧠 The ML Model</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Algorithm', value: 'Machine Learning' },
            { label: 'Train Score', value: '86.1%' },
            { label: 'Test Score', value: '84.2%' },
          ].map(({ label, value }) => (
            <div key={label} className="bg-gradient-to-br from-medical-50 to-cyan-50 dark:from-medical-900/20 dark:to-cyan-900/10 border border-medical-200 dark:border-medical-800 rounded-2xl p-5 text-center hover:-translate-y-0.5 transition-transform duration-200">
              <div className="text-2xl font-extrabold text-gradient font-display">{value}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">{label}</div>
            </div>
          ))}
        </div>

        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          The model is trained on a comprehensive heart disease dataset, analyzing 11 features:
          <span className="font-semibold text-slate-700 dark:text-slate-300"> age, sex, chest pain type, resting blood pressure, cholesterol, fasting blood sugar,
          ECG results, maximum heart rate, exercise-induced angina, ST depression (oldpeak), and ST slope.</span>
        </p>
      </div>

      {/* Tech Stack */}
      <div className="card p-8 mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 font-display">🛠 Technology Stack</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TECH_STACK.map((item, i) => (
            <div
              key={i}
              className={`flex items-center gap-4 p-4 rounded-2xl border ${item.bg} hover:-translate-y-0.5 transition-all duration-200`}
            >
              <div className={`p-2.5 rounded-xl border ${item.bg} ${item.color} flex-shrink-0`}>
                {item.icon}
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{item.role}</div>
                <div className={`font-bold text-sm mt-0.5 ${item.color}`}>{item.tech}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Clinical Parameters */}
      <div className="card p-8 mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 font-display">📋 Clinical Parameters</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { num: '01', name: 'Age', desc: 'Patient age in years' },
            { num: '02', name: 'Sex', desc: 'Biological sex (M/F)' },
            { num: '03', name: 'Chest Pain Type', desc: 'Typical/Atypical Angina, Non-anginal, Asymptomatic' },
            { num: '04', name: 'Resting BP', desc: 'Resting blood pressure (mmHg)' },
            { num: '05', name: 'Cholesterol', desc: 'Serum cholesterol (mm/dl)' },
            { num: '06', name: 'Fasting Blood Sugar', desc: 'Fasting BS > 120 mg/dl' },
            { num: '07', name: 'Resting ECG', desc: 'Electrocardiogram results' },
            { num: '08', name: 'Max Heart Rate', desc: 'Maximum HR achieved (bpm)' },
            { num: '09', name: 'Exercise Angina', desc: 'Exercise-induced angina' },
            { num: '10', name: 'Oldpeak', desc: 'ST depression (exercise vs rest)' },
            { num: '11', name: 'ST Slope', desc: 'Slope of peak exercise ST segment' },
          ].map(({ num, name, desc }) => (
            <div key={num} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-dark-700 border border-slate-100 dark:border-dark-600">
              <span className="text-xs font-bold text-medical-500 dark:text-medical-400 mt-0.5 flex-shrink-0 w-6">{num}</span>
              <div>
                <div className="font-semibold text-sm text-slate-800 dark:text-slate-200">{name}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-900/15 border border-amber-200 dark:border-amber-800">
        <h3 className="font-bold text-amber-800 dark:text-amber-300 mb-2 flex items-center gap-2">
          ⚠️ Medical Disclaimer
        </h3>
        <p className="text-sm text-amber-700 dark:text-amber-400 leading-relaxed">
          This application is for <strong>educational and portfolio purposes only</strong>. The predictions made by this AI model should <strong>never</strong> be used as a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of a qualified healthcare provider with any questions regarding a medical condition.
        </p>
      </div>
    </div>
  </div>
);

export default AboutPage;
