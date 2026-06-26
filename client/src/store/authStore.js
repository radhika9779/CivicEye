import { create } from 'zustand';
import { loginUser, registerUser } from '../api/auth.api';

const storedUser = localStorage.getItem('civiceye_user');

const useAuthStore = create((set, get) => ({
  user: storedUser ? JSON.parse(storedUser) : null,
  token: localStorage.getItem('civiceye_token') || null,
  isLoading: false,
  error: null,

  isAuthenticated: () => !!get().token,
  isAdmin: () => {
    const role = get().user?.role;
    return role === 'admin' || role === 'ward_officer';
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const data = await loginUser({ email, password });
      localStorage.setItem('civiceye_token', data.token);
      localStorage.setItem('civiceye_user', JSON.stringify(data.user));
      set({ user: data.user, token: data.token, isLoading: false });
      return data.user;
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  register: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const data = await registerUser(payload);
      localStorage.setItem('civiceye_token', data.token);
      localStorage.setItem('civiceye_user', JSON.stringify(data.user));
      set({ user: data.user, token: data.token, isLoading: false });
      return data.user;
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  logout: () => {
    localStorage.removeItem('civiceye_token');
    localStorage.removeItem('civiceye_user');
    set({ user: null, token: null });
  },

  updateUser: (user) => {
    localStorage.setItem('civiceye_user', JSON.stringify(user));
    set({ user });
  },
}));

export default useAuthStore;
