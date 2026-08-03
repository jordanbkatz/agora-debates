import React, { useState } from 'react';
import { Lock, Unlock, Clock, Trash2 } from 'lucide-react';
import type { Debate } from '../types';
import { ConfirmModal } from './ConfirmModal';

interface DebateCardProps {
  debate: Debate;
  onSelectDebate: (debate: Debate) => void;
  isExpired: boolean;
  formatExpiration: (debate: Debate) => string;
  currentUserId?: string;
  onDelete?: (e: React.MouseEvent, debate: Debate) => void;
}

export const DebateCard: React.FC<DebateCardProps> = ({
  debate,
  onSelectDebate,
  isExpired,
  formatExpiration,
  currentUserId,
  onDelete,
}) => {
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const locked = isExpired || debate.isLocked;
  const isCreator = Boolean(currentUserId && currentUserId === debate.creatorId);

  return (
    <>
    <div 
      onClick={() => onSelectDebate(debate)}
      className="card"
      style={{
        cursor: 'pointer',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        borderTop: '3px solid var(--color-primary)'
      }}
    >
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span className="badge" style={{ fontSize: '0.75rem' }}>{debate.category}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="meta" style={{ 
              fontSize: '0.7rem', 
              color: locked ? 'var(--color-danger)' : 'var(--color-success)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontWeight: 600
            }}>
              {locked ? <Lock size={12} /> : <Unlock size={12} />}
              {locked ? "LOCKED" : "ACTIVE"}
            </span>
            {isCreator && onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsConfirmDeleteOpen(true);
                }}
                className="btn btn-sm btn-ghost"
                title="Delete debate topic"
                aria-label="Delete debate topic"
                style={{
                  padding: '0.2rem 0.4rem',
                  color: 'var(--color-danger)',
                  lineHeight: 1
                }}
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>
        </div>

        <h3 style={{ fontSize: '1.1rem', textTransform: 'none', letterSpacing: 'normal', margin: '0 0 0.5rem 0', lineHeight: 1.35 }}>
          {debate.title}
        </h3>

        {debate.description && (
          <p className="meta" style={{
            color: 'var(--color-fg-muted)',
            fontSize: '0.8rem',
            lineHeight: 1.4,
            marginBottom: '0.75rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {debate.description}
          </p>
        )}
      </div>

      <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem', marginTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <span className="meta" style={{ color: 'var(--color-fg-muted)', fontSize: '0.75rem' }}>
          By {debate.creatorName || "Anonymous"}
        </span>

        <span className="meta" style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <Clock size={12} />
          {debate.expirationTime ? formatExpiration(debate) : "No expiration"}
        </span>
      </div>
    </div>

    <ConfirmModal 
      isOpen={isConfirmDeleteOpen}
      title="Delete Debate Topic"
      message={`Are you sure you want to delete "${debate.title}"? All arguments in this debate will be permanently removed.`}
      confirmText="Delete Debate"
      onConfirm={() => {
        if (onDelete) {
          const fakeEvent = { stopPropagation: () => {} } as any;
          onDelete(fakeEvent, debate);
        }
      }}
      onClose={() => setIsConfirmDeleteOpen(false)}
    />
    </>
  );
};
