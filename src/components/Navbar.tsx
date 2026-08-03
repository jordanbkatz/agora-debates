import React from 'react';
import { UserCheck, UserX, MessageSquare } from 'lucide-react';
import type { User } from 'firebase/auth';
import type { UserProfile } from '../types';

interface NavbarProps {
  user: User | null;
  profile: UserProfile | null;
  displayNameInput: string;
  onDisplayNameChange: (val: string) => void;
  isUserSignedIn: boolean;
  onHomeClick: () => void;
  onOpenAuth: () => void;
  onSignOut: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  displayNameInput,
  onDisplayNameChange,
  isUserSignedIn,
  onHomeClick,
  onOpenAuth,
  onSignOut,
}) => {
  return (
    <header style={{
      borderBottom: '1px solid var(--color-border)',
      padding: '1.25rem 2.5rem',
      backgroundColor: '#ffffff',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '1rem',
      boxShadow: 'var(--shadow-sm)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div 
        onClick={onHomeClick}
        style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
      >
        <div style={{
          background: 'var(--color-primary-gradient)',
          padding: '0.5rem',
          borderRadius: 'var(--radius-sm)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff'
        }}>
          <MessageSquare size={22} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--color-fg)', margin: 0 }}>
            Agora Debates
          </h1>
          <p className="meta" style={{ marginTop: '0.05rem', margin: 0, color: 'var(--color-fg-muted)', fontWeight: 500 }}>
            Structured Debate Platform
          </p>
        </div>
      </div>

      {/* User Account / Profile Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {profile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--color-bg-subtle)', padding: '0.4rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
            {isUserSignedIn ? <UserCheck size={16} color="var(--color-primary)" /> : <UserX size={16} color="#64748b" />}
            
            {isUserSignedIn ? (
              <input
                type="text"
                className="input"
                style={{ padding: '0.25rem 0.5rem', fontSize: '0.85rem', width: '140px' }}
                value={displayNameInput}
                onChange={(e) => onDisplayNameChange(e.target.value)}
                placeholder="Nickname"
              />
            ) : (
              <span className="meta" style={{ fontWeight: 700, fontFamily: 'monospace', color: '#334155' }}>
                {profile.displayName}
              </span>
            )}
          </div>
        )}

        {!isUserSignedIn ? (
          <button 
            onClick={onOpenAuth}
            className="btn btn-sm btn-primary"
          >
            Sign In
          </button>
        ) : (
          <button 
            onClick={onSignOut}
            className="btn btn-sm btn-danger"
          >
            Sign Out
          </button>
        )}
      </div>
    </header>
  );
};
