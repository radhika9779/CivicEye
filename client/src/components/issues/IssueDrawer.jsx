import React, { useState } from 'react';
import { X, MapPin, User } from 'lucide-react';
import ScoreGauge from '../common/ScoreGauge';
import { StatusBadge } from '../common/Badge';
import Button from '../common/Button';
import StatusTimeline from '../issues/StatusTimeline';
import { getSeverityConfig } from '../../utils/severityConfig';
import { getCategoryConfig } from '../../utils/categoryConfig';
import { formatDateTime, getTicketId } from '../../utils/formatters';

const STATUS_OPTIONS = ['open', 'assigned', 'in_progress', 'resolved'];

export default function IssueDrawer({ issue, currentUserId, onClose, onAssign, onUpdateStatus }) {
  const [resolutionNote, setResolutionNote] = useState(issue.resolution_note || '');
  const [statusDraft, setStatusDraft] = useState(issue.status);
  const [saving, setSaving] = useState(false);

  if (!issue) return null;

  const severityConfig = getSeverityConfig(issue.severity);
  const categoryConfig = getCategoryConfig(issue.category);
  const isAssignedToMe = issue.assigned_to === currentUserId;

  const handleSaveStatus = async () => {
    setSaving(true);
    try {
      await onUpdateStatus(issue.id, statusDraft, resolutionNote);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-civic-dark/40 animate-fade-in" onClick={onClose} />
      <div className="relative w-full max-w-md bg-civic-card h-full overflow-y-auto animate-slide-up shadow-floating">
        <div className="flex items-center justify-between px-5 py-4 border-b border-civic-border sticky top-0 bg-civic-card z-10">
          <h3 className="font-display font-semibold text-lg">Issue Details</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-6">
          {issue.photo_url && (
            <img src={issue.photo_url} alt="" className="w-full h-44 object-cover rounded-xl" />
          )}

          <div>
            <div className="flex items-center gap-2 text-civic-ink mb-1">
              <categoryConfig.icon size={14} />
              <span className="text-xs font-medium uppercase tracking-wide">{categoryConfig.label}</span>
            </div>
            <h4 className="font-display font-semibold text-xl leading-snug">{issue.title}</h4>
            <p className="text-xs font-data font-semibold text-slate-400 mt-0.5">{getTicketId(issue.id)}</p>
            <p className="text-sm text-civic-ink mt-2">{issue.description}</p>
            <p className="flex items-center gap-1 text-xs text-civic-ink mt-2">
              <MapPin size={12} /> {issue.address}
            </p>
            <p className="flex items-center gap-1 text-xs text-civic-ink mt-1">
              <User size={12} />
              {issue.is_anonymous ? 'Anonymous' : issue.reporter?.name || 'Unknown'} · {formatDateTime(issue.created_at)}
            </p>
          </div>

          <div className="bg-civic-surface rounded-xl p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-civic-ink mb-3">
              AI Score Breakdown
            </p>
            <div className="flex items-center gap-5">
              <ScoreGauge value={issue.ai_score} max={10} color={severityConfig.color} size={110} strokeWidth={9} />
              <div className="flex-1 space-y-1.5">
                {(issue.ai_reasons || []).map((r, idx) => (
                  <p key={idx} className="text-xs font-data text-civic-ink leading-snug">
                    • {r}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-civic-ink mb-3">Status</p>
            <StatusTimeline status={issue.status} createdAt={issue.created_at} resolvedAt={issue.resolved_at} />
          </div>

          <div className="border-t border-civic-border pt-5 space-y-3">
            {!issue.assigned_to && (
              <Button fullWidth onClick={() => onAssign(issue.id)}>
                Assign to Me
              </Button>
            )}
            {issue.assigned_to && (
              <p className="text-sm text-civic-ink">
                Assigned to <span className="font-semibold">{isAssignedToMe ? 'you' : issue.assignee?.name}</span>
              </p>
            )}

            <div>
              <label htmlFor="status-select" className="text-sm font-semibold mb-1.5 block">
                Update status
              </label>
              <select
                id="status-select"
                value={statusDraft}
                onChange={(e) => setStatusDraft(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-civic-border text-sm outline-none focus:border-civic-blue"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            {statusDraft === 'resolved' && (
              <div>
                <label htmlFor="resolution-note" className="text-sm font-semibold mb-1.5 block">
                  Resolution note
                </label>
                <textarea
                  id="resolution-note"
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  rows={3}
                  placeholder="What was done to fix this?"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-civic-border text-sm outline-none focus:border-civic-blue resize-none"
                />
              </div>
            )}

            <Button fullWidth onClick={handleSaveStatus} loading={saving}>
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
