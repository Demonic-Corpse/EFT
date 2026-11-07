import React, { useState, useEffect } from 'react';
import {
  Settings,
  Lock,
  Shield,
  Save,
  CheckCircle2,
  Clock,
  Key,
  Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { ActivityLog } from '../types';

export const SettingsPage: React.FC = () => {
  const { authFetch, user } = useAuth();
  const { success, error } = useToast();

  const [settings, setSettings] = useState<Record<string, string>>({
    academy_name: 'Elite Football Training',
    currency: 'INR (₹)',
    default_monthly_fee: '3500',
    contact_phone: '+91 7768993889',
    contact_email: 'elitefootballtraining01@gmail.com',
    billing_cycle_day: '1st of every month',
    fee_due_day: '10th of every month',
    max_upload_size_mb: '50'
  });

  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);

  // Change password
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [settingsRes, logsRes] = await Promise.all([
        authFetch('/api/settings'),
        authFetch('/api/settings/logs')
      ]);

      if (settingsRes.ok) {
        const data = await settingsRes.json();
        setSettings(data);
      }
      if (logsRes.ok) {
        const data = await logsRes.json();
        setLogs(data);
      }
    } catch (err: any) {
      error('Failed to load settings or activity logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await authFetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (!res.ok) throw new Error('Failed to update academy settings.');
      success('Academy operational settings updated successfully.');
      fetchData();
    } catch (err: any) {
      error(err.message);
    } finally {
      setSavingSettings(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      error('Please enter both current and new passwords.');
      return;
    }
    setChangingPassword(true);
    try {
      const res = await authFetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to change password.');

      success('Founder password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      error(err.message);
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <span className="text-xs uppercase font-heading font-bold text-amber-500 tracking-wider">
            System Administration
          </span>
          <h2 className="text-2xl sm:text-3xl font-display uppercase tracking-tight text-white">
            SETTINGS &amp; AUDIT LOGS
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Academy Operational Settings */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0f1523] border border-slate-800 space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <Settings className="w-5 h-5 text-amber-500" />
            <h3 className="font-heading font-bold uppercase text-sm text-white tracking-wider">
              Academy Operational Rules
            </h3>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div>
              <label className="block text-xs font-heading uppercase font-semibold text-slate-300 tracking-wider mb-1.5">
                Academy Name
              </label>
              <input
                type="text"
                value={settings.academy_name || ''}
                onChange={(e) => setSettings({ ...settings, academy_name: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-heading uppercase font-semibold text-slate-300 tracking-wider mb-1.5">
                  Currency
                </label>
                <input
                  type="text"
                  value={settings.currency || 'INR (₹)'}
                  onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-heading uppercase font-semibold text-slate-300 tracking-wider mb-1.5">
                  Default Monthly Fee (₹)
                </label>
                <input
                  type="number"
                  value={settings.default_monthly_fee || '3500'}
                  onChange={(e) => setSettings({ ...settings, default_monthly_fee: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-heading uppercase font-semibold text-slate-300 tracking-wider mb-1.5">
                  Billing Cycle Day
                </label>
                <input
                  type="text"
                  value={settings.billing_cycle_day || '1st of every month'}
                  onChange={(e) => setSettings({ ...settings, billing_cycle_day: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-heading uppercase font-semibold text-slate-300 tracking-wider mb-1.5">
                  Fee Due Deadline
                </label>
                <input
                  type="text"
                  value={settings.fee_due_day || '10th of every month'}
                  onChange={(e) => setSettings({ ...settings, fee_due_day: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={savingSettings}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-heading font-black text-xs uppercase tracking-wider transition-colors shadow-md shadow-amber-500/20 flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{savingSettings ? 'Saving...' : 'Update Settings'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Founder Security & Credentials */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0f1523] border border-slate-800 space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <Lock className="w-5 h-5 text-amber-500" />
            <h3 className="font-heading font-bold uppercase text-sm text-white tracking-wider">
              Founder Account &amp; Credentials
            </h3>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400">Authenticated Actor:</span>
              <span className="font-bold text-white">{user?.name || 'Rahul'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Access Level:</span>
              <span className="text-emerald-400 font-bold uppercase">Academy Founder (Full Access)</span>
            </div>
            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>
                Founder credentials are also managed via your project's <strong className="text-white">.env</strong> file (<code>FOUNDER_NAME</code> and <code>FOUNDER_PASSWORD</code>). Any changes made to <code>.env</code> take immediate effect upon server restart.
              </span>
            </div>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-heading uppercase font-semibold text-slate-300 tracking-wider mb-1.5">
                Current Password
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password (e.g. Dummy)"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-heading uppercase font-semibold text-slate-300 tracking-wider mb-1.5">
                New Secure Password
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min. 5 characters)"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={changingPassword}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-heading font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
              >
                <Key className="w-4 h-4 text-amber-500" />
                <span>{changingPassword ? 'Updating...' : 'Update Password'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Audit & Operations Activity Logs Table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0f1523] border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-blue-400" />
            <h3 className="font-heading font-bold uppercase text-sm text-white tracking-wider">
              Immutable Activity &amp; Audit Trail
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-sans">
            Logged Operations: {logs.length}
          </span>
        </div>

        <div className="divide-y divide-slate-800/60 max-h-96 overflow-y-auto">
          {logs.map((log) => (
            <div key={log.id} className="py-3 flex items-start justify-between gap-4 text-xs">
              <div className="flex items-start gap-3 min-w-0">
                <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-heading font-bold uppercase text-white">
                      {log.action}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 font-mono">
                      {log.actor}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans">{log.details}</p>
                </div>
              </div>
              <span className="text-[11px] font-mono text-slate-500 shrink-0">
                {log.created_at}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
