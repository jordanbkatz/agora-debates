import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  onConfirm,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="modal-overlay" 
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
        padding: '1rem'
      }}
    >
      <div 
        className="modal-content" 
        onClick={e => e.stopPropagation()}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-md)',
          padding: '1.75rem',
          maxWidth: '440px',
          width: '100%',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          position: 'relative'
        }}
      >
        <button 
          onClick={onClose} 
          className="btn btn-ghost" 
          aria-label="Close dialog"
          style={{ position: 'absolute', top: '1rem', right: '1rem', padding: '0.25rem', color: 'var(--color-fg-muted)' }}
        >
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            backgroundColor: '#fee2e2',
            color: 'var(--color-danger)',
            borderRadius: '50%',
            padding: '0.6rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <AlertTriangle size={22} />
          </div>
          <h3 style={{ margin: 0, fontSize: '1.25rem', textTransform: 'none', letterSpacing: 'normal' }}>
            {title}
          </h3>
        </div>

        <p style={{ margin: 0, color: 'var(--color-fg-muted)', lineHeight: 1.5, fontSize: '0.95rem' }}>
          {message}
        </p>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
          <button 
            type="button" 
            onClick={onClose} 
            className="btn btn-ghost"
            style={{ border: '1px solid var(--color-border)' }}
          >
            {cancelText}
          </button>
          <button 
            type="button" 
            onClick={() => {
              onConfirm();
              onClose();
            }} 
            className="btn"
            style={{
              backgroundColor: 'var(--color-danger)',
              color: '#ffffff',
              borderColor: 'var(--color-danger)'
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
