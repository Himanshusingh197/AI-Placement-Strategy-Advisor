import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Brain, Target, Zap, Shield,
  ArrowRight, ChevronRight,
  MessageSquare, BarChart2, BookOpen, Award
} from 'lucide-react';
import './LandingPage.css';

const FEATURES = [
  { icon: '📄', title: 'AI Resume Analyzer', desc: 'Get your resume scored 0–100 by AI. Identify formatting, content, and relevance gaps with specific recommendations.' },
  { icon: '🎯', title: 'Skill Gap Detection', desc: 'Know exactly which skills you need for your target role — with priority levels and current vs required comparison.' },
  { icon: '🗺️', title: 'Learning Roadmap',  desc: 'Receive a personalized multi-phase learning plan with curated resources for each topic you need to master.' },
  { icon: '💼', title: 'Career Matching',    desc: 'Discover career paths that align with your profile — with match %, salary ranges, and growth prospects.' },
  { icon: '🤖', title: 'AI Mock Interviews', desc: 'Answer role-specific questions and get instant per-answer feedback with scores, corrections, and ideal answer hints.' },
  { icon: '🏆', title: 'Placement Dashboard', desc: 'Track your overall readiness score across all dimensions and see your next recommended action at a glance.' },
];

const STEPS = [
  { num: '01', title: 'Create Your Profile',    desc: 'Enter your academic details, skills, and career goals.' },
  { num: '02', title: 'Upload Your Resume',      desc: 'Let AI analyze your resume for strengths and gaps.' },
  { num: '03', title: 'Get AI Insights',         desc: 'Receive personalized skill gap analysis and career recommendations.' },
  { num: '04', title: 'Follow Your Roadmap',     desc: 'Learn the right skills in the right order with curated resources.' },
  { num: '05', title: 'Practice Interviews',     desc: 'Take mock interviews and track your placement readiness score.' },
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="landing">

      {/* ─── Navbar ─────────────────────────────────── */}
      <nav className="landing-nav" style={{ boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.4)' : 'none' }}>
        <div className="landing-nav-inner">
          <Link to="/" className="landing-logo">
            <div className="landing-logo-icon"><Brain size={20} /></div>
            <span>AI Placement Advisor</span>
          </Link>
          <div className="landing-nav-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
          </div>
          <div className="landing-nav-cta">
            <Link to="/login"    className="btn btn-secondary btn-sm">Sign In</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Get Started Free</Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero ────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            <Zap size={13} />
            <span>Powered by Google Gemini AI</span>
          </div>
          <h1 className="hero-title">
            Your AI‑Powered<br />
            <span className="gradient-text">Placement Strategist</span>
          </h1>
          <p className="hero-subtitle">
            Get personalized career guidance, identify skill gaps, generate learning roadmaps,
            and ace your interviews — all driven by advanced AI tailored to your profile.
          </p>
          <div className="hero-cta">
            <Link to="/register" className="btn btn-primary btn-lg">
              Get Started Free <ArrowRight size={17} />
            </Link>
            <Link to="/login" className="btn btn-outline btn-lg">
              Sign In
            </Link>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-num">AI</span>
              <span>Resume Analysis</span>
            </div>
            <div className="hero-stat-sep" />
            <div className="hero-stat">
              <span className="hero-stat-num">6+</span>
              <span>Smart Features</span>
            </div>
            <div className="hero-stat-sep" />
            <div className="hero-stat">
              <span className="hero-stat-num">100%</span>
              <span>Personalized</span>
            </div>
          </div>
        </div>

        {/* Dashboard preview card */}
        <div className="hero-visual">
          <div className="hero-card hero-card-main">
            <div className="hero-card-header">
              <div className="hero-card-dot green" />
              <span>Placement Readiness</span>
            </div>
            <div className="hero-readiness">
              <div className="hero-readiness-score">76%</div>
              <div className="hero-readiness-label">Overall Score</div>
            </div>
            <div className="hero-scores">
              {[['Resume', 82], ['Technical', 74], ['Roadmap', 80], ['Interview', 71]].map(([k, v]) => (
                <div key={k} className="hero-score-row">
                  <span>{k}</span>
                  <div className="progress-bar" style={{ flex: 1, height: '6px' }}>
                    <div className="progress-fill" style={{ width: `${v}%` }} />
                  </div>
                  <span>{v}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-card hero-card-sm hero-card-top">
            <Target size={17} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
            <div>
              <p style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--color-heading)' }}>Top Career Match</p>
              <p style={{ fontSize: '12px', color: 'var(--color-text2)' }}>Full Stack Developer — 87%</p>
            </div>
          </div>

          <div className="hero-card hero-card-sm hero-card-bottom">
            <Zap size={17} style={{ color: 'var(--color-warning)', flexShrink: 0 }} />
            <div>
              <p style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--color-heading)' }}>Next Action</p>
              <p style={{ fontSize: '12px', color: 'var(--color-text2)' }}>Learn System Design</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features ────────────────────────────────── */}
      <section id="features" className="landing-section">
        <div className="landing-section-inner">
          <div className="section-label">Features</div>
          <h2 className="landing-section-title">Everything you need to crack placements</h2>
          <p className="landing-section-subtitle">
            A complete AI‑powered platform that guides you from profile analysis to placement readiness.
          </p>
          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <div key={i} className="feature-card card card-glow">
                <span className="feature-icon">{f.icon}</span>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How it works ─────────────────────────────── */}
      <section id="how-it-works" className="landing-section landing-section-alt">
        <div className="landing-section-inner">
          <div className="section-label">How It Works</div>
          <h2 className="landing-section-title">Your placement journey in 5 steps</h2>
          <p className="landing-section-subtitle">
            From zero to placement-ready — follow the structured AI-guided workflow.
          </p>
          <div className="steps-list">
            {STEPS.map((s, i) => (
              <div key={i} className="step-item">
                <div className="step-num">{s.num}</div>
                <div className="step-content">
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
                {i < STEPS.length - 1 && <ChevronRight size={18} className="step-arrow" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Mini feature highlights ──────────────────── */}
      <section className="landing-section">
        <div className="landing-section-inner">
          <div className="section-label">Why Choose Us</div>
          <h2 className="landing-section-title">Built for serious placement preparation</h2>
          <div className="grid-4" style={{ marginTop: '48px', textAlign: 'left' }}>
            {[
              { icon: <MessageSquare size={22} />, title: 'Real AI Feedback',   desc: 'Every answer, every resume — evaluated by Gemini AI with specific, actionable feedback.' },
              { icon: <BarChart2 size={22} />,     title: 'Live Progress',       desc: 'Track your readiness score across 5 dimensions and see exactly what to improve.' },
              { icon: <BookOpen size={22} />,      title: 'Curated Resources',   desc: 'Each roadmap item comes with handpicked videos, docs, and courses to learn efficiently.' },
              { icon: <Award size={22} />,         title: 'Cert Guidance',       desc: 'Get AI-recommended certifications that boost your profile for your specific target role.' },
            ].map((item, i) => (
              <div key={i} className="card card-glow" style={{ padding: '24px' }}>
                <div style={{
                  width: '42px', height: '42px', borderRadius: 'var(--radius-md)',
                  background: 'var(--color-primary-glow)',
                  border: '1px solid rgba(99,102,241,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--color-primary-light)',
                  marginBottom: '16px',
                }}>
                  {item.icon}
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--color-heading)', marginBottom: '8px' }}>{item.title}</h3>
                <p style={{ fontSize: '13.5px', color: 'var(--color-text2)', lineHeight: '1.7' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────── */}
      <section className="landing-cta">
        <div className="landing-cta-inner">
          <h2>Ready to start your placement journey?</h2>
          <p>Create your free account and let AI guide you to placement success.</p>
          <Link to="/register" className="btn btn-primary btn-lg">
            Create Free Account <ArrowRight size={17} />
          </Link>
          <p className="cta-disclaimer">
            <Shield size={13} /> No credit card required · AI recommendations are for guidance only
          </p>
        </div>
      </section>

      {/* ─── Footer ───────────────────────────────────── */}
      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div className="landing-logo" style={{ justifyContent: 'center', marginBottom: '12px' }}>
            <div className="landing-logo-icon"><Brain size={15} /></div>
            <span>AI Placement Advisor</span>
          </div>
          <p className="footer-note">
            AI recommendations are provided for guidance only and do not guarantee job placement.
            Accuracy depends on the information provided by the student.
          </p>
          <p className="footer-copy">© 2024 AI Placement Advisor · Minor Project · Chandigarh University</p>
        </div>
      </footer>
    </div>
  );
}
