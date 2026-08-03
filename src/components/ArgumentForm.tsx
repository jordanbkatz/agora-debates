import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { Source } from '../types';

interface ArgumentFormProps {
  side: "pro" | "con";
  text: string;
  setText: (val: string) => void;
  sources: Source[];
  onAddSource: () => void;
  onUpdateSource: (index: number, field: "title" | "url", value: string) => void;
  onRemoveSource: (index: number) => void;
  isSubmitting: boolean;
  error: string;
  onSubmit: () => void;
}

export const ArgumentForm: React.FC<ArgumentFormProps> = ({
  side,
  text,
  setText,
  sources,
  onAddSource,
  onUpdateSource,
  onRemoveSource,
  isSubmitting,
  error,
  onSubmit,
}) => {
  const isPro = side === "pro";

  return (
    <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
      <h4 style={{ fontSize: '0.9rem', marginBottom: '0.75rem' }}>
        Submit {isPro ? "Pro" : "Con"} Argument
      </h4>
      
      <div style={{ marginBottom: '0.75rem' }}>
        <textarea
          rows={3}
          required
          className="textarea"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder={`State your ${isPro ? "pro" : "con"} argument clearly...`}
        />
      </div>

      <div style={{ marginBottom: '0.75rem' }}>
        <label className="meta" style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>
          Sources & Citations
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {sources.map((source, index) => (
            <div key={index} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input
                type="text"
                className="input"
                style={{ flex: 1 }}
                value={source.title}
                onChange={e => onUpdateSource(index, "title", e.target.value)}
                placeholder="Source Title"
              />
              <input
                type="url"
                className="input"
                style={{ flex: 1 }}
                value={source.url}
                onChange={e => onUpdateSource(index, "url", e.target.value)}
                placeholder="Source Link (Optional)"
              />
              {sources.length > 1 && (
                <button
                  type="button"
                  className="btn btn-sm btn-ghost"
                  onClick={() => onRemoveSource(index)}
                  title="Remove source"
                  style={{ color: 'var(--color-danger)', padding: '0.35rem 0.5rem' }}
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          className="btn btn-sm btn-ghost"
          onClick={onAddSource}
          style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem' }}
        >
          <Plus size={14} /> Add Additional Source
        </button>
      </div>

      {error && (
        <p className="meta" style={{ color: 'var(--color-danger)', marginBottom: '0.5rem' }}>
          {error}
        </p>
      )}

      <button 
        className="btn btn-primary"
        onClick={onSubmit}
        disabled={isSubmitting}
      >
        Publish Argument
      </button>
    </div>
  );
};
