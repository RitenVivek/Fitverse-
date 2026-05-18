import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Zap, Activity, BrainCircuit, BarChart3, UtensilsCrossed,
  Dumbbell, Shield, ArrowRight, ChevronRight, Sparkles,
  Flame, Droplets, Scale, Target
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  const features = [
    { icon: Activity, title: 'Smart Dashboard', desc: 'Track calories, steps, water, sleep & weight in real-time with live synced data from MongoDB.', color: 'var(--cyan-400)' },
    { icon: BrainCircuit, title: 'AI-Powered Insights', desc: 'Get personalized fitness insights powered by Python + scikit-learn machine learning models.', color: 'var(--purple-400)' },
    { icon: UtensilsCrossed, title: 'Diet Planner', desc: 'AI-generated meal plans with macro breakdowns tailored to your goals — weight loss, gain, or maintenance.', color: 'var(--green-400)' },
    { icon: BarChart3, title: 'Progress Analytics', desc: 'Interactive Chart.js visualizations for calories, weight trends, steps, and hydration over time.', color: 'var(--blue-400)' },
    { icon: Dumbbell, title: 'Workout Logger', desc: 'Log exercises with sets, reps, duration & calories burned. Categorized by cardio, strength & more.', color: 'var(--yellow-400)' },
    { icon: Shield, title: 'Secure & Private', desc: 'JWT authentication, bcrypt password hashing, and validated APIs keep your fitness data safe.', color: 'var(--red-400)' },
  ];

  const stats = [
    { icon: Flame, value: 'Calorie', label: 'Tracking' },
    { icon: Scale, value: 'Weight', label: 'Prediction' },
    { icon: Target, value: 'Goal', label: 'Planning' },
    { icon: Sparkles, value: 'AI', label: 'Insights' },
  ];

  return (
    <div style={{ position: 'relative', zIndex: 1, overflowX: 'hidden' }}>

      {/* Navbar */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '20px 40px', maxWidth: 1200, margin: '0 auto',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          fontSize: '1.5rem', fontWeight: 800,
          background: 'linear-gradient(135deg, var(--cyan-400), var(--blue-400))',
          WebkitBackgroundClip: 'text', backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          <Zap size={24} style={{ color: 'var(--cyan-400)' }} />
          FitVerse
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn-secondary" onClick={() => navigate('/login')}
            style={{ width: 'auto', padding: '10px 24px' }}>
            Login
          </button>
          <button className="btn-primary" onClick={() => navigate('/login')}
            style={{ width: 'auto', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: 6 }}>
            Get Started <ArrowRight size={16} />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        textAlign: 'center', padding: '80px 24px 60px',
        maxWidth: 800, margin: '0 auto',
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '6px 16px', borderRadius: 20,
          background: 'rgba(6, 182, 212, 0.1)',
          border: '1px solid rgba(6, 182, 212, 0.25)',
          fontSize: '0.75rem', fontWeight: 600,
          color: 'var(--cyan-400)', textTransform: 'uppercase',
          letterSpacing: '0.08em', marginBottom: 24,
        }}>
          <BrainCircuit size={14} />
          AI-Powered Fitness Platform
        </div>

        <h1 style={{
          fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900,
          lineHeight: 1.15, marginBottom: 20,
          background: 'linear-gradient(135deg, #ffffff, var(--cyan-400), var(--blue-400))',
          WebkitBackgroundClip: 'text', backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Your Fitness Journey,<br />Supercharged by AI
        </h1>

        <p style={{
          fontSize: '1.1rem', color: 'var(--text-secondary)',
          maxWidth: 560, margin: '0 auto 36px', lineHeight: 1.7,
        }}>
          Track workouts, plan diets, monitor progress, and get personalized ML-powered
          insights — all in one futuristic command center.
        </p>

        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn-primary" onClick={() => navigate('/login')}
            style={{
              width: 'auto', padding: '14px 36px', fontSize: '0.95rem',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
            Start Your Journey <ChevronRight size={18} />
          </button>
        </div>

        {/* Quick Stats Row */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: 32,
          marginTop: 56, flexWrap: 'wrap',
        }}>
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} style={{ textAlign: 'center' }}>
                <Icon size={28} style={{ color: 'var(--cyan-400)', marginBottom: 8 }} />
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: 700 }}>{s.value}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Features Grid */}
      <section style={{
        padding: '60px 24px 80px',
        maxWidth: 1100, margin: '0 auto',
      }}>
        <h2 style={{
          textAlign: 'center', fontSize: '1.8rem', fontWeight: 800,
          marginBottom: 12,
          background: 'linear-gradient(135deg, var(--cyan-400), var(--blue-400))',
          WebkitBackgroundClip: 'text', backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Everything You Need
        </h2>
        <p style={{
          textAlign: 'center', color: 'var(--text-muted)',
          fontSize: '0.95rem', marginBottom: 48, maxWidth: 500, margin: '0 auto 48px',
        }}>
          A complete MERN stack fitness ecosystem with real ML integration
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 20,
        }}>
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="glass-card" style={{
                padding: 28, cursor: 'default',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <Icon size={28} style={{ color: f.color, marginBottom: 14 }} />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {f.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Tech Stack Banner */}
      <section style={{
        padding: '48px 24px',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        <div style={{
          maxWidth: 900, margin: '0 auto',
          display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap',
          alignItems: 'center',
        }}>
          {['React + Vite', 'Node.js + Express', 'MongoDB + Mongoose', 'Python + scikit-learn', 'JWT + bcrypt', 'Chart.js'].map((tech, i) => (
            <span key={i} style={{
              fontSize: '0.8rem', color: 'var(--text-muted)',
              fontWeight: 600, letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}>
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        textAlign: 'center', padding: '80px 24px',
        maxWidth: 600, margin: '0 auto',
      }}>
        <Sparkles size={36} style={{ color: 'var(--cyan-400)', marginBottom: 16 }} />
        <h2 style={{
          fontSize: '1.6rem', fontWeight: 800, marginBottom: 12,
          color: 'var(--text-primary)',
        }}>
          Ready to Transform Your Fitness?
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 28, fontSize: '0.95rem' }}>
          Join FitVerse and let AI guide your fitness journey to success.
        </p>
        <button className="btn-primary" onClick={() => navigate('/login')}
          style={{
            width: 'auto', padding: '14px 40px', fontSize: '0.95rem',
            display: 'inline-flex', alignItems: 'center', gap: 8,
          }}>
          Create Free Account <ArrowRight size={16} />
        </button>
      </section>

      {/* Footer */}
      <footer style={{
        textAlign: 'center', padding: '24px',
        borderTop: '1px solid var(--border-subtle)',
        fontSize: '0.75rem', color: 'var(--text-muted)',
      }}>
        Built with MERN + Python ML — FitVerse © 2024
      </footer>
    </div>
  );
}
