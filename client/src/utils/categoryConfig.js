import { Construction, Zap, Trash2, Droplets, AlertTriangle, Flag } from 'lucide-react';

export const CATEGORIES = [
  'pothole',
  'streetlight',
  'garbage',
  'water_leak',
  'sewage',
  'other',
];

export const CATEGORY_CONFIG = {
  pothole: {
    label: 'Pothole',
    icon: Construction,
    color: '#2563EB',
  },
  streetlight: {
    label: 'Streetlight',
    icon: Zap,
    color: '#D97706',
  },
  garbage: {
    label: 'Garbage',
    icon: Trash2,
    color: '#16A34A',
  },
  water_leak: {
    label: 'Water Leak',
    icon: Droplets,
    color: '#0EA5E9',
  },
  sewage: {
    label: 'Sewage',
    icon: AlertTriangle,
    color: '#7C3AED',
  },
  other: {
    label: 'Other',
    icon: Flag,
    color: '#64748B',
  },
};

export function getCategoryConfig(category) {
  return CATEGORY_CONFIG[category] || CATEGORY_CONFIG.other;
}
