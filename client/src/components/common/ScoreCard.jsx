import React from 'react';

const getAutoColor = (pct) => {
  if (pct >= 75) return 'var(--color-success)';
  if (pct >= 50) return 'var(--color-warning)';
  return 'var(--color-danger)';
};

export default function ScoreCard({ title, score, icon, color = 'auto', subtitle }) {
  const pct = Math.min(100, Math.max(0, score || 0));
  const c = color === 'auto' ? getAutoColor(pct) : color;

  return (
    <div className="card" style={{ textAlign: 'center', padding: '22px 18px' }}>
      {icon && <div style={{ fontSize: '26px', marginBottom: '10px' }}>{icon}</div>}
      <div style={{
        width: '76px', height: '76px',
        borderRadius: '50%',
        border: `3px solid ${c}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 12px',
        background: `${c}12`,
        boxShadow: `0 0 18px ${c}28`,
        position: 'relative',
      }}>
        <span style={{ fontSize: '20px', fontWeight: '800', color: c }}>{pct}</span>
      </div>
      <p style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-heading)', marginBottom: '4px' }}>{title}</p>
      {subtitle && <p style={{ fontSize: '11.5px', color: 'var(--color-text3)', marginBottom: '8px' }}>{subtitle}</p>}
      <div className="progress-bar" style={{ marginTop: subtitle ? 0 : '8px', height: '5px' }}>
        <div className="progress-fill" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${c}, ${c}bb)` }} />
      </div>
    </div>
  );
}
