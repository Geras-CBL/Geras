import api from './api';
import { Database } from '@/types/supabase';

export type SeniorGroceries =
  Database['public']['Tables']['senior_groceries']['Row'];

export const getSeniorGroceries = async () => {
  const { data } = await api.get<SeniorGroceries[]>('/senior_groceries');
  return data;
};

export const addSeniorGroceries = async (
  seniorGroceries: Omit<SeniorGroceries, 'id' | 'created_at'>,
) => {
  const { data } = await api.post<SeniorGroceries>(
    '/senior_groceries',
    seniorGroceries,
  );
  return data;
};

export const updateSeniorGroceries = async (
  seniorGroceries: SeniorGroceries,
) => {
  const { data } = await api.put<SeniorGroceries>(
    `/senior_groceries/${seniorGroceries.id}`,
    seniorGroceries,
  );
  return data;
};

export const deleteSeniorGroceries = async (id: number) => {
  const { data } = await api.delete(`/senior_groceries/${id}`);
  return data;
};
