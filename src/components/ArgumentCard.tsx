import React, { useState } from 'react';
import { BookOpen, ExternalLink, MessageSquare, Trash2 } from 'lucide-react';
import type { Argument, VoteRecord } from '../types';
import { VotingPanel } from './VotingPanel';
import { ConfirmModal } from './ConfirmModal';

interface ArgumentCardProps {
  arg: Argument;
  onVote: (type: "up" | "down") => void;
  userVote: VoteRecord | undefined;
  isExpired: boolean;
  onExpandRebuttals: () => void;
  isRebuttalsOpen: boolean;
  currentUserId?: string;
  onDelete?: (arg: Argument) => void;
}

export const ArgumentCard: React.FC<ArgumentCardProps> = ({
  arg,
  onVote,
  userVote,
  isExpired,
  onExpandRebuttals,
  isRebuttalsOpen,
  currentUserId,
  onDelete,
}) => {
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const isAuthor = Boolean(currentUserId && currentUserId === arg.authorId);

  return (
    <>
      <div className="card" style={{
        borderLeft: `4px solid ${arg.side === "pro" ? 'var(--color-primary)' : 'var(--color-danger)'}`,
        padding: '1.25rem'
      }}>
        {/* Top author row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
            <span className="meta" style={{ fontWeight: 600 }}>{arg.authorName}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="meta">
              {arg.createdAt ? (arg.createdAt.toDate ? arg.createdAt.toDate().toLocaleDateString() : new Date(arg.createdAt).toLocaleDateString()) : "recent"}
            </span>
            {isAuthor && onDelete && (
              <button
                onClick={() => setIsConfirmDeleteOpen(true)}
                className="btn btn-sm btn-ghost"
                title="Delete your argument"
                aria-label="Delete argument"
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

      {/* Main text content */}
      <p className="serif" style={{ marginBottom: '1rem' }}>
        {arg.text}
      </p>

      {arg.evidence && arg.evidence.length > 0 && (
        <div style={{
          backgroundColor: 'var(--color-bg-subtle)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-sm)',
          padding: '0.5rem 0.75rem',
          marginBottom: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem'
        }}>
          <span className="meta" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <BookOpen size={10} /> Sources:
          </span>
          {arg.evidence.map((ev, i) => (
            <a 
              key={i} 
              href={ev.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="meta"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.2rem'
              }}
            >
              {ev.title} <ExternalLink size={10} />
            </a>
          ))}
        </div>
      )}

      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        borderTop: '1px solid var(--color-border)', 
        paddingTop: '0.75rem',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        <VotingPanel 
          onVote={onVote}
          userVote={userVote}
          disabled={isExpired}
          score={arg.consensusMetric}
        />

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span className="meta">{arg.upvotes} Agree · {arg.downvotes} Disagree</span>
          <button 
            onClick={onExpandRebuttals} 
            className="btn btn-sm btn-ghost"
          >
            <MessageSquare size={12} /> {isRebuttalsOpen ? "Hide" : "Rebuttals"}
          </button>
        </div>
      </div>
    </div>

    <ConfirmModal 
      isOpen={isConfirmDeleteOpen}
      title="Delete Argument"
      message="Are you sure you want to delete this argument? This action cannot be undone."
      confirmText="Delete Argument"
      onConfirm={() => onDelete && onDelete(arg)}
      onClose={() => setIsConfirmDeleteOpen(false)}
    />
    </>
  );
};
