import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Download,
  Users,
  CalendarCheck2,
  Receipt,
  MessageSquareQuote,
  TrendingUp,
  FileSpreadsheet,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

export const ReportsPage: React.FC = () => {
  const { authFetch } = useAuth();
  const { error } = useToast();

  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await authFetch('/api/reports/analytics');
      if (!res.ok) throw new Error('Failed to load operational analytics.');
      const data = await res.json();
      setAnalytics(data);
    } catch (err: any) {
      error(err.message || 'Error loading analytics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const downloadCsv = (type: string) => {
    if (type === 'students') window.open('/api/students/export/csv', '_blank');
    else if (type === 'fees') window.open('/api/fees/export/csv?period=October%202026', '_blank');
    else if (type === 'attendance') {
      const today = new Date().toISOString().split('T')[0];
      window.open(`/api/attendance/export/csv?date=${today}`, '_blank');
    } else if (type === 'enquiries') window.open('/api/enquiries/export/csv', '_blank');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <span className="text-xs uppercase font-heading font-bold text-amber-500 tracking-wider">
            Operational Intelligence
          </span>
          <h2 className="text-2xl sm:text-3xl font-display uppercase tracking-tight text-white">
            REPORTS &amp; DATA EXPORTS
          </h2>
        </div>
      </div>

      {/* CSV Export Center Strip */}
      <div className="p-6 rounded-3xl bg-[#0f1523] border border-slate-800 space-y-4">
        <h3 className="font-heading font-bold uppercase text-sm text-white tracking-wider flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4 text-amber-500" />
          <span>One-Click Administrative CSV Exports</span>
        </h3>
        <p className="text-xs text-slate-400">
          Download formatted, spreadsheet-compatible CSV audit files generated directly from current database records.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          <button
            type="button"
            onClick={() => downloadCsv('students')}
            className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-left transition-colors group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <Users className="w-4 h-4 text-blue-400" />
              <Download className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 transition-colors" />
            </div>
            <span className="text-xs font-heading font-bold uppercase text-white block">
              Students Directory
            </span>
            <span className="text-[11px] text-slate-400 font-sans block">
              Profiles, guardians &amp; squads
            </span>
          </button>

          <button
            type="button"
            onClick={() => downloadCsv('fees')}
            className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-left transition-colors group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <Receipt className="w-4 h-4 text-emerald-400" />
              <Download className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 transition-colors" />
            </div>
            <span className="text-xs font-heading font-bold uppercase text-white block">
              Fee Collection Ledger
            </span>
            <span className="text-[11px] text-slate-400 font-sans block">
              Billed fees, receipts &amp; dues
            </span>
          </button>

          <button
            type="button"
            onClick={() => downloadCsv('attendance')}
            className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-left transition-colors group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <CalendarCheck2 className="w-4 h-4 text-amber-400" />
              <Download className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 transition-colors" />
            </div>
            <span className="text-xs font-heading font-bold uppercase text-white block">
              Attendance Records
            </span>
            <span className="text-[11px] text-slate-400 font-sans block">
              Daily rolls, present rates
            </span>
          </button>

          <button
            type="button"
            onClick={() => downloadCsv('enquiries')}
            className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-left transition-colors group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <MessageSquareQuote className="w-4 h-4 text-purple-400" />
              <Download className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 transition-colors" />
            </div>
            <span className="text-xs font-heading font-bold uppercase text-white block">
              Enquiry Pipeline
            </span>
            <span className="text-[11px] text-slate-400 font-sans block">
              Website leads &amp; follow-ups
            </span>
          </button>
        </div>
      </div>

      {/* Analytics Breakdown Grid */}
      {analytics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Enrolment by Squad */}
          <div className="p-6 rounded-3xl bg-[#0f1523] border border-slate-800 space-y-4">
            <h4 className="font-heading font-bold uppercase text-xs text-amber-500 tracking-wider">
              Enrolment Distribution &amp; Expected Revenue
            </h4>

            <div className="divide-y divide-slate-800">
              {analytics.studentsByGroup?.map((g: any, i: number) => (
                <div key={i} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white block">{g.group_name}</span>
                    <span className="text-[11px] text-slate-400">{g.student_count} Active Enrolled Players</span>
                  </div>
                  <span className="font-display font-black text-emerald-400 text-sm">
                    ₹{(g.expected_revenue || 0).toLocaleString('en-IN')} / mo
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue by Payment Method */}
          <div className="p-6 rounded-3xl bg-[#0f1523] border border-slate-800 space-y-4">
            <h4 className="font-heading font-bold uppercase text-xs text-amber-500 tracking-wider">
              Payment Method Collection Channels
            </h4>

            <div className="divide-y divide-slate-800">
              {analytics.collectionByMethod?.map((m: any, i: number) => (
                <div key={i} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white block">{m.payment_method}</span>
                    <span className="text-[11px] text-slate-400">{m.transaction_count} verified receipts</span>
                  </div>
                  <span className="font-display font-black text-white text-sm">
                    ₹{m.total_collected.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Enquiry Conversion Funnel */}
          <div className="p-6 rounded-3xl bg-[#0f1523] border border-slate-800 space-y-4 lg:col-span-2">
            <h4 className="font-heading font-bold uppercase text-xs text-amber-500 tracking-wider">
              Enquiry Conversion Pipeline Funnel
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
                <span className="text-[10px] font-heading uppercase font-bold text-slate-400 block mb-1">
                  Total Leads Received
                </span>
                <span className="text-3xl font-display font-black text-white">
                  {analytics.enquiryStats.total}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-center">
                <span className="text-[10px] font-heading uppercase font-bold text-blue-400 block mb-1">
                  Contacted / Active
                </span>
                <span className="text-3xl font-display font-black text-blue-400">
                  {analytics.enquiryStats.contacted}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-center">
                <span className="text-[10px] font-heading uppercase font-bold text-purple-400 block mb-1">
                  Trials Scheduled
                </span>
                <span className="text-3xl font-display font-black text-purple-400">
                  {analytics.enquiryStats.trial_scheduled}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                <span className="text-[10px] font-heading uppercase font-bold text-emerald-400 block mb-1">
                  Successfully Enrolled
                </span>
                <span className="text-3xl font-display font-black text-emerald-400">
                  {analytics.enquiryStats.converted}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
