import React from 'react';
import { Check } from 'lucide-react';
import { formatDateTime } from '../../utils/formatters';

const STEPS = [
  { key: 'open', label: 'Reported' },
  { key: 'assigned', label: 'Assigned' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'resolved', label: 'Resolved' },
];

export default function StatusTimeline({ status, createdAt, resolvedAt }) {
  const currentIndex = STEPS.findIndex((s) => s.key === status);

  return (
    <div className="flex items-start">
      {STEPS.map((step, idx) => {
        const isComplete = idx <= currentIndex;
        const isLast = idx === STEPS.length - 1;

        return (
          <div key={step.key} className={`flex items-center ${isLast ? '' : 'flex-1'}`}>
            <div className="flex flex-col items-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isComplete ? 'bg-civic-blue text-white' : 'bg-civic-border text-slate-400'
                }`}
              >
                {isComplete ? <Check size={14} /> : <span className="text-xs">{idx + 1}</span>}
              </div>
              <span
                className={`text-[11px] font-medium mt-1.5 text-center ${
                  isComplete ? 'text-civic-dark' : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
              {step.key === 'open' && createdAt && (
                <span className="text-[10px] text-slate-400 font-data mt-0.5">
                  {formatDateTime(createdAt)}
                </span>
              )}
              {step.key === 'resolved' && resolvedAt && (
                <span className="text-[10px] text-slate-400 font-data mt-0.5">
                  {formatDateTime(resolvedAt)}
                </span>
              )}
            </div>
            {!isLast && (
              <div className={`h-0.5 flex-1 mx-1 ${idx < currentIndex ? 'bg-civic-blue' : 'bg-civic-border'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
