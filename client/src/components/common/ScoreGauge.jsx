import React from 'react';

/**
 * The one signature visual motif of CivicEye: a "city pulse" gauge.
 * Used for the AI Severity score (0-10) on issues and the Route Safety
 * score (0-100) for the women's safety module — same visual language,
 * different palette, tying the two halves of the product together.
 */
export default function ScoreGauge({
  value,
  max = 10,
  color = '#2563EB',
  label,
  size = 152,
  strokeWidth = 12,
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(1, value / max));
  const offset = circumference * (1 - pct);

  const displayValue = max === 10 ? value.toFixed(1) : Math.round(value);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E2E8F0"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          className="animate-gauge-fill"
          style={{
            '--gauge-full': circumference,
            '--gauge-offset': offset,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-data font-semibold leading-none" style={{ fontSize: size * 0.26, color }}>
          {displayValue}
        </span>
        <span className="text-[11px] text-civic-ink font-medium mt-0.5">
          / {max}
        </span>
        {label && (
          <span className="text-[11px] uppercase tracking-wide text-civic-ink font-semibold mt-1">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
