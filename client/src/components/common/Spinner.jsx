import React from 'react';

export default function Spinner({ size = 24, className = '' }) {
  return (
    <div
      className={`inline-block border-[3px] border-civic-border border-t-civic-blue rounded-full animate-spin ${className}`}
      style={{ width: size, height: size }}
      role="status"
      aria-label="Loading"
    />
  );
}

export function FullPageSpinner({ label = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] gap-3">
      <Spinner size={32} />
      <p className="text-sm text-civic-ink font-medium">{label}</p>
    </div>
  );
}
