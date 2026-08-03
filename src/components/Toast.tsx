import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const isSuccess = type === 'success';
  const isError = type === 'error';

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        zIndex: 200,
        backgroundColor: isSuccess ? '#10b981' : isError ? '#ef4444' : '#2563eb',
        color: '#ffffff',
        padding: '0.75rem 1.25rem',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        fontSize: '0.9rem',
        fontWeight: 500,
        animation: 'slideUp 0.2s ease'
      }}
    >
      {isSuccess ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
      <span>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: '#ffffff',
          cursor: 'pointer',
          padding: '0.1rem',
          display: 'flex',
          alignItems: 'center',
          opacity: 0.85
        }}
      >
        <X size={14} />
      </button>
    </div>
  );
};
