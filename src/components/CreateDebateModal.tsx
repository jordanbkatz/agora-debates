import React from 'react';

interface CreateDebateModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  setTitle: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  category: string;
  setCategory: (val: string) => void;
  duration: string;
  setDuration: (val: string) => void;
  isCreating: boolean;
  error: string;
  onSubmit: (e: React.FormEvent) => void;
  categories: string[];
}

export const CreateDebateModal: React.FC<CreateDebateModalProps> = ({
  isOpen,
  onClose,
  title,
  setTitle,
  description,
  setDescription,
  category,
  setCategory,
  duration,
  setDuration,
  isCreating,
  error,
  onSubmit,
  categories,
}) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(15, 23, 42, 0.6)",
      backdropFilter: "blur(4px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: "1rem"
    }}>
      <div style={{
        backgroundColor: "#ffffff",
        borderRadius: "var(--radius)",
        boxShadow: "var(--shadow-lg)",
        padding: "2rem",
        maxWidth: "600px",
        width: "100%"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.35rem", fontWeight: 700, margin: 0 }}>
            Start a New Debate Topic
          </h2>
          <button 
            onClick={onClose}
            className="btn btn-sm btn-ghost"
          >
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label className="meta" style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>
              Debate Topic Title *
            </label>
            <input
              type="text"
              required
              className="input"
              value={title}
              onChange={e => setTitle(e.target.value)}
              style={{ padding: '0.75rem', fontSize: '0.95rem' }}
            />
          </div>

          <div>
            <label className="meta" style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>
              Description (Optional)
            </label>
            <textarea
              rows={3}
              className="textarea"
              value={description}
              onChange={e => setDescription(e.target.value)}
              style={{ padding: '0.75rem', fontSize: '0.9rem' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="meta" style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>
                Category
              </label>
              <select
                className="select"
                value={category}
                onChange={e => setCategory(e.target.value)}
                style={{ padding: '0.75rem', width: '100%' }}
              >
                {categories.filter(c => c !== "All").map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="meta" style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>
                Debate Expiration
              </label>
              <select
                className="select"
                value={duration}
                onChange={e => setDuration(e.target.value)}
                style={{ padding: '0.75rem', width: '100%' }}
              >
                <option value="none">No Expiration (Default)</option>
                <option value="15">15 minutes</option>
                <option value="60">1 hour</option>
                <option value="1440">24 hours</option>
                <option value="10080">7 days</option>
              </select>
            </div>
          </div>

          {error && (
            <p className="meta" style={{ color: 'var(--color-danger)', fontSize: '0.85rem', margin: 0 }}>
              {error}
            </p>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button 
              type="submit" 
              disabled={isCreating}
              className="btn btn-primary"
              style={{ flex: 1, padding: '0.75rem', justifyContent: 'center' }}
            >
              Open Debate Topic
            </button>
            
            <button 
              type="button" 
              onClick={onClose}
              className="btn btn-ghost"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
