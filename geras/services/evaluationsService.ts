import api from './api';
import { Database } from '@/types/supabase';

export type Evaluation = Database['public']['Tables']['evaluations']['Row'];

export const getEvaluations = async () => {
  const { data } = await api.get<Evaluation[]>('/evaluations');
  return data;
};

export const addEvaluation = async (evaluation: Omit<Evaluation, 'id'>) => {
  const { data } = await api.post<Evaluation>('/evaluations', evaluation);
  return data;
};

export const updateEvaluation = async (evaluation: Evaluation) => {
  const { data } = await api.put<Evaluation>(
    `/evaluations/${evaluation.id}`,
    evaluation,
  );
  return data;
};

export const deleteEvaluation = async (id: number) => {
  const { data } = await api.delete(`/evaluations/${id}`);
  return data;
};
