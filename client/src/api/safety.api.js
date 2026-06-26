import api from './axios';

export const reportSafetyIssue = (data) => api.post('/safety/report', data).then((r) => r.data);

export const getSafetyReportsForMap = (params) =>
  api.get('/safety/reports/map', { params }).then((r) => r.data);

export const getSafeLocations = (params) => api.get('/safety/locations', { params }).then((r) => r.data);

export const triggerSOS = (data) => api.post('/safety/sos', data).then((r) => r.data);

export const resolveSOS = (id) => api.patch(`/safety/sos/${id}/resolve`).then((r) => r.data);

export const checkRouteSafety = (points) =>
  api.post('/safety/route-safety', { points }).then((r) => r.data);
