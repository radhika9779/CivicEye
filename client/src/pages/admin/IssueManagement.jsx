import React, { useEffect, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { getAdminIssues, assignIssueToUser, updateIssueStatus } from '../../api/admin.api';
import { useSocket } from '../../hooks/useSocket';
import IssueTable from '../../components/admin/IssueTable';
import IssueDrawer from '../../components/issues/IssueDrawer';
import { FullPageSpinner } from '../../components/common/Spinner';
import useAuthStore from '../../store/authStore';
import { CATEGORIES, getCategoryConfig } from '../../utils/categoryConfig';

const STATUS_OPTIONS = ['open', 'assigned', 'in_progress', 'resolved'];
const SEVERITY_OPTIONS = ['low', 'medium', 'high', 'critical'];
const LIMIT = 10;

export default function IssueManagement() {
  const [issues, setIssues] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ status: '', category: '', severity: '' });
  const [loading, setLoading] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const user = useAuthStore((s) => s.user);

  const loadIssues = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: LIMIT };
      if (filters.status) params.status = filters.status;
      if (filters.category) params.category = filters.category;
      if (filters.severity) params.severity = filters.severity;
      const data = await getAdminIssues(params);
      setIssues(data.issues);
      setTotal(data.total);
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    loadIssues();
  }, [loadIssues]);

  useSocket({ isAdmin: true });

  const handleAssign = async (issueId) => {
    await assignIssueToUser(issueId, user.id);
    toast.success('Assigned to you');
    setSelectedIssue(null);
    loadIssues();
  };

  const handleUpdateStatus = async (issueId, status, resolutionNote) => {
    await updateIssueStatus(issueId, status, resolutionNote);
    toast.success('Status updated');
    setSelectedIssue(null);
    loadIssues();
  };

  const updateFilter = (key, value) => {
    setPage(1);
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 pb-28">
      <h1 className="font-display font-bold text-2xl mb-5">Issue Management</h1>

      <div className="flex flex-wrap gap-2 mb-4">
        <select
          value={filters.status}
          onChange={(e) => updateFilter('status', e.target.value)}
          className="px-3 py-2 rounded-lg border border-civic-border text-sm bg-civic-card"
        >
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s.replace('_', ' ')}
            </option>
          ))}
        </select>
        <select
          value={filters.category}
          onChange={(e) => updateFilter('category', e.target.value)}
          className="px-3 py-2 rounded-lg border border-civic-border text-sm bg-civic-card"
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {getCategoryConfig(c).label}
            </option>
          ))}
        </select>
        <select
          value={filters.severity}
          onChange={(e) => updateFilter('severity', e.target.value)}
          className="px-3 py-2 rounded-lg border border-civic-border text-sm bg-civic-card"
        >
          <option value="">All severities</option>
          {SEVERITY_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <FullPageSpinner label="Loading issues…" />
      ) : (
        <>
          <IssueTable issues={issues} onRowClick={setSelectedIssue} />

          <div className="flex items-center justify-between mt-4">
            <p className="text-xs text-civic-ink">
              Showing {issues.length} of {total} issues
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-civic-border disabled:opacity-40"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm font-data">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg border border-civic-border disabled:opacity-40"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </>
      )}

      {selectedIssue && (
        <IssueDrawer
          issue={selectedIssue}
          currentUserId={user.id}
          onClose={() => setSelectedIssue(null)}
          onAssign={handleAssign}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  );
}
