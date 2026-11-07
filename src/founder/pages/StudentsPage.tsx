import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Plus,
  Filter,
  Download,
  Phone,
  Mail,
  Calendar,
  Eye,
  Edit2,
  Archive,
  CheckCircle2,
  XCircle,
  Clock,
  Shield,
  X,
  AlertCircle,
  Receipt,
  FileText,
  Trash2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { Student } from '../types';

export const StudentsPage: React.FC = () => {
  const { authFetch } = useAuth();
  const { success, error } = useToast();

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('active');
  const [selectedFeeStatus, setSelectedFeeStatus] = useState('all');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [profileStudentId, setProfileStudentId] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [profileTab, setProfileTab] = useState<'overview' | 'attendance' | 'fees' | 'notes'>('overview');
  const [profileLoading, setProfileLoading] = useState(false);

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    age: '',
    gender: 'Male',
    guardian_name: '',
    guardian_phone: '',
    guardian_email: '',
    training_group: 'junior',
    joining_date: new Date().toISOString().split('T')[0],
    monthly_fee: '1600',
    address: '',
    notes: '',
    avatar: ''
  });

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.set('search', search);
      if (selectedGroup !== 'all') queryParams.set('group', selectedGroup);
      if (selectedStatus !== 'all') queryParams.set('status', selectedStatus);
      if (selectedFeeStatus !== 'all') queryParams.set('fee_status', selectedFeeStatus);

      const res = await authFetch(`/api/students?${queryParams.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch students.');
      const data = await res.json();
      setStudents(data);
    } catch (err: any) {
      error(err.message || 'Error loading students list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [selectedGroup, selectedStatus, selectedFeeStatus]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStudents();
  };

  const openProfile = async (id: string) => {
    setProfileStudentId(id);
    setProfileLoading(true);
    setProfileTab('overview');
    try {
      const res = await authFetch(`/api/students/${id}`);
      if (!res.ok) throw new Error('Failed to fetch student profile.');
      const data = await res.json();
      setProfileData(data);
    } catch (err: any) {
      error(err.message || 'Error opening profile.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await authFetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      let data: any = {};
      try {
        data = await res.json();
      } catch {
        // Fallback if response wasn't JSON
      }
      if (!res.ok) {
        throw new Error(data?.error || `Failed to enroll student (${res.status} ${res.statusText})`);
      }

      success(`Student enrolled successfully with ID: ${data.id || 'Created'}`);
      setShowAddModal(false);
      resetForm();
      fetchStudents();
    } catch (err: any) {
      error(err.message || 'Failed to enroll student.');
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    try {
      const res = await authFetch(`/api/students/${editingStudent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      let data: any = {};
      try {
        data = await res.json();
      } catch {
        // Fallback
      }
      if (!res.ok) {
        throw new Error(data?.error || `Failed to update student (${res.status} ${res.statusText})`);
      }

      success(`Updated profile for ${data.name || editingStudent.name} (${editingStudent.id})`);
      setEditingStudent(null);
      resetForm();
      fetchStudents();
    } catch (err: any) {
      error(err.message || 'Failed to update student.');
    }
  };

  const handleStatusToggle = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'inactive' : 'active';
    if (!confirm(`Are you sure you want to mark student ${id} as ${nextStatus}? Inactive students are automatically removed from active fees & payment checklist and attendance roll call.`)) {
      return;
    }
    try {
      const res = await authFetch(`/api/students/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
      if (!res.ok) throw new Error('Failed to change status.');
      success(`Student marked as ${nextStatus}. Removed from active fees & attendance.`);
      fetchStudents();
    } catch (err: any) {
      error(err.message);
    }
  };

  const handleDeleteStudent = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently remove student "${name}" (${id})?\n\nThis will permanently delete the student and remove all their fee records, payments, and attendance logs.`)) {
      return;
    }
    try {
      const res = await authFetch(`/api/students/${id}`, {
        method: 'DELETE'
      });
      let data: any = {};
      try {
        data = await res.json();
      } catch {}
      if (!res.ok) throw new Error(data.error || 'Failed to remove student.');
      success(`Student ${name} and all fee records permanently removed.`);
      if (profileStudentId === id) {
        setProfileStudentId(null);
      }
      fetchStudents();
    } catch (err: any) {
      error(err.message || 'Failed to remove student.');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      dob: '',
      age: '',
      gender: 'Male',
      guardian_name: '',
      guardian_phone: '',
      guardian_email: '',
      training_group: 'junior',
      joining_date: new Date().toISOString().split('T')[0],
      monthly_fee: '1600',
      address: '',
      notes: '',
      avatar: ''
    });
  };

  const openEditModal = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      dob: student.dob || '',
      age: String(student.age || ''),
      gender: student.gender || 'Male',
      guardian_name: student.guardian_name,
      guardian_phone: student.guardian_phone,
      guardian_email: student.guardian_email || '',
      training_group: student.training_group,
      joining_date: student.joining_date,
      monthly_fee: String(student.monthly_fee),
      address: student.address || '',
      notes: student.notes || '',
      avatar: student.avatar || ''
    });
  };

  const handleExportCsv = () => {
    window.open('/api/students/export/csv', '_blank');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <span className="text-xs uppercase font-heading font-bold text-amber-500 tracking-wider">
            Academy Directory
          </span>
          <h2 className="text-2xl sm:text-3xl font-display uppercase tracking-tight text-white">
            STUDENT MANAGEMENT
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

          <button
            type="button"
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-heading font-black text-xs uppercase tracking-wider transition-colors shadow-md shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Enroll New Student</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#0f1523] border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name, ID, or guardian phone..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </form>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Training Group */}
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-sans focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Batches</option>
            <option value="junior">Junior Batch</option>
            <option value="senior">Senior Batch</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-sans focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive</option>
            <option value="archived">Archived</option>
          </select>

          {/* Fee Status Filter */}
          <select
            value={selectedFeeStatus}
            onChange={(e) => setSelectedFeeStatus(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-sans focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Fee Status</option>
            <option value="paid">Paid</option>
            <option value="partially_paid">Partially Paid</option>
            <option value="unpaid">Unpaid</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Students Data Table */}
      <div className="bg-[#0f1523] border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0a0f19] border-b border-slate-800 text-slate-400 font-heading uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">Training Squad</th>
                <th className="py-3.5 px-4">Guardian Contact</th>
                <th className="py-3.5 px-4">Joining Date</th>
                <th className="py-3.5 px-4">Attendance</th>
                <th className="py-3.5 px-4">Current Fee</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <span>Loading student records...</span>
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No students match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                students.map((student) => {
                  let feeBadge = 'bg-slate-800 text-slate-400';
                  if (student.current_fee_status === 'paid') {
                    feeBadge = 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30';
                  } else if (student.current_fee_status === 'partially_paid') {
                    feeBadge = 'bg-amber-500/10 text-amber-400 border border-amber-500/30';
                  } else if (student.current_fee_status === 'overdue') {
                    feeBadge = 'bg-red-500/10 text-red-400 border border-red-500/30';
                  }

                  return (
                    <tr key={student.id} className="hover:bg-slate-900/40 transition-colors">
                      {/* Student info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          {student.avatar ? (
                            <img
                              src={student.avatar}
                              alt={student.name}
                              className="w-9 h-9 rounded-full object-cover border border-slate-700 shrink-0"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-heading font-bold text-amber-400 shrink-0">
                              {student.name.charAt(0)}
                            </div>
                          )}
                          <div className="min-w-0">
                            <span className="font-heading font-bold uppercase text-white block truncate">
                              {student.name}
                            </span>
                            <span className="text-[10px] text-amber-500/90 font-mono font-bold block">
                              {student.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Squad */}
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 font-heading uppercase text-[11px] text-slate-300">
                          {student.group_name || student.training_group}
                        </span>
                      </td>

                      {/* Guardian */}
                      <td className="py-3.5 px-4">
                        <div className="text-slate-300">
                          <span className="block font-medium truncate">{student.guardian_name}</span>
                          <span className="block text-[11px] text-slate-400">{student.guardian_phone}</span>
                        </div>
                      </td>

                      {/* Joining date */}
                      <td className="py-3.5 px-4 text-slate-400 text-xs font-mono">
                        {student.joining_date}
                      </td>

                      {/* Attendance */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-400 rounded-full"
                              style={{ width: `${student.attendancePercentage || 0}%` }}
                            />
                          </div>
                          <span className="text-xs font-mono text-slate-300 font-bold">
                            {student.attendancePercentage || 0}%
                          </span>
                        </div>
                      </td>

                      {/* Fee status */}
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-heading uppercase font-bold tracking-wider ${feeBadge}`}>
                          {student.current_fee_status || 'unpaid'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-heading uppercase font-bold ${
                            student.status === 'active'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              student.status === 'active' ? 'bg-emerald-400' : 'bg-slate-500'
                            }`}
                          />
                          {student.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openProfile(student.id)}
                            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                            title="View Full Profile"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => openEditModal(student)}
                            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                            title="Edit Student"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleStatusToggle(student.id, student.status)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              student.status === 'active'
                                ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400'
                                : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400'
                            }`}
                            title={student.status === 'active' ? 'Mark Inactive (Remove from active fees & attendance)' : 'Activate Student'}
                          >
                            {student.status === 'active' ? (
                              <Archive className="w-3.5 h-3.5" />
                            ) : (
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteStudent(student.id, student.name)}
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                            title="Permanently Remove Student & Fee Records"
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

      {/* ADD STUDENT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0f1523] border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-heading uppercase tracking-widest text-amber-500 font-bold">
                  New Registration
                </span>
                <h3 className="text-xl font-display uppercase tracking-tight text-white">
                  ENROLL NEW STUDENT
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-heading uppercase font-semibold text-slate-300 tracking-wider mb-1.5">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Samar Kapoor"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-heading uppercase font-semibold text-slate-300 tracking-wider mb-1.5">
                    Training Batch *
                  </label>
                  <select
                    value={formData.training_group}
                    onChange={(e) => setFormData({ ...formData, training_group: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="junior">Junior Batch</option>
                    <option value="senior">Senior Batch</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-heading uppercase font-semibold text-slate-300 tracking-wider mb-1.5">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-heading uppercase font-semibold text-slate-300 tracking-wider mb-1.5">
                    Age
                  </label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    placeholder="e.g. 13"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-heading uppercase font-semibold text-slate-300 tracking-wider mb-1.5">
                    Guardian / Parent Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.guardian_name}
                    onChange={(e) => setFormData({ ...formData, guardian_name: e.target.value })}
                    placeholder="e.g. Vikram Kapoor"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-heading uppercase font-semibold text-slate-300 tracking-wider mb-1.5">
                    Guardian Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.guardian_phone}
                    onChange={(e) => setFormData({ ...formData, guardian_phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-heading uppercase font-semibold text-slate-300 tracking-wider mb-1.5">
                    Monthly Fee (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.monthly_fee}
                    onChange={(e) => setFormData({ ...formData, monthly_fee: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-heading uppercase font-semibold text-slate-300 tracking-wider mb-1.5">
                  Private Coaching Notes / Position
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. Attacking midfielder, strong weak foot, asthma inhaler carried."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-heading uppercase font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-heading font-black uppercase tracking-wider transition-colors shadow-md shadow-amber-500/20"
                >
                  Save &amp; Enroll Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT STUDENT MODAL */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0f1523] border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-heading uppercase tracking-widest text-amber-500 font-bold">
                  Editing Student ID: {editingStudent.id}
                </span>
                <h3 className="text-xl font-display uppercase tracking-tight text-white">
                  UPDATE STUDENT PROFILE
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingStudent(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-heading uppercase font-semibold text-slate-300 tracking-wider mb-1.5">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-heading uppercase font-semibold text-slate-300 tracking-wider mb-1.5">
                    Training Batch *
                  </label>
                  <select
                    value={formData.training_group}
                    onChange={(e) => setFormData({ ...formData, training_group: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="junior">Junior Batch</option>
                    <option value="senior">Senior Batch</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-heading uppercase font-semibold text-slate-300 tracking-wider mb-1.5">
                    Guardian Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.guardian_name}
                    onChange={(e) => setFormData({ ...formData, guardian_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-heading uppercase font-semibold text-slate-300 tracking-wider mb-1.5">
                    Guardian Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.guardian_phone}
                    onChange={(e) => setFormData({ ...formData, guardian_phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-heading uppercase font-semibold text-slate-300 tracking-wider mb-1.5">
                    Monthly Fee (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.monthly_fee}
                    onChange={(e) => setFormData({ ...formData, monthly_fee: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-heading uppercase font-semibold text-slate-300 tracking-wider mb-1.5">
                    Status
                  </label>
                  <select
                    value={editingStudent.status}
                    onChange={(e) => setEditingStudent({ ...editingStudent, status: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-heading uppercase font-semibold text-slate-300 tracking-wider mb-1.5">
                  Coaching Notes / Position
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-heading uppercase font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-heading font-black uppercase tracking-wider transition-colors shadow-md shadow-amber-500/20"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STUDENT PROFILE DRAWER / MODAL */}
      {profileStudentId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0f1523] border border-slate-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            {profileLoading || !profileData ? (
              <div className="py-20 text-center text-slate-400">
                <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <span>Loading profile records...</span>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="flex items-start justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-4">
                    {profileData.avatar ? (
                      <img
                        src={profileData.avatar}
                        alt={profileData.name}
                        className="w-14 h-14 rounded-2xl object-cover border border-slate-700"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center font-heading font-bold text-amber-400 text-xl">
                        {profileData.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-2xl font-display uppercase tracking-tight text-white">
                          {profileData.name}
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-heading font-bold uppercase">
                          {profileData.status}
                        </span>
                      </div>
                      <span className="text-xs font-mono text-amber-500 font-bold block">
                        {profileData.id} · {profileData.group_name}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setProfileStudentId(null)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* 4 Tabs */}
                <div className="flex items-center gap-2 border-b border-slate-800 text-xs font-heading uppercase tracking-wider font-bold">
                  {(['overview', 'attendance', 'fees', 'notes'] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setProfileTab(tab)}
                      className={`px-4 py-2.5 border-b-2 transition-colors ${
                        profileTab === tab
                          ? 'border-amber-500 text-amber-400'
                          : 'border-transparent text-slate-400 hover:text-white'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* TAB 1: OVERVIEW */}
                {profileTab === 'overview' && (
                  <div className="space-y-4 text-xs font-sans">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block font-heading uppercase">Guardian</span>
                        <span className="text-white font-bold block mt-0.5">{profileData.guardian_name}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block font-heading uppercase">Guardian Contact</span>
                        <span className="text-white font-bold block mt-0.5">{profileData.guardian_phone}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block font-heading uppercase">Joining Date</span>
                        <span className="text-white font-bold block mt-0.5">{profileData.joining_date}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block font-heading uppercase">Monthly Tuition</span>
                        <span className="text-white font-bold block mt-0.5">₹{profileData.monthly_fee}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block font-heading uppercase">Age / Gender</span>
                        <span className="text-white font-bold block mt-0.5">{profileData.age || 'N/A'} yrs · {profileData.gender}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block font-heading uppercase">Overall Attendance</span>
                        <span className="text-emerald-400 font-bold block mt-0.5">{profileData.attendanceRate}% Present</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-heading uppercase mb-1">Address</span>
                      <p className="text-slate-300">{profileData.address || 'No residential address recorded.'}</p>
                    </div>
                  </div>
                )}

                {/* TAB 2: ATTENDANCE HISTORY */}
                {profileTab === 'attendance' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
                      <span>Recent Session History (Last 30 Sessions)</span>
                      <span className="text-white font-bold">Rate: {profileData.attendanceRate}%</span>
                    </div>

                    <div className="divide-y divide-slate-800/60 max-h-60 overflow-y-auto">
                      {profileData.attendanceHistory && profileData.attendanceHistory.length > 0 ? (
                        profileData.attendanceHistory.map((att: any) => (
                          <div key={att.id} className="py-2.5 flex items-center justify-between text-xs">
                            <div>
                              <span className="font-mono text-white block">{att.date}</span>
                              <span className="text-[11px] text-slate-400">{att.session_name} · {att.notes || 'Normal participation'}</span>
                            </div>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-heading uppercase font-bold ${
                                att.status === 'present'
                                  ? 'bg-emerald-500/10 text-emerald-400'
                                  : att.status === 'late'
                                  ? 'bg-amber-500/10 text-amber-400'
                                  : 'bg-red-500/10 text-red-400'
                              }`}
                            >
                              {att.status}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="py-8 text-center text-slate-500 text-xs">
                          No historical attendance records logged yet for this player.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 3: FEES & PAYMENTS */}
                {profileTab === 'fees' && (
                  <div className="space-y-4">
                    <div>
                      <span className="text-xs font-heading uppercase font-bold text-slate-400 block mb-2">
                        Billing Periods Ledger
                      </span>
                      <div className="divide-y divide-slate-800/60 border border-slate-800 rounded-xl overflow-hidden">
                        {profileData.feeHistory && profileData.feeHistory.length > 0 ? (
                          profileData.feeHistory.map((fee: any) => (
                            <div key={fee.id} className="p-3 bg-slate-900/40 flex items-center justify-between text-xs">
                              <div>
                                <span className="font-bold text-white block">{fee.billing_period}</span>
                                <span className="text-[11px] text-slate-400">
                                  Fee: ₹{fee.fee_due} · Paid: ₹{fee.amount_paid} · Balance: ₹{fee.balance}
                                </span>
                              </div>
                              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] font-heading uppercase font-bold text-amber-400">
                                {fee.status}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="p-4 text-center text-slate-500 text-xs">No fee records found.</div>
                        )}
                      </div>
                    </div>

                    <div>
                      <span className="text-xs font-heading uppercase font-bold text-slate-400 block mb-2">
                        Recorded Payments &amp; Receipts
                      </span>
                      <div className="divide-y divide-slate-800/60 border border-slate-800 rounded-xl overflow-hidden">
                        {profileData.paymentHistory && profileData.paymentHistory.length > 0 ? (
                          profileData.paymentHistory.map((pay: any) => (
                            <div key={pay.id} className="p-3 bg-slate-900/40 flex items-center justify-between text-xs">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-amber-500 font-bold">{pay.receipt_no}</span>
                                  <span className="text-slate-400">({pay.payment_method})</span>
                                </div>
                                <span className="text-[11px] text-slate-400">{pay.payment_date} · {pay.notes || 'Tuition payment'}</span>
                              </div>
                              <span className="text-sm font-display font-black text-emerald-400">
                                ₹{pay.amount.toLocaleString('en-IN')}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="p-4 text-center text-slate-500 text-xs">No payments logged yet.</div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 4: NOTES */}
                {profileTab === 'notes' && (
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                    <span className="text-[10px] font-heading uppercase text-slate-400 block mb-2">
                      Coaching Remarks &amp; Development Strategy
                    </span>
                    <p>{profileData.notes || 'No confidential coaching notes recorded yet.'}</p>
                  </div>
                )}

                {/* Modal Footer Actions */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handleDeleteStudent(profileData.id, profileData.name)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-heading uppercase font-bold transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove Student</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setProfileStudentId(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-heading uppercase font-bold transition-colors"
                  >
                    Close
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
