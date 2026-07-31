import React, { useState } from 'react';
import { predictHeartDisease } from '../services/api';
import { Heart, User, Activity, ChevronRight, ChevronLeft, CheckCircle, XCircle, RotateCcw, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

// ---- Form Steps Configuration ----
const STEPS = [
  { id: 1, title: 'Demographics', icon: <User className="w-5 h-5" />, description: 'Basic patient information' },
  { id: 2, title: 'Vitals', icon: <Activity className="w-5 h-5" />, description: 'Physiological measurements' },
  { id: 3, title: 'Cardiac Tests', icon: <Heart className="w-5 h-5" />, description: 'Exercise and ECG results' },
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

const SelectField = ({ label, id, name, value, onChange, options, disabled, tooltip }) => (
  <div>
    <label htmlFor={id} className="input-label">{label}</label>
    {tooltip && <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">{tooltip}</p>}
    <select id={id} name={name} value={value} onChange={onChange} className="input-field" disabled={disabled}>
      {options.map((opt, i) => <option key={i} value={i}>{opt}</option>)}
    </select>
  </div>
);

const InputField = ({ label, id, name, value, onChange, placeholder, error, disabled, step, tooltip }) => (
  <div>
    <label htmlFor={id} className="input-label">{label}</label>
    {tooltip && <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">{tooltip}</p>}
    <input
      type="number" step={step || '1'} id={id} name={name} value={value}
      onChange={onChange} disabled={disabled} placeholder={placeholder}
      className={`input-field ${error ? 'border-cardiac-500 focus:border-cardiac-500 focus:ring-cardiac-500' : ''}`}
    />
    {error && <p className="input-error flex items-center gap-1 mt-1"><AlertCircle className="w-3 h-3" />{error}</p>}
  </div>
);

// ---- Result Card ----
const PredictionResultCard = ({ prediction, onReset }) => {
  const isHighRisk = prediction === 1;
  return (
    <div className="animate-bounce-in mt-8">
      <div className={`rounded-2xl overflow-hidden border-2 ${isHighRisk ? 'border-cardiac-500 shadow-glow-red' : 'border-green-500 shadow-glow-green'}`}>
        {/* Result Header */}
        <div className={`px-8 py-10 text-center ${isHighRisk ? 'bg-gradient-to-br from-cardiac-900/80 to-cardiac-800/60 dark:from-cardiac-900 dark:to-dark-800' : 'bg-gradient-to-br from-green-900/80 to-green-800/60 dark:from-green-900 dark:to-dark-800'}`}>
          <div className={`inline-flex p-5 rounded-full mb-5 ${isHighRisk ? 'bg-cardiac-500/20 border border-cardiac-500/40' : 'bg-green-500/20 border border-green-500/40'}`}>
            {isHighRisk
              ? <XCircle className="w-12 h-12 text-cardiac-400" />
              : <CheckCircle className="w-12 h-12 text-green-400" />
            }
          </div>
          <h2 className={`text-3xl font-extrabold mb-2 ${isHighRisk ? 'text-cardiac-300' : 'text-green-300'}`}>
            {isHighRisk ? '⚠️ High Risk' : '✅ Low Risk'}
          </h2>
          <p className={`text-sm ${isHighRisk ? 'text-cardiac-400' : 'text-green-400'}`}>
            {isHighRisk ? 'Heart disease predicted' : 'No heart disease predicted'}
          </p>
        </div>

        {/* Risk Meter */}
        <div className="px-8 py-6 bg-white dark:bg-dark-800">
          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span>Low Risk</span>
            <span>High Risk</span>
          </div>
          <div className="progress-bar">
            <div
              className={`h-full rounded-full transition-all duration-1000 ease-out ${isHighRisk ? 'bg-gradient-to-r from-yellow-500 to-cardiac-500' : 'bg-gradient-to-r from-green-400 to-green-500'}`}
              style={{ width: isHighRisk ? '82%' : '18%' }}
            />
          </div>

          {/* Recommendation */}
          <div className={`mt-6 p-4 rounded-xl text-sm ${isHighRisk ? 'bg-cardiac-50 dark:bg-cardiac-900/20 border border-cardiac-200 dark:border-cardiac-800 text-cardiac-700 dark:text-cardiac-300' : 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300'}`}>
            <p className="font-semibold mb-1">Recommendation</p>
            <p>{isHighRisk
              ? 'Schedule a cardiology consultation immediately. Further diagnostic testing (ECG, stress test, echocardiogram) is recommended.'
              : 'Continue maintaining a healthy lifestyle. Schedule routine check-ups annually and monitor blood pressure and cholesterol.'
            }</p>
          </div>

          <button
            onClick={onReset}
            id="assess-another"
            className="w-full mt-5 btn-secondary flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Assess Another Patient
          </button>
        </div>
      </div>
    </div>
  );
};

// ---- Progress Bar ----
const ProgressBar = ({ current, total }) => (
  <div className="mb-8">
    <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
      <span>Step {current} of {total}</span>
      <span>{Math.round((current / total) * 100)}% complete</span>
    </div>
    <div className="progress-bar">
      <div className="progress-bar-fill" style={{ width: `${(current / total) * 100}%` }} />
    </div>
  </div>
);

// ---- Main Component ----
const PredictionPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

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
    if (validateStep(step)) setStep(s => s + 1);
  };

  const prevStep = () => setStep(s => s - 1);

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

  return (
    <div className="flex-1 py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="section-label">AI Diagnostics</p>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Heart Disease Prediction</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Complete the 3-step form to receive an instant risk assessment</p>
        </div>

        {/* Step Indicators */}
        <div className="flex items-center justify-center mb-8">
          {STEPS.map((s, i) => (
            <React.Fragment key={s.id}>
              <div className="flex flex-col items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 font-bold transition-all duration-300 ${
                  step > s.id ? 'bg-medical-600 border-medical-600 text-white'
                    : step === s.id ? 'bg-white dark:bg-dark-800 border-medical-500 text-medical-600 dark:text-medical-400 shadow-glow-blue'
                    : 'bg-white dark:bg-dark-800 border-slate-300 dark:border-slate-600 text-slate-400'
                }`}>
                  {step > s.id ? <CheckCircle className="w-5 h-5" /> : s.icon}
                </div>
                <div className={`text-xs font-semibold mt-1.5 hidden sm:block ${step === s.id ? 'text-medical-600 dark:text-medical-400' : 'text-slate-400'}`}>
                  {s.title}
                </div>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-3 transition-all duration-300 ${step > s.id ? 'bg-medical-500' : 'bg-slate-200 dark:bg-dark-700'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* If result available */}
        {result !== null ? (
          <PredictionResultCard prediction={result} onReset={handleReset} />
        ) : (
          <div className="card p-6 sm:p-8">
            <ProgressBar current={step} total={3} />

            {/* Step Title */}
            <div className="mb-6 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-medical-50 dark:bg-medical-900/20 text-medical-600 dark:text-medical-400 border border-medical-200 dark:border-medical-800">
                {STEPS[step - 1].icon}
              </div>
              <div>
                <h2 className="font-bold text-slate-900 dark:text-white">{STEPS[step - 1].title}</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">{STEPS[step - 1].description}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Step 1: Demographics */}
              {step === 1 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-slide-in-right">
                  <InputField label="Age (years)" id="Age" name="Age" value={formData.Age} onChange={handleChange} placeholder="e.g. 55" error={errors.Age} disabled={isLoading} />
                  <div>
                    <label htmlFor="Sex" className="input-label">Sex</label>
                    <select id="Sex" name="Sex" value={formData.Sex} onChange={handleChange} className="input-field" disabled={isLoading}>
                      <option value="1">Male</option>
                      <option value="0">Female</option>
                    </select>
                  </div>
                  <SelectField label="Chest Pain Type" id="ChestPainType" name="ChestPainType" value={formData.ChestPainType} onChange={handleChange} options={CHEST_PAIN_LABELS} disabled={isLoading} tooltip="Type of chest pain experienced by the patient" />
                </div>
              )}

              {/* Step 2: Vitals */}
              {step === 2 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-slide-in-right">
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
                  <InputField label="Maximum Heart Rate Achieved" id="MaxHR" name="MaxHR" value={formData.MaxHR} onChange={handleChange} placeholder="e.g. 150" error={errors.MaxHR} disabled={isLoading} />
                </div>
              )}

              {/* Step 3: Cardiac Tests */}
              {step === 3 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-slide-in-right">
                  <div>
                    <label htmlFor="ExerciseAngina" className="input-label">Exercise Induced Angina</label>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">Chest pain triggered by physical exertion</p>
                    <select id="ExerciseAngina" name="ExerciseAngina" value={formData.ExerciseAngina} onChange={handleChange} className="input-field" disabled={isLoading}>
                      <option value="0">No</option>
                      <option value="1">Yes</option>
                    </select>
                  </div>
                  <InputField label="Oldpeak (ST depression)" id="Oldpeak" name="Oldpeak" value={formData.Oldpeak} onChange={handleChange} placeholder="e.g. 1.5" error={errors.Oldpeak} disabled={isLoading} step="0.1" tooltip="ST depression induced by exercise relative to rest" />
                  <SelectField label="ST Slope (Peak Exercise)" id="ST_Slope" name="ST_Slope" value={formData.ST_Slope} onChange={handleChange} options={SLOPE_LABELS} disabled={isLoading} tooltip="Slope of the peak exercise ST segment" />
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="mt-8 flex items-center justify-between pt-6 border-t border-slate-100 dark:border-dark-700">
                {step > 1 ? (
                  <button type="button" onClick={prevStep} className="btn-secondary gap-2" disabled={isLoading}>
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>
                ) : <div />}

                {step < 3 ? (
                  <button type="button" id={`next-step-${step}`} onClick={nextStep} className="btn-primary gap-2">
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button type="submit" id="submit-prediction" disabled={isLoading} className="btn-primary gap-2">
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
                        <Heart className="w-5 h-5" />
                        Predict Heart Disease
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
