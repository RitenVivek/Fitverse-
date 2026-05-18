import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  BrainCircuit, Plus, Trash2, Sparkles, Sun, Moon, Coffee, Apple,
  CheckCircle2, AlertTriangle, Info
} from 'lucide-react';

export default function DietPlanner() {
  const [plans, setPlans] = useState([]);
  const [activePlan, setActivePlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showAddMeal, setShowAddMeal] = useState(null);
  const [mealForm, setMealForm] = useState({ name: '', calories: '', protein: '', carbs: '', fats: '', quantity: '1 serving' });
  const [toast, setToast] = useState(null);

  useEffect(() => { loadPlans(); }, []);

  const loadPlans = async () => {
    setLoading(true);
    try {
      const [plansRes, activeRes] = await Promise.all([api.getDietPlans(), api.getActiveDiet()]);
      setPlans(plansRes.plans || []);
      setActivePlan(activeRes.plan);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type }); setTimeout(() => setToast(null), 3000);
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await api.generateDiet();
      showToast('AI Diet Plan generated!');
      loadPlans();
    } catch (err) { showToast(err.message, 'error'); }
    setGenerating(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this diet plan?')) return;
    try {
      await api.deleteDiet(id);
      showToast('Plan deleted');
      loadPlans();
    } catch (err) { showToast(err.message, 'error'); }
  };

  const handleAddMeal = async (e) => {
    e.preventDefault();
    if (!showAddMeal || !activePlan) return;
    try {
      await api.addMealItem(activePlan._id, showAddMeal, {
        name: mealForm.name, calories: +mealForm.calories,
        protein: +mealForm.protein || 0, carbs: +mealForm.carbs || 0,
        fats: +mealForm.fats || 0, quantity: mealForm.quantity,
      });
      showToast('Meal item added!');
      setShowAddMeal(null);
      setMealForm({ name: '', calories: '', protein: '', carbs: '', fats: '', quantity: '1 serving' });
      loadPlans();
    } catch (err) { showToast(err.message, 'error'); }
  };

  const mealIcons = {
    breakfast: <Coffee size={16} style={{ color: 'var(--yellow-400)' }} />,
    lunch: <Sun size={16} style={{ color: 'var(--cyan-400)' }} />,
    dinner: <Moon size={16} style={{ color: 'var(--blue-400)' }} />,
    snacks: <Apple size={16} style={{ color: 'var(--green-400)' }} />,
  };

  if (loading) return <div><div className="spinner"></div><p className="loading-text">Loading Diet Plans...</p></div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Diet Planner</h1>
          <p className="page-subtitle">AI-powered nutrition protocol management</p>
        </div>
        <button className="btn-primary" style={{ width: 'auto', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: 8 }} onClick={handleGenerate} disabled={generating}>
          <BrainCircuit size={16} />
          {generating ? 'Generating...' : 'Generate AI Plan'}
        </button>
      </div>

      {activePlan && (
        <div>
          <div className="macro-bar">
            <div className="macro-item">
              <div className="macro-value">{activePlan.targetCalories}</div>
              <div className="macro-label calories">Daily Calories</div>
            </div>
            <div className="macro-item">
              <div className="macro-value">{activePlan.targetProtein || '—'}g</div>
              <div className="macro-label protein">Protein</div>
            </div>
            <div className="macro-item">
              <div className="macro-value">{activePlan.targetCarbs || '—'}g</div>
              <div className="macro-label carbs">Carbs</div>
            </div>
            <div className="macro-item">
              <div className="macro-value">{activePlan.targetFats || '—'}g</div>
              <div className="macro-label fats">Fats</div>
            </div>
          </div>

          <div className="grid-2">
            {['breakfast', 'lunch', 'dinner', 'snacks'].map(mealType => (
              <div className="meal-section" key={mealType}>
                <div className="meal-section-title">
                  {mealIcons[mealType]}
                  {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                  <button className="btn-icon" style={{ marginLeft: 'auto', fontSize: '0.9rem' }} onClick={() => setShowAddMeal(mealType)} title="Add item">
                    <Plus size={14} />
                  </button>
                </div>
                {(activePlan.meals?.[mealType] || []).length > 0 ? (
                  activePlan.meals[mealType].map((item, i) => (
                    <div className="meal-item" key={i}>
                      <div>
                        <div className="meal-item-name">{item.name}</div>
                        <div className="meal-item-meta">
                          {item.quantity} · P:{item.protein || 0}g · C:{item.carbs || 0}g · F:{item.fats || 0}g
                        </div>
                      </div>
                      <div className="meal-item-cals">{item.calories} cal</div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', padding: '8px 0' }}>No items yet</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {!activePlan && (
        <div className="glass-card" style={{ padding: 40, textAlign: 'center' }}>
          <Sparkles size={48} style={{ color: 'var(--cyan-400)', margin: '0 auto 12px' }} />
          <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>No active diet plan. Generate one with AI!</p>
          <button className="btn-primary" style={{ width: 'auto', padding: '12px 32px', display: 'inline-flex', alignItems: 'center', gap: 8 }} onClick={handleGenerate} disabled={generating}>
            <BrainCircuit size={16} />
            {generating ? 'Generating...' : 'Generate AI Diet Plan'}
          </button>
        </div>
      )}

      {plans.length > 1 && (
        <div style={{ marginTop: 28 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>All Plans</h3>
          {plans.map(p => (
            <div key={p._id} className="glass-card" style={{ padding: 16, marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontWeight: 600 }}>{p.name}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: 8 }}>{p.targetCalories} cal/day</span>
                {p.isActive && <span style={{ fontSize: '0.65rem', color: 'var(--green-400)', marginLeft: 8, textTransform: 'uppercase', fontWeight: 700 }}>Active</span>}
                {p.isAIGenerated && <span style={{ fontSize: '0.65rem', color: 'var(--purple-400)', marginLeft: 8 }}>AI</span>}
              </div>
              <button className="btn-danger" style={{ display: 'flex', alignItems: 'center', gap: 4 }} onClick={() => handleDelete(p._id)}>
                <Trash2 size={12} /> Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {showAddMeal && (
        <div className="modal-overlay" onClick={() => setShowAddMeal(null)}>
          <div className="glass-card modal-content" onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--cyan-400)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Plus size={18} /> Add to {showAddMeal.charAt(0).toUpperCase() + showAddMeal.slice(1)}
            </h2>
            <form onSubmit={handleAddMeal}>
              <div className="form-group">
                <label className="input-label">Food Name</label>
                <input className="input-field" required value={mealForm.name} onChange={e => setMealForm({...mealForm, name: e.target.value})} placeholder="e.g. Grilled Chicken" />
              </div>
              <div className="form-row">
                <div className="form-group"><label className="input-label">Calories</label><input className="input-field" type="number" required value={mealForm.calories} onChange={e => setMealForm({...mealForm, calories: e.target.value})} /></div>
                <div className="form-group"><label className="input-label">Quantity</label><input className="input-field" value={mealForm.quantity} onChange={e => setMealForm({...mealForm, quantity: e.target.value})} /></div>
              </div>
              <div className="form-row" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
                <div className="form-group"><label className="input-label">Protein (g)</label><input className="input-field" type="number" value={mealForm.protein} onChange={e => setMealForm({...mealForm, protein: e.target.value})} /></div>
                <div className="form-group"><label className="input-label">Carbs (g)</label><input className="input-field" type="number" value={mealForm.carbs} onChange={e => setMealForm({...mealForm, carbs: e.target.value})} /></div>
                <div className="form-group"><label className="input-label">Fats (g)</label><input className="input-field" type="number" value={mealForm.fats} onChange={e => setMealForm({...mealForm, fats: e.target.value})} /></div>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                <button className="btn-primary" type="submit">Add Item</button>
                <button className="btn-secondary" type="button" onClick={() => setShowAddMeal(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
    </div>
  );
}
