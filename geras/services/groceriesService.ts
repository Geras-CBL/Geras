import api from './api';
import { Database } from '@/types/supabase';

export type Grocery = Database['public']['Tables']['groceries']['Row'];

export const getGroceries = async () => {
  const { data } = await api.get<Grocery[]>('/groceries');
  return data;
};

export const addGrocery = async (
  grocery: Omit<Grocery, 'id' | 'created_at'>,
) => {
  const { data } = await api.post<Grocery>('/groceries', grocery);
  return data;
};

export const updateGrocery = async (grocery: Grocery) => {
  const { data } = await api.put<Grocery>(`/groceries/${grocery.id}`, grocery);
  return data;
};

export const deleteGrocery = async (id: number) => {
  const { data } = await api.delete(`/groceries/${id}`);
  return data;
};
