import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { AILoadingSpinner } from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { Zap, TrendingUp, CheckCircle, XCircle, DollarSign } from 'lucide-react';

const MatchBar = ({ pct }) => {
  const color = pct >= 75 ? 'var(--color-success)' : pct >= 60 ? 'var(--color-warning)' : 'var(--color-danger)';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div className="progress-bar" style={{ flex: 1 }}>
        <div className="progress-fill" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}, ${color}99)` }} />
      </div>
      <span style={{ fontSize: '16px', fontWeight: '800', color, minWidth: '42px' }}>{pct}%</span>
    </div>
  );
};

export default function CareerPage() {
  const [recommendation, setRecommendation] = useState(null);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    api.get('/career/recommendations').then(res => {
      setRecommendation(res.data.recommendation);
    }).catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const generate = async () => {
    setRunning(true);
    try {
      const res = await api.post('/career/recommend');
      setRecommendation(res.data.recommendation);
      setSummary(res.data.summary || '');
      toast.success('Career recommendations generated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed. Please complete your profile first.');
    } finally {
      setRunning(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '48px', color: 'var(--color-text2)' }}>Loading...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Career Path Recommendations</h1>
        <p>Discover the career paths that best match your skills, interests, and profile.</p>
      </div>

      <div className="card" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <p style={{ fontSize: '14px', color: 'var(--color-text2)' }}>
            {recommendation ? `Showing ${recommendation.careerPaths?.length || 0} personalized career recommendations` : 'Run AI analysis to discover your best career matches'}
          </p>
          {recommendation?.generatedAt && (
            <p style={{ fontSize: '12px', color: 'var(--color-text3)', marginTop: '4px' }}>
              Last updated: {new Date(recommendation.generatedAt).toLocaleDateString()}
            </p>
          )}
        </div>
        <button className="btn btn-primary" onClick={generate} disabled={running}>
          {running ? <><span className="spinner-sm" /> Generating...</> : <><Zap size={16} /> {recommendation ? 'Regenerate' : 'Generate Recommendations'}</>}
        </button>
      </div>

      {running && <AILoadingSpinner message="AI is analyzing your career matches..." />}

      {summary && !running && (
        <div className="alert alert-info" style={{ marginBottom: '24px' }}>
          <Zap size={16} style={{ flexShrink: 0 }} />
          <p>{summary}</p>
        </div>
      )}

      {recommendation?.careerPaths?.length > 0 && !running && (
        <>
          {recommendation.topRecommendation && (
            <div className="alert alert-success" style={{ marginBottom: '24px' }}>
              <TrendingUp size={16} style={{ flexShrink: 0 }} />
              <p>Top recommendation for you: <strong>{recommendation.topRecommendation}</strong></p>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {recommendation.careerPaths.map((path, i) => (
              <div key={i} className="card">
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', marginBottom: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--color-heading)' }}>{path.role}</h3>
                      {i === 0 && recommendation.topRecommendation === path.role && (
                        <span className="badge badge-success">Best Match</span>
                      )}
                    </div>
                    <p style={{ fontSize: '14px', color: 'var(--color-text2)', marginBottom: '12px' }}>{path.description}</p>
                    <div style={{ maxWidth: '300px' }}>
                      <MatchBar pct={path.matchPercentage} />
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    {path.averageSalary && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-success)', fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>
                        <DollarSign size={14} />
                        {path.averageSalary}
                      </div>
                    )}
                    {path.growthProspect && (
                      <span className={`badge ${path.growthProspect === 'High' ? 'badge-success' : path.growthProspect === 'Medium' ? 'badge-warning' : 'badge-neutral'}`}>
                        {path.growthProspect} Growth
                      </span>
                    )}
                  </div>
                </div>

                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setExpanded(expanded === i ? null : i)}
                >
                  {expanded === i ? 'Show Less' : 'View Details'}
                </button>

                {expanded === i && (
                  <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                    <div>
                      <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text3)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>
                        Current Strengths
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {(path.currentStrengths || []).map((s, j) => (
                          <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--color-text)' }}>
                            <CheckCircle size={13} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
                            {s}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text3)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>
                        Skills to Learn
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {(path.missingSkills || []).map((s, j) => (
                          <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--color-text)' }}>
                            <XCircle size={13} style={{ color: 'var(--color-danger)', flexShrink: 0 }} />
                            {s}
                          </div>
                        ))}
                      </div>
                    </div>
                    {path.recommendedPath?.length > 0 && (
                      <div>
                        <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text3)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>
                          Recommended Steps
                        </p>
                        <ol style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingLeft: '16px' }}>
                          {path.recommendedPath.map((step, j) => (
                            <li key={j} style={{ fontSize: '13px', color: 'var(--color-text2)' }}>{step}</li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {!recommendation && !running && !loading && (
        <div className="empty-state">
          <div className="empty-state-icon">💼</div>
          <h3>No Recommendations Yet</h3>
          <p>Complete your profile with skills and career goals, then click "Generate Recommendations".</p>
          <button className="btn btn-primary" onClick={generate}>
            <Zap size={16} /> Generate Now
          </button>
        </div>
      )}
    </div>
  );
}
