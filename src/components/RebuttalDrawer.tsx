import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import type { Rebuttal, VoteRecord } from '../types';

interface RebuttalDrawerProps {
  rebuttals: Rebuttal[];
  userVotes: Record<string, VoteRecord>;
  isLocked: boolean;
  onClose: () => void;
  onVote: (rebuttalId: string, type: "up" | "down") => void;
  rebuttalInput: string;
  setRebuttalInput: (val: string) => void;
  isSubmitting: boolean;
  rebuttalError: string;
  onSubmit: (e: React.FormEvent) => void;
}

export const RebuttalDrawer: React.FC<RebuttalDrawerProps> = ({
  rebuttals,
  userVotes,
  isLocked,
  onClose,
  onVote,
  rebuttalInput,
  setRebuttalInput,
  isSubmitting,
  rebuttalError,
  onSubmit,
}) => {
  return (
    <section className="card" style={{ marginTop: '1.5rem' }}>
      <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Rebuttals Drawer</span>
        <button onClick={onClose} className="btn btn-sm btn-ghost">
          Close
        </button>
      </h3>

      {/* Rebuttals list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem', maxHeight: '300px', overflowY: 'auto' }}>
        {rebuttals.length === 0 ? (
          <p className="meta" style={{ color: 'var(--color-fg-muted)', fontStyle: 'italic' }}>No rebuttals submitted yet.</p>
        ) : (
          rebuttals.map(rebuttal => (
            <div key={rebuttal.id} style={{
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '1rem',
              backgroundColor: 'var(--color-bg-subtle)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span className="meta" style={{ fontWeight: 600 }}>{rebuttal.authorName}</span>
                <span className="meta">
                  {rebuttal.createdAt ? (rebuttal.createdAt.toDate ? rebuttal.createdAt.toDate().toLocaleTimeString() : new Date(rebuttal.createdAt).toLocaleTimeString()) : "recent"}
                </span>
              </div>
              <p className="serif" style={{ fontSize: '0.95rem', marginBottom: '0.75rem' }}>{rebuttal.text}</p>
              
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <button 
                  className="btn btn-sm"
                  onClick={() => onVote(rebuttal.id, "up")}
                  disabled={isLocked}
                  style={{
                    backgroundColor: userVotes[rebuttal.id]?.type === "up" ? "var(--color-primary-subtle)" : undefined,
                    borderColor: userVotes[rebuttal.id]?.type === "up" ? "var(--color-primary)" : undefined
                  }}
                >
                  <ArrowUp size={12} /> Agree
                </button>
                <button 
                  className="btn btn-sm"
                  onClick={() => onVote(rebuttal.id, "down")}
                  disabled={isLocked}
                  style={{
                    backgroundColor: userVotes[rebuttal.id]?.type === "down" ? "var(--color-danger-subtle)" : undefined,
                    borderColor: userVotes[rebuttal.id]?.type === "down" ? "var(--color-danger)" : undefined
                  }}
                >
                  <ArrowDown size={12} /> Disagree
                </button>
                <span className="meta">
                  Score: {rebuttal.consensusMetric || 0} ({rebuttal.upvotes || 0} Agree · {rebuttal.downvotes || 0} Disagree)
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Submit Rebuttal Form */}
      {!isLocked ? (
        <form onSubmit={onSubmit}>
          <label className="meta" style={{ display: 'block', marginBottom: '0.5rem' }}>Write a Rebuttal</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              required
              className="input"
              value={rebuttalInput}
              onChange={e => setRebuttalInput(e.target.value)}
              placeholder="State your counterargument..."
            />
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="btn btn-primary"
            >
              Submit Rebuttal
            </button>
          </div>
          {rebuttalError && (
            <p className="meta" style={{ color: 'var(--color-danger)', marginTop: '0.5rem' }}>
              {rebuttalError}
            </p>
          )}
        </form>
      ) : (
        <p className="meta" style={{ color: 'var(--color-danger)', textAlign: 'center' }}>Topic locked. Rebuttals closed.</p>
      )}
    </section>
  );
};
