import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  UserCircle, Activity, Scale, Ruler, Target, Mail,
  CalendarDays, CheckCircle2, AlertCircle, Save
} from 'lucide-react';

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({
    name: user?.name || '', age: user?.age || '', height: user?.height || '',
    weight: user?.weight || '', gender: user?.gender || 'male',
    activityLevel: user?.activityLevel || 'sedentary',
    goal: user?.goal || 'maintenance', targetWeight: user?.targetWeight || '',
  });

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {};
      Object.keys(form).forEach(k => { if (form[k] !== '' && form[k] !== undefined) data[k] = form[k]; });
      await api.updateProfile(data);
      await refreshUser();
      showToast('Profile updated!');
    } catch (err) { showToast(err.message, 'error'); }
    setSaving(false);
  };

  const bmi = user?.bmi; const bmr = user?.bmr; const tdee = user?.tdee;
  const bmiCategory = bmi ? (bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese') : '—';
  const bmiColor = bmi ? (bmi < 18.5 ? 'var(--yellow-400)' : bmi < 25 ? 'var(--green-400)' : bmi < 30 ? 'var(--yellow-400)' : 'var(--red-400)') : 'var(--text-muted)';

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Profile</h1>
          <p className="page-subtitle">Manage your biometrics & goals</p>
        </div>
      </div>

      <div className="grid-2">
        {/* Metrics Display */}
        <div>
          <div className="stats-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr', marginBottom: 20 }}>
            <div className="stat-card cyan">
              <div className="stat-card-icon"><Scale size={20} style={{ color: 'var(--cyan-400)' }} /></div>
              <div className="stat-card-label">BMI</div>
              <div className="stat-card-value">{bmi || '—'}</div>
              <div className="stat-card-change" style={{ color: bmiColor }}>{bmiCategory}</div>
            </div>
            <div className="stat-card blue">
              <div className="stat-card-icon"><Activity size={20} style={{ color: 'var(--blue-400)' }} /></div>
              <div className="stat-card-label">BMR</div>
              <div className="stat-card-value">{bmr || '—'}<span className="stat-card-unit">kcal</span></div>
            </div>
            <div className="stat-card green">
              <div className="stat-card-icon"><Target size={20} style={{ color: 'var(--green-400)' }} /></div>
              <div className="stat-card-label">TDEE</div>
              <div className="stat-card-value">{tdee || '—'}<span className="stat-card-unit">kcal</span></div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--cyan-400)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <UserCircle size={18} /> Account Info
            </h3>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 2 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Mail size={14} style={{ color: 'var(--text-muted)' }} />
                <strong>Email:</strong> {user?.email}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CalendarDays size={14} style={{ color: 'var(--text-muted)' }} />
                <strong>Joined:</strong> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {user?.profileCompleted
                  ? <CheckCircle2 size={14} style={{ color: 'var(--green-400)' }} />
                  : <AlertCircle size={14} style={{ color: 'var(--yellow-400)' }} />
                }
                <strong>Profile Status:</strong>{' '}
                <span style={{ color: user?.profileCompleted ? 'var(--green-400)' : 'var(--yellow-400)' }}>
                  {user?.profileCompleted ? 'Complete' : 'Incomplete'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--cyan-400)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Save size={18} /> Edit Profile
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="input-label">Name</label>
              <input className="input-field" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="input-label">Age</label>
                <input className="input-field" type="number" value={form.age} onChange={e => setForm({...form, age: e.target.value})} placeholder="Years" />
              </div>
              <div className="form-group">
                <label className="input-label">Gender</label>
                <select className="input-field" value={form.gender} onChange={e => setForm({...form, gender: e.target.value})}>
                  <option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="input-label">Height (cm)</label>
                <input className="input-field" type="number" value={form.height} onChange={e => setForm({...form, height: e.target.value})} placeholder="cm" />
              </div>
              <div className="form-group">
                <label className="input-label">Weight (kg)</label>
                <input className="input-field" type="number" step="0.1" value={form.weight} onChange={e => setForm({...form, weight: e.target.value})} placeholder="kg" />
              </div>
            </div>
            <div className="form-group">
              <label className="input-label">Activity Level</label>
              <select className="input-field" value={form.activityLevel} onChange={e => setForm({...form, activityLevel: e.target.value})}>
                <option value="sedentary">Sedentary (desk job)</option>
                <option value="light">Light (1-3x/week)</option>
                <option value="moderate">Moderate (3-5x/week)</option>
                <option value="active">Active (6-7x/week)</option>
                <option value="very_active">Very Active (athlete)</option>
              </select>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="input-label">Fitness Goal</label>
                <select className="input-field" value={form.goal} onChange={e => setForm({...form, goal: e.target.value})}>
                  <option value="weight_loss">Weight Loss</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="weight_gain">Muscle Gain</option>
                </select>
              </div>
              <div className="form-group">
                <label className="input-label">Target Weight (kg)</label>
                <input className="input-field" type="number" step="0.1" value={form.targetWeight} onChange={e => setForm({...form, targetWeight: e.target.value})} placeholder="kg" />
              </div>
            </div>
            <button className="btn-primary" type="submit" disabled={saving} style={{ marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <Save size={15} />
              {saving ? 'Saving...' : 'Update Profile'}
            </button>
          </form>
        </div>
      </div>

      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
    </div>
  );
}
