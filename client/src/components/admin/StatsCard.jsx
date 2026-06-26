import React from 'react';

export default function StatsCard({ label, value, icon: Icon, accent = '#2563EB', suffix = '' }) {
  return (
    <div className="bg-civic-card rounded-xl shadow-card border border-civic-border p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-civic-ink">{label}</span>
        {Icon && (
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${accent}15` }}
          >
            <Icon size={16} style={{ color: accent }} />
          </div>
        )}
      </div>
      <p className="font-display font-bold text-2xl">
        {value}
        {suffix && <span className="text-sm font-medium text-civic-ink ml-1">{suffix}</span>}
      </p>
    </div>
  );
}
