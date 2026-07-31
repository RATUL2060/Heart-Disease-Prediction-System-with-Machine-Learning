import React, { useState } from 'react';

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
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});

const validate = () => {
  const newErrors = {};

  if (!formData.Age || isNaN(formData.Age) || Number(formData.Age) <= 0) {
    newErrors.Age = 'Valid Age > 0 required';
  }

  if (!formData.RestingBP || isNaN(formData.RestingBP) || Number(formData.RestingBP) <= 0) {
    newErrors.RestingBP = 'Valid BP > 0 required';
  }

  if (!formData.Cholesterol || isNaN(formData.Cholesterol) || Number(formData.Cholesterol) <= 0) {
    newErrors.Cholesterol = 'Valid Cholesterol > 0 required';
  }

  if (!formData.MaxHR || isNaN(formData.MaxHR) || Number(formData.MaxHR) <= 0) {
    newErrors.MaxHR = 'Valid Max HR > 0 required';
  }

  if (formData.Oldpeak === '' || isNaN(formData.Oldpeak) || Number(formData.Oldpeak) < 0) {
    newErrors.Oldpeak = 'Valid Oldpeak >= 0 required';
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));

  if (errors[name]) {
    setErrors((prev) => ({
      ...prev,
      [name]: null,
    }));
  }
};

const handleSubmit = (e) => {
  e.preventDefault();

  if (validate()) {

    const payload = {
      Age: Number(formData.Age),
      Sex: Number(formData.Sex),
      ChestPainType: Number(formData.ChestPainType),
      RestingBP: Number(formData.RestingBP),
      Cholesterol: Number(formData.Cholesterol),
      FastingBS: Number(formData.FastingBS),
      RestingECG: Number(formData.RestingECG),
      MaxHR: Number(formData.MaxHR),
      ExerciseAngina: Number(formData.ExerciseAngina),
      Oldpeak: Number(formData.Oldpeak),
      ST_Slope: Number(formData.ST_Slope),
    };

    console.log("Submitting payload:", payload);

    onSubmit(payload);
  }
};

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 border border-slate-100">
      <div className="mb-8 border-b border-slate-100 pb-5">
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Patient Diagnostics</h2>
        <p className="text-sm text-slate-500 mt-1">Enter patient vitals and test results below.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
        {/* Age */}
        <div className="relative">
          <label htmlFor="Age" className="input-label">Age</label>
          <input
            type="number"
            id="Age"
            name="Age"
            value={formData.Age}
            onChange={handleChange}
            className={`input-field ${errors.Age ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
            placeholder="e.g. 45"
            disabled={isLoading}
          />
          {errors.Age && <p className="input-error">{errors.Age}</p>}
        </div>

        {/* Sex */}
        <div>
          <label htmlFor="Sex" className="input-label">Sex</label>
          <select
            id="Sex"
            name="Sex"
            value={formData.Sex}
            onChange={handleChange}
            className="input-field"
            disabled={isLoading}
          >
            <option value="1">Male</option>
            <option value="0">Female</option>
          </select>
        </div>

        {/* Chest Pain Type */}
        <div>
          <label htmlFor="ChestPainType" className="input-label">Chest Pain Type</label>
          <select
            id="ChestPainType"
            name="ChestPainType"
            value={formData.ChestPainType}
            onChange={handleChange}
            className="input-field"
            disabled={isLoading}
          >
            <option value="0">Typical Angina</option>
            <option value="1">Atypical Angina</option>
            <option value="2">Non-anginal Pain</option>
            <option value="3">Asymptomatic</option>
          </select>
        </div>

        {/* Resting Blood Pressure */}
        <div className="relative">
          <label htmlFor="RestingBP" className="input-label">Resting Blood Pressure (mm Hg)</label>
          <input
            type="number"
            id="RestingBP"
            name="RestingBP"
            value={formData.RestingBP}
            onChange={handleChange}
            className={`input-field ${errors.RestingBP ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
            placeholder="e.g. 120"
            disabled={isLoading}
          />
          {errors.RestingBP && <p className="input-error">{errors.RestingBP}</p>}
        </div>

        {/* Cholesterol */}
        <div className="relative">
          <label htmlFor="Cholesterol" className="input-label">Cholesterol (mm/dl)</label>
          <input
            type="number"
            id="Cholesterol"
            name="Cholesterol"
            value={formData.Cholesterol}
            onChange={handleChange}
            className={`input-field ${errors.Cholesterol ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
            placeholder="e.g. 200"
            disabled={isLoading}
          />
          {errors.Cholesterol && <p className="input-error">{errors.Cholesterol}</p>}
        </div>

        {/* Fasting Blood Sugar */}
        <div>
          <label htmlFor="FastingBS" className="input-label">Fasting Blood Sugar > 120 mg/dl</label>
          <select
            id="FastingBS"
            name="FastingBS"
            value={formData.FastingBS}
            onChange={handleChange}
            className="input-field"
            disabled={isLoading}
          >
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>
        </div>

        {/* Resting ECG */}
        <div>
          <label htmlFor="RestingECG" className="input-label">Resting ECG Results</label>
          <select
            id="RestingECG"
            name="RestingECG"
            value={formData.RestingECG}
            onChange={handleChange}
            className="input-field"
            disabled={isLoading}
          >
            <option value="0">Normal</option>
            <option value="1">ST-T Wave Abnormality (ST)</option>
            <option value="2">Left Ventricular Hypertrophy (LVH)</option>
          </select>
        </div>

        {/* Max HR */}
        <div className="relative">
          <label htmlFor="MaxHR" className="input-label">Maximum Heart Rate Achieved</label>
          <input
            type="number"
            id="MaxHR"
            name="MaxHR"
            value={formData.MaxHR}
            onChange={handleChange}
            className={`input-field ${errors.MaxHR ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
            placeholder="e.g. 150"
            disabled={isLoading}
          />
          {errors.MaxHR && <p className="input-error">{errors.MaxHR}</p>}
        </div>

        {/* Exercise Angina */}
        <div>
          <label htmlFor="ExerciseAngina" className="input-label">Exercise Induced Angina</label>
          <select
            id="ExerciseAngina"
            name="ExerciseAngina"
            value={formData.ExerciseAngina}
            onChange={handleChange}
            className="input-field"
            disabled={isLoading}
          >
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>
        </div>

        {/* Oldpeak */}
        <div className="relative">
          <label htmlFor="Oldpeak" className="input-label">Oldpeak (ST depression)</label>
          <input
            type="number"
            step="0.1"
            id="Oldpeak"
            name="Oldpeak"
            value={formData.Oldpeak}
            onChange={handleChange}
            className={`input-field ${errors.Oldpeak ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
            placeholder="e.g. 1.0"
            disabled={isLoading}
          />
          {errors.Oldpeak && <p className="input-error">{errors.Oldpeak}</p>}
        </div>

        {/* ST Slope */}
        <div>
          <label htmlFor="ST_Slope" className="input-label">Slope of the Peak Exercise ST Segment</label>
          <select
            id="ST_Slope"
            name="ST_Slope"
            value={formData.ST_Slope}
            onChange={handleChange}
            className="input-field"
            disabled={isLoading}
          >
            <option value="0">Up-sloping</option>
            <option value="1">Flat</option>
            <option value="2">Down-sloping</option>
          </select>
        </div>
      </div>

      <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full md:w-auto px-8 py-3.5 bg-medical-600 text-white rounded-lg font-medium shadow-md shadow-medical-200 hover:bg-medical-700 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
