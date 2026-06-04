import api from './api';
import { Database } from '@/types/supabase';

export type Medicine = Database['public']['Tables']['medicine']['Row'];

export const getMedicines = async () => {
  const { data } = await api.get<Medicine[]>('/medicine');
  return data;
};

export const addMedicine = async (
  medicine: Omit<Medicine, 'id' | 'created_at'>,
) => {
  const { data } = await api.post<Medicine>('/medicine', medicine);
  return data;
};

export const updateMedicine = async (medicine: Medicine) => {
  const { data } = await api.put<Medicine>(
    `/medicine/${medicine.id}`,
    medicine,
  );
  return data;
};

export const deleteMedicine = async (id: number) => {
  const { data } = await api.delete(`/medicine/${id}`);
  return data;
};
