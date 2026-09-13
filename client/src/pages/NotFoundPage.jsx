import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--color-bg)',
      padding: '24px',
      flexDirection: 'column',
      textAlign: 'center',
    }}>
      <div style={{ maxWidth: '420px' }}>
        <div style={{
          fontSize: '96px',
          fontWeight: '900',
          background: 'linear-gradient(135deg, var(--color-primary-light), var(--color-accent))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          lineHeight: 1,
          marginBottom: '16px',
        }}>
          404
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--color-heading)', marginBottom: '10px' }}>
          Page Not Found
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--color-text2)', marginBottom: '32px', lineHeight: '1.6' }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} /> Go Back
          </button>
          <Link to="/" className="btn btn-primary">
            <Home size={16} /> Home
          </Link>
        </div>
      </div>
    </div>
  );
}
