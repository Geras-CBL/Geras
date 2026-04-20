import api from './api';
import { Database } from '@/types/supabase';

export type SeniorCaretaker =
  Database['public']['Tables']['senior_caretaker']['Row'];

export const getSeniorCaretakers = async () => {
  const { data } = await api.get<SeniorCaretaker[]>('/senior_caretaker');
  return data;
};

export const addSeniorCaretaker = async (seniorCaretaker: SeniorCaretaker) => {
  const { data } = await api.post<SeniorCaretaker>(
    '/senior_caretaker',
    seniorCaretaker,
  );
  return data;
};

export const deleteSeniorCaretaker = async (
  id_senior: number,
  id_caretaker: number,
) => {
  // Backend would typically expect composite keys in URL params or body
  const { data } = await api.delete(
    `/senior_caretaker/${id_senior}/${id_caretaker}`,
  );
  return data;
};
