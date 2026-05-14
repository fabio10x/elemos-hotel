import React, { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Loader2, RefreshCw, Save } from 'lucide-react';
import { useRooms } from '../../hooks/useRooms';
import { useReservations } from '../../hooks/useReservations';
import type { Reservation, ReservationStatus, Room } from '../../types';
import { supabase } from '../../supabaseClient';

const RES_TABLE = 'Aura-basic-reservations';

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function overlapsToday(checkIn: string, checkOut: string, today: string) {
  // Treat check_out as non-inclusive (typical hotel model): occupied if today >= check_in AND today < check_out
  return today >= checkIn && today < checkOut;
}

function badge(status: ReservationStatus) {
  if (status === 'pending') return 'bg-amber-50 text-amber-800 border-amber-100';
  if (status === 'booked') return 'bg-green-50 text-green-800 border-green-100';
  return 'bg-gray-50 text-gray-700 border-gray-100';
}

const AdminReservations: React.FC = () => {
  const { rooms } = useRooms();
  const { reservations, loading, error, refetch } = useReservations();

  const [busyId, setBusyId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const showToast = (type: 'ok' | 'err', text: string) => {
    setToast({ type, text });
    window.setTimeout(() => setToast(null), 3500);
  };

  const roomById = useMemo(() => {
    const map = new Map<string, Room>();
    rooms.forEach((r) => map.set(r.id, r));
    return map;
  }, [rooms]);

  const today = useMemo(() => todayISO(), []);

  const occupiedRoomIds = useMemo(() => {
    const set = new Set<string>();
    reservations.forEach((r) => {
      if (r.status === 'booked' && overlapsToday(r.check_in, r.check_out, today)) {
        set.add(r.room_id);
      }
    });
    return set;
  }, [reservations, today]);

  const updateStatus = async (reservation: Reservation, status: ReservationStatus) => {
    setBusyId(reservation.id);
    try {
      const { error: updError } = await supabase
        .from(RES_TABLE)
        .update({ status })
        .eq('id', reservation.id);

      if (updError) throw updError;
      showToast('ok', `Marked as ${status}.`);
      refetch(); // Ensure UI updates instantly
    } catch (e: any) {
      console.error('Update reservation error', e);
      showToast('err', e?.message || 'Failed to update reservation.');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div
          className={`flex items-start gap-3 p-4 rounded-xl border text-sm ${
            toast.type === 'ok'
              ? 'bg-green-50 border-green-100 text-green-800'
              : 'bg-red-50 border-red-100 text-red-800'
          }`}
        >
          {toast.type === 'ok' ? <CheckCircle2 size={18} className="mt-0.5" /> : <AlertTriangle size={18} className="mt-0.5" />}
          <div>{toast.text}</div>
        </div>
      )}

      <div>
        <h2 className="text-xl font-serif font-bold text-gray-900">Reservations</h2>
        <p className="text-sm text-gray-500">
          Sorted: pending → booked → cancelled. Occupancy for today ({today}) is derived from booked reservations.
        </p>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Loader2 className="animate-spin" size={16} /> Loading reservations...
        </div>
      )}

      {error && !loading && (
        <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
          <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center">
            <AlertTriangle className="h-7 w-7 text-red-500" />
          </div>
          <div className="text-sm text-gray-700">Failed to load reservations</div>
          <div className="text-xs text-gray-500 max-w-md">{error}</div>
          <button
            onClick={refetch}
            className="flex items-center gap-2 px-5 py-2 bg-gray-900 text-white rounded-md hover:bg-amber-600 transition-colors text-sm font-bold"
          >
            <RefreshCw size={14} />
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && reservations.length === 0 && (
        <div className="text-sm text-gray-600">No reservations yet.</div>
      )}

      {!loading && !error && reservations.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left px-4 py-3 font-bold">Status</th>
                  <th className="text-left px-4 py-3 font-bold">Room</th>
                  <th className="text-left px-4 py-3 font-bold">Guest</th>
                  <th className="text-left px-4 py-3 font-bold">Dates</th>
                  <th className="text-left px-4 py-3 font-bold">Today</th>
                  <th className="text-right px-4 py-3 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((r) => {
                  const room = roomById.get(r.room_id);
                  const isOccupiedToday = r.status === 'booked' && overlapsToday(r.check_in, r.check_out, today);
                  const roomOccupiedByOther = occupiedRoomIds.has(r.room_id) && !isOccupiedToday;

                  return (
                    <tr key={r.id} className="border-t border-gray-100">
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${badge(r.status)}`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-gray-900">{room?.name ?? r.room_id}</div>
                        <div className="text-xs text-gray-500">{room ? `ETB ${room.price.toLocaleString()} • Max ${room.max_guests}` : 'Room not found in list'}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-gray-900">{r.guest_name}</div>
                        <div className="text-xs text-gray-500">{r.guest_email}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-gray-900 font-medium">
                          {r.check_in} → {r.check_out}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {isOccupiedToday ? (
                          <span className="text-xs font-bold text-green-700">Checked in / occupied</span>
                        ) : roomOccupiedByOther ? (
                          <span className="text-xs font-bold text-amber-700">Room occupied (other booking)</span>
                        ) : (
                          <span className="text-xs font-bold text-gray-600">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            disabled={busyId === r.id}
                            onClick={() => updateStatus(r, 'pending')}
                            className="px-3 py-2 rounded-xl bg-amber-50 text-amber-800 border border-amber-100 hover:bg-amber-100 transition-colors font-bold text-xs disabled:opacity-60"
                          >
                            Pending
                          </button>
                          <button
                            disabled={busyId === r.id}
                            onClick={() => updateStatus(r, 'booked')}
                            className="px-3 py-2 rounded-xl bg-green-50 text-green-800 border border-green-100 hover:bg-green-100 transition-colors font-bold text-xs disabled:opacity-60 inline-flex items-center gap-2"
                          >
                            <Save size={14} />
                            Booked
                          </button>
                          <button
                            disabled={busyId === r.id}
                            onClick={() => updateStatus(r, 'cancelled')}
                            className="px-3 py-2 rounded-xl bg-gray-50 text-gray-800 border border-gray-100 hover:bg-gray-100 transition-colors font-bold text-xs disabled:opacity-60"
                          >
                            Cancelled
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReservations;

