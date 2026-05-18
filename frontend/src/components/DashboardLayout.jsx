import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, UtensilsCrossed, Dumbbell, TrendingUp,
  BrainCircuit, UserCircle, LogOut, Menu, X, Zap
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/diet', icon: UtensilsCrossed, label: 'Diet Planner' },
  { path: '/workouts', icon: Dumbbell, label: 'Workouts' },
  { path: '/progress', icon: TrendingUp, label: 'Progress' },
  { path: '/insights', icon: BrainCircuit, label: 'AI Insights' },
  { path: '/profile', icon: UserCircle, label: 'Profile' },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      <button className="mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <Zap size={22} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
          FitVerse
        </div>
        <nav className="sidebar-nav">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                onClick={() => { navigate(item.path); setSidebarOpen(false); }}
              >
                <span className="nav-icon"><Icon size={18} /></span>
                {item.label}
              </button>
            );
          })}
        </nav>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px', marginTop: '16px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px', paddingLeft: '16px' }}>
            {user?.name || 'User'}
          </div>
          <button
            className="nav-item"
            onClick={logout}
            style={{ color: 'var(--red-400)' }}
          >
            <span className="nav-icon"><LogOut size={18} /></span>
            Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
