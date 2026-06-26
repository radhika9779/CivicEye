import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import BottomNav from './BottomNav';
import SOSButton from '../common/SOSButton';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-civic-surface">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <BottomNav />
      <SOSButton />
    </div>
  );
}
