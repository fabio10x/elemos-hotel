import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Room } from '../types';

const TABLE_NAME = 'Aura-basic-rooms';

export function useRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRooms = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .order('price', { ascending: false });

      if (fetchError) {
        console.error('Error fetching rooms:', fetchError);
        setError(fetchError.message);
      } else {
        setRooms(data as Room[]);
      }
    } catch (e: any) {
      console.error('Unexpected error fetching rooms:', e);
      setError(e.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('rooms-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: TABLE_NAME },
        (payload) => {
          console.log('Real-time update:', payload.eventType);

          if (payload.eventType === 'INSERT') {
            setRooms((prev) => [...prev, payload.new as Room]);
          } else if (payload.eventType === 'UPDATE') {
            setRooms((prev) =>
              prev.map((room) =>
                room.id === (payload.new as Room).id
                  ? (payload.new as Room)
                  : room
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setRooms((prev) =>
              prev.filter((room) => room.id !== (payload.old as Room).id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { rooms, loading, error, refetch: fetchRooms };
}
