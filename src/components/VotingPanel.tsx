import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import type { VoteRecord } from '../types';

interface VotingPanelProps {
  onVote: (type: "up" | "down") => void;
  userVote: VoteRecord | undefined;
  disabled?: boolean;
  score?: number;
}

export const VotingPanel: React.FC<VotingPanelProps> = ({
  onVote,
  userVote,
  disabled = false,
  score,
}) => {
  return (
    <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
      <button 
        className="btn btn-sm" 
        onClick={() => onVote("up")}
        disabled={disabled}
        style={{ 
          backgroundColor: userVote?.type === "up" ? "var(--color-primary-subtle)" : undefined,
          borderColor: userVote?.type === "up" ? "var(--color-primary)" : undefined
        }}
      >
        <ArrowUp size={12} /> Agree
      </button>
      <button 
        className="btn btn-sm" 
        onClick={() => onVote("down")}
        disabled={disabled}
        style={{ 
          backgroundColor: userVote?.type === "down" ? "var(--color-danger-subtle)" : undefined,
          borderColor: userVote?.type === "down" ? "var(--color-danger)" : undefined
        }}
      >
        <ArrowDown size={12} /> Disagree
      </button>
      {typeof score === 'number' && (
        <span className="meta" style={{ fontWeight: 600 }}>
          {score > 0 ? `+${score}` : score}
        </span>
      )}
    </div>
  );
};
