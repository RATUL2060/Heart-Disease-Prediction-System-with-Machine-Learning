import React, { useState } from 'react';
import { predictHeartDisease } from '../services/api';
import {
  Heart, User, Activity, ChevronRight, ChevronLeft,
  CheckCircle, XCircle, RotateCcw, AlertCircle,
  HeartPulse, Stethoscope, ClipboardList, ArrowRight,
  ShieldAlert, ShieldCheck, PhoneCall, Calendar, Download
} from 'lucide-react';
import toast from 'react-hot-toast';
import html2pdf from 'html2pdf.js';

// ── Steps config ──
const STEPS = [
  { id: 1, title: 'Demographics', icon: <User className="w-5 h-5" />, description: 'Basic patient information' },
  { id: 2, title: 'Vitals', icon: <HeartPulse className="w-5 h-5" />, description: 'Physiological measurements' },
  { id: 3, title: 'Cardiac Tests', icon: <Stethoscope className="w-5 h-5" />, description: 'Exercise & ECG results' },
];

const INITIAL_STATE = {
  Age: '', Sex: '1', ChestPainType: '0',
  RestingBP: '', Cholesterol: '', FastingBS: '0',
  RestingECG: '0', MaxHR: '', ExerciseAngina: '0',
  Oldpeak: '', ST_Slope: '1',
};

const CHEST_PAIN_LABELS = ['Typical Angina', 'Atypical Angina', 'Non-anginal Pain', 'Asymptomatic'];
const ECG_LABELS = ['Normal', 'ST-T Wave Abnormality', 'Left Ventricular Hypertrophy'];
const SLOPE_LABELS = ['Up-sloping', 'Flat', 'Down-sloping'];

// ── Field components ──
const SelectField = ({ label, id, name, value, onChange, options, disabled, tooltip }) => (
  <div className="group">
    <label htmlFor={id} className="input-label">{label}</label>
    {tooltip && <p className="text-xs text-slate-400 dark:text-slate-500 mb-2">{tooltip}</p>}
    <select id={id} name={name} value={value} onChange={onChange} className="input-field" disabled={disabled}>
      {options.map((opt, i) => <option key={i} value={i}>{opt}</option>)}
    </select>
  </div>
);

const InputField = ({ label, id, name, value, onChange, placeholder, error, disabled, step, tooltip }) => (
  <div>
    <label htmlFor={id} className="input-label">{label}</label>
    {tooltip && <p className="text-xs text-slate-400 dark:text-slate-500 mb-2">{tooltip}</p>}
    <input
      type="number" step={step || '1'} id={id} name={name} value={value}
      onChange={onChange} disabled={disabled} placeholder={placeholder}
      className={`input-field ${error ? 'border-cardiac-500 focus:border-cardiac-500 focus:ring-cardiac-500/50 bg-cardiac-50/30 dark:bg-cardiac-900/10' : ''}`}
    />
    {error && (
      <p className="input-error">
        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
        {error}
      </p>
    )}
  </div>
);

// ── Risk Gauge (SVG arc) ──
const RiskGauge = ({ isHighRisk }) => {
  const pct = isHighRisk ? 82 : 18;
  const radius = 54;
  const circumference = Math.PI * radius; // half circle
  const offset = circumference * (1 - pct / 100);
  const color = isHighRisk
    ? 'url(#gaugeHighGrad)'
    : 'url(#gaugeLowGrad)';

  return (
    <div className="flex flex-col items-center">
      <svg width="160" height="90" viewBox="0 0 160 90">
        <defs>
          <linearGradient id="gaugeHighGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#f43f5e" />
          </linearGradient>
          <linearGradient id="gaugeLowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
        {/* Track */}
        <path
          d="M 16 80 A 64 64 0 0 1 144 80"
          fill="none"
          stroke="currentColor"
          strokeWidth="12"
          strokeLinecap="round"
          className="text-slate-100 dark:text-dark-700"
        />
        {/* Fill */}
        <path
          d="M 16 80 A 64 64 0 0 1 144 80"
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${circumference}`}
          strokeDashoffset={`${offset}`}
          style={{
            transition: 'stroke-dashoffset 1.2s ease-out',
            filter: isHighRisk ? 'drop-shadow(0 0 6px rgba(244,63,94,0.6))' : 'drop-shadow(0 0 6px rgba(34,197,94,0.6))',
          }}
        />
        {/* Needle base dot */}
        <circle cx="80" cy="80" r="6" fill={isHighRisk ? '#f43f5e' : '#22c55e'} />
      </svg>
      <div className={`text-4xl font-extrabold font-display -mt-2 ${isHighRisk ? 'text-gradient-red' : 'text-gradient-green'}`}>
        {pct}%
      </div>
      <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Risk Score</div>
    </div>
  );
};

// ── Result Card ──
const PredictionResultCard = ({ prediction, onReset }) => {
  const isHighRisk = prediction === 1;

  const handleDownloadPDF = () => {
    const element = document.getElementById('prediction-report-content');
    const opt = {
      margin:       0.3,
      filename:     `CardioSense_Report_${new Date().toISOString().split('T')[0]}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  const HIGH_RISK_RECS = [
    { icon: <PhoneCall className="w-4 h-4" />, text: 'Schedule a cardiology consultation immediately' },
    { icon: <ClipboardList className="w-4 h-4" />, text: 'Request ECG, stress test & echocardiogram' },
    { icon: <Calendar className="w-4 h-4" />, text: 'Monitor blood pressure and cholesterol daily' },
  ];
  const LOW_RISK_RECS = [
    { icon: <Activity className="w-4 h-4" />, text: 'Maintain regular physical activity (150 min/week)' },
    { icon: <Calendar className="w-4 h-4" />, text: 'Schedule annual cardiac health check-ups' },
    { icon: <Heart className="w-4 h-4" />, text: 'Sustain a heart-healthy diet and lifestyle' },
  ];
  const recs = isHighRisk ? HIGH_RISK_RECS : LOW_RISK_RECS;

  return (
    <div className="animate-bounce-in mt-8 space-y-4">
      {/* Main Result Card */}
      <div id="prediction-report-content" className={`rounded-3xl overflow-hidden border-2 bg-white dark:bg-dark-800 ${
        isHighRisk
          ? 'border-cardiac-500/60 shadow-glow-red'
          : 'border-green-500/60 shadow-glow-green'
      }`}>
        {/* Header */}
        <div className={`px-8 py-10 text-center relative overflow-hidden ${
          isHighRisk
            ? 'bg-gradient-to-br from-cardiac-900 to-dark-800'
            : 'bg-gradient-to-br from-green-900 to-dark-800'
        }`}>
          <div className="absolute inset-0 grid-pattern opacity-30" />
          <div className="relative z-10">
            <div className={`inline-flex p-5 rounded-3xl mb-5 ${
              isHighRisk
                ? 'bg-cardiac-500/20 border border-cardiac-500/40'
                : 'bg-green-500/20 border border-green-500/40'
            }`}>
              {isHighRisk
                ? <ShieldAlert className="w-14 h-14 text-cardiac-400" />
                : <ShieldCheck className="w-14 h-14 text-green-400" />
              }
            </div>
            <h2 className={`text-4xl font-extrabold mb-2 font-display ${
              isHighRisk ? 'text-cardiac-200' : 'text-green-200'
            }`}>
              {isHighRisk ? 'High Risk' : 'Low Risk'}
            </h2>
            <p className={`text-sm font-medium ${
              isHighRisk ? 'text-cardiac-400' : 'text-green-400'
            }`}>
              {isHighRisk
                ? 'Heart disease indicators detected — immediate attention recommended'
                : 'No significant cardiac risk factors detected at this time'
              }
            </p>
          </div>
        </div>

        {/* Gauge + details */}
        <div className="px-6 sm:px-10 py-8 bg-white dark:bg-dark-800 space-y-8">
          {/* Gauge */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <RiskGauge isHighRisk={isHighRisk} />
            <div className="flex flex-col gap-3 w-full sm:max-w-xs">
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                <span>Low</span>
                <span>Risk Level</span>
                <span>High</span>
              </div>
              <div className="progress-bar h-3">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${
                    isHighRisk
                      ? 'bg-gradient-to-r from-yellow-400 to-cardiac-500'
                      : 'bg-gradient-to-r from-green-400 to-cyan-400'
                  }`}
                  style={{ width: isHighRisk ? '82%' : '18%' }}
                />
              </div>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {[
                  { label: 'Risk Level', value: isHighRisk ? 'Elevated' : 'Normal' },
                  { label: 'Confidence', value: 'High' },
                ].map(({ label, value }) => (
                  <div key={label} className={`rounded-xl p-3 text-center border ${
                    isHighRisk
                      ? 'bg-cardiac-50 dark:bg-cardiac-900/20 border-cardiac-200 dark:border-cardiac-800'
                      : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                  }`}>
                    <div className={`text-sm font-bold ${
                      isHighRisk ? 'text-cardiac-700 dark:text-cardiac-300' : 'text-green-700 dark:text-green-300'
                    }`}>{value}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className={`rounded-2xl p-6 border ${
            isHighRisk
              ? 'bg-cardiac-50 dark:bg-cardiac-900/15 border-cardiac-200 dark:border-cardiac-800'
              : 'bg-green-50 dark:bg-green-900/15 border-green-200 dark:border-green-800'
          }`}>
            <p className={`text-xs font-bold uppercase tracking-widest mb-4 ${
              isHighRisk ? 'text-cardiac-600 dark:text-cardiac-400' : 'text-green-600 dark:text-green-400'
            }`}>
              Clinical Recommendations
            </p>
            <div className="space-y-3">
              {recs.map(({ icon, text }, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`flex-shrink-0 p-1.5 rounded-lg mt-0.5 ${
                    isHighRisk
                      ? 'bg-cardiac-100 dark:bg-cardiac-900/40 text-cardiac-600 dark:text-cardiac-400'
                      : 'bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400'
                  }`}>
                    {icon}
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="rounded-xl p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900 text-xs text-amber-700 dark:text-amber-400">
            ⚠️ <strong>Note:</strong> This AI prediction is for educational purposes only. Always consult a qualified healthcare professional before making any medical decisions.
          </div>

          {/* Actions */}
          <div data-html2canvas-ignore="true" className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={onReset}
              id="assess-another"
              className="flex-1 btn-secondary flex items-center justify-center gap-2 py-3.5"
            >
              <RotateCcw className="w-4 h-4" />
              Assess Another Patient
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex-1 btn-primary flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 shadow-indigo-500/30"
            >
              <Download className="w-4 h-4" />
              Download PDF Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Progress Bar ──
const ProgressBar = ({ current, total }) => (
  <div className="mb-8">
    <div className="flex justify-between text-xs font-semibold text-slate-400 dark:text-slate-500 mb-2.5">
      <span className="text-medical-600 dark:text-medical-400">Step {current} of {total}</span>
      <span>{Math.round((current / total) * 100)}% complete</span>
    </div>
    <div className="progress-bar">
      <div className="progress-bar-fill" style={{ width: `${(current / total) * 100}%` }} />
    </div>
  </div>
);

// ── Main Component ──
const PredictionPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [direction, setDirection] = useState('right');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const validateStep = (s) => {
    const newErrors = {};
    if (s === 1) {
      if (!formData.Age || isNaN(formData.Age) || Number(formData.Age) <= 0) newErrors.Age = 'Valid age > 0 required';
    }
    if (s === 2) {
      if (!formData.RestingBP || Number(formData.RestingBP) <= 0) newErrors.RestingBP = 'Valid BP > 0 required';
      if (!formData.Cholesterol || Number(formData.Cholesterol) <= 0) newErrors.Cholesterol = 'Valid value > 0 required';
      if (!formData.MaxHR || Number(formData.MaxHR) <= 0) newErrors.MaxHR = 'Valid Max HR > 0 required';
    }
    if (s === 3) {
      if (formData.Oldpeak === '' || isNaN(formData.Oldpeak) || Number(formData.Oldpeak) < 0) newErrors.Oldpeak = 'Valid value ≥ 0 required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setDirection('right');
      setStep(s => s + 1);
    }
  };

  const prevStep = () => {
    setDirection('left');
    setStep(s => s - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(3)) return;
    setIsLoading(true);
    try {
      const payload = {
        Age: Number(formData.Age), Sex: Number(formData.Sex),
        ChestPainType: Number(formData.ChestPainType), RestingBP: Number(formData.RestingBP),
        Cholesterol: Number(formData.Cholesterol), FastingBS: Number(formData.FastingBS),
        RestingECG: Number(formData.RestingECG), MaxHR: Number(formData.MaxHR),
        ExerciseAngina: Number(formData.ExerciseAngina), Oldpeak: Number(formData.Oldpeak),
        ST_Slope: Number(formData.ST_Slope),
      };
      const response = await predictHeartDisease(payload);
      setResult(response.prediction);
      toast.success('Prediction complete!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setFormData(INITIAL_STATE);
    setStep(1);
    setErrors({});
  };

  const animClass = direction === 'right' ? 'animate-slide-in-right' : 'animate-slide-in-left';

  return (
    <div className="flex-1 py-12 bg-slate-50 dark:bg-dark-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-10">
          <p className="section-label">AI Diagnostics</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-display">
            Cardiac Risk Prediction
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-base">
            Complete the 3-step form to receive an instant risk assessment
          </p>
        </div>

        {/* Step Indicators */}
        <div className="flex items-center justify-center mb-10">
          {STEPS.map((s, i) => (
            <React.Fragment key={s.id}>
              <div className="flex flex-col items-center">
                <div className={`relative flex items-center justify-center w-12 h-12 rounded-2xl border-2 font-bold transition-all duration-400 ${
                  step > s.id
                    ? 'bg-gradient-to-br from-medical-500 to-cyan-500 border-transparent text-white shadow-glow-blue'
                    : step === s.id
                    ? 'bg-white dark:bg-dark-800 border-medical-500 text-medical-600 dark:text-medical-400 shadow-glow-blue'
                    : 'bg-white dark:bg-dark-800 border-slate-200 dark:border-dark-600 text-slate-400 dark:text-slate-600'
                }`}>
                  {step > s.id
                    ? <CheckCircle className="w-5 h-5" />
                    : s.icon
                  }
                  {step === s.id && (
                    <div className="absolute inset-0 rounded-2xl border-2 border-medical-400/50 animate-ripple" />
                  )}
                </div>
                <div className={`text-xs font-bold mt-2 hidden sm:block transition-colors duration-200 ${
                  step === s.id
                    ? 'text-medical-600 dark:text-medical-400'
                    : step > s.id
                    ? 'text-medical-500 dark:text-medical-500'
                    : 'text-slate-400 dark:text-slate-600'
                }`}>
                  {s.title}
                </div>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-1 mx-3 rounded-full transition-all duration-500 ${
                  step > s.id
                    ? 'bg-gradient-to-r from-medical-500 to-cyan-500'
                    : 'bg-slate-200 dark:bg-dark-700'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Result or Form */}
        {result !== null ? (
          <PredictionResultCard prediction={result} onReset={handleReset} />
        ) : (
          <div className="card p-6 sm:p-8 shadow-lg dark:shadow-dark-950/50">
            <ProgressBar current={step} total={3} />

            {/* Step title */}
            <div className="mb-6 flex items-center gap-3 pb-5 border-b border-slate-100 dark:border-dark-700">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-medical-500/10 to-cyan-500/10 text-medical-600 dark:text-medical-400 border border-medical-200/50 dark:border-medical-800/50">
                {STEPS[step - 1].icon}
              </div>
              <div>
                <h2 className="font-bold text-slate-900 dark:text-white font-display">{STEPS[step - 1].title}</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">{STEPS[step - 1].description}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Step 1 */}
              {step === 1 && (
                <div className={`grid grid-cols-1 sm:grid-cols-2 gap-6 ${animClass}`}>
                  <InputField
                    label="Age (years)" id="Age" name="Age"
                    value={formData.Age} onChange={handleChange}
                    placeholder="e.g. 55" error={errors.Age} disabled={isLoading}
                  />
                  <div>
                    <label htmlFor="Sex" className="input-label">Biological Sex</label>
                    <select id="Sex" name="Sex" value={formData.Sex} onChange={handleChange} className="input-field" disabled={isLoading}>
                      <option value="1">Male</option>
                      <option value="0">Female</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <SelectField
                      label="Chest Pain Type" id="ChestPainType" name="ChestPainType"
                      value={formData.ChestPainType} onChange={handleChange}
                      options={CHEST_PAIN_LABELS} disabled={isLoading}
                      tooltip="Select the type of chest pain experienced by the patient"
                    />
                  </div>
                </div>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <div className={`grid grid-cols-1 sm:grid-cols-2 gap-6 ${animClass}`}>
                  <InputField label="Resting Blood Pressure (mm Hg)" id="RestingBP" name="RestingBP" value={formData.RestingBP} onChange={handleChange} placeholder="e.g. 120" error={errors.RestingBP} disabled={isLoading} />
                  <InputField label="Cholesterol (mm/dl)" id="Cholesterol" name="Cholesterol" value={formData.Cholesterol} onChange={handleChange} placeholder="e.g. 200" error={errors.Cholesterol} disabled={isLoading} />
                  <div>
                    <label htmlFor="FastingBS" className="input-label">Fasting Blood Sugar {">"} 120 mg/dl</label>
                    <select id="FastingBS" name="FastingBS" value={formData.FastingBS} onChange={handleChange} className="input-field" disabled={isLoading}>
                      <option value="0">No</option>
                      <option value="1">Yes</option>
                    </select>
                  </div>
                  <SelectField label="Resting ECG Results" id="RestingECG" name="RestingECG" value={formData.RestingECG} onChange={handleChange} options={ECG_LABELS} disabled={isLoading} />
                  <div className="sm:col-span-2">
                    <InputField label="Maximum Heart Rate Achieved (bpm)" id="MaxHR" name="MaxHR" value={formData.MaxHR} onChange={handleChange} placeholder="e.g. 150" error={errors.MaxHR} disabled={isLoading} />
                  </div>
                </div>
              )}

              {/* Step 3 */}
              {step === 3 && (
                <div className={`grid grid-cols-1 sm:grid-cols-2 gap-6 ${animClass}`}>
                  <div>
                    <label htmlFor="ExerciseAngina" className="input-label">Exercise Induced Angina</label>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mb-2">Chest pain triggered by physical exertion</p>
                    <select id="ExerciseAngina" name="ExerciseAngina" value={formData.ExerciseAngina} onChange={handleChange} className="input-field" disabled={isLoading}>
                      <option value="0">No</option>
                      <option value="1">Yes</option>
                    </select>
                  </div>
                  <InputField
                    label="Oldpeak (ST depression)" id="Oldpeak" name="Oldpeak"
                    value={formData.Oldpeak} onChange={handleChange}
                    placeholder="e.g. 1.5" error={errors.Oldpeak}
                    disabled={isLoading} step="0.1"
                    tooltip="ST depression induced by exercise relative to rest"
                  />
                  <div className="sm:col-span-2">
                    <SelectField
                      label="ST Slope (Peak Exercise)" id="ST_Slope" name="ST_Slope"
                      value={formData.ST_Slope} onChange={handleChange}
                      options={SLOPE_LABELS} disabled={isLoading}
                      tooltip="Slope of the peak exercise ST segment"
                    />
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="mt-8 flex items-center justify-between pt-6 border-t border-slate-100 dark:border-dark-700">
                {step > 1 ? (
                  <button type="button" onClick={prevStep} className="btn-secondary gap-2" disabled={isLoading}>
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>
                ) : <div />}

                {step < 3 ? (
                  <button type="button" id={`next-step-${step}`} onClick={nextStep} className="btn-primary gap-2">
                    Continue
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button type="submit" id="submit-prediction" disabled={isLoading} className="btn-primary gap-2 px-8">
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Heart className="w-5 h-5 fill-white" />
                        Predict Risk
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictionPage;
