import api from './axios';

export const getAdminIssues = (params) => api.get('/admin/issues', { params }).then((r) => r.data);

export const assignIssueToUser = (id, assigned_to) =>
  api.patch(`/admin/issues/${id}/assign`, { assigned_to }).then((r) => r.data);

export const updateIssueStatus = (id, status, resolution_note) =>
  api.patch(`/admin/issues/${id}/status`, { status, resolution_note }).then((r) => r.data);

export const getAdminStats = () => api.get('/admin/stats').then((r) => r.data);

export const getActiveSosAlerts = () => api.get('/admin/sos-alerts').then((r) => r.data);
