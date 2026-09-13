import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import {
  Play, Clock, CheckCircle, TrendingUp,
  MessageSquare, ArrowRight, X, Award, BarChart2, Zap
} from 'lucide-react';

const STATUS_BADGE = {
  completed: 'badge-success',
  'in-progress': 'badge-warning',
  abandoned: 'badge-danger',
};

const INTERVIEW_TYPES = [
  { value: 'mock', label: 'Mock Interview', desc: '8 questions · general practice', icon: '🎤' },
  { value: 'technical', label: 'Technical Interview', desc: '10 questions · in-depth technical', icon: '💻' },
];

const SCORE_COLOR = (s) => {
  if (s >= 75) return 'var(--color-success)';
  if (s >= 50) return 'var(--color-warning)';
  return 'var(--color-danger)';
};

/* ── Past Interview Detail Modal ─────────────────── */
function InterviewDetailModal({ interviewId, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/interview/${interviewId}`)
      .then(res => setData(res.data.interview))
      .catch(() => toast.error('Failed to load interview'))
      .finally(() => setLoading(false));
  }, [interviewId]);

  if (loading) return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ textAlign: 'center', padding: '48px' }}>
        <div className="spinner" style={{ margin: '0 auto' }} />
        <p style={{ marginTop: '16px', color: 'var(--color-text2)' }}>Loading results…</p>
      </div>
    </div>
  );

  if (!data) return null;

  const s = data.scores || {};
  const overall = s.overall || 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: '640px' }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--color-heading)', marginBottom: '4px' }}>
              {data.role} — Interview Results
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--color-text3)' }}>
              {new Date(data.completedAt || data.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              {' · '}{data.type} · {data.questions?.length || 0} questions
            </p>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-icon">
            <X size={18} />
          </button>
        </div>

        {/* Overall score */}
        {data.scores && (
          <div style={{ textAlign: 'center', padding: '20px', background: 'var(--color-surface2)', borderRadius: 'var(--radius-lg)', marginBottom: '20px' }}>
            <p style={{ fontSize: '11px', fontWeight: '800', color: 'var(--color-text3)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '6px' }}>Overall Score</p>
            <div style={{ fontSize: '56px', fontWeight: '900', color: SCORE_COLOR(overall), lineHeight: 1 }}>{overall}%</div>
            <p style={{ fontSize: '13px', color: 'var(--color-text2)', marginTop: '6px' }}>
              {overall >= 75 ? '🌟 Excellent performance!' : overall >= 50 ? '👍 Good effort.' : '💪 Keep practicing.'}
            </p>
          </div>
        )}

        {/* Score grid */}
        {data.scores && (
          <div className="grid-4" style={{ marginBottom: '20px' }}>
            {[
              { label: 'Relevance', key: 'relevance' },
              { label: 'Technical', key: 'technicalAccuracy' },
              { label: 'Communication', key: 'communication' },
              { label: 'Completeness', key: 'completeness' },
            ].map((item) => (
              <div key={item.key} style={{ textAlign: 'center', background: 'var(--color-surface2)', borderRadius: 'var(--radius-md)', padding: '12px 8px' }}>
                <div style={{ fontSize: '22px', fontWeight: '800', color: SCORE_COLOR((s[item.key] || 0) * 10) }}>{s[item.key] || 0}</div>
                <div style={{ fontSize: '11px', color: 'var(--color-text3)', marginTop: '3px' }}>{item.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* AI feedback */}
        {data.feedback && (
          <div style={{ marginBottom: '20px' }}>
            {data.feedback.summary && (
              <div className="alert alert-info" style={{ marginBottom: '12px' }}>
                <TrendingUp size={15} style={{ flexShrink: 0, marginTop: '1px' }} />
                <p style={{ fontSize: '13px' }}>{data.feedback.summary}</p>
              </div>
            )}
            <div className="grid-2">
              {data.feedback.strengths?.length > 0 && (
                <div>
                  <p style={{ fontSize: '11px', fontWeight: '800', color: 'var(--color-text3)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>✅ Strengths</p>
                  {data.feedback.strengths.map((s, i) => (
                    <p key={i} style={{ fontSize: '13px', color: 'var(--color-text2)', marginBottom: '5px', paddingLeft: '8px', borderLeft: '2px solid var(--color-success)' }}>{s}</p>
                  ))}
                </div>
              )}
              {data.feedback.improvements?.length > 0 && (
                <div>
                  <p style={{ fontSize: '11px', fontWeight: '800', color: 'var(--color-text3)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>🔧 Improvements</p>
                  {data.feedback.improvements.map((s, i) => (
                    <p key={i} style={{ fontSize: '13px', color: 'var(--color-text2)', marginBottom: '5px', paddingLeft: '8px', borderLeft: '2px solid var(--color-warning)' }}>{s}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Answer review */}
        {data.answers?.length > 0 && (
          <div>
            <p style={{ fontSize: '12px', fontWeight: '800', color: 'var(--color-text3)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>Answer Review</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '240px', overflowY: 'auto', paddingRight: '4px' }}>
              {data.answers.map((ans, i) => (
                <div key={i} style={{ background: 'var(--color-surface2)', borderRadius: 'var(--radius-md)', padding: '10px 12px', border: '1px solid var(--color-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-heading)' }}>Q{i + 1}. {ans.question}</span>
                    <span style={{ fontSize: '13px', fontWeight: '800', color: SCORE_COLOR((ans.score || 0) * 10), flexShrink: 0, marginLeft: '8px' }}>{ans.score}/10</span>
                  </div>
                  {ans.feedback && <p style={{ fontSize: '12px', color: 'var(--color-text3)' }}>{ans.feedback}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ───────────────────────────────────── */
export default function InterviewPage() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showStart, setShowStart] = useState(false);
  const [role, setRole] = useState('');
  const [type, setType] = useState('mock');
  const [starting, setStarting] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);

  useEffect(() => {
    api.get('/interview/history')
      .then(res => setHistory(res.data.interviews || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const startInterview = async () => {
    if (!role.trim()) {
      toast.error('Please enter the role you want to practice for.');
      return;
    }
    setStarting(true);
    try {
      const res = await api.post('/interview/start', { role: role.trim(), type });
      navigate('/dashboard/interview/mock', {
        state: {
          interviewId: res.data.interviewId,
          questions: res.data.questions,
          role: role.trim(),
          type,
        }
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to start interview. Please try again.');
      setStarting(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading interview history..." />;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Interview Preparation</h1>
        <p>Practice with an AI interviewer and get instant detailed feedback on every answer.</p>
      </div>

      {/* Start interview card */}
      <div className="card" style={{
        marginBottom: '28px',
        background: 'linear-gradient(135deg, rgba(99,102,241,0.06), rgba(139,92,246,0.06))',
        borderColor: 'rgba(99,102,241,0.25)',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '18px', flexWrap: 'wrap' }}>
          <div style={{
            width: '52px', height: '52px', flexShrink: 0,
            background: 'var(--color-primary-glow)',
            border: '1px solid rgba(99,102,241,0.3)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '24px'
          }}>🤖</div>
          <div style={{ flex: 1, minWidth: '240px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--color-heading)', marginBottom: '6px' }}>
              Start a New Interview
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--color-text2)', marginBottom: '22px', lineHeight: '1.6' }}>
              The AI will ask role-specific questions, evaluate your answers in real time, and give you a full performance report at the end.
            </p>

            {!showStart ? (
              <button className="btn btn-primary" onClick={() => setShowStart(true)}>
                <Play size={16} /> Start Interview
              </button>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '500px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Target Role</label>
                  <input
                    type="text"
                    placeholder="e.g. Frontend Developer, Data Analyst, Java Developer"
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !starting && startInterview()}
                    autoFocus
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Interview Type</label>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {INTERVIEW_TYPES.map(t => (
                      <button
                        key={t.value}
                        onClick={() => setType(t.value)}
                        style={{
                          flex: 1, minWidth: '160px',
                          padding: '12px 14px',
                          borderRadius: 'var(--radius-md)',
                          border: `2px solid ${type === t.value ? 'var(--color-primary)' : 'var(--color-border)'}`,
                          background: type === t.value ? 'var(--color-primary-glow)' : 'var(--color-surface2)',
                          cursor: 'pointer', textAlign: 'left',
                          transition: 'all 0.2s',
                        }}
                      >
                        <div style={{ fontSize: '20px', marginBottom: '6px' }}>{t.icon}</div>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-heading)', marginBottom: '2px' }}>{t.label}</div>
                        <div style={{ fontSize: '12px', color: 'var(--color-text2)' }}>{t.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="btn btn-primary" onClick={startInterview} disabled={starting || !role.trim()}>
                    {starting ? <><span className="spinner-sm" /> Preparing questions…</> : <><Play size={15} /> Start Interview</>}
                  </button>
                  <button className="btn btn-secondary" onClick={() => { setShowStart(false); setRole(''); }}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="card" style={{ marginBottom: '28px' }}>
        <h2 className="section-title" style={{ fontSize: '17px', marginBottom: '18px' }}>How It Works</h2>
        <div className="grid-3">
          {[
            { icon: <MessageSquare size={18} />, title: 'Answer Questions', desc: 'The AI asks role-specific questions based on your target position.' },
            { icon: <BarChart2 size={18} />, title: 'Get Instant Feedback', desc: 'Each answer is scored on relevance, accuracy, and completeness.' },
            { icon: <Award size={18} />, title: 'Full Report', desc: 'Receive a detailed scorecard with AI feedback and improvement tips.' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{
                width: '34px', height: '34px', flexShrink: 0,
                background: 'var(--color-primary-glow)',
                border: '1px solid rgba(99,102,241,0.2)',
                borderRadius: 'var(--radius-md)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--color-primary-light)',
              }}>{item.icon}</div>
              <div>
                <p style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-heading)', marginBottom: '3px' }}>{item.title}</p>
                <p style={{ fontSize: '13px', color: 'var(--color-text2)', lineHeight: '1.6' }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interview history */}
      <div>
        <h2 className="section-title" style={{ marginBottom: '14px' }}>
          Past Interviews {history.length > 0 && <span className="badge badge-neutral" style={{ fontSize: '12px', marginLeft: '8px' }}>{history.length}</span>}
        </h2>
        {history.length === 0 ? (
          <div className="empty-state" style={{ padding: '36px' }}>
            <div className="empty-state-icon">🎤</div>
            <h3>No interviews yet</h3>
            <p>Start your first mock interview above to track your progress over time.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {history.map((iv, i) => (
              <div
                key={i}
                className="card card-clickable"
                onClick={() => iv.status === 'completed' ? setSelectedInterview(iv._id) : null}
                style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', cursor: iv.status === 'completed' ? 'pointer' : 'default' }}
              >
                <div style={{
                  width: '42px', height: '42px', flexShrink: 0,
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--color-surface2)',
                  border: '1px solid var(--color-border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '20px'
                }}>
                  {iv.type === 'technical' ? '💻' : '🎤'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '3px' }}>
                    <span style={{ fontSize: '15px', fontWeight: '700', color: 'var(--color-heading)' }}>{iv.role}</span>
                    <span className={`badge ${STATUS_BADGE[iv.status] || 'badge-neutral'}`}>{iv.status}</span>
                    <span className="badge badge-neutral" style={{ textTransform: 'capitalize' }}>{iv.type}</span>
                  </div>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--color-text3)' }}>
                    <Clock size={12} /> {new Date(iv.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                {iv.scores?.overall !== undefined && (
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '24px', fontWeight: '900', color: SCORE_COLOR(iv.scores.overall) }}>{iv.scores.overall}%</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text3)' }}>Score</div>
                  </div>
                )}
                {iv.status === 'completed' && (
                  <ArrowRight size={16} style={{ color: 'var(--color-text3)', flexShrink: 0 }} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selectedInterview && (
        <InterviewDetailModal
          interviewId={selectedInterview}
          onClose={() => setSelectedInterview(null)}
        />
      )}
    </div>
  );
}
