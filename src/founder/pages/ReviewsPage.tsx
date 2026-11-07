import React, { useState, useEffect } from 'react';
import {
  Star,
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
  Clock,
  ShieldCheck,
  Eye,
  EyeOff,
  X,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { ReviewItemAdmin } from '../types';

export const ReviewsPage: React.FC = () => {
  const { authFetch } = useAuth();
  const { success, error } = useToast();

  const [reviews, setReviews] = useState<ReviewItemAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // Add Testimonial Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    author: '',
    role: 'Parent',
    rating: 5,
    content: '',
    avatar: ''
  });

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await authFetch('/api/reviews');
      if (!res.ok) throw new Error('Failed to load reviews.');
      const data = await res.json();
      setReviews(data);
    } catch (err: any) {
      error(err.message || 'Error fetching reviews.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: 'approved' | 'rejected' | 'pending') => {
    try {
      const res = await authFetch(`/api/reviews/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error('Failed to update review status.');

      success(`Review ${newStatus === 'approved' ? 'approved for public display' : `marked as ${newStatus}`}.`);
      fetchReviews();
    } catch (err: any) {
      error(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      const res = await authFetch(`/api/reviews/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete review.');
      success('Review removed.');
      fetchReviews();
    } catch (err: any) {
      error(err.message);
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.author || !formData.content) {
      error('Author and content are required.');
      return;
    }

    try {
      const res = await authFetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('Failed to add testimonial.');

      success('Verified testimonial added and published!');
      setShowAddModal(false);
      setFormData({
        author: '',
        role: 'Parent',
        rating: 5,
        content: '',
        avatar: ''
      });
      fetchReviews();
    } catch (err: any) {
      error(err.message);
    }
  };

  const filteredReviews = reviews.filter((r) =>
    statusFilter === 'all' ? true : r.status === statusFilter
  );

  const pendingCount = reviews.filter((r) => r.status === 'pending').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <span className="text-xs uppercase font-heading font-bold text-amber-500 tracking-wider">
            Public Website Testimonials
          </span>
          <h2 className="text-2xl sm:text-3xl font-display uppercase tracking-tight text-white">
            REVIEW &amp; TESTIMONIAL MODERATION
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/reviews"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-heading uppercase font-semibold transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-amber-500" />
            <span>View Public Reviews</span>
          </a>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-heading font-black text-xs uppercase tracking-wider transition-colors shadow-md shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Genuine Testimonial</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="p-3 rounded-2xl bg-[#0f1523] border border-slate-800 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setStatusFilter('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-heading uppercase font-bold tracking-wider transition-colors ${
            statusFilter === 'all'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          All ({reviews.length})
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('pending')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-heading uppercase font-bold tracking-wider transition-colors flex items-center gap-1.5 ${
            statusFilter === 'pending'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'bg-slate-900 text-amber-400 hover:text-white'
          }`}
        >
          <span>Pending Moderation</span>
          {pendingCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-mono">
              {pendingCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('approved')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-heading uppercase font-bold tracking-wider transition-colors ${
            statusFilter === 'approved'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'bg-slate-900 text-emerald-400 hover:text-white'
          }`}
        >
          Approved &amp; Live
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('rejected')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-heading uppercase font-bold tracking-wider transition-colors ${
            statusFilter === 'rejected'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'bg-slate-900 text-red-400 hover:text-white'
          }`}
        >
          Rejected / Hidden
        </button>
      </div>

      {/* Reviews Cards List */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-20 text-center text-slate-500">
            <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <span className="text-xs font-heading uppercase tracking-widest">Loading Reviews...</span>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-[#0f1523] border border-slate-800 text-slate-500 text-xs">
            No reviews match the selected filter.
          </div>
        ) : (
          filteredReviews.map((r) => {
            let badge = 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30';
            if (r.status === 'pending') badge = 'bg-amber-500/10 text-amber-400 border border-amber-500/30';
            else if (r.status === 'rejected') badge = 'bg-red-500/10 text-red-400 border border-red-500/30';

            return (
              <div
                key={r.id}
                className="p-5 rounded-3xl bg-[#0f1523] border border-slate-800 space-y-3 shadow-md"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-heading font-bold text-amber-400">
                      {r.author.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-bold uppercase text-white text-xs">
                          {r.author}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-medium">
                          {r.role}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-sans">{r.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Stars */}
                    <div className="flex items-center text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                          }`}
                        />
                      ))}
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-heading uppercase font-bold tracking-wider ${badge}`}>
                      {r.status}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-sans italic bg-slate-900/40 p-3 rounded-2xl border border-slate-800/60">
                  "{r.content}"
                </p>

                {/* Moderation Actions */}
                <div className="pt-2 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                    {r.is_genuine_external ? (
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Verified Genuine Testimonial</span>
                      </span>
                    ) : (
                      <span>Public Website Submission</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {r.status !== 'approved' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(r.id, 'approved')}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-heading text-xs uppercase font-bold transition-colors flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve &amp; Publish</span>
                      </button>
                    )}

                    {r.status !== 'rejected' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(r.id, 'rejected')}
                        className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-heading text-xs uppercase font-bold transition-colors flex items-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDelete(r.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Delete review"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ADD GENUINE TESTIMONIAL MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f1523] border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-heading uppercase tracking-widest text-amber-500 font-bold">
                  Verified Testimonial
                </span>
                <h3 className="text-xl font-display uppercase tracking-tight text-white">
                  ADD AUTHORIZED TESTIMONIAL
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-heading uppercase font-semibold text-slate-300 tracking-wider mb-1.5">
                    Author / Parent Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="e.g. Ritu Verma"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-heading uppercase font-semibold text-slate-300 tracking-wider mb-1.5">
                    Role *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Parent">Parent</option>
                    <option value="Player">Player</option>
                    <option value="Senior Trainee">Senior Trainee</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-heading uppercase font-semibold text-slate-300 tracking-wider mb-1.5">
                  Rating (Stars)
                </label>
                <select
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value, 10) })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                  <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                  <option value={3}>⭐⭐⭐ (3 Stars)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-heading uppercase font-semibold text-slate-300 tracking-wider mb-1.5">
                  Feedback Content *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Enter genuine parent/player quote..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-heading uppercase font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-heading font-black uppercase tracking-wider"
                >
                  Publish Testimonial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
