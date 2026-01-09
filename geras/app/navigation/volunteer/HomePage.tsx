import { View, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import SectionTitle from '@/components/shared/SectionTitle';
import CardPedidos from '@/components/volunteer/CardPedidos';
import ViewToggle from '@/components/volunteer/ViewToggle';
import React from 'react';
import FilterButton from './FilterButton';

// Mock Data temos passar ficheiro .ts novo
const DATA = [
  { id: '1', name: 'António Silva', task: 'Limpeza de casa' },
  { id: '2', name: 'Maria Santos', task: 'Compras de supermercado' },
  { id: '3', name: 'José Costa', task: 'Acompanhamento médico' },
  { id: '4', name: 'Ana Pereira', task: 'Passear o cão' },
];

export default function Home() {
  const [tab, setTab] = React.useState('lista'); // or 'mapa'

  const renderHeader = () => (
    <View className="mb-2 gap-6">
      <SectionTitle title="Pedidos" />

      <View className="gap-6">
        <ViewToggle
          currentValue={tab}
          onSelect={setTab}
          options={[
            { label: 'Lista', value: 'lista' },
            { label: 'Mapa', value: 'mapa' },
          ]}
        />

        {/* Filters Row */}
        <View className="flex-row gap-3">
          <FilterButton label="Estado" onPress={() => {}} />
          <FilterButton label="Sénior" onPress={() => {}} />
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1">
      <SafeAreaView edges={['top']} className="flex-1 pt-16">
        {/* VIEW: LISTA */}
        {tab === 'lista' && (
          <FlatList
            data={DATA}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            // Layout styling
            className="flex-1 px-6 pt-4"
            contentContainerClassName="gap-6 pb-10"
            // The Header scrolls with the list
            ListHeaderComponent={renderHeader}
            // Add margin to header component to separate from list
            renderItem={({ item }) => (
              <CardPedidos
                name={item.name}
                task={item.task}
                onPress={() => console.log('Open', item.id)}
              />
            )}
          />
        )}

        {/* VIEW: MAPA */}
        {tab === 'mapa' && (
          <View className="flex-1 px-6 pt-4">
            {renderHeader()}

            <View className="mt-8 flex-1 items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-neutralLight">
              <ThemedText type="bodyInfo" className="text-neutral/50">
                Vista de mapa (por implementar)
              </ThemedText>
            </View>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}
