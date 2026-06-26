import React, { useEffect, useState } from 'react';
import { FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { getMyIssues } from '../../api/issues.api';
import IssueCard from '../../components/issues/IssueCard';
import { FullPageSpinner } from '../../components/common/Spinner';

export default function MyReports() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyIssues()
      .then((data) => setIssues(data.issues))
      .catch(() => toast.error('Could not load your reports'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <FullPageSpinner label="Loading your reports…" />;

  return (
    <div className="max-w-lg mx-auto px-4 py-6 pb-28">
      <h1 className="font-display font-bold text-2xl mb-1">My Reports</h1>
      <p className="text-sm text-civic-ink mb-6">Everything you've reported, and where it stands.</p>

      {issues.length === 0 ? (
        <div className="flex flex-col items-center text-center py-16 gap-3">
          <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center">
            <FileText size={24} className="text-civic-blue" />
          </div>
          <p className="font-display font-semibold">No reports yet</p>
          <p className="text-sm text-civic-ink max-w-xs">
            Spotted a pothole or a broken streetlight? Reporting it takes less than a minute.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {issues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      )}
    </div>
  );
}
