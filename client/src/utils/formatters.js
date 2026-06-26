/** "2 hours ago", "3 days ago", etc. */
export function timeAgo(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

/** "25 Jun 2026" */
export function formatDate(dateString) {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/** "25 Jun 2026, 3:45 PM" */
export function formatDateTime(dateString) {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

/** Distance in km/m for "350m away" style labels */
export function formatDistance(km) {
  if (km == null) return '';
  if (km < 1) return `${Math.round(km * 1000)}m`;
  return `${km.toFixed(1)}km`;
}

/** Human-readable ticket code derived from the UUID, e.g. "CIV-A3F291".
 * The real identifier is still the UUID — this is just a friendlier label
 * for the UI, officers, and citizens to reference out loud or in notes. */
export function getTicketId(uuid) {
  if (!uuid) return '';
  return `CIV-${uuid.replace(/-/g, '').slice(0, 6).toUpperCase()}`;
}

/** Title-cases snake_case category/type values: 'water_leak' -> 'Water Leak' */
export function titleCase(str) {
  if (!str) return '';
  return str
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}
