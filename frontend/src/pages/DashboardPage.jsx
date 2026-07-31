import React, { useState, useEffect } from 'react';
import { getDashboardStats, getHistory } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Heart, Users, TrendingUp, TrendingDown, Activity, AlertCircle, RefreshCw } from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  BarChart, Bar,
} from 'recharts';

const COLORS = { high: '#f43f5e', low: '#22c55e', blue: '#0a84ff' };

const StatCard = ({ icon, label, value, color, bg }) => (
  <div className={`card p-6 border ${bg} animate-fade-in-up`}>
    <div className={`inline-flex p-3 rounded-xl ${bg} border ${bg} mb-4`}>
      <div className={color}>{icon}</div>
    </div>
    <div className={`text-3xl font-extrabold ${color} mb-1`}>{value}</div>
    <div className="text-sm text-slate-500 dark:text-slate-400">{label}</div>
  </div>
);

const buildChartData = (history) => {
  // Group by date for line chart
  const byDate = {};
  history.forEach(h => {
    const d = new Date(h.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (!byDate[d]) byDate[d] = { date: d, high: 0, low: 0, total: 0 };
    byDate[d].total++;
    if (h.result === 1) byDate[d].high++;
    else byDate[d].low++;
  });
  return Object.values(byDate).slice(-14); // last 14 days
};

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
  const pieData = stats ? [
    { name: 'High Risk', value: stats.high_risk_count },
    { name: 'Low Risk', value: stats.low_risk_count },
  ] : [];

  if (isLoading) {
    return (
      <div className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => <div key={i} className="card h-36 skeleton" />)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="card h-72 skeleton" />
            <div className="lg:col-span-2 card h-72 skeleton" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center py-10">
        <div className="card p-8 text-center max-w-md">
          <AlertCircle className="w-10 h-10 text-cardiac-500 mx-auto mb-3" />
          <p className="font-medium text-slate-700 dark:text-slate-300">{error}</p>
          <button onClick={loadData} className="btn-primary mt-4 gap-2"><RefreshCw className="w-4 h-4" />Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <p className="section-label">Overview</p>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Welcome back, {user?.full_name?.split(' ')[0]} 👋
            </h1>
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
            bg="bg-medical-50 dark:bg-medical-900/20 border-medical-200 dark:border-medical-800"
          />
          <StatCard
            icon={<TrendingUp className="w-6 h-6" />}
            label="High Risk"
            value={stats?.high_risk_count ?? 0}
            color="text-cardiac-600 dark:text-cardiac-400"
            bg="bg-cardiac-50 dark:bg-cardiac-900/20 border-cardiac-200 dark:border-cardiac-800"
          />
          <StatCard
            icon={<TrendingDown className="w-6 h-6" />}
            label="Low Risk"
            value={stats?.low_risk_count ?? 0}
            color="text-green-600 dark:text-green-400"
            bg="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
          />
          <StatCard
            icon={<Users className="w-6 h-6" />}
            label="Total Patients"
            value={stats?.total_patients ?? 0}
            color="text-purple-600 dark:text-purple-400"
            bg="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Pie Chart */}
          <div className="card p-6">
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-6">Risk Distribution</h2>
            {pieData.every(d => d.value === 0) ? (
              <div className="h-48 flex items-center justify-center text-slate-400 text-sm">No data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                    <Cell fill={COLORS.high} />
                    <Cell fill={COLORS.low} />
                  </Pie>
                  <Tooltip formatter={(val, name) => [val, name]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Line Chart */}
          <div className="lg:col-span-2 card p-6">
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-6">Predictions Over Time</h2>
            {chartData.length === 0 ? (
              <div className="h-48 flex items-center justify-center text-slate-400 text-sm">No data yet — run some predictions!</div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="high" stroke={COLORS.high} strokeWidth={2} dot={false} name="High Risk" />
                  <Line type="monotone" dataKey="low" stroke={COLORS.low} strokeWidth={2} dot={false} name="Low Risk" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Bar Chart */}
        <div className="card p-6">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-6">Daily Prediction Volume</h2>
          {chartData.length === 0 ? (
            <div className="h-40 flex items-center justify-center text-slate-400 text-sm">No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="total" fill={COLORS.blue} radius={[4, 4, 0, 0]} name="Total" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
