import { create } from 'zustand';
import { getIssues, createIssue as apiCreateIssue, upvoteIssue as apiUpvoteIssue } from '../api/issues.api';

const useIssueStore = create((set, get) => ({
  issues: [],
  isLoading: false,
  error: null,
  categoryFilter: null,

  fetchIssues: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const data = await getIssues(params);
      set({ issues: data.issues, isLoading: false });
      return data.issues;
    } catch (err) {
      set({ error: 'Failed to load issues', isLoading: false });
      return [];
    }
  },

  setCategoryFilter: (category) => set({ categoryFilter: category }),

  createIssue: async (formData) => {
    const data = await apiCreateIssue(formData);
    // Optimistically add to local list — the socket 'new_issue' event will
    // also fire, but addIssue() below dedupes by id so it's safe either way.
    get().addIssue(data.issue);
    return data.issue;
  },

  upvote: async (issueId) => {
    const data = await apiUpvoteIssue(issueId);
    set({
      issues: get().issues.map((i) =>
        i.id === issueId
          ? { ...i, ai_score: data.ai_score, severity: data.severity, upvote_count: data.upvote_count }
          : i
      ),
    });
    return data;
  },

  // ---- Socket event handlers (wired up in useSocket) ----
  addIssue: (issue) => {
    const exists = get().issues.some((i) => i.id === issue.id);
    if (exists) return;
    set({ issues: [issue, ...get().issues] });
  },

  updateIssueLive: ({ id, status, severity }) => {
    set({
      issues: get().issues.map((i) => (i.id === id ? { ...i, status, severity } : i)),
    });
  },

  getFilteredIssues: () => {
    const { issues, categoryFilter } = get();
    if (!categoryFilter) return issues;
    return issues.filter((i) => i.category === categoryFilter);
  },
}));

export default useIssueStore;
