import api from './api';
import { Database } from '@/types/supabase';

export type Monitoring = Database['public']['Tables']['monitoring']['Row'];

export const getMonitorings = async () => {
  const { data } = await api.get<Monitoring[]>('/monitoring');
  return data;
};

export const addMonitoring = async (monitoring: Omit<Monitoring, 'id'>) => {
  const { data } = await api.post<Monitoring>('/monitoring', monitoring);
  return data;
};

export const updateMonitoring = async (monitoring: Monitoring) => {
  const { data } = await api.put<Monitoring>(
    `/monitoring/${monitoring.id}`,
    monitoring,
  );
  return data;
};

export const deleteMonitoring = async (id: number) => {
  const { data } = await api.delete(`/monitoring/${id}`);
  return data;
};
