import { useEffect, useMemo, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../supabaseClient';

export function useAdminAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminCheckError, setAdminCheckError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAdmin = async (nextUser: User | null) => {
    if (!nextUser) {
      setIsAdmin(false);
      setAdminCheckError(null);
      return;
    }

    const { data, error } = await supabase
      .from('admins')
      .select('user_id')
      .eq('user_id', nextUser.id)
      .maybeSingle();

    if (error) {
      setIsAdmin(false);
      setAdminCheckError(error.message);
      return;
    }

    setAdminCheckError(null);
    setIsAdmin(Boolean(data));
  };

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(async ({ data, error }) => {
      if (!mounted) return;
      try {
        if (error) console.error('getSession error', error);
        setSession(data.session ?? null);
        setUser(data.session?.user ?? null);
        await checkAdmin(data.session?.user ?? null);
      } catch (e) {
        console.error('Unexpected error in getSession handler:', e);
      } finally {
        setLoading(false);
      }
    });

    const { data: subscription } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      if (!mounted) return;
      try {
        setSession(nextSession);
        setUser(nextSession?.user ?? null);
        await checkAdmin(nextSession?.user ?? null);
      } catch (e) {
        console.error('Unexpected error in onAuthStateChange handler:', e);
      } finally {
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  const isAuthed = useMemo(() => Boolean(user), [user]);

  return { session, user, loading, isAuthed, isAdmin, adminCheckError };
}

