import api from './api';
import { Database } from '@/types/supabase';

export type RequestItem = Database['public']['Tables']['request_item']['Row'];

export const getRequestItems = async () => {
  const { data } = await api.get<RequestItem[]>('/request_item');
  return data;
};

export const addRequestItem = async (requestItem: Omit<RequestItem, 'id'>) => {
  const { data } = await api.post<RequestItem>('/request_item', requestItem);
  return data;
};

export const updateRequestItem = async (requestItem: RequestItem) => {
  const { data } = await api.put<RequestItem>(
    `/request_item/${requestItem.id}`,
    requestItem,
  );
  return data;
};

export const deleteRequestItem = async (id: number) => {
  const { data } = await api.delete(`/request_item/${id}`);
  return data;
};
