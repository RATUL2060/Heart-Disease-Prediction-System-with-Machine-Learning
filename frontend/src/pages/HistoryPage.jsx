import React, { useState, useEffect } from 'react';
import { getHistory } from '../services/api';
import { Heart, Clock, TrendingUp, TrendingDown, AlertCircle, RefreshCw, Search, Filter, Download } from 'lucide-react';
import html2pdf from 'html2pdf.js';

const CHEST_PAIN = ['Typical Angina', 'Atypical Angina', 'Non-anginal Pain', 'Asymptomatic'];
const SEX_LABELS = ['Female', 'Male'];

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
};

const formatTime = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  const loadHistory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getHistory();
      setHistory(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadHistory(); }, []);

  const filtered = history.filter(item => {
    if (filter === 'high') return item.result === 1;
    if (filter === 'low') return item.result === 0;
    return true;
  });

  const highCount = history.filter(h => h.result === 1).length;
  const lowCount = history.filter(h => h.result === 0).length;

  const generateHistoryPDF = (item) => {
    const isHighRisk = item.result === 1;
    const dateStr = `${formatDate(item.created_at)} at ${formatTime(item.created_at)}`;
    
    const container = document.createElement('div');
    container.innerHTML = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1e293b; padding: 50px; max-width: 800px; margin: 0 auto; background: white;">
        <div style="border-bottom: 3px solid ${isHighRisk ? '#e11d48' : '#16a34a'}; padding-bottom: 20px; margin-bottom: 30px;">
          <h1 style="color: #0f172a; margin: 0 0 5px 0; font-size: 32px; font-weight: 800;">CardioSense AI</h1>
          <p style="color: #64748b; margin: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Cardiac Risk Prediction Report</p>
        </div>
        
        <div style="margin-bottom: 30px; line-height: 1.6;">
          <p style="margin: 5px 0;"><strong>Assessment Date:</strong> ${dateStr}</p>
          <p style="margin: 5px 0;"><strong>Patient Age:</strong> ${item.age} years</p>
          <p style="margin: 5px 0;"><strong>Biological Sex:</strong> ${item.sex !== undefined ? SEX_LABELS[item.sex] : 'N/A'}</p>
          <p style="margin: 5px 0;"><strong>Chest Pain Type:</strong> ${item.chest_pain_type !== undefined ? CHEST_PAIN[item.chest_pain_type] : 'N/A'}</p>
        </div>

        <div style="margin-bottom: 40px; padding: 30px; border-radius: 12px; background-color: ${isHighRisk ? '#fff1f2' : '#f0fdf4'}; border: 1px solid ${isHighRisk ? '#fecdd3' : '#bbf7d0'}; text-align: center;">
          <h2 style="margin: 0 0 10px 0; color: ${isHighRisk ? '#be123c' : '#15803d'}; font-size: 28px; font-weight: 800;">
            ${isHighRisk ? 'HIGH RISK IDENTIFIED' : 'LOW RISK IDENTIFIED'}
          </h2>
          <p style="margin: 0; color: ${isHighRisk ? '#9f1239' : '#166534'}; font-size: 16px;">
            ${isHighRisk 
              ? 'Heart disease indicators detected — immediate medical attention recommended.' 
              : 'No significant cardiac risk factors detected based on provided parameters.'}
          </p>
        </div>
        
        <div>
          <h3 style="border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; color: #0f172a; font-size: 18px; margin-bottom: 15px;">Clinical Parameters</h3>
          <table style="width: 100%; border-collapse: collapse; text-align: left;">
            <tbody>
              <tr>
                <td style="padding: 12px 5px; border-bottom: 1px solid #f1f5f9; color: #475569;">Resting Blood Pressure:</td>
                <td style="padding: 12px 5px; border-bottom: 1px solid #f1f5f9; font-weight: 600; color: #0f172a;">${item.resting_bp || 'N/A'} mmHg</td>
              </tr>
              <tr>
                <td style="padding: 12px 5px; border-bottom: 1px solid #f1f5f9; color: #475569;">Serum Cholesterol:</td>
                <td style="padding: 12px 5px; border-bottom: 1px solid #f1f5f9; font-weight: 600; color: #0f172a;">${item.cholesterol || 'N/A'} mg/dl</td>
              </tr>
              <tr>
                <td style="padding: 12px 5px; border-bottom: 1px solid #f1f5f9; color: #475569;">Maximum Heart Rate:</td>
                <td style="padding: 12px 5px; border-bottom: 1px solid #f1f5f9; font-weight: 600; color: #0f172a;">${item.max_hr || 'N/A'} bpm</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div style="margin-top: 60px; font-size: 11px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px; line-height: 1.5;">
          <p style="margin: 0 0 5px 0;"><strong>DISCLAIMER:</strong> This AI prediction is for educational and informational purposes only.</p>
          <p style="margin: 0 0 5px 0;">It does not replace professional medical advice, diagnosis, or treatment.</p>
          <p style="margin: 0;">Generated by CardioSense AI on ${new Date().toLocaleDateString()}</p>
        </div>
      </div>
    `;

    const opt = {
      margin:       0,
      filename:     `CardioSense_Report_${new Date().toISOString().split('T')[0]}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    html2pdf().set(opt).from(container).save();
  };

  return (
    <div className="flex-1 py-10 bg-slate-50 dark:bg-dark-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <p className="section-label">Records</p>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white font-display">
              Prediction History
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              All your past cardiac risk assessments
            </p>
          </div>
          <button onClick={loadHistory} className="btn-secondary gap-2 self-start sm:self-auto">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            {
              label: 'Total Records',
              value: history.length,
              icon: <Clock className="w-5 h-5" />,
              color: 'text-medical-600 dark:text-medical-400',
              bg: 'bg-medical-50 dark:bg-medical-900/20',
              border: 'border-medical-200 dark:border-medical-800',
            },
            {
              label: 'High Risk',
              value: highCount,
              icon: <TrendingUp className="w-5 h-5" />,
              color: 'text-cardiac-600 dark:text-cardiac-400',
              bg: 'bg-cardiac-50 dark:bg-cardiac-900/20',
              border: 'border-cardiac-200 dark:border-cardiac-800',
            },
            {
              label: 'Low Risk',
              value: lowCount,
              icon: <TrendingDown className="w-5 h-5" />,
              color: 'text-green-600 dark:text-green-400',
              bg: 'bg-green-50 dark:bg-green-900/20',
              border: 'border-green-200 dark:border-green-800',
            },
          ].map((s) => (
            <div key={s.label} className={`rounded-2xl p-4 sm:p-5 border ${s.bg} ${s.border} hover:-translate-y-0.5 transition-transform duration-200`}>
              <div className={`${s.color} mb-2`}>{s.icon}</div>
              <div className={`text-2xl sm:text-3xl font-extrabold ${s.color} font-display`}>{s.value}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mb-6 p-1 bg-white dark:bg-dark-800 rounded-2xl border border-slate-100 dark:border-dark-700 w-fit shadow-sm">
          {[['all', 'All Records'], ['high', '⚠ High Risk'], ['low', '✓ Low Risk']].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setFilter(val)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                filter === val
                  ? val === 'high'
                    ? 'bg-cardiac-500 text-white shadow-md shadow-cardiac-500/30'
                    : val === 'low'
                    ? 'bg-green-500 text-white shadow-md shadow-green-500/30'
                    : 'bg-medical-500 text-white shadow-md shadow-medical-500/30'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-dark-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 skeleton rounded-2xl" />
            ))}
          </div>
        ) : error ? (
          <div className="card p-10 text-center">
            <div className="w-14 h-14 rounded-full bg-cardiac-100 dark:bg-cardiac-900/30 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-7 h-7 text-cardiac-500" />
            </div>
            <h3 className="font-bold text-slate-800 dark:text-white mb-2">Couldn't load history</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">{error}</p>
            <button onClick={loadHistory} className="btn-primary gap-2">
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="card p-14 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-dark-700 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-slate-300 dark:text-slate-600" />
            </div>
            <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-2">No predictions found</h3>
            <p className="text-sm text-slate-400 dark:text-slate-500">
              {filter === 'all'
                ? 'Run a prediction to see your history here.'
                : `No ${filter === 'high' ? 'high risk' : 'low risk'} records found.`}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((item, i) => (
              <div
                key={item.id}
                className="card-hover p-4 sm:p-5 flex items-center gap-4 animate-fade-in-up"
                style={{ animationDelay: `${i * 0.04}s` }}
              >
                {/* Risk Icon */}
                <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${
                  item.result === 1
                    ? 'bg-cardiac-100 dark:bg-cardiac-900/40 text-cardiac-600 dark:text-cardiac-400'
                    : 'bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400'
                }`}>
                  {item.result === 1
                    ? <TrendingUp className="w-5 h-5" />
                    : <TrendingDown className="w-5 h-5" />
                  }
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className={item.result === 1 ? 'badge-high-risk' : 'badge-low-risk'}>
                      {item.result === 1 ? '⚠ High Risk' : '✓ Low Risk'}
                    </span>
                    {item.age && (
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Age {item.age}
                        {item.sex !== undefined && item.sex !== null && ` • ${SEX_LABELS[item.sex]}`}
                        {item.chest_pain_type !== undefined && ` • ${CHEST_PAIN[item.chest_pain_type]}`}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />
                    <span>{formatDate(item.created_at)} at {formatTime(item.created_at)}</span>
                  </div>
                </div>

                {/* Details */}
                <div className="hidden sm:flex gap-6 text-right text-xs items-center">
                  {item.resting_bp && (
                    <div>
                      <div className="font-bold text-slate-800 dark:text-slate-200 text-sm">{item.resting_bp}</div>
                      <div className="text-slate-400 dark:text-slate-500">BP (mmHg)</div>
                    </div>
                  )}
                  {item.cholesterol && (
                    <div>
                      <div className="font-bold text-slate-800 dark:text-slate-200 text-sm">{item.cholesterol}</div>
                      <div className="text-slate-400 dark:text-slate-500">Chol.</div>
                    </div>
                  )}
                  {item.max_hr && (
                    <div>
                      <div className="font-bold text-slate-800 dark:text-slate-200 text-sm">{item.max_hr}</div>
                      <div className="text-slate-400 dark:text-slate-500">Max HR</div>
                    </div>
                  )}
                  
                  {/* Download button */}
                  <button 
                    onClick={() => generateHistoryPDF(item)}
                    className="ml-4 p-2.5 rounded-xl text-slate-400 hover:text-medical-500 hover:bg-medical-50 dark:hover:bg-medical-900/20 transition-all focus:outline-none focus:ring-2 focus:ring-medical-500/50"
                    title="Download Report"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
