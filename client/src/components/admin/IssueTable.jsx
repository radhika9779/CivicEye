import React from 'react';
import { SeverityBadge, StatusBadge } from '../common/Badge';
import { getCategoryConfig } from '../../utils/categoryConfig';
import { formatDate, getTicketId } from '../../utils/formatters';

export default function IssueTable({ issues = [], onRowClick }) {
  if (issues.length === 0) {
    return (
      <div className="bg-civic-card rounded-xl border border-civic-border p-10 text-center">
        <p className="text-sm text-civic-ink">No issues match these filters.</p>
      </div>
    );
  }

  return (
    <div className="bg-civic-card rounded-xl border border-civic-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-civic-surface text-left text-xs font-semibold uppercase tracking-wide text-civic-ink">
              <th className="px-4 py-3">Issue</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Severity</th>
              <th className="px-4 py-3">Ward</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue) => {
              const categoryConfig = getCategoryConfig(issue.category);
              return (
                <tr
                  key={issue.id}
                  onClick={() => onRowClick(issue)}
                  className="border-t border-civic-border hover:bg-civic-surface cursor-pointer"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {issue.photo_url ? (
                        <img src={issue.photo_url} alt="" className="w-9 h-9 rounded-lg object-cover" />
                      ) : (
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${categoryConfig.color}15` }}
                        >
                          <categoryConfig.icon size={16} style={{ color: categoryConfig.color }} />
                        </div>
                      )}
                      <div className="min-w-0">
                        <span className="font-medium max-w-[220px] truncate block">{issue.title}</span>
                        <span className="text-[10px] font-data text-slate-400 block">{getTicketId(issue.id)}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-civic-ink">{categoryConfig.label}</td>
                  <td className="px-4 py-3">
                    <SeverityBadge severity={issue.severity} score={issue.ai_score} size="sm" />
                  </td>
                  <td className="px-4 py-3 text-civic-ink">{issue.ward?.name || '—'}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={issue.status} size="sm" />
                  </td>
                  <td className="px-4 py-3 text-civic-ink font-data text-xs">
                    {formatDate(issue.created_at)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
