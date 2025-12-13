import React from 'react';
import { X } from 'lucide-react';
import Button from '../common/Button';

interface SweetModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
  submitLabel?: string;
  submitVariant?: 'primary' | 'secondary' | 'danger';
  hideFooter?: boolean;
}

const SweetModal: React.FC<SweetModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  onSubmit,
  isLoading = false,
  submitLabel = 'Confirm',
  submitVariant = 'primary'
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{title}</h3>
          <button onClick={onClose} className="close-btn">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={onSubmit}>
          <div className="modal-body">
            {children}
          </div>

          <div className="modal-footer">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant={submitVariant}
              isLoading={isLoading}
            >
              {submitLabel}
            </Button>
          </div>
        </form>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(4px);
        }
        
        .modal-content {
          background-color: var(--color-surface);
          border-radius: var(--radius-lg);
          width: 90%;
          max-width: 500px;
          box-shadow: var(--shadow-lg);
          animation: slideUp 0.3s ease;
        }
        
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        .modal-header {
          padding: var(--spacing-lg);
          border-bottom: 1px solid #eee;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .modal-header h3 {
          margin: 0;
          color: var(--color-text-main);
        }
        
        .close-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--color-text-muted);
          padding: 4px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .close-btn:hover {
          background-color: #f1f1f1;
        }
        
        .modal-body {
          padding: var(--spacing-lg);
        }
        
        .modal-footer {
          padding: var(--spacing-lg);
          border-top: 1px solid #eee;
          display: flex;
          justify-content: flex-end;
          gap: var(--spacing-md);
        }
      `}</style>
    </div>
  );
};

export default SweetModal;
