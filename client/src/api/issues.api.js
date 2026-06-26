import api from './axios';

export const getIssues = (params) => api.get('/issues', { params }).then((r) => r.data);

export const getIssueById = (id) => api.get(`/issues/${id}`).then((r) => r.data);

export const getMyIssues = () => api.get('/issues/my').then((r) => r.data);

export const createIssue = (formData) =>
  api
    .post('/issues', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then((r) => r.data);

export const upvoteIssue = (id) => api.patch(`/issues/${id}/upvote`).then((r) => r.data);

export const removeUpvote = (id) => api.delete(`/issues/${id}/upvote`).then((r) => r.data);
