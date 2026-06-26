import React from 'react';
import { getSeverityConfig, getStatusConfig } from '../../utils/severityConfig';

export function SeverityBadge({ severity, score, size = 'md' }) {
  const config = getSeverityConfig(severity);
  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium font-data uppercase tracking-wide ${padding}`}
      style={{ backgroundColor: config.bg, color: config.text }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: config.color }} />
      {config.label}
      {score !== undefined && <span className="opacity-70">· {score.toFixed(1)}</span>}
    </span>
  );
}

export function StatusBadge({ status, size = 'md' }) {
  const config = getStatusConfig(status);
  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${padding}`}
      style={{ backgroundColor: config.bg, color: config.color }}
    >
      {config.label}
    </span>
  );
}

export default SeverityBadge;
