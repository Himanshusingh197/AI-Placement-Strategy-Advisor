import React, { useState, useRef } from 'react';
import { X } from 'lucide-react';

export default function TagInput({ tags = [], onChange, placeholder = 'Type and press Enter…' }) {
  const [input, setInput] = useState('');
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const addTag = (raw) => {
    // Support comma-separated bulk entry
    const values = raw.split(',').map(v => v.trim()).filter(v => v && !tags.includes(v));
    if (values.length > 0) onChange([...tags, ...values]);
    setInput('');
  };

  const removeTag = (tag) => onChange(tags.filter(t => t !== tag));

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (input.trim()) addTag(input);
    } else if (e.key === 'Backspace' && !input && tags.length) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div
      ref={containerRef}
      className="tags-container"
      onClick={() => inputRef.current?.focus()}
      style={{ cursor: 'text', alignItems: 'center' }}
    >
      {tags.map(tag => (
        <span key={tag} className="tag">
          {tag}
          <button
            type="button"
            className="tag-remove"
            onClick={(e) => { e.stopPropagation(); removeTag(tag); }}
            aria-label={`Remove ${tag}`}
          >
            <X size={11} />
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => { if (input.trim()) addTag(input); }}
        placeholder={tags.length === 0 ? placeholder : ''}
        style={{
          border: 'none', background: 'transparent', outline: 'none',
          flex: '1', minWidth: '120px', fontSize: '13px', padding: '3px 4px',
          color: 'var(--color-text)',
        }}
        aria-label={placeholder}
      />
    </div>
  );
}
