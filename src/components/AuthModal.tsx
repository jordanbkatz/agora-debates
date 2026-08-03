import React from 'react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSignUp: boolean;
  setIsSignUp: (val: boolean) => void;
  authEmail: string;
  setAuthEmail: (val: string) => void;
  authPassword: string;
  setAuthPassword: (val: string) => void;
  authError: string;
  setAuthError: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onGoogleSignIn: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  isSignUp,
  setIsSignUp,
  authEmail,
  setAuthEmail,
  authPassword,
  setAuthPassword,
  authError,
  setAuthError,
  onSubmit,
  onGoogleSignIn,
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
        maxWidth: "400px",
        width: "100%"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>
            {isSignUp ? "Create Account" : "Sign In"}
          </h2>
          <button 
            onClick={onClose}
            className="btn btn-sm btn-ghost"
          >
            ✕
          </button>
        </div>

        {authError && (
          <div style={{
            borderRadius: "var(--radius-sm)",
            backgroundColor: "var(--color-danger-subtle)",
            color: "var(--color-danger)",
            padding: "0.5rem 0.75rem",
            marginBottom: "1rem",
            fontSize: "0.85rem",
            fontWeight: 500
          }}>
            {authError}
          </div>
        )}

        <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <label className="meta" style={{ fontWeight: 600 }}>Email</label>
            <input 
              type="email" 
              value={authEmail}
              onChange={(e) => setAuthEmail(e.target.value)}
              required
              className="input"
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <label className="meta" style={{ fontWeight: 600 }}>Password</label>
            <input 
              type="password" 
              value={authPassword}
              onChange={(e) => setAuthPassword(e.target.value)}
              required
              className="input"
            />
          </div>

          <button 
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", justifyContent: "center", marginTop: "0.25rem" }}
          >
            {isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <div style={{ display: "flex", alignItems: "center", margin: "1.25rem 0" }}>
          <div style={{ flex: 1, height: "1px", backgroundColor: "var(--color-border)" }} />
          <span className="meta" style={{ padding: "0 0.75rem" }}>or</span>
          <div style={{ flex: 1, height: "1px", backgroundColor: "var(--color-border)" }} />
        </div>

        <button 
          onClick={onGoogleSignIn}
          className="btn"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            width: "100%"
          }}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
          </svg>
          Sign in with Google
        </button>

        <div style={{ marginTop: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <button 
            onClick={onClose}
            className="btn btn-ghost"
            style={{ width: "100%", justifyContent: "center", color: "var(--color-fg-muted)" }}
          >
            Continue as Guest
          </button>

          <button 
            onClick={() => { setIsSignUp(!isSignUp); setAuthError(""); }}
            className="btn btn-ghost"
            style={{ width: "100%", justifyContent: "center" }}
          >
            {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};
