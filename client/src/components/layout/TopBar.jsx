import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Menu, Bell, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './TopBar.css';

const routeNames = {
  '/dashboard': 'Dashboard',
  '/dashboard/profile': 'My Profile',
  '/dashboard/resume': 'Resume Analyzer',
  '/dashboard/skills': 'Skill Gap Analysis',
  '/dashboard/career': 'Career Paths',
  '/dashboard/roadmap': 'Learning Roadmap',
  '/dashboard/projects': 'Projects & Certifications',
  '/dashboard/interview': 'Interview Preparation',
  '/dashboard/interview/mock': 'Mock Interview',
};

export default function TopBar({ onMenuClick }) {
  const location = useLocation();
  const { user } = useAuth();
  const currentPage = routeNames[location.pathname] || 'Dashboard';

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="topbar-menu-btn" onClick={onMenuClick} aria-label="Open menu">
          <Menu size={20} />
        </button>
        <div className="topbar-breadcrumb">
          <Link to="/dashboard" className="topbar-breadcrumb-home">Dashboard</Link>
          {location.pathname !== '/dashboard' && (
            <>
              <ChevronRight size={14} className="topbar-breadcrumb-sep" />
              <span className="topbar-breadcrumb-current">{currentPage}</span>
            </>
          )}
        </div>
      </div>
      <div className="topbar-right">
        <div className="topbar-user">
          <div className="topbar-avatar">
            {user?.fullName?.charAt(0).toUpperCase()}
          </div>
          <div className="hide-mobile">
            <p className="topbar-user-name">{user?.fullName}</p>
            <p className="topbar-user-degree">{user?.degree} · {user?.graduationYear}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
