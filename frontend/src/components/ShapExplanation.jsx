import React, { useState } from 'react';
import { Info } from 'lucide-react';

/**
 * ShapExplanation — displays top-N SHAP feature contributions for a prediction.
 *
 * Props:
 *   explanation  Array<{ feature_name, value, shap_value, direction }>  (sorted by |shap| desc)
 *   topN         number  (default 5)
 */
const ShapExplanation = ({ explanation, topN = 5 }) => {
  const [tooltipVisible, setTooltipVisible] = useState(false);

  if (!explanation || explanation.length === 0) return null;

  const topFeatures = explanation.slice(0, topN);
  const maxAbs = Math.max(...topFeatures.map(f => Math.abs(f.shap_value)));

  return (
    <div className="mt-6 rounded-2xl border border-slate-200 dark:border-dark-700 bg-white dark:bg-dark-800 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 dark:border-dark-700 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-medical-500 dark:text-medical-400 mb-0.5">
            Explainable AI
          </p>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Why did the model make this prediction?
          </h3>
        </div>

        {/* Info tooltip */}
        <div className="relative flex-shrink-0">
          <button
            onMouseEnter={() => setTooltipVisible(true)}
            onMouseLeave={() => setTooltipVisible(false)}
            onClick={() => setTooltipVisible(v => !v)}
            className="p-2 rounded-lg text-slate-400 hover:text-medical-500 hover:bg-medical-50 dark:hover:bg-medical-900/20 transition-all"
            aria-label="SHAP explanation info"
          >
            <Info className="w-5 h-5" />
          </button>

          {tooltipVisible && (
            <div className="absolute right-0 top-full mt-2 w-72 z-50 p-4 rounded-xl shadow-xl border border-slate-200 dark:border-dark-600 bg-white dark:bg-dark-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed animate-fade-in">
              <strong className="block text-slate-800 dark:text-white mb-1">About SHAP</strong>
              SHAP (SHapley Additive exPlanations) explains how individual features influenced the machine-learning model's prediction. It describes model behavior and does not establish medical causation.
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-5">
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
          The strongest factors influencing this model prediction were:
        </p>

        <div className="space-y-4">
          {topFeatures.map((feat, i) => {
            const isPositive = feat.direction === 'higher_risk';
            const pct = maxAbs > 0 ? (Math.abs(feat.shap_value) / maxAbs) * 100 : 0;

            return (
              <div key={feat.feature_key || i} className="min-w-0">
                {/* Feature label + value */}
                <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                    {feat.feature_name}
                  </span>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                      value: <span className="text-slate-600 dark:text-slate-300 font-bold">{feat.value}</span>
                    </span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      isPositive
                        ? 'bg-cardiac-100 dark:bg-cardiac-900/40 text-cardiac-700 dark:text-cardiac-300'
                        : 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300'
                    }`}>
                      {isPositive ? '↑ Higher risk' : '↓ Lower risk'}
                    </span>
                  </div>
                </div>

                {/* Bar */}
                <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-dark-700 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ease-out ${
                      isPositive
                        ? 'bg-gradient-to-r from-orange-400 to-cardiac-500'
                        : 'bg-gradient-to-r from-cyan-400 to-green-500'
                    }`}
                    style={{ width: `${Math.max(pct, 3)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Disclaimer */}
        <p className="mt-5 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900 rounded-xl p-3 leading-relaxed">
          ⚠️ SHAP values explain the behaviour of the machine-learning model for this prediction.
          They do not establish medical causation and should not be interpreted as a medical diagnosis.
        </p>
      </div>
    </div>
  );
};

export default ShapExplanation;
