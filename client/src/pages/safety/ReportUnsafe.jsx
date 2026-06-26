import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crosshair, AlertTriangle, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../../components/common/Button';
import { useGeolocation } from '../../hooks/useGeolocation';
import { reportSafetyIssue } from '../../api/safety.api';

const REPORT_TYPES = [
  { value: 'harassment', label: 'Harassment' },
  { value: 'poor_lighting', label: 'Poor Lighting' },
  { value: 'unsafe_area', label: 'Unsafe Area' },
  { value: 'other', label: 'Other' },
];

export default function ReportUnsafe() {
  const [reportType, setReportType] = useState('harassment');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [coords, setCoords] = useState(null);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { loading: locating, detect } = useGeolocation();
  const navigate = useNavigate();

  const handleUseMyLocation = async () => {
    try {
      const next = await detect();
      setCoords(next);
      toast.success('Location captured');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!coords) {
      toast.error('Please capture a location first');
      return;
    }
    setSubmitting(true);
    try {
      await reportSafetyIssue({
        report_type: reportType,
        description,
        latitude: coords.lat,
        longitude: coords.lon,
        address,
        is_anonymous: isAnonymous,
      });
      setSubmitted(true);
    } catch (err) {
      toast.error('Could not submit report');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 pb-28 text-center space-y-4">
        <div className="w-14 h-14 mx-auto rounded-full bg-safety-bg flex items-center justify-center">
          <CheckCircle2 size={28} className="text-safety-purple" />
        </div>
        <h1 className="font-display font-bold text-xl">Thank you for speaking up</h1>
        <p className="text-sm text-civic-ink max-w-xs mx-auto">
          Your report helps make this area's safety score more accurate for everyone who checks a
          route through here.
        </p>
        <Button variant="safety" onClick={() => navigate('/safety')}>
          Back to Safety Home
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6 pb-28">
      <div className="flex items-center gap-2 text-safety-purple mb-1">
        <AlertTriangle size={18} />
        <h1 className="font-display font-bold text-2xl">Report Unsafe Area</h1>
      </div>
      <p className="text-sm text-civic-ink mb-6">
        Your report is anonymous by default and feeds directly into the safety heatmap.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-semibold mb-2 block">What happened?</label>
          <div className="grid grid-cols-2 gap-2">
            {REPORT_TYPES.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => setReportType(type.value)}
                className={`px-3 py-2.5 rounded-xl border-2 text-sm font-medium transition-colors ${
                  reportType === type.value
                    ? 'border-safety-purple bg-safety-bg text-safety-purple'
                    : 'border-civic-border text-civic-ink'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="unsafe-desc" className="text-sm font-semibold mb-1.5 block">
            Description
          </label>
          <textarea
            id="unsafe-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="What did you experience or notice? Specific details help others stay safe."
            className="w-full px-3.5 py-2.5 rounded-xl border border-civic-border focus:border-safety-purple outline-none text-sm resize-none"
          />
        </div>

        <div>
          <button
            type="button"
            onClick={handleUseMyLocation}
            disabled={locating}
            className="flex items-center gap-2 text-sm font-medium text-safety-purple"
          >
            <Crosshair size={16} className={locating ? 'animate-spin' : ''} />
            {locating ? 'Detecting…' : coords ? 'Location captured ✓' : 'Capture current location'}
          </button>
        </div>

        <div>
          <label htmlFor="unsafe-address" className="text-sm font-semibold mb-1.5 block">
            Address / landmark (optional)
          </label>
          <input
            id="unsafe-address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="e.g. Near Andheri Station, East Exit"
            className="w-full px-3.5 py-2.5 rounded-xl border border-civic-border focus:border-safety-purple outline-none text-sm"
          />
        </div>

        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
            className="w-4 h-4 rounded accent-safety-purple"
          />
          <span className="text-sm text-civic-ink">Keep my report anonymous</span>
        </label>

        <Button type="submit" variant="safety" fullWidth loading={submitting}>
          Submit Report
        </Button>
      </form>
    </div>
  );
}
