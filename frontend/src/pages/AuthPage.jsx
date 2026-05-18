import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Zap } from 'lucide-react';

export default function AuthPage() {
  const { login, signup } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isLogin) {
        await login(form.email, form.password);
      } else {
        await signup(form.name, form.email, form.password);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="glass-card auth-card">
        <h1 className="auth-title">
          <Zap size={28} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }} />
          FitVerse
        </h1>
        <p className="auth-subtitle">
          {isLogin ? 'Access your fitness command center' : 'Initialize your fitness protocol'}
        </p>

        {error && (
          <div style={{
            padding: '10px 14px', marginBottom: '16px', borderRadius: '8px',
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
            color: 'var(--red-400)', fontSize: '0.8rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label className="input-label">Full Name</label>
              <input
                className="input-field" name="name" type="text"
                placeholder="John Doe" value={form.name}
                onChange={handleChange} required={!isLogin}
              />
            </div>
          )}
          <div className="form-group">
            <label className="input-label">Email</label>
            <input
              className="input-field" name="email" type="email"
              placeholder="user@fitverse.io" value={form.email}
              onChange={handleChange} required
            />
          </div>
          <div className="form-group">
            <label className="input-label">Password</label>
            <input
              className="input-field" name="password" type="password"
              placeholder="••••••••" value={form.password}
              onChange={handleChange} required minLength={6}
            />
          </div>
          <button className="btn-primary" type="submit" disabled={loading} style={{ marginTop: '8px' }}>
            {loading ? 'Processing...' : isLogin ? 'Initialize Login' : 'Create Account'}
          </button>
        </form>

        <div className="auth-toggle">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => { setIsLogin(!isLogin); setError(''); }}>
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
}
