import React, { useEffect, useState, useRef } from 'react';
import api from '../services/api';
import { AILoadingSpinner } from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import {
  Upload, FileText, Zap, CheckCircle, XCircle,
  AlertTriangle, Star, RefreshCw, TrendingUp
} from 'lucide-react';

const getScoreColor = (s) => {
  if (s >= 75) return 'var(--color-success)';
  if (s >= 50) return 'var(--color-warning)';
  return 'var(--color-danger)';
};

const QualityBar = ({ label, value }) => {
  const pct = Math.min(10, Math.max(0, value || 0));
  const color = getScoreColor(pct * 10);
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
        <span style={{ fontSize: '13px', color: 'var(--color-text2)', fontWeight: '500', textTransform: 'capitalize' }}>{label}</span>
        <span style={{ fontSize: '13px', fontWeight: '800', color }}>{pct}/10</span>
      </div>
      <div className="progress-bar" style={{ height: '6px' }}>
        <div className="progress-fill" style={{ width: `${pct * 10}%`, background: `linear-gradient(90deg, ${color}, ${color}99)` }} />
      </div>
    </div>
  );
};

export default function ResumePage() {
  const [resume, setResume]     = useState(null);
  const [loading, setLoading]   = useState(true);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [dragOver, setDragOver]  = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    api.get('/resume')
      .then(res => setResume(res.data.resume))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  /* ── File validation & upload ──────────────── */
  const processFile = async (file) => {
    if (!file) return;
    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are accepted.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File must be under 5 MB.');
      return;
    }
    const formData = new FormData();
    formData.append('resume', file);
    setUploading(true);
    try {
      const res = await api.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResume(res.data.resume);
      toast.success('Resume uploaded successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleFileInput = (e) => processFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    processFile(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = () => setDragOver(false);

  /* ── Analyze ──────────────────────────────── */
  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const res = await api.post('/resume/analyze');
      setResume(prev => ({ ...prev, isAnalyzed: true, analysis: res.data.analysis }));
      toast.success('Resume analyzed successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Analysis failed. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const analysis = resume?.analysis;

  /* ── Render ────────────────────────────────── */
  if (loading) return (
    <div className="page-container">
      <div style={{ textAlign: 'center', padding: '64px', color: 'var(--color-text3)' }}>Loading…</div>
    </div>
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Resume Analyzer</h1>
        <p>Upload your PDF resume and get a detailed AI-powered analysis with actionable improvements.</p>
      </div>

      {/* ── Upload / file card ── */}
      <div className="card" style={{ marginBottom: '24px' }}>
        {!resume ? (
          /* Drop zone */
          <div
            onClick={() => !uploading && fileRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            style={{
              border: `2px dashed ${dragOver ? 'var(--color-primary)' : 'var(--color-border)'}`,
              borderRadius: 'var(--radius-lg)',
              padding: '56px 24px',
              textAlign: 'center',
              cursor: uploading ? 'not-allowed' : 'pointer',
              transition: 'border-color 0.2s, background 0.2s',
              background: dragOver ? 'var(--color-primary-glow)' : 'transparent',
            }}
          >
            <div style={{
              width: '60px', height: '60px', borderRadius: '50%',
              background: 'var(--color-primary-glow)',
              border: '1px solid rgba(99,102,241,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <Upload size={26} style={{ color: 'var(--color-primary-light)' }} />
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: '700', color: 'var(--color-heading)', marginBottom: '8px' }}>
              {dragOver ? 'Drop your PDF here' : 'Drag & drop or click to upload'}
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--color-text2)', marginBottom: '20px' }}>
              PDF only · Maximum 5 MB
            </p>
            <button
              className="btn btn-primary btn-sm"
              style={{ pointerEvents: 'none' }}
              disabled={uploading}
            >
              {uploading
                ? <><span className="spinner-sm" /> Uploading…</>
                : <><Upload size={14} /> Choose PDF File</>}
            </button>
          </div>
        ) : (
          /* Uploaded file row */
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '52px', height: '52px',
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.2)',
                borderRadius: 'var(--radius-md)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <FileText size={26} style={{ color: '#f87171' }} />
              </div>
              <div>
                <p style={{ fontSize: '15px', fontWeight: '700', color: 'var(--color-heading)', marginBottom: '3px' }}>
                  {resume.originalName}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '12px', color: 'var(--color-text3)' }}>
                    Uploaded {new Date(resume.uploadDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  {resume.isAnalyzed ? (
                    <span className="badge badge-success"><CheckCircle size={11} /> Analyzed</span>
                  ) : (
                    <span className="badge badge-warning">Not yet analyzed</span>
                  )}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => !uploading && fileRef.current?.click()}
                disabled={uploading}
              >
                <Upload size={13} /> {uploading ? 'Uploading…' : 'Replace'}
              </button>
              {!resume.isAnalyzed ? (
                <button className="btn btn-primary" onClick={handleAnalyze} disabled={analyzing}>
                  {analyzing ? <><span className="spinner-sm" /> Analyzing…</> : <><Zap size={14} /> Analyze with AI</>}
                </button>
              ) : (
                <button className="btn btn-outline btn-sm" onClick={handleAnalyze} disabled={analyzing}>
                  {analyzing ? <><span className="spinner-sm" /> Analyzing…</> : <><RefreshCw size={13} /> Re-analyze</>}
                </button>
              )}
            </div>
          </div>
        )}
        <input ref={fileRef} type="file" accept=".pdf" style={{ display: 'none' }} onChange={handleFileInput} />
      </div>

      {/* ── AI Loading ── */}
      {analyzing && <AILoadingSpinner message="AI is analyzing your resume…" />}

      {/* ── Analysis results ── */}
      {analysis && !analyzing && (
        <>
          {/* Score hero row */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
            {/* Main score */}
            <div className="card" style={{
              flex: '0 0 auto', width: '160px', textAlign: 'center', padding: '24px 16px',
              background: 'linear-gradient(135deg, rgba(99,102,241,0.06), rgba(139,92,246,0.06))',
              borderColor: 'rgba(99,102,241,0.25)',
            }}>
              <p style={{ fontSize: '11px', fontWeight: '800', color: 'var(--color-text3)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '10px' }}>
                Resume Score
              </p>
              <div style={{ fontSize: '56px', fontWeight: '900', color: getScoreColor(analysis.score), lineHeight: 1 }}>
                {analysis.score}
              </div>
              <p style={{ fontSize: '12px', color: 'var(--color-text3)', marginTop: '4px' }}>out of 100</p>
            </div>

            {/* Quality bars */}
            {analysis.resumeQuality && (
              <div className="card" style={{ flex: 1, minWidth: '240px' }}>
                <p style={{ fontSize: '12px', fontWeight: '800', color: 'var(--color-text3)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '16px' }}>
                  Quality Breakdown
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {Object.entries(analysis.resumeQuality).map(([k, v]) => (
                    <QualityBar key={k} label={k} value={v} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* AI Summary */}
          {analysis.summary && (
            <div className="alert alert-info" style={{ marginBottom: '20px' }}>
              <TrendingUp size={16} style={{ flexShrink: 0, marginTop: '1px' }} />
              <p style={{ fontSize: '14px', lineHeight: '1.7' }}>{analysis.summary}</p>
            </div>
          )}

          {/* Key Highlights */}
          {analysis.keyHighlights?.length > 0 && (
            <div className="card" style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--color-heading)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Star size={16} style={{ color: 'var(--color-warning)' }} /> Key Highlights
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {analysis.keyHighlights.map((h, i) => (
                  <span key={i} className="badge badge-accent">{h}</span>
                ))}
              </div>
            </div>
          )}

          {/* Strengths & Weaknesses */}
          <div className="grid-2" style={{ marginBottom: '20px' }}>
            <div className="card">
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--color-success)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '7px' }}>
                <CheckCircle size={16} /> Strengths
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
                {(analysis.strengths || []).map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px', fontSize: '13.5px', color: 'var(--color-text)', lineHeight: '1.6' }}>
                    <CheckCircle size={13} style={{ color: 'var(--color-success)', flexShrink: 0, marginTop: '3px' }} />
                    {s}
                  </div>
                ))}
                {(!analysis.strengths || analysis.strengths.length === 0) && (
                  <p style={{ fontSize: '13px', color: 'var(--color-text3)' }}>No strengths detected.</p>
                )}
              </div>
            </div>
            <div className="card">
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--color-danger)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '7px' }}>
                <XCircle size={16} /> Areas to Improve
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
                {(analysis.weaknesses || []).map((w, i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px', fontSize: '13.5px', color: 'var(--color-text)', lineHeight: '1.6' }}>
                    <AlertTriangle size={13} style={{ color: 'var(--color-warning)', flexShrink: 0, marginTop: '3px' }} />
                    {w}
                  </div>
                ))}
                {(!analysis.weaknesses || analysis.weaknesses.length === 0) && (
                  <p style={{ fontSize: '13px', color: 'var(--color-text3)' }}>No weaknesses detected.</p>
                )}
              </div>
            </div>
          </div>

          {/* Skill Gaps */}
          {analysis.skillGaps?.length > 0 && (
            <div className="card" style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--color-heading)', marginBottom: '12px' }}>
                Skill Gaps Detected in Resume
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
                {analysis.skillGaps.map((g, i) => <span key={i} className="badge badge-warning">{g}</span>)}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {analysis.recommendations?.length > 0 && (
            <div className="card">
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--color-heading)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '7px' }}>
                <Zap size={16} style={{ color: 'var(--color-primary-light)' }} /> AI Recommendations
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {analysis.recommendations.map((r, i) => (
                  <div key={i} style={{
                    padding: '12px 16px',
                    background: 'var(--color-surface2)',
                    borderRadius: 'var(--radius-md)',
                    borderLeft: '3px solid var(--color-primary)',
                    fontSize: '13.5px', color: 'var(--color-text)', lineHeight: '1.65',
                    display: 'flex', gap: '10px', alignItems: 'flex-start',
                  }}>
                    <span style={{ color: 'var(--color-primary-light)', fontWeight: '800', flexShrink: 0 }}>{i + 1}.</span>
                    {r}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* ── No analysis yet ── */}
      {resume && !analysis && !analyzing && (
        <div className="empty-state">
          <div className="empty-state-icon">🤖</div>
          <h3>Ready for AI Analysis</h3>
          <p>Your resume is uploaded. Click "Analyze with AI" to get your personalized score and recommendations.</p>
          <button className="btn btn-primary" onClick={handleAnalyze}>
            <Zap size={16} /> Analyze with AI
          </button>
        </div>
      )}

      {/* ── No resume yet ── */}
      {!resume && !loading && (
        <div className="empty-state">
          <div className="empty-state-icon">📄</div>
          <h3>No Resume Uploaded</h3>
          <p>Drag & drop or click the upload area above to get started.</p>
        </div>
      )}
    </div>
  );
}
