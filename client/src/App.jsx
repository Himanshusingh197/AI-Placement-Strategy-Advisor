import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import ResumePage from './pages/ResumePage';
import SkillsPage from './pages/SkillsPage';
import CareerPage from './pages/CareerPage';
import RoadmapPage from './pages/RoadmapPage';
import ProjectsPage from './pages/ProjectsPage';
import InterviewPage from './pages/InterviewPage';
import MockInterviewPage from './pages/MockInterviewPage';
import NotFoundPage from './pages/NotFoundPage';

// Layout
import DashboardLayout from './components/layout/DashboardLayout';

const AppLoader = () => (
  <div className="loading-screen">
    <div style={{
      width: '52px', height: '52px',
      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      borderRadius: '14px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 4px 24px rgba(99,102,241,0.45)',
      fontSize: '26px',
    }}>🧠</div>
    <div className="spinner" />
    <p style={{ fontSize: '13px', color: 'var(--color-text3)', fontWeight: '500' }}>AI Placement Advisor</p>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <AppLoader />;
  return user ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <AppLoader />;
  return user ? <Navigate to="/dashboard" replace /> : children;
};

function AppRoutes() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1a1a2e',
            color: '#e2e8f0',
            border: '1px solid #252538',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
          },
          success: {
            iconTheme: { primary: '#10b981', secondary: '#1a1a2e' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#1a1a2e' },
          },
        }}
      />
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login"    element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

        {/* Protected dashboard */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index                element={<DashboardPage />} />
          <Route path="profile"       element={<ProfilePage />} />
          <Route path="resume"        element={<ResumePage />} />
          <Route path="skills"        element={<SkillsPage />} />
          <Route path="career"        element={<CareerPage />} />
          <Route path="roadmap"       element={<RoadmapPage />} />
          <Route path="projects"      element={<ProjectsPage />} />
          <Route path="interview"     element={<InterviewPage />} />
          <Route path="interview/mock" element={<MockInterviewPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
