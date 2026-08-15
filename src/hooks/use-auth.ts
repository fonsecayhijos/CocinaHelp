"use client";

import { useCallback, useEffect, useState } from "react";
import { isSupabaseConfigured } from "@/lib/config";

export type AuthUser = {
  id: string;
  email: string | null;
};

/**
 * Shared auth state for header + chat shell.
 * When Supabase is not configured, stays logged-out (guest mode).
 */
export function useAuth() {
  const configured = isSupabaseConfigured();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(configured);

  useEffect(() => {
    if (!configured) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    let unsub: (() => void) | undefined;

    async function init() {
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();

        const {
          data: { user: u },
        } = await supabase.auth.getUser();
        if (!cancelled) {
          setUser(u ? { id: u.id, email: u.email ?? null } : null);
        }

        const { data } = supabase.auth.onAuthStateChange((_event, session) => {
          if (cancelled) return;
          const next = session?.user;
          setUser(next ? { id: next.id, email: next.email ?? null } : null);
        });
        unsub = () => data.subscription.unsubscribe();
      } catch (e) {
        console.warn("[useAuth]", e);
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void init();
    return () => {
      cancelled = true;
      unsub?.();
    };
  }, [configured]);

  const signOut = useCallback(async () => {
    if (!configured) return;
    try {
      const { createClient } = await import("@/lib/supabase/client");
      await createClient().auth.signOut();
    } catch (e) {
      console.warn("[signOut]", e);
    }
    setUser(null);
  }, [configured]);

  return {
    configured,
    loading,
    user,
    userId: user?.id ?? null,
    email: user?.email ?? null,
    isLoggedIn: Boolean(user),
    signOut,
  };
}
