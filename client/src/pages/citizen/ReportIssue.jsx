import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CheckCircle2 } from 'lucide-react';
import IssueForm from '../../components/issues/IssueForm';
import SeverityCard from '../../components/issues/SeverityCard';
import Button from '../../components/common/Button';
import useIssueStore from '../../store/issueStore';
import { getTicketId } from '../../utils/formatters';

export default function ReportIssue() {
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const createIssue = useIssueStore((s) => s.createIssue);
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      const issue = await createIssue(formData);
      setResult(issue);
      toast.success('Report submitted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-6 pb-28">
      <h1 className="font-display font-bold text-2xl mb-1">Report an issue</h1>
      <p className="text-sm text-civic-ink mb-6">
        Tell us what's wrong — our AI scores it for severity instantly.
      </p>

      {result ? (
        <div className="space-y-5">
          <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
            <CheckCircle2 size={20} className="text-severity-low flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-civic-dark">Report submitted</p>
              <p className="text-xs font-data text-civic-ink">
                Ticket ID: <span className="font-semibold">{getTicketId(result.id)}</span>
              </p>
            </div>
          </div>

          <SeverityCard score={result.ai_score} severity={result.severity} reasons={result.ai_reasons} />
          <div className="flex gap-3">
            <Button variant="secondary" fullWidth onClick={() => navigate('/')}>
              View on Map
            </Button>
            <Button
              fullWidth
              onClick={() => {
                setResult(null);
              }}
            >
              Report Another
            </Button>
          </div>
        </div>
      ) : (
        <IssueForm onSubmit={handleSubmit} submitting={submitting} />
      )}
    </div>
  );
}

