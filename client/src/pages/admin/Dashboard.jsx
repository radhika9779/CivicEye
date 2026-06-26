import React, { useEffect, useState, useCallback } from 'react';
import { AlertCircle, ListChecks, CheckCircle2, Clock, ShieldAlert, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { getAdminStats, getAdminIssues } from '../../api/admin.api';
import { useSocket } from '../../hooks/useSocket';
import StatsCard from '../../components/admin/StatsCard';
import CategoryChart from '../../components/admin/CategoryChart';
import TrendChart from '../../components/admin/TrendChart';
import IssueTable from '../../components/admin/IssueTable';
import IssueDrawer from '../../components/issues/IssueDrawer';
import { FullPageSpinner } from '../../components/common/Spinner';
import useAuthStore from '../../store/authStore';
import { assignIssueToUser, updateIssueStatus } from '../../api/admin.api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentIssues, setRecentIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [sosAlerts, setSosAlerts] = useState([]);
  const user = useAuthStore((s) => s.user);

  const loadData = useCallback(async () => {
    const [statsData, issuesData] = await Promise.all([
      getAdminStats(),
      getAdminIssues({ limit: 10 }),
    ]);
    setStats(statsData);
    setRecentIssues(issuesData.issues);
  }, []);

  useEffect(() => {
    loadData().finally(() => setLoading(false));
  }, [loadData]);

  const handleSosAlert = useCallback((alert) => {
    setSosAlerts((prev) => [alert, ...prev]);
    toast.error(`🚨 SOS from ${alert.userName}`, { duration: 6000 });
  }, []);

  useSocket({ isAdmin: true, onSosAlert: handleSosAlert });

  const handleAssign = async (issueId) => {
    await assignIssueToUser(issueId, user.id);
    toast.success('Assigned to you');
    setSelectedIssue(null);
    loadData();
  };

  const handleUpdateStatus = async (issueId, status, resolutionNote) => {
    await updateIssueStatus(issueId, status, resolutionNote);
    toast.success('Status updated');
    setSelectedIssue(null);
    loadData();
  };

  if (loading) return <FullPageSpinner label="Loading dashboard…" />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 pb-28">
      {sosAlerts.length > 0 && (
        <div className="space-y-2 mb-5">
          {sosAlerts.map((alert, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 animate-slide-up"
            >
              <div className="flex items-center gap-3">
                <ShieldAlert className="text-severity-critical flex-shrink-0" size={20} />
                <p className="text-sm">
                  <span className="font-semibold">SOS from {alert.userName}</span> — live location
                  shared at {new Date(alert.time).toLocaleTimeString()}
                </p>
              </div>
              <button
                onClick={() => setSosAlerts((prev) => prev.filter((_, i) => i !== idx))}
                className="p-1 hover:bg-red-100 rounded-full"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      <h1 className="font-display font-bold text-2xl mb-5">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <StatsCard label="Total Issues" value={stats.total} icon={ListChecks} accent="#2563EB" />
        <StatsCard label="Open" value={stats.open} icon={AlertCircle} accent="#DC2626" />
        <StatsCard label="Resolved" value={stats.resolved} icon={CheckCircle2} accent="#16A34A" />
        <StatsCard
          label="Avg Resolution"
          value={stats.avg_resolution_hours}
          suffix="hrs"
          icon={Clock}
          accent="#D97706"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-5">
        <CategoryChart data={stats.by_category} />
        <TrendChart data={stats.daily_trend} />
      </div>

      <h2 className="font-display font-semibold text-lg mb-3">Recent Issues</h2>
      <IssueTable issues={recentIssues} onRowClick={setSelectedIssue} />

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
