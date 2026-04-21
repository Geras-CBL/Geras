import api from './api';
import { Database } from '@/types/supabase';

export type Notification = Database['public']['Tables']['notifications']['Row'];

export const getNotifications = async () => {
  const { data } = await api.get<Notification[]>('/notifications');
  return data;
};

export const addNotification = async (
  notification: Omit<Notification, 'id'>,
) => {
  const { data } = await api.post<Notification>('/notifications', notification);
  return data;
};

export const updateNotification = async (notification: Notification) => {
  const { data } = await api.put<Notification>(
    `/notifications/${notification.id}`,
    notification,
  );
  return data;
};

export const deleteNotification = async (id: number) => {
  const { data } = await api.delete(`/notifications/${id}`);
  return data;
};
