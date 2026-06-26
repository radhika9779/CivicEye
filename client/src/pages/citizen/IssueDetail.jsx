import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, User, ThumbsUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { getIssueById } from '../../api/issues.api';
import useIssueStore from '../../store/issueStore';
import useAuthStore from '../../store/authStore';
import { FullPageSpinner } from '../../components/common/Spinner';
import { StatusBadge } from '../../components/common/Badge';
import ScoreGauge from '../../components/common/ScoreGauge';
import StatusTimeline from '../../components/issues/StatusTimeline';
import IssueMap from '../../components/issues/IssueMap';
import { getCategoryConfig } from '../../utils/categoryConfig';
import { getSeverityConfig } from '../../utils/severityConfig';
import { formatDateTime, getTicketId } from '../../utils/formatters';

export default function IssueDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [upvoting, setUpvoting] = useState(false);
  const upvote = useIssueStore((s) => s.upvote);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());

  useEffect(() => {
    let active = true;
    setLoading(true);
    getIssueById(id)
      .then((data) => {
        if (active) setIssue(data.issue);
      })
      .catch(() => toast.error('Could not load this issue'))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id]);

  const handleUpvote = async () => {
    if (!isAuthenticated) {
      toast.error('Log in to upvote');
      return;
    }
    setUpvoting(true);
    try {
      const data = await upvote(id);
      setIssue((prev) => ({ ...prev, ...data }));
      toast.success('Upvoted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not upvote');
    } finally {
      setUpvoting(false);
    }
  };

  if (loading) return <FullPageSpinner label="Loading issue…" />;
  if (!issue) return null;

  const categoryConfig = getCategoryConfig(issue.category);
  const severityConfig = getSeverityConfig(issue.severity);

  return (
    <div className="max-w-lg mx-auto pb-28">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm font-medium text-civic-ink px-4 pt-4"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="px-4 pt-4 space-y-5">
        {issue.photo_url && (
          <img src={issue.photo_url} alt="" className="w-full h-52 object-cover rounded-xl" />
        )}

        <div>
          <div className="flex items-center gap-2 text-civic-ink mb-1">
            <categoryConfig.icon size={14} />
            <span className="text-xs font-medium uppercase tracking-wide">{categoryConfig.label}</span>
            <StatusBadge status={issue.status} size="sm" />
          </div>
          <h1 className="font-display font-bold text-2xl leading-snug">{issue.title}</h1>
          <p className="text-xs font-data font-semibold text-slate-400 mt-1">{getTicketId(issue.id)}</p>
          <p className="text-sm text-civic-ink mt-2">{issue.description}</p>
          <p className="flex items-center gap-1 text-xs text-civic-ink mt-3">
            <MapPin size={12} /> {issue.address}
          </p>
          <p className="flex items-center gap-1 text-xs text-civic-ink mt-1">
            <User size={12} />
            {issue.is_anonymous ? 'Anonymous' : issue.reporter?.name || 'Unknown'} · {formatDateTime(issue.created_at)}
          </p>
        </div>

        <button
          onClick={handleUpvote}
          disabled={upvoting}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-civic-border bg-civic-card text-sm font-semibold hover:border-civic-blue/40 disabled:opacity-60"
        >
          <ThumbsUp size={16} /> Upvote ({issue.upvote_count})
        </button>

        <div className="bg-civic-surface rounded-xl p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-civic-ink mb-3">
            AI Score Breakdown
          </p>
          <div className="flex items-center gap-5">
            <ScoreGauge value={issue.ai_score} max={10} color={severityConfig.color} label={severityConfig.label} />
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
          {issue.resolution_note && (
            <p className="text-sm text-civic-ink bg-green-50 rounded-lg px-3 py-2 mt-3">
              <span className="font-semibold">Resolution: </span>
              {issue.resolution_note}
            </p>
          )}
        </div>

        <div className="h-48 rounded-xl overflow-hidden border border-civic-border">
          <IssueMap issues={[issue]} center={[issue.latitude, issue.longitude]} zoom={15} />
        </div>
      </div>
    </div>
  );
}
