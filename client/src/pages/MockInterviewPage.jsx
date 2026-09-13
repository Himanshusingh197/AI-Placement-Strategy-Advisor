import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import {
  Send, ChevronLeft, ChevronRight, CheckCircle, XCircle,
  TrendingUp, Award, RotateCcw, Home, AlertCircle, Lightbulb
} from 'lucide-react';

/* ─── helpers ───────────────────────────────────────────── */

const SCORE_COLOR = (s) => {
  if (s >= 8) return 'var(--color-success)';
  if (s >= 5) return 'var(--color-warning)';
  return 'var(--color-danger)';
};

const SCORE_LABEL = (s) => {
  if (s >= 8) return 'Excellent';
  if (s >= 6) return 'Good';
  if (s >= 4) return 'Average';
  return 'Needs Work';
};

const DOT_BADGE = ({ label, color }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: '4px',
    padding: '2px 9px', borderRadius: '9999px', fontSize: '11px', fontWeight: '700',
    background: `${color}15`, color, border: `1px solid ${color}33`
  }}>{label}</span>
);

/* ─── Question nav ─────────────────────────────────────── */
const QuestionNav = ({ total, current, answers, onJump }) => (
  <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', alignItems: 'center' }}>
    {Array.from({ length: total }, (_, i) => {
      const isDone = !!answers[i];
      const isCurrent = i === current;
      return (
        <button
          key={i}
          onClick={() => onJump(i)}
          title={isDone ? `Q${i + 1} — answered` : `Q${i + 1}`}
          style={{
            width: '30px', height: '30px',
            borderRadius: 'var(--radius-sm)',
            border: `1.5px solid ${isCurrent ? 'var(--color-primary)' : isDone ? 'rgba(16,185,129,0.4)' : 'var(--color-border)'}`,
            background: isCurrent ? 'var(--color-primary-glow)' : isDone ? 'rgba(16,185,129,0.08)' : 'var(--color-surface2)',
            color: isCurrent ? 'var(--color-primary-light)' : isDone ? 'var(--color-success)' : 'var(--color-text3)',
            fontSize: '12px', fontWeight: '700',
            cursor: 'pointer', transition: 'all 0.15s',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          {isDone ? <CheckCircle size={14} /> : i + 1}
        </button>
      );
    })}
  </div>
);

/* ─── Main component ─────────────────────────────────────── */
export default function MockInterviewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { interviewId, questions = [], role = '', type = 'mock' } = location.state || {};

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [answers, setAnswers] = useState({});     // { index: { answer, feedback, score, correctPoints, missingPoints, improvedAnswer, verdict } }
  const [liveFeedback, setLiveFeedback] = useState(null);
  const [report, setReport] = useState(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (!interviewId || questions.length === 0) navigate('/dashboard/interview');
  }, [interviewId, questions, navigate]);

  useEffect(() => {
    if (!report && !submitting) {
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [currentIndex, report]);

  if (!interviewId || questions.length === 0) return null;

  const q = questions[currentIndex];
  const isAnswered = !!answers[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === questions.length;
  const progress = Math.round((answeredCount / questions.length) * 100);

  /* ── submit answer ────────────────────────────── */
  const submitAnswer = async () => {
    if (!answer.trim()) { toast.error('Please write your answer first.'); return; }
    setSubmitting(true);
    setLiveFeedback(null);
    try {
      const res = await api.post('/interview/answer', {
        interviewId,
        questionIndex: currentIndex,
        answer: answer.trim(),
      });
      const fb = res.data.feedback || {};
      setAnswers(prev => ({
        ...prev,
        [currentIndex]: {
          answer: answer.trim(),
          feedback: fb.feedback,
          score: fb.score,
          correctPoints: fb.correctPoints || [],
          missingPoints: fb.missingPoints || [],
          improvedAnswer: fb.improvedAnswer,
          verdict: fb.verdict,
        }
      }));
      setLiveFeedback(fb);
      setAnswer('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  /* ── finish interview ─────────────────────────── */
  const finishInterview = async () => {
    if (answeredCount === 0) { toast.error('Answer at least one question first.'); return; }
    setCompleting(true);
    try {
      const res = await api.post('/interview/complete', { interviewId });
      setReport(res.data.interview);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate report.');
      setCompleting(false);
    }
  };

  const jumpTo = (i) => {
    setLiveFeedback(null);
    setAnswer('');
    setCurrentIndex(i);
  };

  const goNext = () => jumpTo(Math.min(currentIndex + 1, questions.length - 1));
  const goPrev = () => jumpTo(Math.max(currentIndex - 1, 0));

  /* ── get feedback to display for current Q ────── */
  const displayFeedback = liveFeedback || (isAnswered ? answers[currentIndex] : null);

  /* ──────────────────────────────────────────────────
      FINAL REPORT VIEW
  ─────────────────────────────────────────────────── */
  if (report) {
    const s = report.scores || {};
    const overall = s.overall || 0;

    return (
      <div className="page-container" style={{ maxWidth: '860px' }}>
        {/* Hero score */}
        <div className="card" style={{
          marginBottom: '24px',
          background: 'linear-gradient(135deg, rgba(99,102,241,0.06), rgba(139,92,246,0.06))',
          borderColor: 'rgba(99,102,241,0.25)',
          textAlign: 'center', padding: '44px 28px',
        }}>
          <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--color-text3)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '10px' }}>
            🎉 Interview Complete — {report.role}
          </div>
          <div style={{ fontSize: '76px', fontWeight: '900', color: SCORE_COLOR(overall / 10), lineHeight: 1, marginBottom: '8px' }}>
            {overall}%
          </div>
          <p style={{ fontSize: '15px', color: 'var(--color-text2)' }}>
            {overall >= 75 ? '🌟 Excellent! You\'re well-prepared for this role.' :
             overall >= 55 ? '👍 Solid effort. A few areas to sharpen.' :
             '💪 Keep practicing — consistency is key.'}
          </p>
          {report.feedback?.readinessLevel && (
            <div style={{ marginTop: '12px' }}>
              <span className={`badge ${overall >= 75 ? 'badge-success' : overall >= 55 ? 'badge-warning' : 'badge-danger'}`} style={{ fontSize: '13px', padding: '5px 14px' }}>
                {report.feedback.readinessLevel}
              </span>
            </div>
          )}
        </div>

        {/* Score breakdown */}
        <div className="grid-4" style={{ marginBottom: '24px' }}>
          {[
            { label: 'Relevance', key: 'relevance' },
            { label: 'Technical', key: 'technicalAccuracy' },
            { label: 'Communication', key: 'communication' },
            { label: 'Completeness', key: 'completeness' },
          ].map((item) => {
            const val = s[item.key] || 0;
            const color = SCORE_COLOR(val);
            return (
              <div key={item.key} className="card" style={{ textAlign: 'center', padding: '18px' }}>
                <p style={{ fontSize: '11px', color: 'var(--color-text3)', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.5px', marginBottom: '8px' }}>{item.label}</p>
                <div style={{ fontSize: '32px', fontWeight: '900', color, marginBottom: '8px' }}>{val}</div>
                <div className="progress-bar" style={{ height: '5px' }}>
                  <div className="progress-fill" style={{ width: `${(val / 10) * 100}%`, background: `linear-gradient(90deg, ${color}, ${color}99)` }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* AI feedback summary */}
        {report.feedback && (
          <div className="card" style={{ marginBottom: '24px' }}>
            <h2 className="section-title" style={{ fontSize: '17px', marginBottom: '16px' }}>AI Feedback</h2>
            {report.feedback.summary && (
              <p style={{ fontSize: '14px', color: 'var(--color-text)', lineHeight: '1.8', marginBottom: '20px', padding: '14px', background: 'var(--color-surface2)', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--color-primary)' }}>
                {report.feedback.summary}
              </p>
            )}
            <div className="grid-2" style={{ gap: '20px' }}>
              {report.feedback.strengths?.length > 0 && (
                <div>
                  <p style={{ fontSize: '11px', fontWeight: '800', color: 'var(--color-text3)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>✅ Strengths</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                    {report.feedback.strengths.map((s, i) => (
                      <div key={i} style={{ display: 'flex', gap: '8px', fontSize: '13.5px', color: 'var(--color-text2)' }}>
                        <CheckCircle size={14} style={{ color: 'var(--color-success)', flexShrink: 0, marginTop: '2px' }} />
                        {s}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {report.feedback.improvements?.length > 0 && (
                <div>
                  <p style={{ fontSize: '11px', fontWeight: '800', color: 'var(--color-text3)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>🔧 Improvements</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                    {report.feedback.improvements.map((s, i) => (
                      <div key={i} style={{ display: 'flex', gap: '8px', fontSize: '13.5px', color: 'var(--color-text2)' }}>
                        <XCircle size={14} style={{ color: 'var(--color-warning)', flexShrink: 0, marginTop: '2px' }} />
                        {s}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {report.feedback.recommendedTopics?.length > 0 && (
              <div style={{ marginTop: '18px' }}>
                <p style={{ fontSize: '11px', fontWeight: '800', color: 'var(--color-text3)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>📚 Study These Topics</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
                  {report.feedback.recommendedTopics.map((t, i) => <span key={i} className="badge badge-warning">{t}</span>)}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Per-answer review */}
        {report.answers?.length > 0 && (
          <div className="card" style={{ marginBottom: '24px' }}>
            <h2 className="section-title" style={{ fontSize: '17px', marginBottom: '16px' }}>Answer Review</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {report.answers.map((ans, i) => (
                <div key={i} style={{ background: 'var(--color-surface2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '14px 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', marginBottom: '8px' }}>
                    <p style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-heading)', flex: 1 }}>Q{i + 1}. {ans.question}</p>
                    <div style={{ flexShrink: 0, textAlign: 'right' }}>
                      <span style={{ fontSize: '18px', fontWeight: '900', color: SCORE_COLOR(ans.score || 0) }}>{ans.score}/10</span>
                    </div>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--color-text2)', lineHeight: '1.65', marginBottom: '8px', fontStyle: 'italic' }}>"{ans.answer}"</p>
                  {ans.feedback && (
                    <p style={{ fontSize: '13px', color: 'var(--color-text3)', lineHeight: '1.6' }}>💬 {ans.feedback}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => navigate('/dashboard/interview')}>
            <RotateCcw size={16} /> New Interview
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
            <Home size={16} /> Dashboard
          </button>
        </div>
      </div>
    );
  }

  /* ──────────────────────────────────────────────────
      SESSION VIEW
  ─────────────────────────────────────────────────── */
  return (
    <div className="page-container" style={{ maxWidth: '780px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--color-heading)', marginBottom: '3px' }}>
            {role} Interview
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--color-text3)', textTransform: 'capitalize' }}>
            {type} · {questions.length} questions · {answeredCount} answered
          </p>
        </div>
        <button
          className="btn btn-primary btn-sm"
          onClick={finishInterview}
          disabled={completing || answeredCount === 0}
        >
          {completing ? <><span className="spinner-sm" /> Generating report…</> : <><Award size={14} /> Finish & Get Report</>}
        </button>
      </div>

      {/* Progress + nav */}
      <div className="card" style={{ marginBottom: '16px', padding: '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span style={{ fontSize: '12px', color: 'var(--color-text3)', fontWeight: '700' }}>Progress</span>
          <span style={{ fontSize: '13px', color: 'var(--color-primary-light)', fontWeight: '800' }}>{progress}%</span>
        </div>
        <div className="progress-bar" style={{ height: '5px', marginBottom: '12px' }}>
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <QuestionNav total={questions.length} current={currentIndex} answers={answers} onJump={jumpTo} />
      </div>

      {/* Question */}
      <div className="card" style={{ marginBottom: '14px', borderColor: 'rgba(99,102,241,0.3)', background: 'rgba(99,102,241,0.03)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
          <span style={{
            background: 'var(--color-primary-glow)', border: '1px solid rgba(99,102,241,0.3)',
            color: 'var(--color-primary-light)',
            borderRadius: 'var(--radius-full)', padding: '2px 10px',
            fontSize: '12px', fontWeight: '800'
          }}>Q{currentIndex + 1} / {questions.length}</span>
          {q?.category && <span className="badge badge-neutral" style={{ fontSize: '11px', textTransform: 'capitalize' }}>{q.category}</span>}
          {q?.difficulty && (
            <span className={`badge ${q.difficulty === 'easy' ? 'badge-success' : q.difficulty === 'medium' ? 'badge-warning' : 'badge-danger'}`} style={{ fontSize: '11px' }}>
              {q.difficulty}
            </span>
          )}
          {isAnswered && <span className="badge badge-success" style={{ fontSize: '11px' }}><CheckCircle size={11} /> Answered</span>}
        </div>
        <p style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-heading)', lineHeight: '1.75' }}>
          {q?.question}
        </p>
        {q?.expectedKeyPoints?.length > 0 && !isAnswered && (
          <div style={{ marginTop: '12px', padding: '10px 12px', background: 'var(--color-surface2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
            <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-text3)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Hints (key points to cover)</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {q.expectedKeyPoints.map((pt, i) => (
                <span key={i} className="badge badge-neutral" style={{ fontSize: '11.5px' }}>{pt}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Answer input or saved answer */}
      {!isAnswered ? (
        <div className="card" style={{ marginBottom: '14px' }}>
          <label className="form-label">Your Answer</label>
          <textarea
            ref={textareaRef}
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            placeholder="Write a clear, detailed answer. Use specific examples where possible…"
            rows={6}
            style={{ resize: 'vertical', minHeight: '130px' }}
            disabled={submitting}
            onKeyDown={e => { if (e.ctrlKey && e.key === 'Enter' && !submitting) submitAnswer(); }}
          />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
            <p style={{ fontSize: '11.5px', color: 'var(--color-text3)' }}>Ctrl+Enter to submit</p>
            <button
              className="btn btn-primary btn-sm"
              onClick={submitAnswer}
              disabled={submitting || !answer.trim()}
            >
              {submitting ? <><span className="spinner-sm" /> Evaluating…</> : <><Send size={14} /> Submit Answer</>}
            </button>
          </div>
        </div>
      ) : (
        <div className="card" style={{ marginBottom: '14px', background: 'rgba(16,185,129,0.03)', borderColor: 'rgba(16,185,129,0.2)' }}>
          <p style={{ fontSize: '11px', fontWeight: '800', color: 'var(--color-text3)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Your Answer</p>
          <p style={{ fontSize: '14px', color: 'var(--color-text)', lineHeight: '1.7', fontStyle: 'italic' }}>"{answers[currentIndex]?.answer}"</p>
        </div>
      )}

      {/* Feedback panel */}
      {displayFeedback && (
        <div className="card" style={{ marginBottom: '16px' }}>
          {submitting ? (
            <div style={{ textAlign: 'center', padding: '24px' }}>
              <div className="spinner" style={{ margin: '0 auto 12px' }} />
              <p style={{ color: 'var(--color-text2)', fontSize: '14px' }}>AI is evaluating your answer…</p>
            </div>
          ) : (
            <>
              {/* Score row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-text3)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '3px' }}>Score</p>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                    <span style={{ fontSize: '32px', fontWeight: '900', color: SCORE_COLOR(displayFeedback.score || 0) }}>{displayFeedback.score}</span>
                    <span style={{ fontSize: '15px', color: 'var(--color-text3)', fontWeight: '600' }}>/10</span>
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <DOT_BADGE label={SCORE_LABEL(displayFeedback.score || 0)} color={SCORE_COLOR(displayFeedback.score || 0)} />
                    {displayFeedback.verdict && (
                      <span className="badge badge-neutral" style={{ textTransform: 'capitalize', fontSize: '11px' }}>{displayFeedback.verdict}</span>
                    )}
                  </div>
                  <div className="progress-bar" style={{ height: '6px' }}>
                    <div className="progress-fill" style={{
                      width: `${((displayFeedback.score || 0) / 10) * 100}%`,
                      background: `linear-gradient(90deg, ${SCORE_COLOR(displayFeedback.score || 0)}, ${SCORE_COLOR(displayFeedback.score || 0)}99)`
                    }} />
                  </div>
                </div>
              </div>

              {/* Feedback text */}
              {displayFeedback.feedback && (
                <div className="alert alert-info" style={{ marginBottom: '14px' }}>
                  <TrendingUp size={14} style={{ flexShrink: 0, marginTop: '1px' }} />
                  <p style={{ fontSize: '13.5px' }}>{displayFeedback.feedback}</p>
                </div>
              )}

              {/* Correct points + missing points */}
              {(displayFeedback.correctPoints?.length > 0 || displayFeedback.missingPoints?.length > 0) && (
                <div className="grid-2" style={{ gap: '14px', marginBottom: '12px' }}>
                  {displayFeedback.correctPoints?.length > 0 && (
                    <div>
                      <p style={{ fontSize: '11px', fontWeight: '800', color: 'var(--color-text3)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>✅ What You Got Right</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {displayFeedback.correctPoints.map((pt, i) => (
                          <div key={i} style={{ display: 'flex', gap: '7px', fontSize: '13px', color: 'var(--color-text2)' }}>
                            <CheckCircle size={13} style={{ color: 'var(--color-success)', flexShrink: 0, marginTop: '2px' }} />
                            {pt}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {displayFeedback.missingPoints?.length > 0 && (
                    <div>
                      <p style={{ fontSize: '11px', fontWeight: '800', color: 'var(--color-text3)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>❌ What Was Missing</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {displayFeedback.missingPoints.map((pt, i) => (
                          <div key={i} style={{ display: 'flex', gap: '7px', fontSize: '13px', color: 'var(--color-text2)' }}>
                            <XCircle size={13} style={{ color: 'var(--color-danger)', flexShrink: 0, marginTop: '2px' }} />
                            {pt}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Ideal answer hint */}
              {displayFeedback.improvedAnswer && (
                <div style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 'var(--radius-md)', padding: '12px 14px' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <Lightbulb size={14} style={{ color: 'var(--color-warning)', flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <p style={{ fontSize: '11px', fontWeight: '800', color: 'var(--color-warning)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Ideal Answer Outline</p>
                      <p style={{ fontSize: '13px', color: 'var(--color-text2)', lineHeight: '1.65' }}>{displayFeedback.improvedAnswer}</p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
        <button className="btn btn-secondary btn-sm" onClick={goPrev} disabled={currentIndex === 0}>
          <ChevronLeft size={15} /> Previous
        </button>
        <div style={{ display: 'flex', gap: '8px' }}>
          {currentIndex < questions.length - 1 ? (
            <button className="btn btn-secondary btn-sm" onClick={goNext}>
              {isAnswered ? 'Next' : 'Skip'} <ChevronRight size={15} />
            </button>
          ) : (
            <button className="btn btn-primary btn-sm" onClick={finishInterview} disabled={completing || answeredCount === 0}>
              {completing ? <><span className="spinner-sm" /> Finishing…</> : <><Award size={14} /> Finish & Get Report</>}
            </button>
          )}
        </div>
      </div>

      {/* Skip warning */}
      {!allAnswered && currentIndex === questions.length - 1 && !isAnswered && answeredCount > 0 && (
        <div className="alert alert-warning" style={{ marginTop: '14px' }}>
          <AlertCircle size={14} style={{ flexShrink: 0 }} />
          <p style={{ fontSize: '13px' }}>You can finish now — only answered questions will be scored.</p>
        </div>
      )}
    </div>
  );
}
