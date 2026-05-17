/**
 * Sidebar Component
 * Premium dark sidebar with navigation, icons, and active state highlighting.
 */

import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Store,
  MapPin,
  Package,
  Users,
  ShoppingCart,
  BarChart3,
  Zap
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/stores', label: 'Dark Stores', icon: Store },
  { path: '/zones', label: 'Zones', icon: MapPin },
  { path: '/inventory', label: 'Inventory', icon: Package },
  { path: '/employees', label: 'Employees', icon: Users },
  { path: '/orders', label: 'Orders', icon: ShoppingCart },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
];

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-dark-950 border-r border-white/[0.06] flex flex-col z-50">
      {/* Logo Section */}
      <div className="p-6 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight">DarkStore</h1>
            <p className="text-[10px] text-dark-500 uppercase tracking-widest">Registry System</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <p className="px-3 py-2 text-[10px] uppercase tracking-widest text-dark-600 font-semibold">Navigation</p>
        {navItems.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20 shadow-lg shadow-primary-500/5'
                  : 'text-dark-400 hover:text-white hover:bg-white/[0.04]'
              }`
            }
          >
            <Icon className="w-[18px] h-[18px] transition-transform duration-200 group-hover:scale-110" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/[0.06]">
        <div className="glass-light rounded-xl p-4">
          <p className="text-xs text-dark-500 text-center">DBMS Mini Project</p>
          <p className="text-[10px] text-dark-600 text-center mt-1">v1.0.0</p>
        </div>
      </div>
    </aside>
  );
}
