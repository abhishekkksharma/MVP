import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      if (isMounted) {
        setSession(data.session ?? null);
        setInitializing(false);
      }
    };
    init();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession ?? null);
    });
    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo(() => {
    const user = session?.user ?? null;
    return {
      session,
      user,
      initializing,
      signInWithPassword: ({ email, password }) =>
        supabase.auth.signInWithPassword({ email, password }),
      signUpWithPassword: ({ email, password, options }) =>
        supabase.auth.signUp({ email, password, options }),
      signInWithProvider: (provider) =>
        supabase.auth.signInWithOAuth({ provider }),
      signOut: () => supabase.auth.signOut(),
    };
  }, [session, initializing]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}


