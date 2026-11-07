import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  CalendarCheck2,
  Receipt,
  MessageSquareQuote,
  TrendingUp,
  AlertCircle,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  XCircle,
  UserCheck,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const DashboardPage: React.FC = () => {
  const { authFetch } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await authFetch('/api/dashboard');
      if (!res.ok) throw new Error('Failed to load dashboard metrics.');
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message || 'Error connecting to database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-400">
        <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mb-3" />
        <span className="text-xs uppercase font-heading tracking-widest text-slate-500">
          Loading Live Academy Metrics...
        </span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{error || 'Unable to retrieve dashboard data.'}</span>
        </div>
        <button
          onClick={fetchDashboardData}
          className="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-white font-heading uppercase text-[11px] font-bold"
        >
          Retry
        </button>
      </div>
    );
  }

  const { summary, todayAttendance, feesOverview, recentEnquiries, recentActivities } = data;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome & Live Status Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-heading font-bold uppercase tracking-wider">
              Database Online
            </span>
            <span className="text-xs text-slate-400 font-sans">
              Billing Period: <strong className="text-white">{feesOverview?.billingPeriod}</strong>
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display uppercase tracking-tight text-white">
            ACADEMY COMMAND CENTER
          </h2>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={fetchDashboardData}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-heading uppercase font-semibold transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-500' : ''}`} />
            <span>Refresh</span>
          </button>
          <Link
            to="/founder/attendance"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-heading font-black text-xs uppercase tracking-wider transition-colors shadow-md shadow-amber-500/20"
          >
            <CalendarCheck2 className="w-4 h-4" />
            <span>Mark Today's Roll</span>
          </Link>
        </div>
      </div>

      {/* 8 Core Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Students */}
        <Link
          to="/founder/students"
          className="p-5 rounded-2xl bg-[#0f1523] border border-slate-800/90 hover:border-amber-500/50 transition-all duration-200 group relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-heading font-bold uppercase tracking-wider text-slate-400">
              Active Enrolled Students
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display font-black text-white">
              {summary.activeStudents}
            </span>
            <span className="text-xs text-slate-400">/ {summary.totalStudents} total</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
            <span>5 Training squads</span>
            <span className="text-amber-500 font-bold group-hover:translate-x-0.5 transition-transform flex items-center">
              Manage <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
        </Link>

        {/* Card 2: Today's Attendance */}
        <Link
          to="/founder/attendance"
          className="p-5 rounded-2xl bg-[#0f1523] border border-slate-800/90 hover:border-amber-500/50 transition-all duration-200 group relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-heading font-bold uppercase tracking-wider text-slate-400">
              Today's Attendance Rate
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CalendarCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display font-black text-white">
              {summary.attendancePercentage}%
            </span>
            <span className="text-xs text-emerald-400 font-medium">
              {summary.todayPresent} present
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
            <span>{summary.todayAbsent} absent · {summary.todayLate} late</span>
            <span className="text-amber-500 font-bold group-hover:translate-x-0.5 transition-transform flex items-center">
              View Sheet <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
        </Link>

        {/* Card 3: Monthly Fees Collected */}
        <Link
          to="/founder/fees"
          className="p-5 rounded-2xl bg-[#0f1523] border border-slate-800/90 hover:border-amber-500/50 transition-all duration-200 group relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-heading font-bold uppercase tracking-wider text-slate-400">
              Monthly Fees Collected
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display font-black text-white">
              ₹{summary.feesCollected.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
            <span>{summary.paidStudents} fully paid students</span>
            <span className="text-amber-500 font-bold group-hover:translate-x-0.5 transition-transform flex items-center">
              Ledger <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
        </Link>

        {/* Card 4: Outstanding Dues & Overdue */}
        <Link
          to="/founder/fees?status=overdue"
          className="p-5 rounded-2xl bg-[#0f1523] border border-slate-800/90 hover:border-amber-500/50 transition-all duration-200 group relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-heading font-bold uppercase tracking-wider text-slate-400">
              Outstanding Dues
            </span>
            <div className="w-8 h-8 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display font-black text-red-400">
              ₹{summary.feesOutstanding.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
            <span className="text-red-300 font-medium">
              {summary.unpaidOrOverdueStudents} students with pending dues
            </span>
            <span className="text-amber-500 font-bold group-hover:translate-x-0.5 transition-transform flex items-center">
              Follow-up <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
        </Link>
      </div>

      {/* Two Column Layout: Today's Attendance & Fee Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Training Attendance Status */}
        <div className="bg-[#0f1523] border border-slate-800 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <CalendarCheck2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-heading font-bold uppercase text-sm text-white tracking-wider">
                  Today's Training Attendance
                </h3>
                <span className="text-[11px] text-slate-400 font-sans">
                  Date: {todayAttendance.date}
                </span>
              </div>
            </div>
            <Link
              to="/founder/attendance"
              className="text-xs font-heading font-bold uppercase text-amber-500 hover:text-amber-400 transition-colors"
            >
              Open Full Roll →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
              <span className="block text-2xl font-display font-black text-emerald-400">
                {todayAttendance.present}
              </span>
              <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-emerald-300">
                Present
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-center">
              <span className="block text-2xl font-display font-black text-red-400">
                {todayAttendance.absent}
              </span>
              <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-red-300">
                Absent
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center">
              <span className="block text-2xl font-display font-black text-amber-400">
                {todayAttendance.late}
              </span>
              <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-amber-300">
                Late
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-center">
              <span className="block text-2xl font-display font-black text-blue-400">
                {todayAttendance.excused}
              </span>
              <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-blue-300">
                Excused
              </span>
            </div>
          </div>

          {/* Quick Info Bar */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>All active students tracked across squads</span>
            </div>
            <Link
              to="/founder/attendance"
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-heading uppercase text-[11px] font-bold transition-colors"
            >
              Update Sheet
            </Link>
          </div>
        </div>

        {/* Fee Collection Overview */}
        <div className="bg-[#0f1523] border border-slate-800 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Receipt className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-heading font-bold uppercase text-sm text-white tracking-wider">
                  Fee Collection Overview
                </h3>
                <span className="text-[11px] text-slate-400 font-sans">
                  Billing Cycle: {feesOverview.billingPeriod}
                </span>
              </div>
            </div>
            <Link
              to="/founder/fees"
              className="text-xs font-heading font-bold uppercase text-amber-500 hover:text-amber-400 transition-colors"
            >
              Fee Checklist →
            </Link>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-400">Collection Progress</span>
                <span className="text-white font-bold">
                  {feesOverview.totalDue > 0
                    ? Math.round((feesOverview.collected / feesOverview.totalDue) * 100)
                    : 0}%
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-500"
                  style={{
                    width: `${feesOverview.totalDue > 0 ? (feesOverview.collected / feesOverview.totalDue) * 100 : 0}%`
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] uppercase font-heading font-bold text-slate-400 block mb-1">
                  Total Billed
                </span>
                <span className="text-base font-display font-black text-white">
                  ₹{feesOverview.totalDue.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
                <span className="text-[10px] uppercase font-heading font-bold text-emerald-400 block mb-1">
                  Collected
                </span>
                <span className="text-base font-display font-black text-emerald-400">
                  ₹{feesOverview.collected.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-red-500/5 border border-red-500/20">
                <span className="text-[10px] uppercase font-heading font-bold text-red-400 block mb-1">
                  Balance
                </span>
                <span className="text-base font-display font-black text-red-400">
                  ₹{feesOverview.outstanding.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
            <span>
              <strong>{feesOverview.fullyPaidCount}</strong> Paid ·{' '}
              <strong>{feesOverview.partiallyPaidCount}</strong> Partial ·{' '}
              <strong className="text-red-400">{feesOverview.pendingCount}</strong> Pending
            </span>
            <Link
              to="/founder/fees"
              className="text-amber-500 hover:text-amber-400 font-bold uppercase text-[11px]"
            >
              Record Payment +
            </Link>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Recent Enquiries & Recent Activity Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Website Enquiries */}
        <div className="bg-[#0f1523] border border-slate-800 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <MessageSquareQuote className="w-4 h-4" />
              </div>
              <h3 className="font-heading font-bold uppercase text-sm text-white tracking-wider">
                Recent Website Enquiries
              </h3>
            </div>
            <Link
              to="/founder/enquiries"
              className="text-xs font-heading font-bold uppercase text-amber-500 hover:text-amber-400 transition-colors"
            >
              View All ({summary.totalEnquiries}) →
            </Link>
          </div>

          <div className="space-y-3">
            {recentEnquiries && recentEnquiries.length > 0 ? (
              recentEnquiries.map((enq: any) => {
                let badgeColor = 'bg-blue-500/10 text-blue-400 border-blue-500/30';
                if (enq.status === 'New') badgeColor = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
                else if (enq.status === 'Converted') badgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
                else if (enq.status === 'Trial Scheduled') badgeColor = 'bg-purple-500/10 text-purple-400 border-purple-500/30';

                return (
                  <div
                    key={enq.id}
                    className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-heading font-bold uppercase text-xs text-white truncate">
                          {enq.name}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-heading uppercase font-bold ${badgeColor}`}>
                          {enq.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        <span>{enq.phone}</span> · <span>Age: {enq.player_age || 'N/A'}</span>
                      </div>
                    </div>

                    <Link
                      to="/founder/enquiries"
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-heading text-[11px] uppercase font-bold shrink-0 transition-colors"
                    >
                      Follow Up
                    </Link>
                  </div>
                );
              })
            ) : (
              <div className="py-8 text-center text-xs text-slate-500 font-sans">
                No recent enquiries received yet.
              </div>
            )}
          </div>
        </div>

        {/* Real-time Activity Logs */}
        <div className="bg-[#0f1523] border border-slate-800 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <h3 className="font-heading font-bold uppercase text-sm text-white tracking-wider">
                Audit &amp; Operations Activity
              </h3>
            </div>
            <Link
              to="/founder/settings"
              className="text-xs font-heading font-bold uppercase text-amber-500 hover:text-amber-400 transition-colors"
            >
              Full Log →
            </Link>
          </div>

          <div className="space-y-3">
            {recentActivities && recentActivities.length > 0 ? (
              recentActivities.map((act: any) => (
                <div
                  key={act.id}
                  className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3 text-xs"
                >
                  <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span className="font-heading font-bold text-white uppercase text-[11px]">
                        {act.action}
                      </span>
                      <span className="text-[10px] text-slate-500 shrink-0 font-sans">
                        {act.created_at}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed truncate">
                      {act.details}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-slate-500 font-sans">
                No recent activity recorded.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
