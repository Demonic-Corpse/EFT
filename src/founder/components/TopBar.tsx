import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  Bell,
  Search,
  ExternalLink,
  LogOut,
  User,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface TopBarProps {
  onMenuClick: () => void;
  collapsed: boolean;
}

const titles: Record<string, { title: string; subtitle: string }> = {
  '/admin/dashboard': { title: 'Executive Overview', subtitle: 'Academy operations, attendance, and revenue metrics' },
  '/admin/students': { title: 'Student Management', subtitle: 'Student directory, profiles, enrollment, and guardian contacts' },
  '/admin/attendance': { title: 'Attendance Management', subtitle: 'Daily roll call, session tracking, and historical logs' },
  '/admin/fees': { title: 'Fee Management & Payment Checklist', subtitle: 'Billing periods, receipts, payment tracking, and fee waivers' },
  '/admin/enquiries': { title: 'Enquiry Management', subtitle: 'Website submissions, trial requests, follow-ups, and student conversions' },
  '/admin/album': { title: 'Album & Media Editor', subtitle: 'Photo & video gallery uploads, visibility controls, and consent tags' },
  '/admin/contact': { title: 'Manage Contact & Pitch Location', subtitle: 'Official phone, email, WhatsApp, and Crimson Anisha pitch coordinates' },
  '/admin/reviews': { title: 'Reviews & Testimonials', subtitle: 'Public review moderation, verified testimonial publishing' },
  '/admin/website': { title: 'Website Content Controls', subtitle: 'Live CMS editor for home, about, training programs, and contact info' },
  '/admin/reports': { title: 'Reports & Analytics', subtitle: 'Operations insights, financial reports, and CSV data exports' },
  '/admin/settings': { title: 'Academy Settings & Audit Logs', subtitle: 'System configuration, operational rules, and activity logs' },
  // Founder aliases
  '/founder/dashboard': { title: 'Executive Overview', subtitle: 'Academy operations, attendance, and revenue metrics' },
  '/founder/students': { title: 'Student Management', subtitle: 'Student directory, profiles, enrollment, and guardian contacts' },
  '/founder/attendance': { title: 'Attendance Management', subtitle: 'Daily roll call, session tracking, and historical logs' },
  '/founder/fees': { title: 'Fee Management & Payment Checklist', subtitle: 'Billing periods, receipts, payment tracking, and fee waivers' },
  '/founder/enquiries': { title: 'Enquiry Management', subtitle: 'Website submissions, trial requests, follow-ups, and student conversions' },
  '/founder/album': { title: 'Album & Media Editor', subtitle: 'Photo & video gallery uploads, visibility controls, and consent tags' },
  '/founder/contact': { title: 'Manage Contact & Pitch Location', subtitle: 'Official phone, email, WhatsApp, and Crimson Anisha pitch coordinates' },
  '/founder/reviews': { title: 'Reviews & Testimonials', subtitle: 'Public review moderation, verified testimonial publishing' },
  '/founder/website': { title: 'Website Content Controls', subtitle: 'Live CMS editor for home, about, training programs, and contact info' },
  '/founder/reports': { title: 'Reports & Analytics', subtitle: 'Operations insights, financial reports, and CSV data exports' },
  '/founder/settings': { title: 'Academy Settings & Audit Logs', subtitle: 'System configuration, operational rules, and activity logs' },
};

export const TopBar: React.FC<TopBarProps> = ({ onMenuClick, collapsed }) => {
  const { pathname } = useLocation();
  const { user, logout, authFetch } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [pendingEnquiries, setPendingEnquiries] = useState<any[]>([]);
  const [hasUnread, setHasUnread] = useState(false);

  // Fetch pending enquiries and evaluate unread status based on last time user viewed notifications
  React.useEffect(() => {
    let isMounted = true;
    const fetchAlerts = async () => {
      try {
        const res = await authFetch('/api/enquiries?status=New');
        if (res.ok) {
          const data = await res.json();
          if (!isMounted) return;
          setPendingEnquiries(data);

          const lastChecked = localStorage.getItem('eft_notifications_last_checked_at');
          if (!lastChecked) {
            setHasUnread(data.length > 0);
          } else {
            const lastTime = new Date(lastChecked).getTime();
            const hasNew = data.some((e: any) => {
              const created = e.created_at ? new Date(e.created_at).getTime() : 0;
              return created > lastTime;
            });
            setHasUnread(hasNew);
          }
        }
      } catch {
        // Silently continue
      }
    };

    fetchAlerts();
    const interval = setInterval(fetchAlerts, 20000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleToggleNotifications = () => {
    const nextState = !showNotifications;
    setShowNotifications(nextState);
    setShowProfileMenu(false);
    if (nextState) {
      // User has checked notifications - clear unread glow and save timestamp
      setHasUnread(false);
      localStorage.setItem('eft_notifications_last_checked_at', new Date().toISOString());
    }
  };

  const handleMarkAllRead = () => {
    setHasUnread(false);
    localStorage.setItem('eft_notifications_last_checked_at', new Date().toISOString());
  };

  const routeInfo = titles[pathname] || {
    title: 'Admin Panel',
    subtitle: 'Academy management and website control'
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <header className="h-16 bg-[#0b0f17] border-b border-slate-800/80 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-3">
        {/* Mobile menu hamburger */}
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Page Titles */}
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-sans">
            <span>Admin</span>
            <span>/</span>
            <span className="text-amber-500 font-heading uppercase font-semibold">
              {routeInfo.title}
            </span>
          </div>
          <h1 className="text-sm sm:text-base font-heading font-black uppercase text-white tracking-wide leading-tight truncate">
            {routeInfo.title}
          </h1>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Quick View Public Website */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white text-xs font-heading uppercase tracking-wider transition-colors border border-slate-700/50"
        >
          <span>Live Site</span>
          <ExternalLink className="w-3.5 h-3.5 text-amber-500" />
        </a>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={handleToggleNotifications}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {hasUnread && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-[#0b0f17] animate-pulse" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#101725] border border-slate-800 rounded-2xl shadow-2xl p-4 z-50 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="font-heading uppercase font-bold text-white tracking-wider">
                  Academy Alerts
                </span>
                <div className="flex items-center gap-2">
                  {hasUnread ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold">
                      {pendingEnquiries.length} New
                    </span>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-medium">
                      Checked
                    </span>
                  )}
                  {pendingEnquiries.length > 0 && (
                    <button
                      type="button"
                      onClick={handleMarkAllRead}
                      className="text-[10px] text-amber-500 hover:text-amber-400 font-semibold"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
              <div className="space-y-3 mt-3">
                {pendingEnquiries.length > 0 ? (
                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white block">
                        {pendingEnquiries.length} Pending {pendingEnquiries.length === 1 ? 'Enquiry' : 'Enquiries'}
                      </span>
                      <span className="text-slate-400 text-[11px] block mt-0.5">
                        New enquiries from {pendingEnquiries.map((e) => e.name).slice(0, 2).join(' & ')}
                        {pendingEnquiries.length > 2 ? ` +${pendingEnquiries.length - 2} more` : ''}.
                      </span>
                      <Link
                        to="/admin/enquiries"
                        onClick={() => setShowNotifications(false)}
                        className="text-amber-500 hover:underline text-[10px] font-bold uppercase mt-1.5 inline-block"
                      >
                        View Enquiries →
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/60">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white block">All Enquiries Reviewed</span>
                      <span className="text-slate-400 text-[11px] block mt-0.5">
                        No pending enquiry requests at this time.
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Training Roster Active</span>
                    <span className="text-slate-400 text-[11px] block mt-0.5">
                      Junior &amp; Senior batch sessions scheduled at Crimson Anisha Ground.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Founder Profile Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-600 to-amber-500 flex items-center justify-center font-heading font-black text-slate-950 text-xs shadow-sm">
              {user?.name?.[0] || 'R'}
            </div>
            <span className="hidden md:inline font-heading uppercase font-bold text-xs text-white tracking-wider">
              {user?.name || 'Rahul'}
            </span>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-[#101725] border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 text-xs">
              <div className="p-3 border-b border-slate-800">
                <span className="font-heading font-bold text-white block uppercase">
                  {user?.name || 'Rahul'}
                </span>
                <span className="text-[11px] text-slate-400 block">Founder &amp; Head Coach</span>
                <span className="mt-1 inline-flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Authorized Admin
                </span>
              </div>

              <div className="py-1">
                <Link
                  to="/founder/settings"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors font-medium"
                >
                  <User className="w-4 h-4 text-amber-500" />
                  <span>Account &amp; Password</span>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors font-medium text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
