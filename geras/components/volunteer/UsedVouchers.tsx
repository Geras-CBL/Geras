import { View, FlatList } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useState, useRef, useCallback } from 'react';
import Voucher from '@/components/volunteer/Voucher';
import BottomSheet from '@/components/volunteer/VoucherBottomSheet';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { VOUCHERS_DATA } from '@/data/vouchersData';

export default function UsedVouchers() {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [selectedVoucher, setSelectedVoucher] = useState<
    (typeof VOUCHERS_DATA)[0] | null
  >(null);

  const usedVouchers = VOUCHERS_DATA.filter((item) => item.status === false);

  const handlePresentModalPress = useCallback(
    (item: (typeof VOUCHERS_DATA)[0]) => {
      setSelectedVoucher(item);
      bottomSheetModalRef.current?.present();
    },
    [],
  );

  return (
    <View>
      <FlatList
        data={usedVouchers}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View className="mb-6">
            <Voucher
              name_store={item.name_store}
              address={item.address}
              value={item.value}
              currentTasks={item.currentTasks}
              totalTasks={item.totalTasks}
              onPress={() => handlePresentModalPress(item)}
            />
          </View>
        )}
        ListEmptyComponent={() => (
          <View className="mt-10 flex-1 items-center justify-center">
            <ThemedText type="bodyInfo" className="text-neutral">
              Ainda não utilizaste nenhum voucher.
            </ThemedText>
          </View>
        )}
      />

      <BottomSheet ref={bottomSheetModalRef} voucher={selectedVoucher} />
    </View>
  );
}
