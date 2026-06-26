export const SEVERITY_CONFIG = {
  low: {
    label: 'Low',
    color: '#16A34A',
    bg: '#F0FDF4',
    text: '#15803D',
  },
  medium: {
    label: 'Medium',
    color: '#D97706',
    bg: '#FFFBEB',
    text: '#B45309',
  },
  high: {
    label: 'High',
    color: '#EA580C',
    bg: '#FFF7ED',
    text: '#C2410C',
  },
  critical: {
    label: 'Critical',
    color: '#DC2626',
    bg: '#FEF2F2',
    text: '#B91C1C',
  },
};

export const STATUS_CONFIG = {
  open: { label: 'Open', color: '#DC2626', bg: '#FEF2F2' },
  assigned: { label: 'Assigned', color: '#D97706', bg: '#FFFBEB' },
  in_progress: { label: 'In Progress', color: '#2563EB', bg: '#EFF6FF' },
  resolved: { label: 'Resolved', color: '#16A34A', bg: '#F0FDF4' },
};

export function getSeverityConfig(severity) {
  return SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.low;
}

export function getStatusConfig(status) {
  return STATUS_CONFIG[status] || STATUS_CONFIG.open;
}

/** Pin color for the map — resolved issues always show gray regardless of severity. */
export function getPinColor(issue) {
  if (issue.status === 'resolved') return '#94A3B8';
  return getSeverityConfig(issue.severity).color;
}
