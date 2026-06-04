import api from './api';
import { Database } from '@/types/supabase';

export type Voucher = Database['public']['Tables']['vouchers']['Row'];

export const getVouchers = async () => {
  const { data } = await api.get<Voucher[]>('/vouchers');
  return data;
};

export const addVoucher = async (voucher: Omit<Voucher, 'id'>) => {
  const { data } = await api.post<Voucher>('/vouchers', voucher);
  return data;
};

export const updateVoucher = async (voucher: Voucher) => {
  const { data } = await api.put<Voucher>(`/vouchers/${voucher.id}`, voucher);
  return data;
};

export const deleteVoucher = async (id: number) => {
  const { data } = await api.delete(`/vouchers/${id}`);
  return data;
};
