import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { ToastProvider } from './Toast';

export const FounderLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <ToastProvider>
      <div className="min-h-screen bg-[#070a10] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
        {/* Navigation Sidebar */}
        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        {/* Main Content Container */}
        <div
          className={`flex-1 flex flex-col transition-all duration-300 ${
            collapsed ? 'lg:pl-20' : 'lg:pl-64'
          }`}
        >
          {/* Header TopBar */}
          <TopBar
            collapsed={collapsed}
            onMenuClick={() => setMobileOpen(!mobileOpen)}
          />

          {/* Sub-page Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
            <Outlet />
          </main>
        </div>
      </div>
    </ToastProvider>
  );
};
