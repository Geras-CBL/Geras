import api from './api';
import { Database } from '@/types/supabase';

export type User = Database['public']['Tables']['users']['Row'];

export const getProfiles = async () => {
  const { data } = await api.get<User[]>('/users');
  return data;
};

export const updateProfile = async (user: User) => {
  const { data } = await api.put<User>(`/users/${user.id}`, user);
  return data;
};
