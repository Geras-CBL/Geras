import { View, FlatList } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useState, useRef, useCallback } from 'react';
import Voucher from '@/components/volunteer/Voucher';
import BottomSheet from '@/components/volunteer/VoucherBottomSheet';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { VOUCHERS_DATA } from '@/data/vouchersData';

export default function ActiveVouchers() {
  // Lógica para abertura do Bottom Sheet
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [selectedVoucher, setSelectedVoucher] = useState<
    (typeof VOUCHERS_DATA)[0] | null
  >(null);

  const activeVouchers = VOUCHERS_DATA.filter((item) => item.status === true);

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
              isCompleted={item.currentTasks >= item.totalTasks}
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

      <BottomSheet ref={bottomSheetModalRef} voucher={selectedVoucher} />
    </View>
  );
}
