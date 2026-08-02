import React, { useState, useEffect, useRef } from 'react';
import { getDashboardStats, getHistory } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Heart, Users, TrendingUp, TrendingDown, Activity,
  AlertCircle, RefreshCw, BarChart3, Sparkles
} from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  BarChart, Bar,
} from 'recharts';

const COLORS = { high: '#f43f5e', low: '#22c55e', blue: '#0a84ff', cyan: '#06b6d4' };

// ── Animated Counter ──
const useAnimatedCounter = (target, duration = 1200, trigger = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!trigger || target === 0) { setCount(target); return; }
    let startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(ease * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, trigger]);
  return count;
};

// ── Stat Card ──
const StatCard = ({ icon, label, value, color, bg, border, delay = 0 }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const animatedVal = useAnimatedCounter(Number(value) || 0, 1200, visible);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`rounded-2xl p-6 border ${bg} ${border} animate-fade-in-up hover:-translate-y-1 hover:shadow-lg transition-all duration-300`}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className={`inline-flex p-3 rounded-xl ${bg} border ${border} mb-4`}>
        <div className={color}>{icon}</div>
      </div>
      <div className={`text-4xl font-extrabold ${color} mb-1 font-display`}>
        {visible ? animatedVal : 0}
      </div>
      <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">{label}</div>
    </div>
  );
};

const buildChartData = (history) => {
  const byDate = {};
  history.forEach(h => {
    const d = new Date(h.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (!byDate[d]) byDate[d] = { date: d, high: 0, low: 0, total: 0 };
    byDate[d].total++;
    if (h.result === 1) byDate[d].high++;
    else byDate[d].low++;
  });
  return Object.values(byDate).slice(-14);
};

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-dark-800 border border-slate-200 dark:border-dark-600 rounded-xl p-3 shadow-xl text-sm">
      <p className="font-bold text-slate-800 dark:text-slate-200 mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2 text-xs">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
          <span className="text-slate-600 dark:text-slate-400 capitalize">{p.name}:</span>
          <span className="font-bold text-slate-900 dark:text-white">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

const EmptyChart = ({ message }) => (
  <div className="h-48 flex flex-col items-center justify-center gap-2">
    <BarChart3 className="w-8 h-8 text-slate-300 dark:text-slate-600" />
    <p className="text-slate-400 dark:text-slate-500 text-sm">{message}</p>
  </div>
);

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [s, h] = await Promise.all([getDashboardStats(), getHistory()]);
      setStats(s);
      setHistory(h);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const chartData = buildChartData(history);
  const pieData = stats
    ? [
        { name: 'High Risk', value: stats.high_risk_count },
        { name: 'Low Risk', value: stats.low_risk_count },
      ]
    : [];

  if (isLoading) {
    return (
      <div className="flex-1 py-10 bg-slate-50 dark:bg-dark-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-10 w-64 skeleton mb-2" />
          <div className="h-5 w-48 skeleton mb-8" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => <div key={i} className="h-36 skeleton rounded-2xl" />)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="h-72 skeleton rounded-2xl" />
            <div className="lg:col-span-2 h-72 skeleton rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center py-10 bg-slate-50 dark:bg-dark-950">
        <div className="card p-10 text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-cardiac-100 dark:bg-cardiac-900/30 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-cardiac-500" />
          </div>
          <h3 className="font-bold text-slate-800 dark:text-white mb-2">Failed to load dashboard</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{error}</p>
          <button onClick={loadData} className="btn-primary gap-2">
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 py-10 bg-slate-50 dark:bg-dark-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <p className="section-label">Overview</p>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white font-display flex items-center gap-2">
              Welcome back, {user?.full_name?.split(' ')[0]} 👋
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Here's your cardiac prediction activity at a glance.
            </p>
          </div>
          <button onClick={loadData} className="btn-secondary gap-2 self-start sm:self-auto">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<Activity className="w-6 h-6" />}
            label="Total Predictions"
            value={stats?.total_predictions ?? 0}
            color="text-medical-600 dark:text-medical-400"
            bg="bg-medical-50 dark:bg-medical-900/20"
            border="border-medical-200 dark:border-medical-800"
            delay={0}
          />
          <StatCard
            icon={<TrendingUp className="w-6 h-6" />}
            label="High Risk"
            value={stats?.high_risk_count ?? 0}
            color="text-cardiac-600 dark:text-cardiac-400"
            bg="bg-cardiac-50 dark:bg-cardiac-900/20"
            border="border-cardiac-200 dark:border-cardiac-800"
            delay={0.05}
          />
          <StatCard
            icon={<TrendingDown className="w-6 h-6" />}
            label="Low Risk"
            value={stats?.low_risk_count ?? 0}
            color="text-green-600 dark:text-green-400"
            bg="bg-green-50 dark:bg-green-900/20"
            border="border-green-200 dark:border-green-800"
            delay={0.1}
          />
          <StatCard
            icon={<Users className="w-6 h-6" />}
            label="Total Patients"
            value={stats?.total_patients ?? 0}
            color="text-purple-600 dark:text-purple-400"
            bg="bg-purple-50 dark:bg-purple-900/20"
            border="border-purple-200 dark:border-purple-800"
            delay={0.15}
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

          {/* Donut Chart */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Risk Distribution</h2>
              <div className="p-1.5 rounded-lg bg-medical-50 dark:bg-medical-900/20 text-medical-500">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            {pieData.every(d => d.value === 0) ? (
              <EmptyChart message="No data yet" />
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%" cy="50%"
                    innerRadius={52} outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    <Cell fill={COLORS.high} />
                    <Cell fill={COLORS.low} />
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    formatter={(val) => (
                      <span className="text-xs text-slate-600 dark:text-slate-400">{val}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Area Chart */}
          <div className="lg:col-span-2 card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Predictions Over Time</h2>
              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-cardiac-500 inline-block" />High</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />Low</span>
              </div>
            </div>
            {chartData.length === 0 ? (
              <EmptyChart message="No data yet — run some predictions!" />
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={chartData} margin={{ top: 0, right: 4, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="highGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.high} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={COLORS.high} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="lowGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.low} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={COLORS.low} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="high" stroke={COLORS.high} strokeWidth={2} fill="url(#highGrad)" name="High Risk" dot={false} />
                  <Area type="monotone" dataKey="low" stroke={COLORS.low} strokeWidth={2} fill="url(#lowGrad)" name="Low Risk" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Bar Chart */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Daily Prediction Volume</h2>
          </div>
          {chartData.length === 0 ? (
            <EmptyChart message="No data yet" />
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData} margin={{ top: 0, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={COLORS.blue} stopOpacity={1} />
                    <stop offset="100%" stopColor={COLORS.cyan} stopOpacity={0.8} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="total" fill="url(#barGrad)" radius={[6, 6, 0, 0]} name="Total" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;
