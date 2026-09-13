import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { AILoadingSpinner } from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import {
  Zap, ChevronDown, ChevronUp, CheckCircle, Circle,
  Clock, ExternalLink, BookOpen, Video, Globe, ArrowRight, Target
} from 'lucide-react';

const PRIORITY_COLOR = {
  critical: 'var(--color-danger)',
  high: 'var(--color-warning)',
  medium: 'var(--color-primary-light)',
  low: 'var(--color-text3)',
};

const PRIORITY_BADGE = {
  critical: 'badge-danger',
  high: 'badge-warning',
  medium: 'badge-primary',
  low: 'badge-neutral',
};

const RESOURCE_ICON = {
  video: <Video size={13} />,
  book: <BookOpen size={13} />,
  course: <BookOpen size={13} />,
  article: <Globe size={13} />,
  docs: <Globe size={13} />,
};

export default function RoadmapPage() {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [summary, setSummary] = useState('');
  const [expandedPhases, setExpandedPhases] = useState({});

  useEffect(() => {
    api.get('/roadmap')
      .then(res => {
        if (res.data.roadmap) {
          setRoadmap(res.data.roadmap);
          // Expand first incomplete phase by default
          const firstIncomplete = res.data.roadmap.phases?.findIndex(p => !p.completed);
          if (firstIncomplete !== -1) {
            setExpandedPhases({ [firstIncomplete]: true });
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const generate = async () => {
    setGenerating(true);
    try {
      const res = await api.post('/roadmap/generate');
      setRoadmap(res.data.roadmap);
      setSummary(res.data.summary || '');
      // Expand first phase on fresh generation
      setExpandedPhases({ 0: true });
      toast.success('Learning roadmap generated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed. Please complete your profile first.');
    } finally {
      setGenerating(false);
    }
  };

  const toggleItem = async (phaseIndex, itemIndex, current) => {
    // Optimistic update
    const updated = JSON.parse(JSON.stringify(roadmap));
    updated.phases[phaseIndex].items[itemIndex].completed = !current;
    // Recalculate progress optimistically
    let total = 0, done = 0;
    updated.phases.forEach(p => p.items.forEach(it => { total++; if (it.completed) done++; }));
    updated.totalProgress = total > 0 ? Math.round((done / total) * 100) : 0;
    updated.phases[phaseIndex].completed = updated.phases[phaseIndex].items.every(it => it.completed);
    setRoadmap(updated);

    try {
      const res = await api.put('/roadmap/progress', {
        phaseIndex,
        itemIndex,
        completed: !current
      });
      setRoadmap(res.data.roadmap);
    } catch {
      toast.error('Failed to save progress');
      // Revert
      setRoadmap(roadmap);
    }
  };

  const togglePhase = (i) => {
    setExpandedPhases(prev => ({ ...prev, [i]: !prev[i] }));
  };

  const progressColor = (pct) => {
    if (pct >= 75) return 'var(--color-success)';
    if (pct >= 40) return 'var(--color-warning)';
    return 'var(--color-primary)';
  };

  if (loading) return (
    <div className="page-container">
      <div style={{ textAlign: 'center', padding: '48px', color: 'var(--color-text2)' }}>Loading...</div>
    </div>
  );

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <h1>Learning Roadmap</h1>
        <p>Your personalized, step-by-step plan to reach your career goal.</p>
      </div>

      {/* Top bar */}
      <div className="card" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          {roadmap ? (
            <>
              <p style={{ fontSize: '15px', fontWeight: '700', color: 'var(--color-heading)', marginBottom: '4px' }}>
                <Target size={15} style={{ display: 'inline', marginRight: '6px', color: 'var(--color-primary-light)' }} />
                Target: {roadmap.targetRole}
              </p>
              <p style={{ fontSize: '13px', color: 'var(--color-text3)' }}>
                {roadmap.phases?.length} phases · Generated {new Date(roadmap.generatedAt).toLocaleDateString()}
              </p>
            </>
          ) : (
            <p style={{ fontSize: '14px', color: 'var(--color-text2)' }}>
              Generate a personalized roadmap based on your profile and skill gaps.
            </p>
          )}
        </div>
        <button className="btn btn-primary" onClick={generate} disabled={generating}>
          {generating
            ? <><span className="spinner-sm" /> Generating...</>
            : <><Zap size={16} /> {roadmap ? 'Regenerate' : 'Generate Roadmap'}</>}
        </button>
      </div>

      {generating && <AILoadingSpinner message="AI is building your personalized learning roadmap..." />}

      {/* Summary */}
      {summary && !generating && (
        <div className="alert alert-info" style={{ marginBottom: '24px' }}>
          <Zap size={16} style={{ flexShrink: 0 }} />
          <p>{summary}</p>
        </div>
      )}

      {/* Progress bar */}
      {roadmap && !generating && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text2)' }}>Overall Progress</span>
            <span style={{ fontSize: '22px', fontWeight: '800', color: progressColor(roadmap.totalProgress) }}>
              {roadmap.totalProgress}%
            </span>
          </div>
          <div className="progress-bar" style={{ height: '10px' }}>
            <div
              className="progress-fill"
              style={{
                width: `${roadmap.totalProgress}%`,
                background: `linear-gradient(90deg, ${progressColor(roadmap.totalProgress)}, ${progressColor(roadmap.totalProgress)}99)`
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: '20px', marginTop: '12px', flexWrap: 'wrap' }}>
            {roadmap.phases?.map((phase, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                {phase.completed
                  ? <CheckCircle size={14} style={{ color: 'var(--color-success)' }} />
                  : <Circle size={14} style={{ color: 'var(--color-text3)' }} />}
                <span style={{ color: phase.completed ? 'var(--color-success)' : 'var(--color-text2)' }}>
                  Phase {phase.phaseNumber}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Phases */}
      {roadmap?.phases?.length > 0 && !generating && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {roadmap.phases.map((phase, phaseIdx) => {
            const isExpanded = !!expandedPhases[phaseIdx];
            const phaseCompleted = phase.items.every(it => it.completed);
            const phaseProgress = phase.items.length > 0
              ? Math.round((phase.items.filter(it => it.completed).length / phase.items.length) * 100)
              : 0;

            return (
              <div key={phaseIdx} className="card" style={{
                borderColor: phaseCompleted
                  ? 'rgba(16,185,129,0.3)'
                  : isExpanded ? 'rgba(99,102,241,0.4)' : 'var(--color-border)'
              }}>
                {/* Phase header */}
                <button
                  onClick={() => togglePhase(phaseIdx)}
                  style={{
                    width: '100%', background: 'none', border: 'none', padding: '0',
                    cursor: 'pointer', textAlign: 'left'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: phaseCompleted ? 'rgba(16,185,129,0.15)' : 'var(--color-primary-glow)',
                      border: `2px solid ${phaseCompleted ? 'rgba(16,185,129,0.4)' : 'rgba(99,102,241,0.4)'}`,
                      fontSize: '14px', fontWeight: '800',
                      color: phaseCompleted ? 'var(--color-success)' : 'var(--color-primary-light)',
                    }}>
                      {phaseCompleted ? <CheckCircle size={18} /> : phase.phaseNumber}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--color-heading)' }}>
                          {phase.phaseName}
                        </h3>
                        {phaseCompleted && <span className="badge badge-success">Completed</span>}
                        {!phaseCompleted && phaseProgress > 0 && (
                          <span className="badge badge-primary">{phaseProgress}%</span>
                        )}
                        {phase.duration && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--color-text3)' }}>
                            <Clock size={12} /> {phase.duration}
                          </span>
                        )}
                      </div>
                      {phase.description && (
                        <p style={{ fontSize: '13px', color: 'var(--color-text2)', marginTop: '3px' }}>
                          {phase.description}
                        </p>
                      )}
                    </div>
                    <div style={{ color: 'var(--color-text3)', flexShrink: 0 }}>
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </div>

                  {/* Phase mini progress */}
                  {!isExpanded && phase.items.length > 0 && (
                    <div className="progress-bar" style={{ marginTop: '12px', height: '4px' }}>
                      <div
                        className="progress-fill"
                        style={{
                          width: `${phaseProgress}%`,
                          background: phaseCompleted ? 'var(--color-success)' : undefined
                        }}
                      />
                    </div>
                  )}
                </button>

                {/* Phase items */}
                {isExpanded && (
                  <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {phase.items.map((item, itemIdx) => (
                      <div
                        key={itemIdx}
                        style={{
                          background: item.completed ? 'rgba(16,185,129,0.05)' : 'var(--color-surface2)',
                          border: `1px solid ${item.completed ? 'rgba(16,185,129,0.2)' : 'var(--color-border)'}`,
                          borderRadius: 'var(--radius-md)',
                          padding: '14px 16px',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                          <button
                            onClick={() => toggleItem(phaseIdx, itemIdx, item.completed)}
                            style={{
                              background: 'none', border: 'none', padding: '0',
                              cursor: 'pointer', flexShrink: 0, marginTop: '2px',
                              color: item.completed ? 'var(--color-success)' : 'var(--color-text3)',
                              transition: 'color 0.2s'
                            }}
                            title={item.completed ? 'Mark incomplete' : 'Mark complete'}
                          >
                            {item.completed ? <CheckCircle size={20} /> : <Circle size={20} />}
                          </button>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                              <span style={{
                                fontSize: '14px', fontWeight: '600',
                                color: item.completed ? 'var(--color-text3)' : 'var(--color-heading)',
                                textDecoration: item.completed ? 'line-through' : 'none',
                              }}>
                                {item.topic}
                              </span>
                              {item.priority && (
                                <span
                                  className={`badge ${PRIORITY_BADGE[item.priority] || 'badge-neutral'}`}
                                  style={{ fontSize: '11px' }}
                                >
                                  {item.priority}
                                </span>
                              )}
                              {item.estimatedTime && (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11px', color: 'var(--color-text3)' }}>
                                  <Clock size={11} /> {item.estimatedTime}
                                </span>
                              )}
                            </div>
                            {item.description && (
                              <p style={{ fontSize: '13px', color: 'var(--color-text2)', lineHeight: '1.6', marginBottom: '8px' }}>
                                {item.description}
                              </p>
                            )}
                            {item.resources?.length > 0 && (
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {item.resources.map((res, ri) => (
                                  res.url ? (
                                    <a
                                      key={ri}
                                      href={res.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '5px',
                                        fontSize: '12px', color: 'var(--color-primary-light)',
                                        background: 'var(--color-primary-glow)',
                                        border: '1px solid rgba(99,102,241,0.2)',
                                        borderRadius: 'var(--radius-full)',
                                        padding: '3px 10px',
                                        transition: 'all 0.2s',
                                      }}
                                    >
                                      {RESOURCE_ICON[res.type?.toLowerCase()] || <Globe size={13} />}
                                      {res.title}
                                      <ExternalLink size={11} />
                                    </a>
                                  ) : (
                                    <span key={ri} style={{
                                      display: 'inline-flex', alignItems: 'center', gap: '5px',
                                      fontSize: '12px', color: 'var(--color-text2)',
                                      background: 'var(--color-surface)',
                                      border: '1px solid var(--color-border)',
                                      borderRadius: 'var(--radius-full)',
                                      padding: '3px 10px',
                                    }}>
                                      {RESOURCE_ICON[res.type?.toLowerCase()] || <Globe size={13} />}
                                      {res.title}
                                    </span>
                                  )
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {!roadmap && !generating && !loading && (
        <div className="empty-state">
          <div className="empty-state-icon">🗺️</div>
          <h3>No Roadmap Yet</h3>
          <p>
            Complete your{' '}
            <Link to="/dashboard/profile" style={{ color: 'var(--color-primary-light)' }}>profile</Link>{' '}
            and run a{' '}
            <Link to="/dashboard/skills" style={{ color: 'var(--color-primary-light)' }}>skill analysis</Link>{' '}
            first, then generate your personalized roadmap.
          </p>
          <button className="btn btn-primary" onClick={generate}>
            <Zap size={16} /> Generate Roadmap
          </button>
        </div>
      )}
    </div>
  );
}
