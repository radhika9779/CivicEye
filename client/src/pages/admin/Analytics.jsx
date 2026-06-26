import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { getAdminStats, getAdminIssues } from '../../api/admin.api';
import { FullPageSpinner } from '../../components/common/Spinner';
import TrendChart from '../../components/admin/TrendChart';
import { getSeverityConfig } from '../../utils/severityConfig';

export default function Analytics() {
  const [stats, setStats] = useState(null);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAdminStats(), getAdminIssues({ limit: 200 })])
      .then(([statsData, issuesData]) => {
        setStats(statsData);
        setIssues(issuesData.issues);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <FullPageSpinner label="Crunching the numbers…" />;

  const severityCounts = ['low', 'medium', 'high', 'critical'].map((sev) => ({
    name: getSeverityConfig(sev).label,
    value: issues.filter((i) => i.severity === sev).length,
    color: getSeverityConfig(sev).color,
  }));

  const wardMap = {};
  issues.forEach((i) => {
    const name = i.ward?.name || 'Unassigned';
    wardMap[name] = (wardMap[name] || 0) + 1;
  });
  const wardData = Object.entries(wardMap).map(([name, count]) => ({ name, count }));

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 pb-28">
      <h1 className="font-display font-bold text-2xl mb-5">Analytics</h1>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div className="bg-civic-card rounded-xl shadow-card border border-civic-border p-4">
          <p className="text-sm font-display font-semibold mb-3">Severity Distribution</p>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={severityCounts}
                dataKey="value"
                nameKey="name"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={2}
              >
                {severityCounts.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #E2E8F0', fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-civic-card rounded-xl shadow-card border border-civic-border p-4">
          <p className="text-sm font-display font-semibold mb-3">Issues by Ward</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={wardData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #E2E8F0', fontSize: 12 }} />
              <Bar dataKey="count" fill="#2563EB" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <TrendChart data={stats.daily_trend} />
    </div>
  );
}
