import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { AILoadingSpinner } from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Zap, TrendingUp } from 'lucide-react';

const levelMap = { none: 0, beginner: 25, intermediate: 50, advanced: 75, expert: 100 };
const priorityColor = { critical: 'var(--color-danger)', high: 'var(--color-warning)', medium: 'var(--color-info)', low: 'var(--color-success)' };
const priorityBadge = { critical: 'badge-danger', high: 'badge-warning', medium: 'badge-info', low: 'badge-success' };

export default function SkillsPage() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [targetRole, setTargetRole] = useState('');

  useEffect(() => {
    api.get('/skills').then(res => {
      setAnalysis(res.data.analysis);
      if (res.data.analysis?.targetRole) setTargetRole(res.data.analysis.targetRole);
    }).catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const runAnalysis = async () => {
    setRunning(true);
    try {
      const res = await api.post('/skills/analyze', { targetRole });
      setAnalysis(res.data.analysis);
      toast.success('Skill gap analysis complete!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Analysis failed. Please add skills to your profile first.');
    } finally {
      setRunning(false);
    }
  };

  const chartData = (analysis?.skillGaps || []).slice(0, 8).map(g => ({
    name: g.skill,
    current: levelMap[g.currentLevel] || 0,
    required: levelMap[g.requiredLevel] || 50,
    priority: g.priority,
  }));

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Skill Gap Analysis</h1>
        <p>Identify exactly which skills you need to develop for your target role.</p>
      </div>

      {/* Run analysis */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label className="form-label">Target Role (optional override)</label>
            <input
              value={targetRole}
              onChange={e => setTargetRole(e.target.value)}
              placeholder="e.g. Full Stack Developer"
            />
            <p className="form-hint">Leave empty to use the role from your profile.</p>
          </div>
          <button className="btn btn-primary" onClick={runAnalysis} disabled={running} style={{ flexShrink: 0 }}>
            {running ? <><span className="spinner-sm" /> Analyzing...</> : <><Zap size={16} /> Run AI Analysis</>}
          </button>
        </div>
      </div>

      {running && <AILoadingSpinner message="Analyzing your skill gaps with AI..." />}

      {loading && <div style={{ textAlign: 'center', padding: '48px', color: 'var(--color-text2)' }}>Loading...</div>}

      {analysis && !running && !loading && (
        <>
          {/* Overview */}
          <div className="grid-3" style={{ marginBottom: '24px' }}>
            <div className="card" style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '12px', color: 'var(--color-text3)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Overall Gap Score</p>
              <div style={{ fontSize: '40px', fontWeight: '800', color: analysis.overallGapScore > 50 ? 'var(--color-danger)' : 'var(--color-warning)' }}>
                {analysis.overallGapScore || 0}
              </div>
              <p style={{ fontSize: '12px', color: 'var(--color-text3)' }}>Lower is better</p>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '12px', color: 'var(--color-text3)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Missing Skills</p>
              <div style={{ fontSize: '40px', fontWeight: '800', color: 'var(--color-danger)' }}>
                {(analysis.missingSkills || []).length}
              </div>
              <p style={{ fontSize: '12px', color: 'var(--color-text3)' }}>skills to develop</p>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '12px', color: 'var(--color-text3)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Skills You Have</p>
              <div style={{ fontSize: '40px', fontWeight: '800', color: 'var(--color-success)' }}>
                {(analysis.currentSkills || []).length}
              </div>
              <p style={{ fontSize: '12px', color: 'var(--color-text3)' }}>out of {(analysis.requiredSkills || []).length} required</p>
            </div>
          </div>

          {/* Chart */}
          {chartData.length > 0 && (
            <div className="card" style={{ marginBottom: '24px' }}>
              <h2 className="section-title">Skill Level Comparison</h2>
              <p className="section-subtitle">Current vs Required skill levels for {analysis.targetRole}</p>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={chartData} margin={{ top: 0, right: 20, left: 0, bottom: 60 }}>
                  <XAxis dataKey="name" tick={{ fill: 'var(--color-text3)', fontSize: 11 }} angle={-30} textAnchor="end" />
                  <YAxis tick={{ fill: 'var(--color-text3)', fontSize: 11 }} domain={[0, 100]} tickFormatter={v => `${v}%`} />
                  <Tooltip
                    contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px' }}
                    labelStyle={{ color: 'var(--color-heading)' }}
                    formatter={(v, n) => [`${v}%`, n === 'current' ? 'Current Level' : 'Required Level']}
                  />
                  <Bar dataKey="current" name="current" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="required" name="required" fill="var(--color-border2)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Skill gaps table */}
          <div className="card" style={{ marginBottom: '24px' }}>
            <h2 className="section-title">Detailed Skill Gap Report</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                    {['Skill', 'Current Level', 'Required Level', 'Gap', 'Priority'].map(h => (
                      <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: 'var(--color-text3)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(analysis.skillGaps || []).map((g, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--color-border)', transition: 'background var(--transition)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--color-surface2)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '10px 12px', fontWeight: '600', color: 'var(--color-heading)' }}>{g.skill}</td>
                      <td style={{ padding: '10px 12px' }}>
                        <span className={`badge ${g.currentLevel === 'none' ? 'badge-neutral' : 'badge-info'}`}>
                          {g.currentLevel || 'none'}
                        </span>
                      </td>
                      <td style={{ padding: '10px 12px' }}>
                        <span className="badge badge-primary">{g.requiredLevel}</span>
                      </td>
                      <td style={{ padding: '10px 12px' }}>
                        <span className={`badge ${g.gap === 'high' ? 'badge-danger' : g.gap === 'medium' ? 'badge-warning' : 'badge-success'}`}>
                          {g.gap}
                        </span>
                      </td>
                      <td style={{ padding: '10px 12px' }}>
                        <span className={`badge ${priorityBadge[g.priority] || 'badge-neutral'}`}>{g.priority}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid-2">
            {/* Missing skills */}
            <div className="card">
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--color-danger)', marginBottom: '12px' }}>Skills to Learn</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {(analysis.missingSkills || []).map((s, i) => <span key={i} className="badge badge-danger">{s}</span>)}
              </div>
            </div>

            {/* Recommendations */}
            <div className="card">
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--color-heading)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <TrendingUp size={16} /> Recommendations
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {(analysis.recommendations || []).map((r, i) => (
                  <div key={i} style={{ fontSize: '13px', color: 'var(--color-text)', padding: '8px 12px', background: 'var(--color-surface2)', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--color-primary)' }}>
                    {r}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {!analysis && !running && !loading && (
        <div className="empty-state">
          <div className="empty-state-icon">🎯</div>
          <h3>No Analysis Yet</h3>
          <p>Add your technical skills in your profile and click "Run AI Analysis" to identify your skill gaps.</p>
          <button className="btn btn-primary" onClick={runAnalysis}>
            <Zap size={16} /> Run Analysis Now
          </button>
        </div>
      )}
    </div>
  );
}
