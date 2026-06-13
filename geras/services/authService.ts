import { supabase } from '@/lib/supabase';

/**
 * Envia o ID Token do Google obtido no cliente nativo para o Supabase Auth.
 *
 * @param idToken Token de ID fornecido pelo Google Sign-In nativo
 */
export const signInWithGoogleToken = async (idToken: string) => {
  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: 'google',
    token: idToken,
  });

  if (error) {
    throw error;
  }
  return data;
};
