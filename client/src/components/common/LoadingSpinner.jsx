import React from 'react';

export default function LoadingSpinner({ message = 'Loading...', size = 'md' }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '14px',
      padding: '56px 32px',
      color: 'var(--color-text2)',
    }}>
      <div className={size === 'sm' ? 'spinner-sm' : 'spinner'} style={size === 'sm' ? {} : { width: '36px', height: '36px' }} />
      <p style={{ fontSize: '14px', color: 'var(--color-text3)' }}>{message}</p>
    </div>
  );
}

export function AILoadingSpinner({ message = 'Analyzing with AI...' }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '20px',
      padding: '56px 32px',
      textAlign: 'center',
    }}>
      <div style={{
        width: '68px', height: '68px',
        background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
        borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 0 32px rgba(99,102,241,0.45)',
        animation: 'ai-pulse 2s ease-in-out infinite',
      }}>
        <span style={{ fontSize: '30px' }}>🤖</span>
      </div>
      <div>
        <p style={{ fontSize: '17px', fontWeight: '700', color: 'var(--color-heading)', marginBottom: '5px' }}>
          {message}
        </p>
        <p style={{ fontSize: '13px', color: 'var(--color-text3)' }}>
          Powered by Google Gemini · Usually takes 15–30 seconds
        </p>
      </div>
      <style>{`
        @keyframes ai-pulse {
          0%,100% { transform: scale(1); box-shadow: 0 0 32px rgba(99,102,241,0.45); }
          50%      { transform: scale(1.06); box-shadow: 0 0 52px rgba(99,102,241,0.65); }
        }
      `}</style>
    </div>
  );
}
