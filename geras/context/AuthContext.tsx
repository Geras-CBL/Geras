import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';
import { setAuthToken } from '@/services/api';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

// Baseado no user_role da DB
export type UserRole = 'SENIOR' | 'CARETAKER' | 'VOLUNTEER';

export interface UserProfile {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  auth_user_id: string;
  gender?: string;
  address?: string;
  zip_code?: string;
  local?: string;
  profile_picture?: any;
  action_radius?: number | null;
}

interface AuthContextType {
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Obter a sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        setAuthToken(session.access_token);
        fetchProfile(session.user.id);
      } else {
        setAuthToken('');
        setIsLoading(false);
      }
    });

    // 2. Escutar mudanças na autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        setAuthToken(session.access_token);
        setIsLoading(true);
        fetchProfile(session.user.id);
      } else {
        setAuthToken('');
        setProfile(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (authUserId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('auth_user_id', authUserId)
        .single();

      if (error) {
        console.error('Erro a carregar perfil:', error);
      } else if (data) {
        setProfile(data as UserProfile);
      }
    } catch (err) {
      console.error('Erro inesperado:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (session?.user.id) {
      await fetchProfile(session.user.id);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    try {
      await GoogleSignin.signOut();
    } catch (e) {
      console.error('Erro ao limpar sessão do Google:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{ session, profile, isLoading, signOut, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth tem de ser usado dentro de um AuthProvider');
  }
  return context;
}
