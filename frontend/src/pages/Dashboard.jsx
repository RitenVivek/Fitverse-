import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Flame, Footprints, Droplets, Scale, Moon, Activity,
  Plus, CalendarDays, TrendingUp, TrendingDown, Minus,
  BrainCircuit, Pencil, CheckCircle2, AlertTriangle, Info, Sparkles
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [todayLog, setTodayLog] = useState(null);
  const [summary, setSummary] = useState(null);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLogModal, setShowLogModal] = useState(false);
  const [logForm, setLogForm] = useState({
    caloriesConsumed: '', caloriesBurned: '', steps: '', waterIntake: '', sleepHours: '', weight: '', mood: 'okay'
  });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => { loadDashboard(); }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const [logRes, sumRes, insRes] = await Promise.all([
        api.getTodayLog(), api.getSummary(), api.getInsights().catch(() => ({ insights: [] }))
      ]);
      setTodayLog(logRes.log);
      setSummary(sumRes);
      setInsights(insRes.insights || []);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveLog = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {};
      if (logForm.caloriesConsumed) payload.calories = { consumed: +logForm.caloriesConsumed, burned: +(logForm.caloriesBurned || 0), target: todayLog?.calories?.target || 2000 };
      if (logForm.steps) payload.steps = +logForm.steps;
      if (logForm.waterIntake) payload.waterIntake = +logForm.waterIntake;
      if (logForm.sleepHours) payload.sleepHours = +logForm.sleepHours;
      if (logForm.weight) payload.weight = +logForm.weight;
      if (logForm.mood) payload.mood = logForm.mood;
      await api.saveLog(payload);
      if (logForm.weight) await api.addWeight({ weight: +logForm.weight }).catch(() => {});
      showToast('Daily log saved!');
      setShowLogModal(false);
      loadDashboard();
    } catch (err) { showToast(err.message, 'error'); }
    setSaving(false);
  };

  const insightIcons = {
    success: <CheckCircle2 size={18} style={{ color: 'var(--green-400)', flexShrink: 0 }} />,
    warning: <AlertTriangle size={18} style={{ color: 'var(--yellow-400)', flexShrink: 0 }} />,
    info: <Info size={18} style={{ color: 'var(--blue-400)', flexShrink: 0 }} />,
  };

  if (loading) return <div><div className="spinner"></div><p className="loading-text">Loading Command Center...</p></div>;

  const cal = todayLog?.calories || { consumed: 0, burned: 0, target: 2000 };
  const calPercent = Math.min(100, Math.round((cal.consumed / cal.target) * 100));

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Command Center</h1>
          <p className="page-subtitle">Welcome back, {user?.name || 'Operator'}. Here's your daily status.</p>
        </div>
        <button className="btn-primary" style={{ width: 'auto', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: 8 }} onClick={() => setShowLogModal(true)}>
          <Plus size={16} /> Log Today
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card cyan">
          <div className="stat-card-icon"><Flame size={26} style={{ color: 'var(--cyan-400)' }} /></div>
          <div className="stat-card-label">Calories Consumed</div>
          <div className="stat-card-value">{cal.consumed}<span className="stat-card-unit">/ {cal.target} kcal</span></div>
          <div style={{ marginTop: 8, height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2 }}>
            <div style={{ height: '100%', width: `${calPercent}%`, background: calPercent > 100 ? 'var(--red-400)' : 'var(--cyan-400)', borderRadius: 2, transition: 'width 0.5s' }}></div>
          </div>
        </div>
        <div className="stat-card green">
          <div className="stat-card-icon"><Footprints size={26} style={{ color: 'var(--green-400)' }} /></div>
          <div className="stat-card-label">Steps</div>
          <div className="stat-card-value">{(todayLog?.steps || 0).toLocaleString()}</div>
          <div className="stat-card-change positive">Goal: 10,000</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-card-icon"><Droplets size={26} style={{ color: 'var(--blue-400)' }} /></div>
          <div className="stat-card-label">Water Intake</div>
          <div className="stat-card-value">{todayLog?.waterIntake || 0}<span className="stat-card-unit">glasses</span></div>
          <div className="stat-card-change" style={{ color: (todayLog?.waterIntake || 0) >= 8 ? 'var(--green-400)' : 'var(--yellow-400)' }}>
            {(todayLog?.waterIntake || 0) >= 8 ? '✓ Hydrated' : 'Target: 8 glasses'}
          </div>
        </div>
        <div className="stat-card purple">
          <div className="stat-card-icon"><Scale size={26} style={{ color: 'var(--purple-400)' }} /></div>
          <div className="stat-card-label">Current Weight</div>
          <div className="stat-card-value">{user?.weight || '—'}<span className="stat-card-unit">kg</span></div>
          {user?.targetWeight && <div className="stat-card-change" style={{ color: 'var(--purple-400)' }}>Target: {user.targetWeight} kg</div>}
        </div>
        <div className="stat-card yellow">
          <div className="stat-card-icon"><Moon size={26} style={{ color: 'var(--yellow-400)' }} /></div>
          <div className="stat-card-label">Sleep</div>
          <div className="stat-card-value">{todayLog?.sleepHours || 0}<span className="stat-card-unit">hrs</span></div>
        </div>
        <div className="stat-card red">
          <div className="stat-card-icon"><Activity size={26} style={{ color: 'var(--red-400)' }} /></div>
          <div className="stat-card-label">Calories Burned</div>
          <div className="stat-card-value">{cal.burned}<span className="stat-card-unit">kcal</span></div>
        </div>
      </div>

      {summary && (
        <div className="grid-2" style={{ marginBottom: 24 }}>
          <div className="glass-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16, color: 'var(--cyan-400)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <CalendarDays size={18} /> Weekly Summary
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div><span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Avg Calories</span><p style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: 700 }}>{summary.weekly?.avgCalories || 0}</p></div>
              <div><span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Avg Steps</span><p style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: 700 }}>{(summary.weekly?.avgSteps || 0).toLocaleString()}</p></div>
              <div><span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Avg Water</span><p style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: 700 }}>{summary.weekly?.avgWater || 0} gl</p></div>
              <div><span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Streak</span><p style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: 700 }}>{summary.weekly?.streakDays || 0} days</p></div>
            </div>
          </div>
          <div className="glass-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16, color: 'var(--cyan-400)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <BrainCircuit size={18} /> AI Quick Insights
            </h3>
            {insights.length > 0 ? insights.slice(0, 3).map((ins, i) => (
              <div key={i} className={`insight-card ${ins.type}`} style={{ marginBottom: 8, padding: 10 }}>
                {insightIcons[ins.type] || insightIcons.info}
                <span className="insight-text" style={{ fontSize: '0.8rem' }}>{ins.message}</span>
              </div>
            )) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Start logging data to get AI insights!</p>
            )}
          </div>
        </div>
      )}

      {/* Log Modal */}
      {showLogModal && (
        <div className="modal-overlay" onClick={() => setShowLogModal(false)}>
          <div className="glass-card modal-content" onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--cyan-400)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Pencil size={18} /> Daily Log Entry
            </h2>
            <form onSubmit={handleSaveLog}>
              <div className="form-row">
                <div className="form-group">
                  <label className="input-label">Calories Consumed</label>
                  <input className="input-field" type="number" placeholder="e.g. 1800" value={logForm.caloriesConsumed} onChange={e => setLogForm({...logForm, caloriesConsumed: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="input-label">Calories Burned</label>
                  <input className="input-field" type="number" placeholder="e.g. 400" value={logForm.caloriesBurned} onChange={e => setLogForm({...logForm, caloriesBurned: e.target.value})} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="input-label">Steps</label>
                  <input className="input-field" type="number" placeholder="e.g. 8000" value={logForm.steps} onChange={e => setLogForm({...logForm, steps: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="input-label">Water (glasses)</label>
                  <input className="input-field" type="number" placeholder="e.g. 8" value={logForm.waterIntake} onChange={e => setLogForm({...logForm, waterIntake: e.target.value})} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="input-label">Sleep (hours)</label>
                  <input className="input-field" type="number" step="0.5" placeholder="e.g. 7.5" value={logForm.sleepHours} onChange={e => setLogForm({...logForm, sleepHours: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="input-label">Weight (kg)</label>
                  <input className="input-field" type="number" step="0.1" placeholder="e.g. 72.5" value={logForm.weight} onChange={e => setLogForm({...logForm, weight: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label className="input-label">Mood</label>
                <select className="input-field" value={logForm.mood} onChange={e => setLogForm({...logForm, mood: e.target.value})}>
                  <option value="great">Great</option>
                  <option value="good">Good</option>
                  <option value="okay">Okay</option>
                  <option value="bad">Bad</option>
                  <option value="terrible">Terrible</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                <button className="btn-primary" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Log'}</button>
                <button className="btn-secondary" type="button" onClick={() => setShowLogModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
    </div>
  );
}
