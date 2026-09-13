import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Brain, Eye, EyeOff, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import './AuthPage.css';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '', email: '', password: '',
    college: '', degree: '', graduationYear: ''
  });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const currentYear = new Date().getFullYear();

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (!form.college.trim()) e.college = 'College name is required';
    if (!form.degree.trim()) e.degree = 'Degree is required';
    if (!form.graduationYear) e.graduationYear = 'Graduation year is required';
    else if (form.graduationYear < currentYear || form.graduationYear > currentYear + 5)
      e.graduationYear = `Enter a year between ${currentYear} and ${currentYear + 5}`;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register({ ...form, graduationYear: Number(form.graduationYear) });
      toast.success('Account created! Welcome aboard.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const field = (key, label, type = 'text', placeholder = '') => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={form[key]}
        onChange={e => setForm({ ...form, [key]: e.target.value })}
      />
      {errors[key] && <p className="form-error">{errors[key]}</p>}
    </div>
  );

  return (
    <div className="auth-page">
      <div className="auth-left">
        <Link to="/" className="auth-logo">
          <div className="auth-logo-icon"><Brain size={24} /></div>
          <span>AI Placement Advisor</span>
        </Link>
        <div className="auth-left-content">
          <h2>Start your journey</h2>
          <p>Create your account and let AI guide you from where you are to where you want to be.</p>
          <div className="auth-features">
            {[
              'Personalized AI career guidance',
              'Resume analysis & scoring',
              'Skill gap identification',
              'Learning roadmap generation',
              'AI-powered mock interviews'
            ].map(f => (
              <div key={f} className="auth-feature">
                <span className="auth-feature-dot" />
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-right" style={{ alignItems: 'flex-start', overflowY: 'auto', paddingTop: '40px' }}>
        <div className="auth-card">
          <h1>Create Account</h1>
          <p className="auth-sub">Fill in your details to get started</p>

          <form onSubmit={handleSubmit} noValidate>
            {field('fullName', 'Full Name', 'text', 'Himanshu Rajput')}
            {field('email', 'Email Address', 'email', 'you@example.com')}

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-with-icon">
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="Min 6 characters"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                />
                <button type="button" className="input-icon-btn" onClick={() => setShowPw(!showPw)}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="form-error">{errors.password}</p>}
            </div>

            {field('college', 'College / University', 'text', 'Chandigarh University')}
            {field('degree', 'Degree / Program', 'text', 'B.Tech Computer Science')}

            <div className="form-group">
              <label className="form-label">Graduation Year</label>
              <input
                type="number"
                placeholder={`${currentYear + 1}`}
                value={form.graduationYear}
                onChange={e => setForm({ ...form, graduationYear: e.target.value })}
                min={currentYear}
                max={currentYear + 5}
              />
              {errors.graduationYear && <p className="form-error">{errors.graduationYear}</p>}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}
              disabled={loading}
            >
              {loading ? <><span className="spinner-sm" /> Creating account...</> : <><UserPlus size={16} /> Create Account</>}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
