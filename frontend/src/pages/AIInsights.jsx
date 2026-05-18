import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  BrainCircuit, RefreshCw, Flame, Activity, Target, Scale,
  TrendingUp, Award, CheckCircle2, AlertTriangle, Info,
  Lightbulb, Sparkles, BarChart3
} from 'lucide-react';

export default function AIInsights() {
  const [insights, setInsights] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [calorieRec, setCalorieRec] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [insRes, predRes, calRes] = await Promise.all([
        api.getInsights().catch(() => ({ insights: [] })),
        api.getWeightPrediction().catch(() => null),
        api.getCalorieRecommendation().catch(() => null),
      ]);
      setInsights(insRes.insights || []);
      setPrediction(predRes);
      setCalorieRec(calRes);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const insightIcons = {
    success: <CheckCircle2 size={18} style={{ color: 'var(--green-400)', flexShrink: 0 }} />,
    warning: <AlertTriangle size={18} style={{ color: 'var(--yellow-400)', flexShrink: 0 }} />,
    info: <Info size={18} style={{ color: 'var(--blue-400)', flexShrink: 0 }} />,
  };

  if (loading) return <div><div className="spinner"></div><p className="loading-text">AI Engine Processing...</p></div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">AI Insights</h1>
          <p className="page-subtitle">Machine learning powered fitness intelligence</p>
        </div>
        <button className="btn-secondary" onClick={loadAll} style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Calorie Recommendation */}
      {calorieRec && (
        <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--cyan-400)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <BrainCircuit size={18} /> AI Calorie Recommendation
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 400, textTransform: 'uppercase' }}>via {calorieRec.method}</span>
          </h3>
          <div className="stats-grid" style={{ marginBottom: 16 }}>
            <div className="stat-card cyan">
              <div className="stat-card-icon"><Activity size={22} style={{ color: 'var(--cyan-400)' }} /></div>
              <div className="stat-card-label">BMR</div>
              <div className="stat-card-value">{calorieRec.bmr}<span className="stat-card-unit">kcal</span></div>
            </div>
            <div className="stat-card blue">
              <div className="stat-card-icon"><Flame size={22} style={{ color: 'var(--blue-400)' }} /></div>
              <div className="stat-card-label">TDEE</div>
              <div className="stat-card-value">{calorieRec.tdee}<span className="stat-card-unit">kcal</span></div>
            </div>
            <div className="stat-card green">
              <div className="stat-card-icon"><Target size={22} style={{ color: 'var(--green-400)' }} /></div>
              <div className="stat-card-label">Recommended</div>
              <div className="stat-card-value">{calorieRec.recommendedCalories}<span className="stat-card-unit">kcal</span></div>
              {calorieRec.goalAdjustment !== 0 && (
                <div className="stat-card-change" style={{ color: calorieRec.goalAdjustment < 0 ? 'var(--green-400)' : 'var(--yellow-400)' }}>
                  {calorieRec.goalAdjustment > 0 ? '+' : ''}{calorieRec.goalAdjustment} cal adjustment
                </div>
              )}
            </div>
          </div>
          {calorieRec.macros && (
            <div className="macro-bar">
              <div className="macro-item">
                <div className="macro-value">{calorieRec.macros.protein}g</div>
                <div className="macro-label protein">Protein {calorieRec.macroRatios?.protein || ''}</div>
              </div>
              <div className="macro-item">
                <div className="macro-value">{calorieRec.macros.carbs}g</div>
                <div className="macro-label carbs">Carbs {calorieRec.macroRatios?.carbs || ''}</div>
              </div>
              <div className="macro-item">
                <div className="macro-value">{calorieRec.macros.fats}g</div>
                <div className="macro-label fats">Fats {calorieRec.macroRatios?.fats || ''}</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Weight Prediction */}
      {prediction && (
        <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--purple-400)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <BarChart3 size={18} /> Weight Prediction
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 400, marginLeft: 4, textTransform: 'uppercase' }}>{prediction.method}</span>
          </h3>
          {prediction.predictions && prediction.predictions.length > 0 ? (
            <div>
              <div className="stats-grid" style={{ marginBottom: 16 }}>
                <div className="stat-card purple">
                  <div className="stat-card-icon"><Scale size={20} style={{ color: 'var(--purple-400)' }} /></div>
                  <div className="stat-card-label">Current Weight</div>
                  <div className="stat-card-value">{prediction.currentWeight}<span className="stat-card-unit">kg</span></div>
                </div>
                <div className="stat-card cyan">
                  <div className="stat-card-icon"><TrendingUp size={20} style={{ color: 'var(--cyan-400)' }} /></div>
                  <div className="stat-card-label">Trend</div>
                  <div className="stat-card-value" style={{ fontSize: '1.2rem', textTransform: 'capitalize' }}>{prediction.trend}</div>
                  <div className="stat-card-change" style={{ color: 'var(--text-muted)' }}>
                    {prediction.weeklyChange ? `${prediction.weeklyChange} kg/week` : `${prediction.avgDailyChange} kg/day`}
                  </div>
                </div>
                {prediction.daysToTarget && (
                  <div className="stat-card green">
                    <div className="stat-card-icon"><Target size={20} style={{ color: 'var(--green-400)' }} /></div>
                    <div className="stat-card-label">Days to Target ({prediction.targetWeight}kg)</div>
                    <div className="stat-card-value">{prediction.daysToTarget}<span className="stat-card-unit">days</span></div>
                  </div>
                )}
                {prediction.confidence && (
                  <div className="stat-card yellow">
                    <div className="stat-card-icon"><Award size={20} style={{ color: 'var(--yellow-400)' }} /></div>
                    <div className="stat-card-label">Model R² Score</div>
                    <div className="stat-card-value">{(prediction.confidence * 100).toFixed(1)}<span className="stat-card-unit">%</span></div>
                  </div>
                )}
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <th style={{ padding: 8, textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600 }}>Week</th>
                      <th style={{ padding: 8, textAlign: 'right', color: 'var(--text-muted)', fontWeight: 600 }}>Predicted Weight</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prediction.predictions.slice(0, 8).map((p, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                        <td style={{ padding: 8, color: 'var(--text-secondary)' }}>{p.date || `Day ${p.day}`}</td>
                        <td style={{ padding: 8, textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{p.weight} kg</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              {prediction.message || 'Need more weight entries for predictions. Keep logging!'}
              {prediction.currentEntries !== undefined && <span> ({prediction.currentEntries} entries, need 3+)</span>}
            </p>
          )}
        </div>
      )}

      {/* Fitness Insights */}
      <div className="glass-card" style={{ padding: 24 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--green-400)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Lightbulb size={18} /> Fitness Insights
        </h3>
        {insights.length > 0 ? insights.map((ins, i) => (
          <div key={i} className={`insight-card ${ins.type}`}>
            {insightIcons[ins.type] || insightIcons.info}
            <span className="insight-text">{ins.message}</span>
          </div>
        )) : (
          <div className="insight-card info">
            <Sparkles size={18} style={{ color: 'var(--blue-400)', flexShrink: 0 }} />
            <span className="insight-text">Start logging your daily metrics to get personalized AI insights!</span>
          </div>
        )}
      </div>
    </div>
  );
}
