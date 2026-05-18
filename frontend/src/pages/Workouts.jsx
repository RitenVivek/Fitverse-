import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Dumbbell, Plus, X, Clock, Flame, Tag, Trash2
} from 'lucide-react';

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({ title: '', exercises: [{ name: '', category: 'strength', duration: '', caloriesBurned: '', sets: '', reps: '', weight: '' }] });

  useEffect(() => { loadWorkouts(); }, []);

  const loadWorkouts = async () => {
    setLoading(true);
    try {
      const res = await api.getWorkouts();
      setWorkouts(res.workouts || []);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const addExercise = () => {
    setForm({ ...form, exercises: [...form.exercises, { name: '', category: 'strength', duration: '', caloriesBurned: '', sets: '', reps: '', weight: '' }] });
  };

  const updateExercise = (idx, field, val) => {
    const exs = [...form.exercises];
    exs[idx] = { ...exs[idx], [field]: val };
    setForm({ ...form, exercises: exs });
  };

  const removeExercise = (idx) => {
    if (form.exercises.length <= 1) return;
    setForm({ ...form, exercises: form.exercises.filter((_, i) => i !== idx) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const exercises = form.exercises.filter(ex => ex.name && ex.duration).map(ex => ({
        name: ex.name, category: ex.category, duration: +ex.duration,
        caloriesBurned: +ex.caloriesBurned || 0, sets: +ex.sets || 0,
        reps: +ex.reps || 0, weight: +ex.weight || 0,
      }));
      if (exercises.length === 0) { showToast('Add at least one exercise', 'error'); setSaving(false); return; }
      await api.logWorkout({ title: form.title || 'Workout Session', exercises });
      showToast('Workout logged!');
      setShowModal(false);
      setForm({ title: '', exercises: [{ name: '', category: 'strength', duration: '', caloriesBurned: '', sets: '', reps: '', weight: '' }] });
      loadWorkouts();
    } catch (err) { showToast(err.message, 'error'); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    try { await api.deleteWorkout(id); showToast('Workout deleted'); loadWorkouts(); } catch (err) { showToast(err.message, 'error'); }
  };

  const categoryColors = { cardio: 'var(--red-400)', strength: 'var(--cyan-400)', flexibility: 'var(--green-400)', sports: 'var(--yellow-400)', other: 'var(--purple-400)' };

  if (loading) return <div><div className="spinner"></div><p className="loading-text">Loading Workouts...</p></div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Workout Log</h1>
          <p className="page-subtitle">Track your training sessions</p>
        </div>
        <button className="btn-primary" style={{ width: 'auto', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: 8 }} onClick={() => setShowModal(true)}>
          <Plus size={16} /> Log Workout
        </button>
      </div>

      {workouts.length === 0 ? (
        <div className="glass-card" style={{ padding: 40, textAlign: 'center' }}>
          <Dumbbell size={48} style={{ color: 'var(--cyan-400)', margin: '0 auto 12px' }} />
          <p style={{ color: 'var(--text-secondary)' }}>No workouts logged yet. Start training!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {workouts.map(w => (
            <div key={w._id} className="glass-card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Dumbbell size={18} style={{ color: 'var(--cyan-400)' }} />
                  <span style={{ fontWeight: 700, fontSize: '1rem' }}>{w.title}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(w.date).toLocaleDateString()}</span>
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--cyan-400)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={13} /> {w.totalDuration} min
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--red-400)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Flame size={13} /> {w.totalCaloriesBurned} cal
                  </span>
                  <button className="btn-icon" onClick={() => handleDelete(w._id)} title="Delete">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {w.exercises?.map((ex, i) => (
                  <span key={i} style={{
                    padding: '4px 10px', borderRadius: 6, fontSize: '0.75rem',
                    background: 'rgba(255,255,255,0.05)', border: `1px solid ${categoryColors[ex.category] || 'var(--border-subtle)'}`,
                    color: categoryColors[ex.category] || 'var(--text-secondary)',
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                  }}>
                    <Tag size={10} />
                    {ex.name} · {ex.duration}min{ex.sets ? ` · ${ex.sets}×${ex.reps}` : ''}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="glass-card modal-content" style={{ maxWidth: 600 }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--cyan-400)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Dumbbell size={18} /> Log Workout
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="input-label">Session Title</label>
                <input className="input-field" placeholder="e.g. Morning Push Day" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
              </div>
              {form.exercises.map((ex, idx) => (
                <div key={idx} style={{ padding: 12, background: 'rgba(255,255,255,0.02)', borderRadius: 8, marginBottom: 10, border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Exercise {idx + 1}</span>
                    {form.exercises.length > 1 && (
                      <button type="button" className="btn-icon" style={{ width: 24, height: 24 }} onClick={() => removeExercise(idx)}>
                        <X size={12} />
                      </button>
                    )}
                  </div>
                  <div className="form-row">
                    <div className="form-group"><label className="input-label">Name</label><input className="input-field" required placeholder="e.g. Bench Press" value={ex.name} onChange={e => updateExercise(idx, 'name', e.target.value)} /></div>
                    <div className="form-group"><label className="input-label">Category</label>
                      <select className="input-field" value={ex.category} onChange={e => updateExercise(idx, 'category', e.target.value)}>
                        <option value="strength">Strength</option><option value="cardio">Cardio</option>
                        <option value="flexibility">Flexibility</option><option value="sports">Sports</option><option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-row" style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr' }}>
                    <div className="form-group"><label className="input-label">Duration (min)</label><input className="input-field" type="number" required value={ex.duration} onChange={e => updateExercise(idx, 'duration', e.target.value)} /></div>
                    <div className="form-group"><label className="input-label">Cal Burned</label><input className="input-field" type="number" value={ex.caloriesBurned} onChange={e => updateExercise(idx, 'caloriesBurned', e.target.value)} /></div>
                    <div className="form-group"><label className="input-label">Sets</label><input className="input-field" type="number" value={ex.sets} onChange={e => updateExercise(idx, 'sets', e.target.value)} /></div>
                    <div className="form-group"><label className="input-label">Reps</label><input className="input-field" type="number" value={ex.reps} onChange={e => updateExercise(idx, 'reps', e.target.value)} /></div>
                  </div>
                </div>
              ))}
              <button type="button" className="btn-secondary" style={{ width: '100%', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }} onClick={addExercise}>
                <Plus size={14} /> Add Exercise
              </button>
              <div style={{ display: 'flex', gap: 12 }}>
                <button className="btn-primary" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Workout'}</button>
                <button className="btn-secondary" type="button" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
    </div>
  );
}
