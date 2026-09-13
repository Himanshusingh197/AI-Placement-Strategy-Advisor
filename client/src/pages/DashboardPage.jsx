import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ScoreCard from '../components/common/ScoreCard';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';
import { ArrowRight, Zap, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';
import './DashboardPage.css';

const QUICK_ACTIONS = [
  { to: '/dashboard/resume',    icon: '📄', title: 'Resume Analyzer',    desc: 'Upload & analyze your resume with AI',      key: 'hasResume'       },
  { to: '/dashboard/skills',    icon: '🎯', title: 'Skill Gap Analysis',  desc: 'Identify skills needed for your target role', key: 'hasSkillAnalysis' },
  { to: '/dashboard/career',    icon: '💼', title: 'Career Paths',        desc: 'Discover career paths that match your profile', key: 'hasCareerRec'  },
  { to: '/dashboard/roadmap',   icon: '🗺️', title: 'Learning Roadmap',    desc: 'Get your personalized step-by-step plan',    key: 'hasRoadmap'      },
  { to: '/dashboard/projects',  icon: '🏗️', title: 'Project Ideas',       desc: 'AI-recommended portfolio projects & certs',  key: null              },
  { to: '/dashboard/interview', icon: '🤖', title: 'Mock Interview',       desc: 'Practice with AI interviewer — get scored',  key: null              },
];

const getReadinessColor = (score) => {
  if (score >= 75) return 'var(--color-success)';
  if (score >= 50) return 'var(--color-warning)';
  return 'var(--color-danger)';
};

const getReadinessMsg = (score) => {
  if (score >= 75) return 'Great progress! Keep it up.';
  if (score >= 50) return 'Good start. Keep learning.';
  return 'Just getting started — stay consistent!';
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard')
      .then(res => setData(res.data.dashboard))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner message="Loading your dashboard…" />;

  const d = data || {};
  const scores = d.scores || {};
  const readiness = d.overallReadiness || 0;
  const readinessColor = getReadinessColor(readiness);

  const radarData = [
    { subject: 'Resume',    value: scores.resume    || 0 },
    { subject: 'Technical', value: scores.technical || 0 },
    { subject: 'Roadmap',   value: scores.roadmap   || 0 },
    { subject: 'Interview', value: scores.interview || 0 },
    { subject: 'Profile',   value: scores.profile   || 0 },
  ];

  return (
    <div className="page-container">

      {/* Header */}
      <div className="page-header">
        <h1>Welcome back, {user?.fullName?.split(' ')[0]} 👋</h1>
        <p>Here's your placement readiness overview.</p>
      </div>

      {/* Top row — readiness + next action */}
      <div className="dashboard-top-row">

        {/* Readiness card */}
        <div className="card dashboard-readiness-card">
          <div className="dashboard-readiness-content">
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '11px', fontWeight: '800', color: 'var(--color-text3)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '4px' }}>
                Overall Placement Readiness
              </p>
              <div className="dashboard-readiness-score" style={{ color: readinessColor }}>
                {readiness}%
              </div>
              <div className="progress-bar" style={{ marginTop: '12px', marginBottom: '8px', height: '8px' }}>
                <div className="progress-fill" style={{
                  width: `${readiness}%`,
                  background: `linear-gradient(90deg, ${readinessColor}, ${readinessColor}99)`
                }} />
              </div>
              <p style={{ fontSize: '13px', color: 'var(--color-text3)' }}>{getReadinessMsg(readiness)}</p>
            </div>
            <div className="dashboard-radar">
              <ResponsiveContainer width={190} height={190}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="var(--color-border)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--color-text3)', fontSize: 11, fontWeight: 600 }} />
                  <Radar name="Score" dataKey="value" stroke="var(--color-primary)" fill="var(--color-primary)" fillOpacity={0.18} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Next action card */}
        {d.nextAction ? (
          <div className="card dashboard-next-action" style={{
            borderColor: d.nextAction.priority === 'high' ? 'rgba(239,68,68,0.3)' : 'rgba(99,102,241,0.25)',
            background: d.nextAction.priority === 'high'
              ? 'rgba(239,68,68,0.03)'
              : 'linear-gradient(135deg, rgba(99,102,241,0.04), rgba(139,92,246,0.04))',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: 'var(--radius-md)', flexShrink: 0,
                background: d.nextAction.priority === 'high' ? 'rgba(239,68,68,0.12)' : 'var(--color-primary-glow)',
                border: `1px solid ${d.nextAction.priority === 'high' ? 'rgba(239,68,68,0.25)' : 'rgba(99,102,241,0.25)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: d.nextAction.priority === 'high' ? 'var(--color-danger)' : 'var(--color-primary-light)',
              }}>
                {d.nextAction.priority === 'high' ? <AlertCircle size={17} /> : <Zap size={17} />}
              </div>
              <div>
                <p style={{ fontSize: '10px', color: 'var(--color-text3)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '800', marginBottom: '2px' }}>
                  Recommended Next Step
                </p>
                <p style={{ fontSize: '15px', fontWeight: '800', color: 'var(--color-heading)', lineHeight: 1.2 }}>
                  {d.nextAction.action}
                </p>
              </div>
            </div>
            <p style={{ fontSize: '13.5px', color: 'var(--color-text2)', lineHeight: '1.7', marginBottom: '18px' }}>
              {d.nextAction.description}
            </p>
            <Link to={d.nextAction.link} className="btn btn-primary btn-sm">
              Take Action <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="card dashboard-next-action" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>🎯</div>
            <p style={{ fontSize: '15px', fontWeight: '700', color: 'var(--color-heading)', marginBottom: '6px' }}>Complete Your Profile</p>
            <p style={{ fontSize: '13px', color: 'var(--color-text2)', marginBottom: '16px' }}>Fill in your profile to get personalized recommendations.</p>
            <Link to="/dashboard/profile" className="btn btn-primary btn-sm">
              <TrendingUp size={14} /> Go to Profile
            </Link>
          </div>
        )}
      </div>

      {/* Score cards */}
      <div className="grid-4" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <ScoreCard title="Resume Score"    score={scores.resume}    icon="📄" color="auto" />
        <ScoreCard title="Technical Skills" score={scores.technical} icon="💻" color="auto" />
        <ScoreCard title="Roadmap Progress" score={scores.roadmap}   icon="🗺️" color="auto" />
        <ScoreCard title="Interview Score"  score={scores.interview} icon="🎤" color="auto" />
      </div>

      {/* Quick actions */}
      <div style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h2 className="section-title">Quick Actions</h2>
        <div className="grid-3">
          {QUICK_ACTIONS.map((item, i) => {
            const done = item.key ? !!d[item.key] : false;
            return (
              <Link key={i} to={item.to} className="card card-glow dashboard-quick-link" style={{ textDecoration: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                  <span style={{ fontSize: '30px', lineHeight: 1 }}>{item.icon}</span>
                  {done && <CheckCircle size={16} style={{ color: 'var(--color-success)', flexShrink: 0, marginTop: '2px' }} />}
                </div>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--color-heading)', margin: '12px 0 4px' }}>{item.title}</h3>
                <p style={{ fontSize: '13px', color: 'var(--color-text2)', lineHeight: '1.6', flex: 1 }}>{item.desc}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '14px', fontSize: '13px', color: 'var(--color-primary-light)', fontWeight: '700' }}>
                  {done ? 'View Results' : 'Get Started'} <ArrowRight size={13} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Top skill gaps */}
      {d.topSkillGaps?.length > 0 && (
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
            <h2 className="section-title" style={{ marginBottom: 0 }}>Top Skill Gaps</h2>
            <Link to="/dashboard/skills" className="btn btn-outline btn-sm">
              Full Analysis <ArrowRight size={13} />
            </Link>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {d.topSkillGaps.map((gap, i) => (
              <span key={i} className="badge badge-danger">{gap}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
