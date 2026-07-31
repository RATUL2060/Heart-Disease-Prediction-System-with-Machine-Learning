import React from 'react';

const ResultCard = ({ prediction, onReset }) => {
  const isHighRisk = prediction === 1;
  
  return (
    <div className="animate-fade-in-up bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
      <div className={`p-8 text-center ${isHighRisk ? 'bg-red-50' : 'bg-green-50'}`}>
        <div className={`mx-auto flex items-center justify-center h-20 w-20 rounded-full mb-6 ${
          isHighRisk ? 'bg-red-100 text-red-600 shadow-inner shadow-red-200' : 'bg-green-100 text-green-600 shadow-inner shadow-green-200'
        }`}>
          {isHighRisk ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>
        
        <h2 className={`text-3xl font-bold mb-2 tracking-tight ${isHighRisk ? 'text-red-700' : 'text-green-700'}`}>
          {isHighRisk ? '🔴 High Risk' : '🟢 Low Risk'}
        </h2>
        
        <p className={`text-lg mb-8 max-w-md mx-auto ${isHighRisk ? 'text-red-600/80' : 'text-green-600/80'}`}>
          {isHighRisk 
            ? "This patient is predicted to have a higher likelihood of heart disease." 
            : "This patient is predicted to have a low likelihood of heart disease."}
        </p>
        
        <div className="bg-white p-6 rounded-xl shadow-sm inline-block border border-slate-100/50 w-full max-w-sm">
          <p className="text-sm text-slate-500 mb-4 font-medium uppercase tracking-wider">Next Steps</p>
          <p className="text-sm text-slate-700 mb-6">
            {isHighRisk 
              ? "We recommend scheduling a follow-up appointment with a cardiologist for further evaluation and comprehensive testing."
              : "Continue maintaining a healthy lifestyle, regular exercise, and balanced diet. Schedule routine check-ups as normal."}
          </p>
          <button
            onClick={onReset}
            className={`w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ${
              isHighRisk 
                ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' 
                : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
            }`}
          >
            Assess Another Patient
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
