import { FlatList, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import Voucher from './Voucher';
import { VOUCHERS_DATA } from '@/data/vouchersData';

export default function UsedVouchers() {
  const usedVouchers = VOUCHERS_DATA.filter((item) => item.status === false);

  return (
    <View>
      <FlatList
        data={usedVouchers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="mb-6">
            <Voucher
              name_store={item.name_store}
              address={item.address}
              value={item.value}
              currentTasks={item.currentTasks}
              totalTasks={item.totalTasks}
              onPress={() => {}}
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
    </View>
  );
}
