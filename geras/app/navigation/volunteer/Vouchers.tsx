import { View, Pressable, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { useRouter } from 'expo-router';
import { useState, useRef, useCallback } from 'react';
import SectionTitle from '@/components/shared/SectionTitle';
import Voucher from '@/components/volunteer/Voucher';
import BottomSheet from '@/components/volunteer/VoucherBottomSheet';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

// Dados fictícios
const mockVouchers = [
  {
    id: '1',
    name_store: 'Supermercado Lili & Co',
    address: 'Rua da Glória, 123',
    value: '2%',
    currentTasks: 3,
    totalTasks: 5,
  },
  {
    id: '2',
    name_store: 'Livraria Central',
    address: 'Rua da Glória, 3',
    value: '5%',
    currentTasks: 3,
    totalTasks: 5,
  },
  {
    id: '3',
    name_store: 'Padaria do Bairro',
    address: 'Rua da Glória, 13',
    value: '2%',
    currentTasks: 2,
    totalTasks: 5,
  },
  {
    id: '4',
    name_store: 'Supermercados Eduardo',
    address: 'Rua da Glória, 12',
    value: '10%',
    currentTasks: 1,
    totalTasks: 5,
  },
  {
    id: '5',
    name_store: 'Ferraria Mateus',
    address: 'Rua da Glória, 1',
    value: '5%',
    currentTasks: 0,
    totalTasks: 5,
  },
];

export default function Vouchers() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'disponiveis' | 'usados'>(
    'disponiveis',
  );

  // Lógica para gerir a troca de tabs
  const handleTabPress = (tab: 'disponiveis' | 'usados') => {
    setActiveTab(tab);
    if (tab === 'usados') {
      router.push('./UsedVouchers');
      console.log('Navegar para página de Usados');
    }
  };

  // Lógica para abertura do Bottom Sheet
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [selectedVoucher, setSelectedVoucher] = useState<
    (typeof mockVouchers)[0] | null
  >(null);

  const handlePresentModalPress = useCallback(
    (item: (typeof mockVouchers)[0]) => {
      setSelectedVoucher(item);
      bottomSheetModalRef.current?.present();
    },
    [],
  );

  return (
    <SafeAreaView edges={['top']} className="flex-1 pt-24">
      <FlatList
        data={mockVouchers}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-6 pb-32"
        ListHeaderComponent={() => (
          <View>
            {/* Título */}
            <SectionTitle title="Vouchers" />

               {/* Alterar Tabs para componente (Shared) */}

            {/* Tabs / Botões */} 
            <View className="mb-6 mt-6 h-[35px] w-full flex-row rounded-2xl">
              {/* Tab Disponíveis */}
              <Pressable
                onPress={() => handleTabPress('disponiveis')}
                className={`flex-1 items-center justify-center rounded-l-2xl ${
                  activeTab === 'disponiveis' ? 'bg-primary' : 'bg-neutralLight'
                }`}
              >
                <ThemedText
                  type="body"
                  className={`uppercase ${
                    activeTab === 'disponiveis'
                      ? 'text-neutralLight'
                      : 'text-primary'
                  }`}
                >
                  disponíveis
                </ThemedText>
              </Pressable>

              {/* Tab Usados */}
              <Pressable
                onPress={() => handleTabPress('usados')}
                className={`flex-1 items-center justify-center rounded-r-2xl ${
                  activeTab === 'usados' ? 'bg-primary' : 'bg-neutralLight'
                }`}
              >
                <ThemedText
                  type="body"
                  className={`uppercase ${
                    activeTab === 'usados'
                      ? 'text-neutralLight'
                      : 'text-primary'
                  }`}
                >
                  usados
                </ThemedText>
              </Pressable>
            </View>
          </View>
        )}

        /* --------------------------- Lista de Vouchers --------------------------- */
        renderItem={({ item }) => (
          <View className="mb-4">
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
        // Caso a lista esteja vazia
        ListEmptyComponent={() => (
          <View className="mt-10 flex-1 items-center justify-center">
            <ThemedText type="bodyInfo" className="text-neutral">
              Não há vouchers disponíveis.
            </ThemedText>
          </View>
        )}
      />

      <BottomSheet ref={bottomSheetModalRef} voucher={selectedVoucher} />
    </SafeAreaView>
  );
}
