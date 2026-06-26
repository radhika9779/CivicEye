import React from 'react';
import { Routes, Route } from 'react-router-dom';

import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminLogin from './pages/auth/AdminLogin';

import Home from './pages/citizen/Home';
import ReportIssue from './pages/citizen/ReportIssue';
import IssueDetail from './pages/citizen/IssueDetail';
import MyReports from './pages/citizen/MyReports';

import Dashboard from './pages/admin/Dashboard';
import IssueManagement from './pages/admin/IssueManagement';
import Analytics from './pages/admin/Analytics';

import SafetyHome from './pages/safety/SafetyHome';
import RouteCheck from './pages/safety/RouteCheck';
import ReportUnsafe from './pages/safety/ReportUnsafe';
import SafeMap from './pages/safety/SafeMap';
import SafeLocations from './pages/safety/SafeLocations';

export default function App() {
  return (
    <Routes>
      {/* Public auth routes — no nav shell */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Everything else shares the nav + bottom nav + floating SOS shell */}
      <Route element={<AppLayout />}>
        {/* Citizen */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/report"
          element={
            <ProtectedRoute>
              <ReportIssue />
            </ProtectedRoute>
          }
        />
        <Route
          path="/issues/:id"
          element={
            <ProtectedRoute>
              <IssueDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-reports"
          element={
            <ProtectedRoute>
              <MyReports />
            </ProtectedRoute>
          }
        />

        {/* Women's Safety */}
        <Route
          path="/safety"
          element={
            <ProtectedRoute>
              <SafetyHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/safety/route-check"
          element={
            <ProtectedRoute>
              <RouteCheck />
            </ProtectedRoute>
          }
        />
        <Route
          path="/safety/report-unsafe"
          element={
            <ProtectedRoute>
              <ReportUnsafe />
            </ProtectedRoute>
          }
        />
        <Route
          path="/safety/map"
          element={
            <ProtectedRoute>
              <SafeMap />
            </ProtectedRoute>
          }
        />
        <Route
          path="/safety/locations"
          element={
            <ProtectedRoute>
              <SafeLocations />
            </ProtectedRoute>
          }
        />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/issues"
          element={
            <ProtectedRoute adminOnly>
              <IssueManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute adminOnly>
              <Analytics />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Home />} />
    </Routes>
  );
}
