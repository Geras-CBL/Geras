import api from './api';
import { Database } from '@/types/supabase';

export type VouchersVolunteer =
  Database['public']['Tables']['vouchers_volunteer']['Row'];

export const getVouchersVolunteers = async () => {
  const { data } = await api.get<VouchersVolunteer[]>('/vouchers_volunteer');
  return data;
};

export const addVouchersVolunteer = async (
  vouchersVolunteer: VouchersVolunteer,
) => {
  const { data } = await api.post<VouchersVolunteer>(
    '/vouchers_volunteer',
    vouchersVolunteer,
  );
  return data;
};

export const updateVouchersVolunteer = async (
  vouchersVolunteer: VouchersVolunteer,
) => {
  const { data } = await api.put<VouchersVolunteer>(
    `/vouchers_volunteer/${vouchersVolunteer.id_volunteer}/${vouchersVolunteer.id_voucher}`,
    vouchersVolunteer,
  );
  return data;
};

export const deleteVouchersVolunteer = async (
  id_volunteer: number,
  id_voucher: number,
) => {
  const { data } = await api.delete(
    `/vouchers_volunteer/${id_volunteer}/${id_voucher}`,
  );
  return data;
};
