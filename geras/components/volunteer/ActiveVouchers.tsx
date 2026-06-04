import { useState, useRef, useCallback, useEffect } from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import Voucher from '@/components/volunteer/Voucher';
import BottomSheet from '@/components/volunteer/VoucherBottomSheet';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { VoucherData } from '@/data/vouchersData';

export default function ActiveVouchers() {
  const { profile } = useAuth();
  const [vouchers, setVouchers] = useState<VoucherData[]>([]);
  const [loading, setLoading] = useState(true);

  // Lógica para abertura do Bottom Sheet
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [selectedVoucher, setSelectedVoucher] = useState<VoucherData | null>(
    null,
  );

  const fetchVouchers = useCallback(async () => {
    if (!profile?.id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('vouchers_volunteer')
        .select(
          `
          status,
          current_tasks,
          vouchers (
            id,
            store_name,
            address,
            value,
            needed_tasks
          )
        `,
        )
        .eq('id_volunteer', profile.id);

      if (error) throw error;

      if (data) {
        const mapped: VoucherData[] = data.map((item: any) => ({
          id: item.vouchers.id.toString(),
          name_store: item.vouchers.store_name,
          address: item.vouchers.address || '',
          value: `${item.vouchers.value}%`,
          currentTasks: item.current_tasks || 0,
          totalTasks: item.vouchers.needed_tasks || 5,
          status: item.status,
        }));
        setVouchers(mapped);
      }
    } catch (err) {
      console.error('Erro ao carregar vouchers:', err);
    } finally {
      setLoading(false);
    }
  }, [profile?.id]);

  useEffect(() => {
    fetchVouchers();
  }, [fetchVouchers]);

  const activeVouchers = vouchers.filter(
    (item) => item.status === 'AVAILABLE' || item.status === 'UNAVAILABLE',
  );

  const handlePresentModalPress = useCallback((item: VoucherData) => {
    setSelectedVoucher(item);
    bottomSheetModalRef.current?.present();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center py-10">
        <ActivityIndicator size="large" color="#205a2d" />
      </View>
    );
  }

  return (
    <View>
      <FlatList
        data={activeVouchers}
        className="-m-4 p-4"
        keyExtractor={(item) => item.id}
        contentContainerClassName="pb-32"
        renderItem={({ item }) => (
          <View className="mb-6">
            <Voucher
              name_store={item.name_store}
              address={item.address}
              value={item.value}
              currentTasks={item.currentTasks}
              totalTasks={item.totalTasks}
              isCompleted={
                item.status === 'AVAILABLE' &&
                item.currentTasks >= item.totalTasks
              }
              onPress={() => handlePresentModalPress(item)}
            />
          </View>
        )}
        ListEmptyComponent={() => (
          <View className="flex-1 items-center justify-center">
            <ThemedText type="bodyInfo" className="text-neutral">
              Não há vouchers disponíveis.
            </ThemedText>
          </View>
        )}
      />

      <BottomSheet
        ref={bottomSheetModalRef}
        voucher={selectedVoucher}
        onVoucherUsed={fetchVouchers}
      />
    </View>
  );
}
