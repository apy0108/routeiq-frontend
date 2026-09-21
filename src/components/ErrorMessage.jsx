import React from 'react';
import { AlertCircle, X } from 'lucide-react';

export default function ErrorMessage({ title = 'Error', message, onDismiss, className = '' }) {
  if (!message) return null;

  return (
    <div className={`p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 flex items-start justify-between text-sm ${className}`}>
      <div className="flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
        <div>
          {title && <h4 className="font-semibold text-red-800 text-xs uppercase tracking-wide">{title}</h4>}
          <p className="text-red-700 text-xs mt-0.5">{message}</p>
        </div>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-red-400 hover:text-red-600 p-0.5"
          aria-label="Dismiss error"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
