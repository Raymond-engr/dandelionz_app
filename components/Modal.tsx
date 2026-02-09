import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  isDestructive?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  isDestructive = false,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-sm bg-white rounded-xl shadow-xl overflow-hidden transform transition-all scale-100 opacity-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-6">{description}</p>
        
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium text-white transition-colors ${
              isDestructive 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-system-blue-light hover:bg-[#020360]'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
