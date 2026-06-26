import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Map as MapIcon, List } from 'lucide-react';
import useIssueStore from '../../store/issueStore';
import { useSocket } from '../../hooks/useSocket';
import IssueMap from '../../components/issues/IssueMap';
import IssueCard from '../../components/issues/IssueCard';
import { FullPageSpinner } from '../../components/common/Spinner';
import { CATEGORIES, getCategoryConfig } from '../../utils/categoryConfig';

export default function Home() {
  const issues = useIssueStore((s) => s.issues);
  const isLoading = useIssueStore((s) => s.isLoading);
  const categoryFilter = useIssueStore((s) => s.categoryFilter);
  const setCategoryFilter = useIssueStore((s) => s.setCategoryFilter);
  const fetchIssues = useIssueStore((s) => s.fetchIssues);
  const getFilteredIssues = useIssueStore((s) => s.getFilteredIssues);
  const [view, setView] = useState('map'); // 'map' | 'list'

  useSocket();

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  const filtered = getFilteredIssues();

  return (
    <div className="relative h-[calc(100vh-64px)] md:h-[calc(100vh-64px)]">
      {/* Filter bar */}
      <div className="absolute top-3 left-3 right-3 z-20 flex items-center gap-2">
        <div className="flex-1 flex gap-2 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setCategoryFilter(null)}
            className={`flex-shrink-0 px-3.5 py-2 rounded-full text-xs font-semibold shadow-card border ${
              !categoryFilter
                ? 'bg-civic-blue text-white border-civic-blue'
                : 'bg-white text-civic-ink border-civic-border'
            }`}
          >
            All
          </button>
          {CATEGORIES.map((cat) => {
            const config = getCategoryConfig(cat);
            const active = categoryFilter === cat;
            return (
              <button
                key={cat}
                onClick={() => setCategoryFilter(active ? null : cat)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold shadow-card border whitespace-nowrap ${
                  active ? 'bg-civic-blue text-white border-civic-blue' : 'bg-white text-civic-ink border-civic-border'
                }`}
              >
                <config.icon size={13} />
                {config.label}
              </button>
            );
          })}
        </div>
        <button
          onClick={() => setView(view === 'map' ? 'list' : 'map')}
          className="flex-shrink-0 w-10 h-10 rounded-full bg-white shadow-card border border-civic-border flex items-center justify-center"
          aria-label="Toggle map/list view"
        >
          {view === 'map' ? <List size={18} /> : <MapIcon size={18} />}
        </button>
      </div>

      {isLoading ? (
        <FullPageSpinner label="Loading issues…" />
      ) : view === 'map' ? (
        <IssueMap issues={filtered} />
      ) : (
        <div className="h-full overflow-y-auto pt-16 pb-28 px-3 space-y-3">
          {filtered.length === 0 ? (
            <p className="text-center text-sm text-civic-ink mt-10">No issues reported yet.</p>
          ) : (
            filtered.map((issue) => <IssueCard key={issue.id} issue={issue} />)
          )}
        </div>
      )}

      <Link
        to="/report"
        className="absolute bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-20 bg-civic-blue text-white font-semibold text-sm px-5 py-3 rounded-full shadow-floating flex items-center gap-2 hover:bg-blue-700"
      >
        <Plus size={18} /> Report Issue
      </Link>
    </div>
  );
}
