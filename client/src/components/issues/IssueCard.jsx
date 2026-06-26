import React from 'react';
import { Link } from 'react-router-dom';
import { ThumbsUp, MapPin } from 'lucide-react';
import { getCategoryConfig } from '../../utils/categoryConfig';
import { SeverityBadge, StatusBadge } from '../common/Badge';
import { timeAgo, getTicketId } from '../../utils/formatters';

export default function IssueCard({ issue }) {
  const categoryConfig = getCategoryConfig(issue.category);
  const Icon = categoryConfig.icon;

  return (
    <Link
      to={`/issues/${issue.id}`}
      className="block bg-civic-card rounded-xl shadow-card border border-civic-border p-4 hover:border-civic-blue/40 transition-colors"
    >
      <div className="flex items-start gap-3">
        {issue.photo_url ? (
          <img
            src={issue.photo_url}
            alt=""
            className="w-14 h-14 rounded-lg object-cover flex-shrink-0 bg-slate-100"
          />
        ) : (
          <div
            className="w-14 h-14 rounded-lg flex-shrink-0 flex items-center justify-center"
            style={{ backgroundColor: `${categoryConfig.color}15` }}
          >
            <Icon size={22} style={{ color: categoryConfig.color }} />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-data font-semibold text-slate-400 mb-0.5">{getTicketId(issue.id)}</p>
          <p className="font-display font-semibold text-sm leading-snug truncate">{issue.title}</p>
          <p className="text-xs text-civic-ink mt-0.5 flex items-center gap-1">
            <MapPin size={12} /> {issue.address || categoryConfig.label}
          </p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <SeverityBadge severity={issue.severity} score={issue.ai_score} size="sm" />
            <StatusBadge status={issue.status} size="sm" />
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <span className="text-xs text-slate-400">{timeAgo(issue.created_at)}</span>
          <span className="flex items-center gap-1 text-xs font-data text-civic-ink">
            <ThumbsUp size={12} /> {issue.upvote_count}
          </span>
        </div>
      </div>
    </Link>
  );
}
