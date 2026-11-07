import React, { useState, useEffect } from 'react';
import {
  CalendarCheck2,
  Calendar,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  HelpCircle,
  Download,
  Save,
  Search,
  CheckSquare,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { AttendanceRecord } from '../types';

export const AttendancePage: React.FC = () => {
  const { authFetch } = useAuth();
  const { success, error } = useToast();

  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [sessionName, setSessionName] = useState('Morning Session');
  const [students, setStudents] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const res = await authFetch(`/api/attendance?date=${date}&group=${selectedGroup}`);
      if (!res.ok) throw new Error('Failed to fetch attendance data.');
      const data = await res.json();
      setStudents(data.students || []);
    } catch (err: any) {
      error(err.message || 'Error loading attendance sheet.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [date, selectedGroup]);

  const updateStudentStatus = (
    studentId: string,
    status: 'present' | 'absent' | 'late' | 'excused' | 'unmarked'
  ) => {
    setStudents((prev) =>
      prev.map((s) => (s.student_id === studentId ? { ...s, status } : s))
    );
  };

  const updateStudentNote = (studentId: string, notes: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.student_id === studentId ? { ...s, notes } : s))
    );
  };

  const markAllPresent = () => {
    setStudents((prev) => prev.map((s) => ({ ...s, status: 'present' })));
    success('All students on sheet marked as Present. Review and click Save Attendance.');
  };

  const saveAttendance = async () => {
    setSaving(true);
    try {
      const payload = {
        date,
        session_name: sessionName,
        records: students.map((s) => ({
          student_id: s.student_id,
          training_group: s.training_group,
          status: s.status,
          notes: s.notes
        }))
      };

      const res = await authFetch('/api/attendance/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Failed to save attendance records.');

      success(`Attendance successfully recorded for ${students.length} students on ${date}!`);
      fetchAttendance();
    } catch (err: any) {
      error(err.message || 'Failed to save attendance.');
    } finally {
      setSaving(false);
    }
  };

  const handleExportCsv = () => {
    window.open(`/api/attendance/export/csv?date=${date}`, '_blank');
  };

  // Filtered students by search input
  const filteredStudents = students.filter(
    (s) =>
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.student_id.toLowerCase().includes(search.toLowerCase())
  );

  // Stats calculation
  const totalStudents = students.length;
  const presentCount = students.filter((s) => s.status === 'present').length;
  const absentCount = students.filter((s) => s.status === 'absent').length;
  const lateCount = students.filter((s) => s.status === 'late').length;
  const excusedCount = students.filter((s) => s.status === 'excused').length;
  const unmarkedCount = students.filter((s) => s.status === 'unmarked').length;
  const rate = totalStudents > 0 ? Math.round(((presentCount + lateCount) / totalStudents) * 100) : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <span className="text-xs uppercase font-heading font-bold text-amber-500 tracking-wider">
            Daily Pitch Operations
          </span>
          <h2 className="text-2xl sm:text-3xl font-display uppercase tracking-tight text-white">
            ATTENDANCE MANAGEMENT
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
            onClick={saveAttendance}
            disabled={saving || loading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-heading font-black text-xs uppercase tracking-wider transition-colors shadow-md shadow-amber-500/20 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Attendance Sheet'}</span>
          </button>
        </div>
      </div>

      {/* Control Bar: Date Picker, Squad, Session & Search */}
      <div className="p-4 rounded-2xl bg-[#0f1523] border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Date Picker */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white">
            <Calendar className="w-4 h-4 text-amber-500 shrink-0" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-transparent text-white font-mono text-xs focus:outline-none"
            />
          </div>

          {/* Squad Selector */}
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-sans focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Batches</option>
            <option value="junior">Junior Batch</option>
            <option value="senior">Senior Batch</option>
          </select>

          {/* Session Selector */}
          <select
            value={sessionName}
            onChange={(e) => setSessionName(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-sans focus:outline-none focus:border-amber-500"
          >
            <option value="Morning Session">Morning Training (06:30 AM)</option>
            <option value="Evening Session">Evening Training (05:00 PM)</option>
            <option value="Weekend Match">Weekend Match Simulation</option>
            <option value="Specialist Camp">Specialist Drill Clinic</option>
          </select>
        </div>

        {/* Quick Batch Action & Search */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search student..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <button
            type="button"
            onClick={markAllPresent}
            className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-heading text-xs uppercase font-bold transition-colors shrink-0 flex items-center gap-1.5"
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Mark All Present</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
          <span className="text-[10px] uppercase font-heading font-bold text-slate-400 block mb-0.5">
            Total In Squad
          </span>
          <span className="text-xl font-display font-black text-white">{totalStudents}</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
          <span className="text-[10px] uppercase font-heading font-bold text-emerald-400 block mb-0.5">
            Present ({rate}%)
          </span>
          <span className="text-xl font-display font-black text-emerald-400">{presentCount}</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-center">
          <span className="text-[10px] uppercase font-heading font-bold text-red-400 block mb-0.5">
            Absent
          </span>
          <span className="text-xl font-display font-black text-red-400">{absentCount}</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center">
          <span className="text-[10px] uppercase font-heading font-bold text-amber-400 block mb-0.5">
            Late
          </span>
          <span className="text-xl font-display font-black text-amber-400">{lateCount}</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-center col-span-2 sm:col-span-1">
          <span className="text-[10px] uppercase font-heading font-bold text-blue-400 block mb-0.5">
            Excused / Unmarked
          </span>
          <span className="text-xl font-display font-black text-blue-400">
            {excusedCount} / {unmarkedCount}
          </span>
        </div>
      </div>

      {/* Roll Call Student List */}
      <div className="bg-[#0f1523] border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0a0f19] border-b border-slate-800 text-slate-400 font-heading uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">Squad</th>
                <th className="py-3.5 px-4">Roll Status</th>
                <th className="py-3.5 px-4">Session Notes &amp; Observations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-500">
                    <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <span>Loading attendance roll...</span>
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-500">
                    No active students found for this squad.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.student_id} className="hover:bg-slate-900/40 transition-colors">
                    {/* Student Info */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {student.avatar ? (
                          <img
                            src={student.avatar}
                            alt={student.name}
                            className="w-8 h-8 rounded-full object-cover border border-slate-700 shrink-0"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-heading font-bold text-amber-400 shrink-0">
                            {student.name?.charAt(0) || 'S'}
                          </div>
                        )}
                        <div>
                          <span className="font-heading font-bold uppercase text-white block">
                            {student.name}
                          </span>
                          <span className="text-[10px] text-amber-500 font-mono">
                            {student.student_id}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Squad */}
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-lg bg-slate-800 font-heading uppercase text-[10px] text-slate-300">
                        {student.group_name || student.training_group}
                      </span>
                    </td>

                    {/* Interactive Status Selector */}
                    <td className="py-3 px-4">
                      <div className="inline-flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
                        {/* Present */}
                        <button
                          type="button"
                          onClick={() => updateStudentStatus(student.student_id, 'present')}
                          className={`px-3 py-1 rounded-lg text-xs font-heading uppercase font-bold transition-all ${
                            student.status === 'present'
                              ? 'bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/30'
                              : 'text-slate-400 hover:text-emerald-400'
                          }`}
                        >
                          Present
                        </button>

                        {/* Absent */}
                        <button
                          type="button"
                          onClick={() => updateStudentStatus(student.student_id, 'absent')}
                          className={`px-3 py-1 rounded-lg text-xs font-heading uppercase font-bold transition-all ${
                            student.status === 'absent'
                              ? 'bg-red-500 text-white shadow-sm shadow-red-500/30'
                              : 'text-slate-400 hover:text-red-400'
                          }`}
                        >
                          Absent
                        </button>

                        {/* Late */}
                        <button
                          type="button"
                          onClick={() => updateStudentStatus(student.student_id, 'late')}
                          className={`px-3 py-1 rounded-lg text-xs font-heading uppercase font-bold transition-all ${
                            student.status === 'late'
                              ? 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/30'
                              : 'text-slate-400 hover:text-amber-400'
                          }`}
                        >
                          Late
                        </button>

                        {/* Excused */}
                        <button
                          type="button"
                          onClick={() => updateStudentStatus(student.student_id, 'excused')}
                          className={`px-3 py-1 rounded-lg text-xs font-heading uppercase font-bold transition-all ${
                            student.status === 'excused'
                              ? 'bg-blue-500 text-white shadow-sm shadow-blue-500/30'
                              : 'text-slate-400 hover:text-blue-400'
                          }`}
                        >
                          Excused
                        </button>
                      </div>
                    </td>

                    {/* Notes Input */}
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        value={student.notes || ''}
                        onChange={(e) => updateStudentNote(student.student_id, e.target.value)}
                        placeholder="Add quick drill observation, late reason, or injury note..."
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500 transition-colors"
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
