import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import {
  ExternalLink, Star, Clock, Tag, Award, ChevronDown, ChevronUp,
  Github, BookOpen, Zap
} from 'lucide-react';

const DIFFICULTY_BADGE = {
  beginner: 'badge-success',
  intermediate: 'badge-warning',
  advanced: 'badge-danger',
};

const PRIORITY_BADGE = {
  high: 'badge-danger',
  medium: 'badge-warning',
  low: 'badge-neutral',
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [certLoading, setCertLoading] = useState(true);
  const [expandedProject, setExpandedProject] = useState(null);
  const [expandedCert, setExpandedCert] = useState(null);
  const [activeTab, setActiveTab] = useState('projects');

  useEffect(() => {
    api.get('/projects/recommend')
      .then(res => setProjects(res.data.projects || []))
      .catch(() => toast.error('Failed to load project recommendations'))
      .finally(() => setLoading(false));

    api.get('/projects/certifications')
      .then(res => setCerts(res.data.certifications || []))
      .catch(() => {})
      .finally(() => setCertLoading(false));
  }, []);

  const refresh = () => {
    setLoading(true);
    setCertLoading(true);
    api.get('/projects/recommend')
      .then(res => setProjects(res.data.projects || []))
      .catch(() => toast.error('Failed to reload projects'))
      .finally(() => setLoading(false));
    api.get('/projects/certifications')
      .then(res => setCerts(res.data.certifications || []))
      .catch(() => {})
      .finally(() => setCertLoading(false));
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <h1>Projects & Certifications</h1>
        <p>AI-curated project ideas and certifications to build your portfolio and credibility.</p>
      </div>

      {/* Top actions */}
      <div className="card" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={`btn ${activeTab === 'projects' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            onClick={() => setActiveTab('projects')}
          >
            🏗️ Projects {projects.length > 0 && `(${projects.length})`}
          </button>
          <button
            className={`btn ${activeTab === 'certs' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            onClick={() => setActiveTab('certs')}
          >
            🏆 Certifications {certs.length > 0 && `(${certs.length})`}
          </button>
        </div>
        <button className="btn btn-outline btn-sm" onClick={refresh} disabled={loading}>
          <Zap size={14} /> Refresh Recommendations
        </button>
      </div>

      {/* Projects tab */}
      {activeTab === 'projects' && (
        <>
          {loading ? (
            <LoadingSpinner message="Loading project recommendations..." />
          ) : projects.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {projects.map((project, i) => {
                const isExpanded = expandedProject === i;
                return (
                  <div key={i} className="card" style={{ borderColor: isExpanded ? 'rgba(99,102,241,0.4)' : 'var(--color-border)' }}>
                    <div
                      style={{ cursor: 'pointer' }}
                      onClick={() => setExpandedProject(isExpanded ? null : i)}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
                            <h3 style={{ fontSize: '17px', fontWeight: '700', color: 'var(--color-heading)' }}>
                              {project.title}
                            </h3>
                            {project.difficulty && (
                              <span className={`badge ${DIFFICULTY_BADGE[project.difficulty?.toLowerCase()] || 'badge-neutral'}`}>
                                {project.difficulty}
                              </span>
                            )}
                            {project.priority && (
                              <span className={`badge ${PRIORITY_BADGE[project.priority?.toLowerCase()] || 'badge-neutral'}`}>
                                {project.priority} priority
                              </span>
                            )}
                          </div>
                          <p style={{ fontSize: '14px', color: 'var(--color-text2)', lineHeight: '1.6' }}>
                            {project.description}
                          </p>
                          <div style={{ display: 'flex', gap: '16px', marginTop: '10px', flexWrap: 'wrap' }}>
                            {project.estimatedTime && (
                              <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: 'var(--color-text3)' }}>
                                <Clock size={13} /> {project.estimatedTime}
                              </span>
                            )}
                            {project.techStack?.length > 0 && (
                              <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: 'var(--color-text3)' }}>
                                <Tag size={13} /> {project.techStack.slice(0, 3).join(', ')}{project.techStack.length > 3 ? ' +more' : ''}
                              </span>
                            )}
                          </div>
                        </div>
                        <div style={{ color: 'var(--color-text3)', flexShrink: 0, marginTop: '2px' }}>
                          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </div>
                      </div>
                    </div>

                    {isExpanded && (
                      <div style={{ marginTop: '20px', borderTop: '1px solid var(--color-border)', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {/* Tech stack */}
                        {project.techStack?.length > 0 && (
                          <div>
                            <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text3)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                              Tech Stack
                            </p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                              {project.techStack.map((tech, j) => (
                                <span key={j} className="badge badge-primary">{tech}</span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Skills practiced */}
                        {project.skillsPracticed?.length > 0 && (
                          <div>
                            <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text3)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                              Skills You'll Practice
                            </p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                              {project.skillsPracticed.map((sk, j) => (
                                <span key={j} className="badge badge-info">{sk}</span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Features */}
                        {project.keyFeatures?.length > 0 && (
                          <div>
                            <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text3)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                              Key Features to Build
                            </p>
                            <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              {project.keyFeatures.map((f, j) => (
                                <li key={j} style={{ fontSize: '13px', color: 'var(--color-text2)' }}>{f}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Resources / links */}
                        {project.resources?.length > 0 && (
                          <div>
                            <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text3)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                              Resources
                            </p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                              {project.resources.map((res, j) => (
                                res.url ? (
                                  <a key={j} href={res.url} target="_blank" rel="noopener noreferrer"
                                    className="btn btn-outline btn-sm"
                                  >
                                    <ExternalLink size={13} /> {res.title}
                                  </a>
                                ) : (
                                  <span key={j} className="badge badge-neutral">
                                    <BookOpen size={12} /> {res.title}
                                  </span>
                                )
                              ))}
                            </div>
                          </div>
                        )}

                        {/* GitHub tip */}
                        <div className="alert alert-info" style={{ fontSize: '13px' }}>
                          <Github size={14} style={{ flexShrink: 0 }} />
                          <span>Build this project and push it to GitHub with a detailed README to impress recruiters.</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">🏗️</div>
              <h3>No Project Recommendations Yet</h3>
              <p>
                Complete your <Link to="/dashboard/profile">profile</Link> and run a{' '}
                <Link to="/dashboard/skills">skill analysis</Link> to get personalized project ideas.
              </p>
            </div>
          )}
        </>
      )}

      {/* Certifications tab */}
      {activeTab === 'certs' && (
        <>
          {certLoading ? (
            <LoadingSpinner message="Loading certification recommendations..." />
          ) : certs.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {certs.map((cert, i) => {
                const isExpanded = expandedCert === i;
                return (
                  <div key={i} className="card" style={{ borderColor: isExpanded ? 'rgba(99,102,241,0.4)' : 'var(--color-border)' }}>
                    <div style={{ cursor: 'pointer' }} onClick={() => setExpandedCert(isExpanded ? null : i)}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
                            <Award size={18} style={{ color: 'var(--color-warning)', flexShrink: 0 }} />
                            <h3 style={{ fontSize: '17px', fontWeight: '700', color: 'var(--color-heading)' }}>
                              {cert.name}
                            </h3>
                            {cert.provider && (
                              <span className="badge badge-neutral">{cert.provider}</span>
                            )}
                            {cert.priority && (
                              <span className={`badge ${PRIORITY_BADGE[cert.priority?.toLowerCase()] || 'badge-neutral'}`}>
                                {cert.priority}
                              </span>
                            )}
                          </div>
                          <p style={{ fontSize: '14px', color: 'var(--color-text2)', lineHeight: '1.6' }}>
                            {cert.description}
                          </p>
                          <div style={{ display: 'flex', gap: '16px', marginTop: '10px', flexWrap: 'wrap' }}>
                            {cert.cost && (
                              <span style={{ fontSize: '13px', color: 'var(--color-text3)' }}>
                                💰 {cert.cost}
                              </span>
                            )}
                            {cert.duration && (
                              <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: 'var(--color-text3)' }}>
                                <Clock size={13} /> {cert.duration}
                              </span>
                            )}
                            {cert.difficulty && (
                              <span className={`badge ${DIFFICULTY_BADGE[cert.difficulty?.toLowerCase()] || 'badge-neutral'}`}>
                                {cert.difficulty}
                              </span>
                            )}
                          </div>
                        </div>
                        <div style={{ color: 'var(--color-text3)', flexShrink: 0, marginTop: '2px' }}>
                          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </div>
                      </div>
                    </div>

                    {isExpanded && (
                      <div style={{ marginTop: '20px', borderTop: '1px solid var(--color-border)', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {cert.skills?.length > 0 && (
                          <div>
                            <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text3)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                              Skills Covered
                            </p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                              {cert.skills.map((sk, j) => (
                                <span key={j} className="badge badge-primary">{sk}</span>
                              ))}
                            </div>
                          </div>
                        )}

                        {cert.whyRecommended && (
                          <div className="alert alert-success" style={{ fontSize: '13px' }}>
                            <Star size={14} style={{ flexShrink: 0 }} />
                            <span>{cert.whyRecommended}</span>
                          </div>
                        )}

                        {cert.url && (
                          <a href={cert.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm" style={{ alignSelf: 'flex-start' }}>
                            <ExternalLink size={14} /> View Certification
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">🏆</div>
              <h3>No Certifications Found</h3>
              <p>Complete your profile to get certification recommendations tailored to your goals.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
