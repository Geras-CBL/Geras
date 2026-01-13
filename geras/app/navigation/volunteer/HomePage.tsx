import { View } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import PedidosHomePage from '@/components/volunteer/PedidosHomePage';
import MapaHomePage from '@/components/volunteer/MapaHomePage';
import SectionTitle from '@/components/shared/SectionTitle';
import ViewToggle from '@/components/volunteer/ViewToggle';
import FilterButton from '@/components/volunteer/FilterButton';

export default function Home() {
  const [tab, setTab] = React.useState('Lista');

  const [statusFilter, setStatusFilter] = useState<
    'todos' | 'disponivel' | 'decorrer'
  >('todos');
  const [seniorFilter, setSeniorFilter] = useState<string | null>(null);

  const handleStatusFilterPress = () => {
    if (statusFilter === 'todos') setStatusFilter('disponivel');
    else if (statusFilter === 'disponivel') setStatusFilter('decorrer');
    else setStatusFilter('todos');
  };

  const handleSeniorFilterPress = () => {
    if (seniorFilter) {
      setSeniorFilter(null);
    } else {
      setSeniorFilter('António');
    }
  };

  const statusLabel =
    statusFilter === 'todos'
      ? 'Estado'
      : statusFilter === 'disponivel'
        ? 'Disponível'
        : 'A Decorrer';

  const seniorLabel = seniorFilter ? `Sénior: ${seniorFilter}` : 'Sénior';

  return (
    <View className="flex-1">
      <SafeAreaView edges={['top']} className="flex-1 px-6 pt-24">
        <View className="flex-1 gap-2">
          {/* Título */}
          <SectionTitle title="Pedidos" />

          {/* Tabs / Botões */}
          <ViewToggle
            currentValue={tab}
            onSelect={setTab}
            options={[
              { label: 'Lista', value: 'Lista' },
              { label: 'Mapa', value: 'Mapa' },
            ]}
          />

          {/* Conteúdo  - Páginas Lista/Mapa*/}
          <View className="flex-1">
            {tab === 'Lista' && (
              <View className="items-left mb-6 flex-row justify-start gap-6">
                {/* Filtros */}
                <FilterButton
                  label={statusLabel}
                  isActive={statusFilter !== 'todos'}
                  onPress={handleStatusFilterPress}
                />
                <FilterButton
                  label={seniorLabel}
                  isActive={!!seniorFilter}
                  onPress={handleSeniorFilterPress}
                />
              </View>
            )}

            {tab === 'Lista' && (
              <PedidosHomePage
                filterStatus={statusFilter}
                filterSenior={seniorFilter}
              />
            )}

            {tab === 'Mapa' && <MapaHomePage />}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
