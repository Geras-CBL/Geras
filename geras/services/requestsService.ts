import api from './api';
import { Database } from '@/types/supabase';

export type Request = Database['public']['Tables']['requests']['Row'];

export const getRequests = async () => {
  const { data } = await api.get<Request[]>('/requests');
  return data;
};

export const addRequest = async (
  request: Omit<Request, 'id' | 'created_at' | 'updated_at'>,
) => {
  const { data } = await api.post<Request>('/requests', request);
  return data;
};

export const updateRequest = async (request: Request) => {
  const { data } = await api.put<Request>(`/requests/${request.id}`, request);
  return data;
};

export const deleteRequest = async (id: number) => {
  const { data } = await api.delete(`/requests/${id}`);
  return data;
};
