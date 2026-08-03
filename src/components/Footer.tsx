import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer style={{
      borderTop: '1px solid var(--color-border)',
      padding: '1.5rem 2rem',
      backgroundColor: '#ffffff',
      textAlign: 'center',
      marginTop: 'auto'
    }}>
      <a 
        href="https://jordankatz.dev" 
        target="_blank" 
        rel="noopener noreferrer"
        style={{
          color: 'var(--color-fg-muted)',
          textTransform: 'uppercase',
          fontSize: '0.7rem',
          fontWeight: 600,
          letterSpacing: '0.12em',
          textDecoration: 'none'
        }}
      >
        a Jordan Katz project
      </a>
    </footer>
  );
};
