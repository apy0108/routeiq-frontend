import React from 'react';
import { CheckCircle, X } from 'lucide-react';

export default function SuccessMessage({ title = 'Success', message, onDismiss, className = '' }) {
  if (!message) return null;

  return (
    <div className={`p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-start justify-between text-sm ${className}`}>
      <div className="flex items-start gap-2.5">
        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          {title && <h4 className="font-semibold text-emerald-900 text-xs uppercase tracking-wide">{title}</h4>}
          <p className="text-emerald-800 text-xs mt-0.5">{message}</p>
        </div>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-emerald-500 hover:text-emerald-700 p-0.5"
          aria-label="Dismiss message"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
