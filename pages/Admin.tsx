import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Building2, ClipboardList, BedDouble, AlertTriangle, Loader2 } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useAdminAuth } from '../hooks/useAdminAuth';
import AdminRooms from '../components/admin/AdminRooms';
import AdminReservations from '../components/admin/AdminReservations';

type AdminTab = 'rooms' | 'reservations';

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthed, loading, user, isAdmin, adminCheckError } = useAdminAuth();
  const [tab, setTab] = useState<AdminTab>('rooms');

  useEffect(() => {
    if (!loading && !isAuthed) {
      navigate('/admin/login', { replace: true });
    }
  }, [loading, isAuthed, navigate]);

  const email = useMemo(() => user?.email ?? '', [user]);

  const onLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 md:p-8 bg-gray-900 text-white flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-600 flex items-center justify-center">
                <Building2 size={20} />
              </div>
              <div>
                <h1 className="text-2xl font-serif font-bold">Admin Panel</h1>
                <p className="text-sm text-gray-300">{email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setTab('rooms')}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                  tab === 'rooms' ? 'bg-white text-gray-900' : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <BedDouble size={16} />
                Rooms
              </button>
              <button
                onClick={() => setTab('reservations')}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                  tab === 'reservations' ? 'bg-white text-gray-900' : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <ClipboardList size={16} />
                Reservations
              </button>

              <button
                onClick={onLogout}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 text-white text-sm font-bold hover:bg-amber-700 transition-colors"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>

          <div className="p-6 md:p-8">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="h-10 w-10 text-amber-600 animate-spin" />
                <p className="text-sm text-gray-500 font-medium">Verifying administrator access...</p>
              </div>
            ) : (
              <>
                {!isAdmin && (
                  <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-red-800">
                    <AlertTriangle className="mt-0.5 shrink-0" size={18} />
                    <div className="text-sm">
                      This account is authenticated but not authorized as admin.
                      <div className="mt-1 text-xs text-red-700">
                        Add this user ID to <span className="font-mono">public.admins</span> in Supabase.{" "}
                        {adminCheckError ? `Check error: ${adminCheckError}` : ""}
                      </div>
                    </div>
                  </div>
                )}

                {tab === 'rooms' ? (
                  isAdmin ? <AdminRooms /> : null
                ) : (
                  isAdmin ? <AdminReservations /> : null
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;

