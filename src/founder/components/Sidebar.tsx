import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  CalendarCheck2,
  Receipt,
  MessageSquareQuote,
  Image as ImageIcon,
  Star,
  Globe,
  BarChart3,
  Settings,
  LogOut,
  ExternalLink,
  Shield,
  ChevronLeft,
  ChevronRight,
  MapPin
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (val: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Enquiries', to: '/admin/enquiries', icon: MessageSquareQuote },
    { name: 'Album & Media Editor', to: '/admin/album', icon: ImageIcon },
    { name: 'Manage Contact Info', to: '/admin/contact', icon: MapPin },
    { name: 'Students', to: '/admin/students', icon: Users },
    { name: 'Attendance', to: '/admin/attendance', icon: CalendarCheck2 },
    { name: 'Fees & Payments', to: '/admin/fees', icon: Receipt },
    { name: 'Reviews', to: '/admin/reviews', icon: Star },
    { name: 'Website Content', to: '/admin/website', icon: Globe },
    { name: 'Reports', to: '/admin/reports', icon: BarChart3 },
    { name: 'Settings & Logs', to: '/admin/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-[#0b0f17] border-r border-slate-800/80 transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-64'
        } ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3 overflow-hidden">
            <img
              src="/logo.png"
              alt="Elite Football Training Logo"
              className="w-10 h-10 object-contain shrink-0 drop-shadow-md"
            />
            {!collapsed && (
              <div className="truncate">
                <span className="block font-heading font-black text-xs tracking-wider text-amber-500 uppercase">
                  ADMIN PANEL
                </span>
                <span className="block text-[11px] font-sans text-slate-400 truncate">
                  Elite Football Academy
                </span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-800">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl font-heading text-xs tracking-wider uppercase transition-all duration-200 group ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60 font-semibold'
                  }`
                }
                title={collapsed ? item.name : undefined}
              >
                <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110`} />
                {!collapsed && <span className="truncate">{item.name}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Public Website Quick Link */}
        <div className="px-3 py-2 border-t border-slate-800/60">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 font-heading text-xs uppercase tracking-wider transition-colors"
            title="View Public Website"
          >
            <ExternalLink className="w-4 h-4 shrink-0 text-amber-500" />
            {!collapsed && <span className="truncate">View Public Site</span>}
          </a>
        </div>

        {/* Founder Profile & Logout Footer */}
        <div className="p-3 border-t border-slate-800/80 bg-[#080b12]">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-heading font-bold text-amber-400 text-xs shrink-0">
                {user?.name?.[0] || 'R'}
              </div>
              {!collapsed && (
                <div className="truncate">
                  <div className="flex items-center gap-1.5">
                    <span className="font-heading text-xs font-bold text-white truncate">
                      {user?.name || 'Rahul'}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  </div>
                  <span className="text-[10px] text-slate-400 font-sans block truncate capitalize">
                    Academy Founder
                  </span>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors shrink-0"
              title="Logout from Founder Panel"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
