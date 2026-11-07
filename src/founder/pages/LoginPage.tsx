import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Shield, Lock, User, ArrowRight, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/admin/dashboard';

  // If already logged in, redirect immediately
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !password.trim()) {
      setError('Please enter both Name and Password.');
      return;
    }

    setIsSubmitting(true);
    const result = await login(name, password);
    setIsSubmitting(false);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error || 'Authentication failed. Please verify your founder credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-[#070a10] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Background Decorative Pitch & Glow */}
      <div className="absolute inset-0 bg-pitch-pattern bg-[length:32px_32px] opacity-15 pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-500/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-600/10 blur-[140px] rounded-full pointer-events-none" />

      {/* Back to Public Website Link */}
      <div className="absolute top-6 left-6 z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-heading uppercase tracking-wider text-slate-400 hover:text-white transition-colors py-1.5 px-3 rounded-lg bg-slate-900/60 border border-slate-800"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Academy Website</span>
        </Link>
      </div>

      <div className="max-w-md w-full relative z-10 space-y-8">
        {/* Brand Header */}
        <div className="text-center">
          <img
            src="/logo.png"
            alt="Elite Football Training Logo"
            className="mx-auto h-20 w-auto object-contain mb-4 drop-shadow-xl"
          />
          <span className="inline-block px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-heading uppercase font-bold tracking-[0.2em] mb-2">
            ADMINISTRATIVE PORTAL
          </span>
          <h1 className="text-3xl font-display uppercase tracking-tight text-white mb-2">
            ADMIN PANEL LOGIN
          </h1>
          <p className="text-xs text-slate-400 font-sans max-w-sm mx-auto">
            Authorized access only for Elite Football Training management, enquiries, album, and pitch settings.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[#0f1523]/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-3 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-heading uppercase font-semibold text-slate-300 tracking-wider mb-2">
                Founder Name / Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#090d15] border border-slate-700/80 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-heading uppercase font-semibold text-slate-300 tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#090d15] border border-slate-700/80 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-heading font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Access Admin Panel</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Notice */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 text-center">
            <div className="inline-flex items-center gap-1.5 text-[11px] text-slate-400">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Encrypted server-side JWT session validation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
