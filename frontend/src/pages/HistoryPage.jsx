import React, { useState, useEffect } from 'react';
import { getHistory } from '../services/api';
import { Heart, Clock, TrendingUp, TrendingDown, AlertCircle, RefreshCw } from 'lucide-react';

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
  const [filter, setFilter] = useState('all'); // all | high | low

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

  return (
    <div className="flex-1 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <p className="section-label">Records</p>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Prediction History</h1>
          </div>
          <button onClick={loadHistory} className="btn-secondary gap-2 self-start sm:self-auto">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total', value: history.length, icon: <Clock className="w-5 h-5" />, color: 'text-medical-600 dark:text-medical-400', bg: 'bg-medical-50 dark:bg-medical-900/20 border-medical-200 dark:border-medical-800' },
            { label: 'High Risk', value: highCount, icon: <TrendingUp className="w-5 h-5" />, color: 'text-cardiac-600 dark:text-cardiac-400', bg: 'bg-cardiac-50 dark:bg-cardiac-900/20 border-cardiac-200 dark:border-cardiac-800' },
            { label: 'Low Risk', value: lowCount, icon: <TrendingDown className="w-5 h-5" />, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' },
          ].map((s) => (
            <div key={s.label} className={`card p-4 border ${s.bg}`}>
              <div className={`${s.color} mb-2`}>{s.icon}</div>
              <div className={`text-2xl font-extrabold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {[['all', 'All'], ['high', 'High Risk'], ['low', 'Low Risk']].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setFilter(val)}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-150 ${
                filter === val
                  ? 'bg-medical-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-dark-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-dark-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card p-5 h-24 skeleton" />
            ))}
          </div>
        ) : error ? (
          <div className="card p-8 text-center">
            <AlertCircle className="w-10 h-10 text-cardiac-500 mx-auto mb-3" />
            <p className="text-slate-700 dark:text-slate-300 font-medium">{error}</p>
            <button onClick={loadHistory} className="btn-primary mt-4">Retry</button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="card p-12 text-center">
            <Heart className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400 font-medium">No predictions found.</p>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Run a prediction to see your history here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((item, i) => (
              <div
                key={item.id}
                className="card-hover p-5 flex items-center gap-4 animate-fade-in-up"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {/* Risk Icon */}
                <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                  item.result === 1 ? 'bg-cardiac-100 dark:bg-cardiac-900/30 text-cardiac-600 dark:text-cardiac-400' : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                }`}>
                  {item.result === 1 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={item.result === 1 ? 'badge-high-risk' : 'badge-low-risk'}>
                      {item.result === 1 ? '⚠ High Risk' : '✓ Low Risk'}
                    </span>
                    {item.age && (
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        Age {item.age} • {item.sex !== undefined && item.sex !== null ? SEX_LABELS[item.sex] : '—'} • {item.chest_pain_type !== undefined ? CHEST_PAIN[item.chest_pain_type] : '—'}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDate(item.created_at)} at {formatTime(item.created_at)}
                  </div>
                </div>

                {/* Details */}
                <div className="hidden sm:flex gap-6 text-right text-xs text-slate-500 dark:text-slate-400">
                  {item.resting_bp && <div><div className="font-semibold text-slate-700 dark:text-slate-300">{item.resting_bp}</div>BP (mmHg)</div>}
                  {item.cholesterol && <div><div className="font-semibold text-slate-700 dark:text-slate-300">{item.cholesterol}</div>Chol.</div>}
                  {item.max_hr && <div><div className="font-semibold text-slate-700 dark:text-slate-300">{item.max_hr}</div>Max HR</div>}
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
