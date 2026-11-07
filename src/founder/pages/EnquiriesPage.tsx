import React, { useState, useEffect } from 'react';
import {
  MessageSquareQuote,
  Search,
  Filter,
  Download,
  Phone,
  Mail,
  Calendar,
  Eye,
  CheckCircle2,
  Clock,
  ArrowRight,
  UserCheck,
  X,
  Send,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { Enquiry } from '../types';

export const EnquiriesPage: React.FC = () => {
  const { authFetch } = useAuth();
  const { success, error } = useToast();

  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Selected Detail Modal
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [editStatus, setEditStatus] = useState<any>('New');
  const [editNotes, setEditNotes] = useState('');
  const [editNextFollowUp, setEditNextFollowUp] = useState('');

  // Convert to Student Modal
  const [convertingEnquiry, setConvertingEnquiry] = useState<Enquiry | null>(null);
  const [convertSquad, setConvertSquad] = useState('u12');
  const [convertFee, setConvertFee] = useState('3500');
  const [convertGuardian, setConvertGuardian] = useState('');
  const [isConverting, setIsConverting] = useState(false);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (search) params.set('search', search);

      const res = await authFetch(`/api/enquiries?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch enquiries.');
      const data = await res.json();
      setEnquiries(data);
    } catch (err: any) {
      error(err.message || 'Error loading enquiries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEnquiries();
  };

  const openDetail = (enq: Enquiry) => {
    setSelectedEnquiry(enq);
    setEditStatus(enq.status);
    setEditNotes(enq.notes || '');
    setEditNextFollowUp(enq.next_follow_up || '');
  };

  const handleSaveStatus = async () => {
    if (!selectedEnquiry) return;
    try {
      const res = await authFetch(`/api/enquiries/${selectedEnquiry.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: editStatus,
          notes: editNotes,
          next_follow_up: editNextFollowUp
        })
      });

      if (!res.ok) throw new Error('Failed to update enquiry status.');
      success(`Enquiry status updated to ${editStatus}`);
      setSelectedEnquiry(null);
      fetchEnquiries();
    } catch (err: any) {
      error(err.message);
    }
  };

  const openConvertModal = (enq: Enquiry) => {
    setConvertingEnquiry(enq);
    setConvertSquad('u12');
    setConvertFee('3500');
    setConvertGuardian(enq.name);
  };

  const handleConvertSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!convertingEnquiry) return;

    setIsConverting(true);
    try {
      const res = await authFetch(`/api/enquiries/${convertingEnquiry.id}/convert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          training_group: convertSquad,
          monthly_fee: parseInt(convertFee, 10) || 3500,
          guardian_name: convertGuardian
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to convert enquiry.');

      success(`Successfully converted! Enrolled as student: ${data.studentId}`);
      setConvertingEnquiry(null);
      fetchEnquiries();
    } catch (err: any) {
      error(err.message);
    } finally {
      setIsConverting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this enquiry record?')) return;
    try {
      const res = await authFetch(`/api/enquiries/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete enquiry.');
      success('Enquiry record deleted.');
      fetchEnquiries();
    } catch (err: any) {
      error(err.message);
    }
  };

  const getCleanWhatsappUrl = (phone: string, name: string) => {
    const digits = phone.replace(/[^0-9]/g, '');
    const cleanNumber = digits.length === 10 ? `91${digits}` : digits;
    const msg = encodeURIComponent(`Hello ${name}, thank you for contacting Elite Football Training! How can we assist you with coaching details and trial session schedules?`);
    return `https://wa.me/${cleanNumber}?text=${msg}`;
  };

  const handleExportCsv = () => {
    window.open('/api/enquiries/export/csv', '_blank');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <span className="text-xs uppercase font-heading font-bold text-amber-500 tracking-wider">
            Public Website Submissions
          </span>
          <h2 className="text-2xl sm:text-3xl font-display uppercase tracking-tight text-white">
            ENQUIRY MANAGEMENT &amp; TRIALS
          </h2>
        </div>

        <button
          type="button"
          onClick={handleExportCsv}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-heading uppercase font-semibold transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-amber-500" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#0f1523] border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {(['all', 'New', 'Contacted', 'Trial Scheduled', 'Converted', 'Not Interested'] as const).map(
            (st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-heading uppercase font-bold tracking-wider transition-colors ${
                  statusFilter === st
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {st === 'all' ? 'All Enquiries' : st}
              </button>
            )
          )}
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, phone, program..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
          />
        </form>
      </div>

      {/* Enquiries Table */}
      <div className="bg-[#0f1523] border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0a0f19] border-b border-slate-800 text-slate-400 font-heading uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Contact Person</th>
                <th className="py-3.5 px-4">Player Details</th>
                <th className="py-3.5 px-4">Program Interest</th>
                <th className="py-3.5 px-4">Submission Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Quick Contact &amp; Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <span>Loading enquiries...</span>
                  </td>
                </tr>
              ) : enquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No enquiries match the selected filter.
                  </td>
                </tr>
              ) : (
                enquiries.map((enq) => {
                  let badge = 'bg-blue-500/10 text-blue-400 border border-blue-500/30';
                  if (enq.status === 'New') badge = 'bg-amber-500/10 text-amber-400 border border-amber-500/30';
                  else if (enq.status === 'Converted') badge = 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30';
                  else if (enq.status === 'Trial Scheduled') badge = 'bg-purple-500/10 text-purple-400 border border-purple-500/30';
                  else if (enq.status === 'Not Interested') badge = 'bg-slate-800 text-slate-400';

                  return (
                    <tr key={enq.id} className="hover:bg-slate-900/40 transition-colors">
                      {/* Contact */}
                      <td className="py-3.5 px-4">
                        <div>
                          <span className="font-heading font-bold uppercase text-white block">
                            {enq.name}
                          </span>
                          <span className="text-[11px] text-slate-400 block">{enq.phone}</span>
                          {enq.email && <span className="text-[10px] text-slate-500 block truncate">{enq.email}</span>}
                        </div>
                      </td>

                      {/* Player details */}
                      <td className="py-3.5 px-4">
                        <div className="text-slate-300">
                          <span className="block font-medium">Age: {enq.player_age || 'N/A'}</span>
                          <span className="text-[11px] text-slate-400">Level: {enq.experience_level || 'Beginner'}</span>
                        </div>
                      </td>

                      {/* Program Interest */}
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-800 font-heading uppercase text-[10px] text-slate-300">
                          {enq.program_interest || 'General Training'}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 font-mono text-slate-400 text-xs">
                        {enq.created_at?.slice(0, 10)}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-heading uppercase font-bold tracking-wider ${badge}`}>
                          {enq.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {/* Direct WhatsApp link */}
                          <a
                            href={getCleanWhatsappUrl(enq.phone, enq.name)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-colors"
                            title="Chat on WhatsApp"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </a>

                          {/* View details */}
                          <button
                            type="button"
                            onClick={() => openDetail(enq)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                            title="View / Update Notes"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Convert to Student if not already converted */}
                          {enq.status !== 'Converted' ? (
                            <button
                              type="button"
                              onClick={() => openConvertModal(enq)}
                              className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-heading text-[10px] uppercase font-black transition-colors flex items-center gap-1"
                              title="Enroll directly into Student directory"
                            >
                              <UserCheck className="w-3 h-3" />
                              <span>Convert</span>
                            </button>
                          ) : (
                            <span className="text-[10px] font-mono text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/10">
                              {enq.converted_student_id || 'Enrolled'}
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() => handleDelete(enq.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Delete Enquiry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
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

      {/* DETAIL / UPDATE STATUS MODAL */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f1523] border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-heading uppercase tracking-widest text-amber-500 font-bold">
                  Enquiry ID: #{selectedEnquiry.id}
                </span>
                <h3 className="text-xl font-display uppercase tracking-tight text-white">
                  ENQUIRY &amp; FOLLOW-UP
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Name:</span>
                <span className="text-white font-bold">{selectedEnquiry.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Phone / WhatsApp:</span>
                <span className="text-amber-400 font-mono font-bold">{selectedEnquiry.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Player Age / Level:</span>
                <span className="text-slate-200">{selectedEnquiry.player_age || 'N/A'} · {selectedEnquiry.experience_level || 'Beginner'}</span>
              </div>
              <div className="pt-2 border-t border-slate-800">
                <span className="text-slate-400 block mb-1">Message from visitor:</span>
                <p className="text-slate-200 italic bg-black/40 p-2.5 rounded-lg">{selectedEnquiry.message}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-heading uppercase font-semibold text-slate-300 tracking-wider mb-1.5">
                  Update Enquiry Status
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted via Phone / WhatsApp</option>
                  <option value="Trial Scheduled">Trial Session Scheduled</option>
                  <option value="Converted">Converted to Enrolled Student</option>
                  <option value="Not Interested">Not Interested / Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-heading uppercase font-semibold text-slate-300 tracking-wider mb-1.5">
                  Next Follow-up Date
                </label>
                <input
                  type="date"
                  value={editNextFollowUp}
                  onChange={(e) => setEditNextFollowUp(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-heading uppercase font-semibold text-slate-300 tracking-wider mb-1.5">
                  Private Follow-up Remarks
                </label>
                <textarea
                  rows={3}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="e.g. Spoke to mother, scheduled free trial Saturday 6:30 AM."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedEnquiry(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-heading uppercase font-bold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveStatus}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-heading font-black uppercase tracking-wider"
                >
                  Save Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONVERT ENQUIRY TO STUDENT MODAL */}
      {convertingEnquiry && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f1523] border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-heading uppercase tracking-widest text-emerald-400 font-bold">
                  Quick Enrollment
                </span>
                <h3 className="text-xl font-display uppercase tracking-tight text-white">
                  CONVERT TO STUDENT RECORD
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setConvertingEnquiry(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              This will automatically enroll <strong>{convertingEnquiry.name}</strong> as an active student and create their current fee record.
            </p>

            <form onSubmit={handleConvertSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-heading uppercase font-semibold text-slate-300 tracking-wider mb-1.5">
                  Guardian / Parent Name *
                </label>
                <input
                  type="text"
                  required
                  value={convertGuardian}
                  onChange={(e) => setConvertGuardian(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-heading uppercase font-semibold text-slate-300 tracking-wider mb-1.5">
                  Assign Training Squad *
                </label>
                <select
                  value={convertSquad}
                  onChange={(e) => setConvertSquad(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="u10">Grassroots (U-10)</option>
                  <option value="u12">Youth Development (U-12)</option>
                  <option value="u14">Junior Academy (U-14)</option>
                  <option value="u16">Elite Squad (U-16)</option>
                  <option value="seniors">Senior &amp; Pro Pathway (U-19+)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-heading uppercase font-semibold text-slate-300 tracking-wider mb-1.5">
                  Monthly Fee (₹) *
                </label>
                <input
                  type="number"
                  required
                  value={convertFee}
                  onChange={(e) => setConvertFee(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setConvertingEnquiry(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-heading uppercase font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isConverting}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-heading font-black uppercase tracking-wider flex items-center gap-1.5"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>{isConverting ? 'Enrolling...' : 'Confirm Enrollment'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
