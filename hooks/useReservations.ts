import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../supabaseClient';
import type { Reservation, ReservationStatus } from '../types';

const TABLE_NAME = 'Aura-basic-reservations';

const STATUS_ORDER: Record<ReservationStatus, number> = {
  pending: 0,
  booked: 1,
  cancelled: 2,
};

export function useReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReservations = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Error fetching reservations:', fetchError);
        setError(fetchError.message);
      } else {
        setReservations((data ?? []) as Reservation[]);
      }
    } catch (e: any) {
      console.error('Unexpected error fetching reservations:', e);
      setError(e.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();

    const channel = supabase
      .channel('reservations-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: TABLE_NAME }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setReservations((prev) => [payload.new as Reservation, ...prev]);
          return;
        }
        if (payload.eventType === 'UPDATE') {
          setReservations((prev) =>
            prev.map((r) => (r.id === (payload.new as Reservation).id ? (payload.new as Reservation) : r))
          );
          return;
        }
        if (payload.eventType === 'DELETE') {
          setReservations((prev) => prev.filter((r) => r.id !== (payload.old as Reservation).id));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const sorted = useMemo(() => {
    return [...reservations].sort((a, b) => {
      const byStatus = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
      if (byStatus !== 0) return byStatus;
      const aCreated = a.created_at ? new Date(a.created_at).getTime() : 0;
      const bCreated = b.created_at ? new Date(b.created_at).getTime() : 0;
      return bCreated - aCreated;
    });
  }, [reservations]);

  return { reservations: sorted, loading, error, refetch: fetchReservations };
}

