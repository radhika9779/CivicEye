import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { getCategoryConfig } from '../../utils/categoryConfig';

export default function CategoryChart({ data = [] }) {
  const chartData = data.map((d) => ({
    name: getCategoryConfig(d.category).label,
    count: d.count,
    color: getCategoryConfig(d.category).color,
  }));

  return (
    <div className="bg-civic-card rounded-xl shadow-card border border-civic-border p-4">
      <p className="text-sm font-display font-semibold mb-3">Issues by Category</p>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={chartData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip
            contentStyle={{ borderRadius: 10, border: '1px solid #E2E8F0', fontSize: 12 }}
            cursor={{ fill: '#F8FAFC' }}
          />
          <Bar dataKey="count" radius={[6, 6, 0, 0]}>
            {chartData.map((entry, idx) => (
              <Cell key={idx} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
