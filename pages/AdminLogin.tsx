import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Loader2, AlertTriangle } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useAdminAuth } from '../hooks/useAdminAuth';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthed, loading: authLoading } = useAdminAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (!authLoading && isAuthed) {
      navigate('/admin', { replace: true });
    }
  }, [authLoading, isAuthed, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setSubmitting(false);
      return;
    }

    navigate('/admin', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-8 border-b bg-gray-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center">
              <Lock size={18} />
            </div>
            <div>
              <h1 className="text-xl font-serif font-bold">Admin Login</h1>
              <p className="text-sm text-gray-300">Manager access for rooms & reservations</p>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-6">
          {error && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-100 text-red-700">
              <AlertTriangle className="shrink-0 mt-0.5" size={18} />
              <div className="text-sm">{error}</div>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Email</label>
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus-within:border-amber-500 transition-all">
                <Mail size={16} className="text-gray-400" />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  required
                  className="w-full bg-transparent outline-none text-sm"
                  placeholder="manager@hotel.com"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Password</label>
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus-within:border-amber-500 transition-all">
                <Lock size={16} className="text-gray-400" />
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  required
                  className="w-full bg-transparent outline-none text-sm"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-600 text-white font-bold hover:bg-amber-700 transition-colors disabled:opacity-60 disabled:cursor-wait"
            >
              {submitting ? <Loader2 className="animate-spin" size={16} /> : null}
              {submitting ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="text-xs text-gray-500">
            This area is restricted. Only accessible for authorized staff members.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

