import React from 'react';

const INITIAL_STATE = {
  Age: '',
  Sex: '1',
  ChestPainType: '0',
  RestingBP: '',
  Cholesterol: '',
  FastingBS: '0',
  RestingECG: '0',
  MaxHR: '',
  ExerciseAngina: '0',
  Oldpeak: '',
  ST_Slope: '1',
};

const PredictionForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = React.useState(INITIAL_STATE);
  const [errors, setErrors] = React.useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.Age || isNaN(formData.Age) || Number(formData.Age) <= 0) newErrors.Age = 'Valid Age > 0 required';
    if (!formData.RestingBP || isNaN(formData.RestingBP) || Number(formData.RestingBP) <= 0) newErrors.RestingBP = 'Valid BP > 0 required';
    if (!formData.Cholesterol || isNaN(formData.Cholesterol) || Number(formData.Cholesterol) <= 0) newErrors.Cholesterol = 'Valid Cholesterol > 0 required';
    if (!formData.MaxHR || isNaN(formData.MaxHR) || Number(formData.MaxHR) <= 0) newErrors.MaxHR = 'Valid Max HR > 0 required';
    if (formData.Oldpeak === '' || isNaN(formData.Oldpeak) || Number(formData.Oldpeak) < 0) newErrors.Oldpeak = 'Valid Oldpeak >= 0 required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const payload = {
        Age: Number(formData.Age), Sex: Number(formData.Sex),
        ChestPainType: Number(formData.ChestPainType), RestingBP: Number(formData.RestingBP),
        Cholesterol: Number(formData.Cholesterol), FastingBS: Number(formData.FastingBS),
        RestingECG: Number(formData.RestingECG), MaxHR: Number(formData.MaxHR),
        ExerciseAngina: Number(formData.ExerciseAngina), Oldpeak: Number(formData.Oldpeak),
        ST_Slope: Number(formData.ST_Slope),
      };
      onSubmit(payload);
    }
  };

  const Field = ({ label, children, error }) => (
    <div>
      <label className="input-label">{label}</label>
      {children}
      {error && <p className="input-error mt-1">{error}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="card p-6 sm:p-8">
      <div className="mb-8 pb-5 border-b border-slate-100 dark:border-dark-700">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight font-display">Patient Diagnostics</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Enter patient vitals and test results below.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-6">
        <Field label="Age" error={errors.Age}>
          <input type="number" id="Age" name="Age" value={formData.Age} onChange={handleChange}
            className={`input-field mt-1 ${errors.Age ? 'border-cardiac-500 focus:ring-cardiac-500/50' : ''}`}
            placeholder="e.g. 45" disabled={isLoading} />
        </Field>

        <Field label="Sex">
          <select id="Sex" name="Sex" value={formData.Sex} onChange={handleChange} className="input-field mt-1" disabled={isLoading}>
            <option value="1">Male</option>
            <option value="0">Female</option>
          </select>
        </Field>

        <Field label="Chest Pain Type">
          <select id="ChestPainType" name="ChestPainType" value={formData.ChestPainType} onChange={handleChange} className="input-field mt-1" disabled={isLoading}>
            <option value="0">Typical Angina</option>
            <option value="1">Atypical Angina</option>
            <option value="2">Non-anginal Pain</option>
            <option value="3">Asymptomatic</option>
          </select>
        </Field>

        <Field label="Resting Blood Pressure (mm Hg)" error={errors.RestingBP}>
          <input type="number" id="RestingBP" name="RestingBP" value={formData.RestingBP} onChange={handleChange}
            className={`input-field mt-1 ${errors.RestingBP ? 'border-cardiac-500 focus:ring-cardiac-500/50' : ''}`}
            placeholder="e.g. 120" disabled={isLoading} />
        </Field>

        <Field label="Cholesterol (mm/dl)" error={errors.Cholesterol}>
          <input type="number" id="Cholesterol" name="Cholesterol" value={formData.Cholesterol} onChange={handleChange}
            className={`input-field mt-1 ${errors.Cholesterol ? 'border-cardiac-500 focus:ring-cardiac-500/50' : ''}`}
            placeholder="e.g. 200" disabled={isLoading} />
        </Field>

        <Field label="Fasting Blood Sugar > 120 mg/dl">
          <select id="FastingBS" name="FastingBS" value={formData.FastingBS} onChange={handleChange} className="input-field mt-1" disabled={isLoading}>
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>
        </Field>

        <Field label="Resting ECG Results">
          <select id="RestingECG" name="RestingECG" value={formData.RestingECG} onChange={handleChange} className="input-field mt-1" disabled={isLoading}>
            <option value="0">Normal</option>
            <option value="1">ST-T Wave Abnormality (ST)</option>
            <option value="2">Left Ventricular Hypertrophy (LVH)</option>
          </select>
        </Field>

        <Field label="Maximum Heart Rate Achieved" error={errors.MaxHR}>
          <input type="number" id="MaxHR" name="MaxHR" value={formData.MaxHR} onChange={handleChange}
            className={`input-field mt-1 ${errors.MaxHR ? 'border-cardiac-500 focus:ring-cardiac-500/50' : ''}`}
            placeholder="e.g. 150" disabled={isLoading} />
        </Field>

        <Field label="Exercise Induced Angina">
          <select id="ExerciseAngina" name="ExerciseAngina" value={formData.ExerciseAngina} onChange={handleChange} className="input-field mt-1" disabled={isLoading}>
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>
        </Field>

        <Field label="Oldpeak (ST depression)" error={errors.Oldpeak}>
          <input type="number" step="0.1" id="Oldpeak" name="Oldpeak" value={formData.Oldpeak} onChange={handleChange}
            className={`input-field mt-1 ${errors.Oldpeak ? 'border-cardiac-500 focus:ring-cardiac-500/50' : ''}`}
            placeholder="e.g. 1.0" disabled={isLoading} />
        </Field>

        <Field label="Slope of the Peak Exercise ST Segment">
          <select id="ST_Slope" name="ST_Slope" value={formData.ST_Slope} onChange={handleChange} className="input-field mt-1" disabled={isLoading}>
            <option value="0">Up-sloping</option>
            <option value="1">Flat</option>
            <option value="2">Down-sloping</option>
          </select>
        </Field>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-100 dark:border-dark-700 flex items-center justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary px-10 py-3.5 text-base gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Processing Data...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
              </svg>
              Predict Heart Disease
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default PredictionForm;
