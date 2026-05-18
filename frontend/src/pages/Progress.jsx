import React, { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import api from '../services/api';
import {
  Flame, Scale, Footprints, Droplets, TrendingUp, Target,
  BarChart3, RefreshCw, ShieldCheck
} from 'lucide-react';

Chart.register(...registerables);

function ChartComponent({ type, data, options, height = 260 }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) chartRef.current.destroy();
    if (!canvasRef.current || !data) return;
    chartRef.current = new Chart(canvasRef.current, {
      type, data,
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#94a3b8', font: { family: 'Inter', size: 11 } } } },
        scales: {
          x: { ticks: { color: '#64748b', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.04)' } },
          y: { ticks: { color: '#64748b', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.04)' } },
        },
        ...options,
      },
    });
    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, [data, type]);

  return <div style={{ height }}><canvas ref={canvasRef}></canvas></div>;
}

export default function Progress() {
  const [chartData, setChartData] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);
  const [weightForm, setWeightForm] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => { loadData(); }, [days]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [charts, pred] = await Promise.all([
        api.getChartData(days),
        api.getWeightPrediction().catch(() => null),
      ]);
      setChartData(charts);
      setPrediction(pred);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type }); setTimeout(() => setToast(null), 3000);
  };

  const handleLogWeight = async (e) => {
    e.preventDefault();
    if (!weightForm) return;
    try {
      await api.addWeight({ weight: +weightForm });
      showToast('Weight logged!');
      setWeightForm('');
      loadData();
    } catch (err) { showToast(err.message, 'error'); }
  };

  if (loading) return <div><div className="spinner"></div><p className="loading-text">Analyzing Progress...</p></div>;

  const calorieChart = chartData?.caloriesData?.length > 0 ? {
    labels: chartData.caloriesData.map(d => d.date.slice(5)),
    datasets: [
      { label: 'Consumed', data: chartData.caloriesData.map(d => d.consumed), borderColor: '#22d3ee', backgroundColor: 'rgba(34,211,238,0.1)', fill: true, tension: 0.4 },
      { label: 'Target', data: chartData.caloriesData.map(d => d.target), borderColor: '#64748b', borderDash: [5, 5], fill: false, tension: 0 },
      { label: 'Burned', data: chartData.caloriesData.map(d => d.burned), borderColor: '#f87171', backgroundColor: 'rgba(248,113,113,0.1)', fill: true, tension: 0.4 },
    ],
  } : null;

  const weightChart = chartData?.weightData?.length > 0 ? {
    labels: chartData.weightData.map(d => d.date.slice(5)),
    datasets: [{ label: 'Weight (kg)', data: chartData.weightData.map(d => d.weight), borderColor: '#c084fc', backgroundColor: 'rgba(192,132,252,0.1)', fill: true, tension: 0.4, pointRadius: 4 }],
  } : null;

  const stepsChart = chartData?.stepsData?.length > 0 ? {
    labels: chartData.stepsData.map(d => d.date.slice(5)),
    datasets: [{ label: 'Steps', data: chartData.stepsData.map(d => d.steps), backgroundColor: 'rgba(34,197,94,0.6)', borderColor: '#22c55e', borderWidth: 1, borderRadius: 4 }],
  } : null;

  const waterChart = chartData?.waterData?.length > 0 ? {
    labels: chartData.waterData.map(d => d.date.slice(5)),
    datasets: [{ label: 'Water (glasses)', data: chartData.waterData.map(d => d.glasses), backgroundColor: 'rgba(96,165,250,0.6)', borderColor: '#60a5fa', borderWidth: 1, borderRadius: 4 }],
  } : null;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Progress Analytics</h1>
          <p className="page-subtitle">Track your fitness journey with live data</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {[7, 30, 90].map(d => (
            <button key={d} className={d === days ? 'btn-primary' : 'btn-secondary'} style={{ width: 'auto', padding: '8px 16px', fontSize: '0.75rem' }} onClick={() => setDays(d)}>
              {d}D
            </button>
          ))}
        </div>
      </div>

      {/* Quick weight log */}
      <div className="glass-card" style={{ padding: 16, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <Scale size={18} style={{ color: 'var(--text-secondary)' }} />
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Quick log:</span>
        <form onSubmit={handleLogWeight} style={{ display: 'flex', gap: 8, flex: 1, minWidth: 200 }}>
          <input className="input-field" type="number" step="0.1" placeholder="Weight (kg)" value={weightForm} onChange={e => setWeightForm(e.target.value)} style={{ maxWidth: 160 }} />
          <button className="btn-primary" type="submit" style={{ width: 'auto', padding: '8px 20px' }}>Log</button>
        </form>
        {prediction?.trend && (
          <span style={{ fontSize: '0.8rem', color: prediction.trend === 'losing' ? 'var(--green-400)' : prediction.trend === 'gaining' ? 'var(--red-400)' : 'var(--blue-400)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <TrendingUp size={14} />
            Trend: {prediction.trend} ({prediction.weeklyChange || prediction.avgDailyChange} kg/wk)
          </span>
        )}
      </div>

      <div className="grid-2">
        <div className="chart-container">
          <div className="chart-title"><Flame size={16} style={{ color: 'var(--cyan-400)' }} /> Calories Tracking</div>
          {calorieChart ? <ChartComponent type="line" data={calorieChart} /> : <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 40 }}>No calorie data yet. Start logging!</p>}
        </div>
        <div className="chart-container">
          <div className="chart-title"><Scale size={16} style={{ color: 'var(--purple-400)' }} /> Weight Progress</div>
          {weightChart ? <ChartComponent type="line" data={weightChart} /> : <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 40 }}>No weight data yet. Log your weight!</p>}
        </div>
        <div className="chart-container">
          <div className="chart-title"><Footprints size={16} style={{ color: 'var(--green-400)' }} /> Daily Steps</div>
          {stepsChart ? <ChartComponent type="bar" data={stepsChart} /> : <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 40 }}>No step data yet.</p>}
        </div>
        <div className="chart-container">
          <div className="chart-title"><Droplets size={16} style={{ color: 'var(--blue-400)' }} /> Water Intake</div>
          {waterChart ? <ChartComponent type="bar" data={waterChart} /> : <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 40 }}>No water data yet.</p>}
        </div>
      </div>

      {/* Weight Prediction */}
      {prediction && prediction.predictions && prediction.predictions.length > 0 && (
        <div className="glass-card" style={{ padding: 24, marginTop: 8 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--purple-400)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <BarChart3 size={18} /> ML Weight Prediction
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 400, textTransform: 'uppercase' }}>{prediction.method}</span>
          </h3>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 16 }}>
            <div className="stat-card purple" style={{ flex: 1, minWidth: 140 }}>
              <div className="stat-card-label">Current</div>
              <div className="stat-card-value">{prediction.currentWeight} kg</div>
            </div>
            {prediction.daysToTarget && (
              <div className="stat-card green" style={{ flex: 1, minWidth: 140 }}>
                <div className="stat-card-label">Est. Days to Target</div>
                <div className="stat-card-value">{prediction.daysToTarget}</div>
              </div>
            )}
            {prediction.confidence && (
              <div className="stat-card cyan" style={{ flex: 1, minWidth: 140 }}>
                <div className="stat-card-label">Model Confidence</div>
                <div className="stat-card-value">{(prediction.confidence * 100).toFixed(0)}%</div>
              </div>
            )}
          </div>
          <ChartComponent type="line" data={{
            labels: prediction.predictions.map(p => p.date ? p.date.slice(5) : `Day ${p.day}`),
            datasets: [{
              label: 'Predicted Weight', data: prediction.predictions.map(p => p.weight),
              borderColor: '#c084fc', backgroundColor: 'rgba(192,132,252,0.1)', fill: true, tension: 0.3, borderDash: [6, 3],
            }],
          }} height={200} />
        </div>
      )}

      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
    </div>
  );
}
