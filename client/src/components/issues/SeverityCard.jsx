import React from 'react';
import { Sparkles } from 'lucide-react';
import ScoreGauge from '../common/ScoreGauge';
import { getSeverityConfig } from '../../utils/severityConfig';

export default function SeverityCard({ score, severity, reasons = [] }) {
  const config = getSeverityConfig(severity);

  return (
    <div className="bg-civic-card rounded-2xl shadow-floating border border-civic-border p-6 animate-slide-up">
      <div className="flex items-center gap-2 mb-4 text-civic-blue">
        <Sparkles size={16} />
        <span className="text-xs font-semibold uppercase tracking-wide">AI Severity Analysis</span>
      </div>

      <div className="flex items-center gap-5">
        <ScoreGauge value={score} max={10} color={config.color} label={config.label} />
        <div className="flex-1 space-y-2">
          {reasons.map((reason, idx) => (
            <div key={idx} className="flex items-start gap-2 text-sm text-civic-ink">
              <span
                className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                style={{ backgroundColor: config.color }}
              />
              <span className="font-data text-[13px] leading-snug">{reason}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
