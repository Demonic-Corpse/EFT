import React, { useState, useEffect } from 'react';
import {
  Receipt,
  Search,
  Filter,
  Download,
  Plus,
  RotateCcw,
  Tag,
  Printer,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  X,
  CreditCard,
  DollarSign
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { FeeRecord, Payment } from '../types';

export const FeesPage: React.FC = () => {
  const { authFetch } = useAuth();
  const { success, error } = useToast();

  const [billingPeriod, setBillingPeriod] = useState('October 2026');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [search, setSearch] = useState('');

  const [feeRecords, setFeeRecords] = useState<FeeRecord[]>([]);
  const [dashboardMetrics, setDashboardMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Modals
  const [activePaymentFee, setActivePaymentFee] = useState<FeeRecord | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'UPI' | 'Bank Transfer' | 'Other'>('UPI');
  const [paymentRef, setPaymentRef] = useState('');
  const [paymentNotes, setPaymentNotes] = useState('');
  const [submittingPayment, setSubmittingPayment] = useState(false);

  // Waive Modal
  const [activeWaiveFee, setActiveWaiveFee] = useState<FeeRecord | null>(null);
  const [waiveAmount, setWaiveAmount] = useState('');
  const [waiveReason, setWaiveReason] = useState('');

  // Reversal Modal
  const [activePaymentForReversal, setActivePaymentForReversal] = useState<Payment | null>(null);
  const [reversalReason, setReversalReason] = useState('');

  // Receipt Modal
  const [printableReceipt, setPrintableReceipt] = useState<any>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch metrics
      const metricRes = await authFetch(`/api/fees/dashboard?period=${encodeURIComponent(billingPeriod)}`);
      if (metricRes.ok) {
        const metrics = await metricRes.json();
        setDashboardMetrics(metrics);
      }

      // 2. Fetch records
      const queryParams = new URLSearchParams();
      queryParams.set('period', billingPeriod);
      if (selectedStatus !== 'all') queryParams.set('status', selectedStatus);
      if (selectedGroup !== 'all') queryParams.set('group', selectedGroup);
      if (search) queryParams.set('search', search);

      const recordsRes = await authFetch(`/api/fees?${queryParams.toString()}`);
      if (!recordsRes.ok) throw new Error('Failed to load fee ledger.');
      const data = await recordsRes.json();
      setFeeRecords(data);
    } catch (err: any) {
      error(err.message || 'Error fetching fee records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [billingPeriod, selectedStatus, selectedGroup]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData();
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePaymentFee) return;

    const amt = parseInt(paymentAmount, 10);
    if (!amt || amt <= 0) {
      error('Please enter a valid payment amount.');
      return;
    }

    if (amt > activePaymentFee.balance) {
      error(`Payment amount cannot exceed outstanding balance of ₹${activePaymentFee.balance}`);
      return;
    }

    setSubmittingPayment(true);
    try {
      const res = await authFetch(`/api/fees/${activePaymentFee.id}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amt,
          payment_method: paymentMethod,
          transaction_ref: paymentRef,
          notes: paymentNotes
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to record payment.');

      success(`Payment of ₹${amt.toLocaleString('en-IN')} recorded successfully! Receipt: ${data.receiptNo}`);
      setActivePaymentFee(null);
      setPaymentAmount('');
      setPaymentRef('');
      setPaymentNotes('');
      fetchData();
    } catch (err: any) {
      error(err.message);
    } finally {
      setSubmittingPayment(false);
    }
  };

  const handleWaiveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeWaiveFee) return;

    if (!waiveReason.trim()) {
      error('Mandatory reason is required for fee adjustment or waiver.');
      return;
    }

    try {
      const res = await authFetch(`/api/fees/${activeWaiveFee.id}/waive`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          discount_amount: parseInt(waiveAmount, 10) || 0,
          reason: waiveReason.trim()
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to adjust fee.');

      success('Fee record adjusted successfully.');
      setActiveWaiveFee(null);
      setWaiveAmount('');
      setWaiveReason('');
      fetchData();
    } catch (err: any) {
      error(err.message);
    }
  };

  const handleReversePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePaymentForReversal) return;

    if (!reversalReason.trim()) {
      error('Mandatory reason is required for payment reversal.');
      return;
    }

    try {
      const res = await authFetch(`/api/fees/payments/${activePaymentForReversal.id}/reverse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: reversalReason.trim() })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to reverse payment.');

      success(`Payment ${activePaymentForReversal.receipt_no} reversed.`);
      setActivePaymentForReversal(null);
      setReversalReason('');
      fetchData();
    } catch (err: any) {
      error(err.message);
    }
  };

  const viewReceipt = async (paymentId: number) => {
    try {
      const res = await authFetch(`/api/fees/receipt/${paymentId}`);
      if (!res.ok) throw new Error('Failed to retrieve receipt.');
      const data = await res.json();
      setPrintableReceipt(data);
    } catch (err: any) {
      error(err.message);
    }
  };

  const handleExportCsv = () => {
    window.open(`/api/fees/export/csv?period=${encodeURIComponent(billingPeriod)}`, '_blank');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <span className="text-xs uppercase font-heading font-bold text-amber-500 tracking-wider">
            Financial Ledger &amp; Checklist
          </span>
          <h2 className="text-2xl sm:text-3xl font-display uppercase tracking-tight text-white">
            FEE MANAGEMENT &amp; CHECKLIST
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-heading uppercase font-semibold transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-amber-500" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      {dashboardMetrics && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-[#0f1523] border border-slate-800">
            <span className="text-[11px] font-heading uppercase font-bold text-slate-400 block mb-1">
              Total Billed ({dashboardMetrics.billingPeriod})
            </span>
            <span className="text-2xl font-display font-black text-white">
              ₹{dashboardMetrics.totalDue.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#0f1523] border border-slate-800">
            <span className="text-[11px] font-heading uppercase font-bold text-emerald-400 block mb-1">
              Amount Collected
            </span>
            <span className="text-2xl font-display font-black text-emerald-400">
              ₹{dashboardMetrics.amountPaid.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#0f1523] border border-slate-800">
            <span className="text-[11px] font-heading uppercase font-bold text-red-400 block mb-1">
              Outstanding Balance
            </span>
            <span className="text-2xl font-display font-black text-red-400">
              ₹{dashboardMetrics.outstandingBalance.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#0f1523] border border-slate-800">
            <span className="text-[11px] font-heading uppercase font-bold text-amber-400 block mb-1">
              Payment Status Breakdown
            </span>
            <span className="text-xs text-slate-300 block font-medium mt-1">
              <strong className="text-emerald-400">{dashboardMetrics.fullyPaidCount}</strong> Paid ·{' '}
              <strong className="text-amber-400">{dashboardMetrics.partiallyPaidCount}</strong> Partial ·{' '}
              <strong className="text-red-400">{dashboardMetrics.overdueCount}</strong> Overdue
            </span>
          </div>
        </div>
      )}

      {/* Filters Strip */}
      <div className="p-4 rounded-2xl bg-[#0f1523] border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Billing Period Selector */}
          <select
            value={billingPeriod}
            onChange={(e) => setBillingPeriod(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-white font-sans focus:outline-none focus:border-amber-500"
          >
            <option value="October 2026">October 2026</option>
            <option value="November 2026">November 2026</option>
            <option value="December 2026">December 2026</option>
            <option value="September 2026">September 2026</option>
          </select>

          {/* Payment Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-sans focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Statuses</option>
            <option value="paid">Fully Paid</option>
            <option value="partially_paid">Partially Paid</option>
            <option value="unpaid">Unpaid</option>
            <option value="overdue">Overdue</option>
            <option value="waived">Waived / Adjusted</option>
          </select>

          {/* Training Group Filter */}
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-sans focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Squads</option>
            <option value="u10">Grassroots (U-10)</option>
            <option value="u12">Youth (U-12)</option>
            <option value="u14">Junior Academy (U-14)</option>
            <option value="u16">Elite Squad (U-16)</option>
            <option value="seniors">Seniors (U-19+)</option>
          </select>
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student or phone..."
            className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
          />
        </form>
      </div>

      {/* Fee Checklist Table */}
      <div className="bg-[#0f1523] border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0a0f19] border-b border-slate-800 text-slate-400 font-heading uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">Billing Period</th>
                <th className="py-3.5 px-4 text-right">Fee Due</th>
                <th className="py-3.5 px-4 text-right">Amount Paid</th>
                <th className="py-3.5 px-4 text-right">Balance</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <span>Loading fee checklist...</span>
                  </td>
                </tr>
              ) : feeRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No fee records match the selected criteria.
                  </td>
                </tr>
              ) : (
                feeRecords.map((fee) => {
                  let badge = 'bg-slate-800 text-slate-400';
                  if (fee.status === 'paid') badge = 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30';
                  else if (fee.status === 'partially_paid') badge = 'bg-amber-500/10 text-amber-400 border border-amber-500/30';
                  else if (fee.status === 'overdue') badge = 'bg-red-500/10 text-red-400 border border-red-500/30';

                  return (
                    <tr key={fee.id} className="hover:bg-slate-900/40 transition-colors">
                      {/* Student info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-heading font-bold text-amber-400 shrink-0">
                            {fee.student_name?.charAt(0) || 'S'}
                          </div>
                          <div>
                            <span className="font-heading font-bold uppercase text-white block">
                              {fee.student_name}
                            </span>
                            <span className="text-[10px] text-amber-500 font-mono">
                              {fee.student_id} · {fee.group_name || fee.training_group}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Billing Period */}
                      <td className="py-3.5 px-4 font-mono text-slate-300">
                        {fee.billing_period}
                      </td>

                      {/* Fee Due */}
                      <td className="py-3.5 px-4 text-right font-display font-bold text-white text-sm">
                        ₹{fee.fee_due.toLocaleString('en-IN')}
                      </td>

                      {/* Amount Paid */}
                      <td className="py-3.5 px-4 text-right font-display font-bold text-emerald-400 text-sm">
                        ₹{fee.amount_paid.toLocaleString('en-IN')}
                      </td>

                      {/* Balance */}
                      <td className="py-3.5 px-4 text-right font-display font-black text-red-400 text-sm">
                        ₹{fee.balance.toLocaleString('en-IN')}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-heading uppercase font-bold tracking-wider ${badge}`}>
                          {fee.status.replace('_', ' ')}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {fee.balance > 0 && (
                            <button
                              type="button"
                              onClick={() => {
                                setActivePaymentFee(fee);
                                setPaymentAmount(String(fee.balance));
                              }}
                              className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-heading text-[11px] uppercase font-black transition-colors"
                            >
                              Record Payment
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              setActiveWaiveFee(fee);
                              setWaiveAmount('500');
                            }}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                            title="Fee Waiver / Discount Adjustment"
                          >
                            <Tag className="w-3.5 h-3.5" />
                          </button>

                          {fee.payments && fee.payments.length > 0 && (
                            <button
                              type="button"
                              onClick={() => viewReceipt(fee.payments![0].id)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                              title="View Latest Receipt"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* RECORD PAYMENT MODAL */}
      {activePaymentFee && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f1523] border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-heading uppercase tracking-widest text-amber-500 font-bold">
                  Tuition Collection
                </span>
                <h3 className="text-xl font-display uppercase tracking-tight text-white">
                  RECORD PAYMENT
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActivePaymentFee(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              <span className="font-heading uppercase text-slate-400 block mb-1">Player &amp; Fee Details</span>
              <div className="flex items-center justify-between font-bold text-white mb-0.5">
                <span>{activePaymentFee.student_name}</span>
                <span className="font-mono text-amber-500">{activePaymentFee.student_id}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Outstanding Balance:</span>
                <span className="text-red-400 font-bold">₹{activePaymentFee.balance.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-4">
              <div>
                <label className="block text-xs font-heading uppercase font-semibold text-slate-300 tracking-wider mb-1.5">
                  Payment Amount (₹) *
                </label>
                <input
                  type="number"
                  required
                  max={activePaymentFee.balance}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm font-bold text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-heading uppercase font-semibold text-slate-300 tracking-wider mb-1.5">
                  Payment Method *
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="UPI">UPI (Google Pay / PhonePe / Paytm)</option>
                  <option value="Cash">Cash (Received at pitch)</option>
                  <option value="Bank Transfer">Bank Transfer (NEFT / IMPS)</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-heading uppercase font-semibold text-slate-300 tracking-wider mb-1.5">
                  Transaction Reference / UTR
                </label>
                <input
                  type="text"
                  value={paymentRef}
                  onChange={(e) => setPaymentRef(e.target.value)}
                  placeholder="e.g. UPI/261020/998124"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-heading uppercase font-semibold text-slate-300 tracking-wider mb-1.5">
                  Internal Remarks / Notes
                </label>
                <input
                  type="text"
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  placeholder="e.g. Paid in full for October training"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setActivePaymentFee(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-heading uppercase font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingPayment}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-heading font-black uppercase tracking-wider transition-colors shadow-md shadow-amber-500/20 disabled:opacity-50"
                >
                  {submittingPayment ? 'Processing...' : 'Confirm & Generate Receipt'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FEE WAIVER / ADJUSTMENT MODAL */}
      {activeWaiveFee && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f1523] border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-heading uppercase tracking-widest text-amber-500 font-bold">
                  Concession &amp; Adjustment
                </span>
                <h3 className="text-xl font-display uppercase tracking-tight text-white">
                  ADJUST / WAIVE FEE
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveWaiveFee(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleWaiveSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-heading uppercase font-semibold text-slate-300 tracking-wider mb-1.5">
                  Concession / Discount Amount (₹) *
                </label>
                <input
                  type="number"
                  required
                  value={waiveAmount}
                  onChange={(e) => setWaiveAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-heading uppercase font-semibold text-slate-300 tracking-wider mb-1.5">
                  Mandatory Audit Reason *
                </label>
                <textarea
                  rows={3}
                  required
                  value={waiveReason}
                  onChange={(e) => setWaiveReason(e.target.value)}
                  placeholder="e.g. Sibling discount, tournament merit scholarship, or economic hardship approval."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveWaiveFee(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-heading uppercase font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-heading font-black uppercase tracking-wider"
                >
                  Apply Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINTABLE RECEIPT MODAL */}
      {printableReceipt && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-3xl max-w-lg w-full p-8 shadow-2xl space-y-6 relative print:p-0">
            <button
              type="button"
              onClick={() => setPrintableReceipt(null)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-800 transition-colors print:hidden"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Receipt Header */}
            <div className="text-center pb-4 border-b border-slate-200">
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-amber-600 block">
                OFFICIAL PAYMENT RECEIPT
              </span>
              <h3 className="text-2xl font-black uppercase tracking-tight text-slate-900">
                ELITE FOOTBALL TRAINING
              </h3>
              <p className="text-xs text-slate-500">
                Academy Registration &amp; Player Development · Receipt: {printableReceipt.receipt_no}
              </p>
            </div>

            {/* Receipt Body */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Student Name:</span>
                <span className="font-bold text-slate-900">{printableReceipt.student_name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Student ID / Squad:</span>
                <span className="font-mono text-slate-900 font-bold">{printableReceipt.student_id} ({printableReceipt.group_name})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Guardian Name:</span>
                <span className="font-medium text-slate-900">{printableReceipt.guardian_name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Billing Period:</span>
                <span className="font-medium text-slate-900">{printableReceipt.billing_period}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Payment Date:</span>
                <span className="font-medium text-slate-900">{printableReceipt.payment_date}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Payment Mode:</span>
                <span className="font-medium text-slate-900">{printableReceipt.payment_method} {printableReceipt.transaction_ref ? `(${printableReceipt.transaction_ref})` : ''}</span>
              </div>
              <div className="flex justify-between py-2 bg-slate-50 px-3 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-700">Amount Paid:</span>
                <span className="font-black text-emerald-600 text-base">₹{printableReceipt.amount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1 text-slate-500 text-[11px]">
                <span>Remaining Balance on Period:</span>
                <span className="font-bold text-slate-800">₹{printableReceipt.balance.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Print button */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 print:hidden">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs uppercase flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
