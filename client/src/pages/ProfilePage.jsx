import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import TagInput from '../components/common/TagInput';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { Save, User, GraduationCap, Code, Briefcase, Link as LinkIcon } from 'lucide-react';

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');

  // Form states
  const [personalForm, setPersonalForm] = useState({ fullName: '', college: '', degree: '', graduationYear: '' });
  const [academicForm, setAcademicForm] = useState({ cgpa: '', percentage: '', relevantSubjects: [], achievements: [] });
  const [skillsForm, setSkillsForm] = useState({ programmingLanguages: [], frameworks: [], databases: [], tools: [], cloudTechnologies: [] });
  const [careerForm, setCareerForm] = useState({ desiredRole: '', preferredIndustry: '', careerInterests: [], experienceLevel: 'fresher', targetCompanies: [] });
  const [personalInfoForm, setPersonalInfoForm] = useState({ linkedIn: '', github: '', portfolio: '', bio: '' });

  useEffect(() => {
    api.get('/profile').then(res => {
      const { profile, user: u } = res.data;
      setProfile(profile);
      setPersonalForm({ fullName: u?.fullName || '', college: u?.college || '', degree: u?.degree || '', graduationYear: u?.graduationYear || '' });
      const ac = profile?.academicDetails || {};
      setAcademicForm({ cgpa: ac.cgpa || '', percentage: ac.percentage || '', relevantSubjects: ac.relevantSubjects || [], achievements: ac.achievements || [] });
      const sk = profile?.technicalSkills || {};
      setSkillsForm({ programmingLanguages: sk.programmingLanguages || [], frameworks: sk.frameworks || [], databases: sk.databases || [], tools: sk.tools || [], cloudTechnologies: sk.cloudTechnologies || [] });
      const ca = profile?.careerInfo || {};
      setCareerForm({ desiredRole: ca.desiredRole || '', preferredIndustry: ca.preferredIndustry || '', careerInterests: ca.careerInterests || [], experienceLevel: ca.experienceLevel || 'fresher', targetCompanies: ca.targetCompanies || [] });
      const pi = profile?.personalInfo || {};
      setPersonalInfoForm({ linkedIn: pi.linkedIn || '', github: pi.github || '', portfolio: pi.portfolio || '', bio: pi.bio || '' });
    }).catch(() => toast.error('Failed to load profile'))
      .finally(() => setLoading(false));
  }, []);

  const savePersonal = async () => {
    setSaving(true);
    try {
      const res = await api.put('/profile/user', { ...personalForm, graduationYear: Number(personalForm.graduationYear) });
      setUser(res.data.user);
      toast.success('Personal info saved');
    } catch { toast.error('Failed to save'); } finally { setSaving(false); }
  };

  const saveSection = async (section, data) => {
    setSaving(true);
    try {
      await api.put('/profile', { [section]: data });
      toast.success('Profile updated successfully');
    } catch { toast.error('Failed to save profile'); } finally { setSaving(false); }
  };

  if (loading) return <LoadingSpinner message="Loading profile..." />;

  const tabs = [
    { id: 'personal', label: 'Personal', icon: User },
    { id: 'academic', label: 'Academic', icon: GraduationCap },
    { id: 'skills', label: 'Skills', icon: Code },
    { id: 'career', label: 'Career', icon: Briefcase },
    { id: 'links', label: 'Links', icon: LinkIcon },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>My Profile</h1>
        <p>Keep your profile updated for accurate AI recommendations.</p>
      </div>

      {/* Completion */}
      <div className="card" style={{ marginBottom: '24px', padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <div>
            <p style={{ fontSize: '13px', color: 'var(--color-text2)', fontWeight: '600' }}>Profile Completion</p>
            <p style={{ fontSize: '24px', fontWeight: '800', color: 'var(--color-primary-light)' }}>{profile?.completionScore || 0}%</p>
          </div>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${profile?.completionScore || 0}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', overflowX: 'auto', padding: '2px' }}>
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className={`btn btn-sm ${activeTab === id ? 'btn-primary' : 'btn-secondary'}`}>
            <Icon size={14} />{label}
          </button>
        ))}
      </div>

      {/* Personal Tab */}
      {activeTab === 'personal' && (
        <div className="card">
          <h2 className="section-title">Personal Information</h2>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input value={personalForm.fullName} onChange={e => setPersonalForm({ ...personalForm, fullName: e.target.value })} placeholder="Your full name" />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input value={user?.email} disabled style={{ opacity: 0.6 }} />
              <p className="form-hint">Email cannot be changed</p>
            </div>
            <div className="form-group">
              <label className="form-label">College / University</label>
              <input value={personalForm.college} onChange={e => setPersonalForm({ ...personalForm, college: e.target.value })} placeholder="Your college name" />
            </div>
            <div className="form-group">
              <label className="form-label">Degree / Program</label>
              <input value={personalForm.degree} onChange={e => setPersonalForm({ ...personalForm, degree: e.target.value })} placeholder="B.Tech Computer Science" />
            </div>
            <div className="form-group">
              <label className="form-label">Graduation Year</label>
              <input type="number" value={personalForm.graduationYear} onChange={e => setPersonalForm({ ...personalForm, graduationYear: e.target.value })} />
            </div>
          </div>
          <button className="btn btn-primary" onClick={savePersonal} disabled={saving}>
            {saving ? <><span className="spinner-sm" /> Saving...</> : <><Save size={14} /> Save Personal Info</>}
          </button>
        </div>
      )}

      {/* Academic Tab */}
      {activeTab === 'academic' && (
        <div className="card">
          <h2 className="section-title">Academic Details</h2>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">CGPA (out of 10)</label>
              <input type="number" step="0.01" min="0" max="10" value={academicForm.cgpa} onChange={e => setAcademicForm({ ...academicForm, cgpa: e.target.value })} placeholder="e.g. 8.5" />
            </div>
            <div className="form-group">
              <label className="form-label">Percentage (%)</label>
              <input type="number" step="0.01" min="0" max="100" value={academicForm.percentage} onChange={e => setAcademicForm({ ...academicForm, percentage: e.target.value })} placeholder="e.g. 85" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Relevant Subjects</label>
            <TagInput tags={academicForm.relevantSubjects} onChange={v => setAcademicForm({ ...academicForm, relevantSubjects: v })} placeholder="Type subject name and press Enter..." />
          </div>
          <div className="form-group">
            <label className="form-label">Academic Achievements</label>
            <TagInput tags={academicForm.achievements} onChange={v => setAcademicForm({ ...academicForm, achievements: v })} placeholder="e.g. Dean's List, Hackathon winner..." />
          </div>
          <button className="btn btn-primary" onClick={() => saveSection('academicDetails', academicForm)} disabled={saving}>
            {saving ? <><span className="spinner-sm" /> Saving...</> : <><Save size={14} /> Save Academic Details</>}
          </button>
        </div>
      )}

      {/* Skills Tab */}
      {activeTab === 'skills' && (
        <div className="card">
          <h2 className="section-title">Technical Skills</h2>
          <p className="section-subtitle">Add your skills — these power the AI analysis. Press Enter after each skill.</p>
          {[
            { key: 'programmingLanguages', label: 'Programming Languages', placeholder: 'e.g. JavaScript, Python, Java...' },
            { key: 'frameworks', label: 'Frameworks & Libraries', placeholder: 'e.g. React, Node.js, Spring Boot...' },
            { key: 'databases', label: 'Databases', placeholder: 'e.g. MongoDB, MySQL, PostgreSQL...' },
            { key: 'tools', label: 'Tools & Technologies', placeholder: 'e.g. Git, Docker, VS Code...' },
            { key: 'cloudTechnologies', label: 'Cloud Technologies', placeholder: 'e.g. AWS, Azure, GCP...' },
          ].map(({ key, label, placeholder }) => (
            <div className="form-group" key={key}>
              <label className="form-label">{label}</label>
              <TagInput tags={skillsForm[key]} onChange={v => setSkillsForm({ ...skillsForm, [key]: v })} placeholder={placeholder} />
            </div>
          ))}
          <button className="btn btn-primary" onClick={() => saveSection('technicalSkills', skillsForm)} disabled={saving}>
            {saving ? <><span className="spinner-sm" /> Saving...</> : <><Save size={14} /> Save Skills</>}
          </button>
        </div>
      )}

      {/* Career Tab */}
      {activeTab === 'career' && (
        <div className="card">
          <h2 className="section-title">Career Goals</h2>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Desired Job Role</label>
              <input value={careerForm.desiredRole} onChange={e => setCareerForm({ ...careerForm, desiredRole: e.target.value })} placeholder="e.g. Full Stack Developer" />
            </div>
            <div className="form-group">
              <label className="form-label">Preferred Industry</label>
              <input value={careerForm.preferredIndustry} onChange={e => setCareerForm({ ...careerForm, preferredIndustry: e.target.value })} placeholder="e.g. Product, FinTech, EdTech" />
            </div>
            <div className="form-group">
              <label className="form-label">Experience Level</label>
              <select value={careerForm.experienceLevel} onChange={e => setCareerForm({ ...careerForm, experienceLevel: e.target.value })}>
                <option value="fresher">Fresher (0 years)</option>
                <option value="beginner">Beginner (0-1 years)</option>
                <option value="intermediate">Intermediate (1-3 years)</option>
                <option value="experienced">Experienced (3+ years)</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Career Interests</label>
            <TagInput tags={careerForm.careerInterests} onChange={v => setCareerForm({ ...careerForm, careerInterests: v })} placeholder="e.g. AI/ML, Web Development, Mobile..." />
          </div>
          <div className="form-group">
            <label className="form-label">Target Companies</label>
            <TagInput tags={careerForm.targetCompanies} onChange={v => setCareerForm({ ...careerForm, targetCompanies: v })} placeholder="e.g. Google, Microsoft, Infosys..." />
          </div>
          <button className="btn btn-primary" onClick={() => saveSection('careerInfo', careerForm)} disabled={saving}>
            {saving ? <><span className="spinner-sm" /> Saving...</> : <><Save size={14} /> Save Career Info</>}
          </button>
        </div>
      )}

      {/* Links Tab */}
      {activeTab === 'links' && (
        <div className="card">
          <h2 className="section-title">Online Presence</h2>
          <div className="form-group">
            <label className="form-label">LinkedIn URL</label>
            <input value={personalInfoForm.linkedIn} onChange={e => setPersonalInfoForm({ ...personalInfoForm, linkedIn: e.target.value })} placeholder="https://linkedin.com/in/yourprofile" />
          </div>
          <div className="form-group">
            <label className="form-label">GitHub URL</label>
            <input value={personalInfoForm.github} onChange={e => setPersonalInfoForm({ ...personalInfoForm, github: e.target.value })} placeholder="https://github.com/yourusername" />
          </div>
          <div className="form-group">
            <label className="form-label">Portfolio Website</label>
            <input value={personalInfoForm.portfolio} onChange={e => setPersonalInfoForm({ ...personalInfoForm, portfolio: e.target.value })} placeholder="https://yourportfolio.com" />
          </div>
          <div className="form-group">
            <label className="form-label">Professional Bio</label>
            <textarea rows={4} value={personalInfoForm.bio} onChange={e => setPersonalInfoForm({ ...personalInfoForm, bio: e.target.value })} placeholder="A brief professional summary about yourself..." style={{ resize: 'vertical' }} />
          </div>
          <button className="btn btn-primary" onClick={() => saveSection('personalInfo', personalInfoForm)} disabled={saving}>
            {saving ? <><span className="spinner-sm" /> Saving...</> : <><Save size={14} /> Save Links</>}
          </button>
        </div>
      )}
    </div>
  );
}
