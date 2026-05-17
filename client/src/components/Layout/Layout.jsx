/**
 * Layout Component
 * Wraps the app with sidebar and main content area.
 */

import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-dark-950">
      <Sidebar />
      <main className="ml-64 flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
