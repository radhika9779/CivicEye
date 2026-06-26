import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

/**
 * Wrap any route element: <ProtectedRoute><Dashboard /></ProtectedRoute>
 * Pass adminOnly to additionally require role admin/ward_officer.
 */
export default function ProtectedRoute({ children, adminOnly = false }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());
  const isAdmin = useAuthStore((s) => s.isAdmin());
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={adminOnly ? '/admin/login' : '/login'} state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
