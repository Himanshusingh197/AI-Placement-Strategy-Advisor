import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, User, FileText, BarChart2, Compass,
  Map, FolderOpen, MessageSquare, Award, LogOut, Brain, X
} from 'lucide-react';
import './Sidebar.css';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/dashboard/profile', icon: User, label: 'My Profile' },
  { to: '/dashboard/resume', icon: FileText, label: 'Resume Analyzer' },
  { to: '/dashboard/skills', icon: BarChart2, label: 'Skill Gap Analysis' },
  { to: '/dashboard/career', icon: Compass, label: 'Career Paths' },
  { to: '/dashboard/roadmap', icon: Map, label: 'Learning Roadmap' },
  { to: '/dashboard/projects', icon: FolderOpen, label: 'Projects & Certs' },
  { to: '/dashboard/interview', icon: MessageSquare, label: 'Interview Prep' },
];

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <Brain size={20} />
          </div>
          <span className="sidebar-logo-text">AI Advisor</span>
        </div>
        <button className="sidebar-close" onClick={onClose}>
          <X size={18} />
        </button>
      </div>

      <div className="sidebar-user">
        <div className="sidebar-avatar">
          {user?.fullName?.charAt(0).toUpperCase()}
        </div>
        <div className="sidebar-user-info">
          <p className="sidebar-user-name">{user?.fullName}</p>
          <p className="sidebar-user-college">{user?.college}</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        <p className="sidebar-nav-label">Navigation</p>
        {navItems.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-logout" onClick={handleLogout}>
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
