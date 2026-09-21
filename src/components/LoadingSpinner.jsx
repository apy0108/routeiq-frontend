import React from 'react';

export default function LoadingSpinner({ size = 'md', message = 'Loading...', className = '' }) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3'
  };

  return (
    <div className={`flex flex-col items-center justify-center p-4 space-y-2.5 ${className}`}>
      <div
        className={`${sizeClasses[size] || sizeClasses.md} rounded-full border-gray-200 border-t-indigo-600 animate-spin`}
        role="status"
        aria-label="loading"
      />
      {message && (
        <p className="text-xs text-gray-500 font-medium">{message}</p>
      )}
    </div>
  );
}
