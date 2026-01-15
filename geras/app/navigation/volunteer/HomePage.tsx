import SectionTitle from '@/components/shared/SectionTitle';
import FilterButton from '@/components/volunteer/FilterButton';
import MapaHomePage from '@/components/volunteer/MapaHomePage';
import PedidosHomePage from '@/components/volunteer/PedidosHomePage';
import ViewToggle from '@/components/volunteer/ViewToggle';
import React, { useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Home() {
  const [tab, setTab] = React.useState('Lista');

  const [statusFilter, setStatusFilter] = useState<
    'todos' | 'disponivel' | 'decorrer'
  >('todos');
  const [seniorFilter, setSeniorFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<
    'todos' | 'cleaning' | 'food' | 'other'
  >('todos');

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

  const handleTypeFilterPress = () => {
    if (typeFilter === 'todos') setTypeFilter('cleaning');
    else if (typeFilter === 'cleaning') setTypeFilter('food');
    else if (typeFilter === 'food') setTypeFilter('other');
    else setTypeFilter('todos');
  };

  let statusLabel = 'Estado';
  if (statusFilter === 'disponivel') {
    statusLabel = 'Disponível';
  } else if (statusFilter === 'decorrer') {
    statusLabel = 'A Decorrer';
  }

  const seniorLabel = seniorFilter ? `Sénior: ${seniorFilter}` : 'Sénior';

  let typeLabel = 'Tipo';
  if (typeFilter === 'cleaning') typeLabel = 'Limpeza';
  else if (typeFilter === 'food') typeLabel = 'Compras';
  else if (typeFilter === 'other') typeLabel = 'Outros';

  return (
    <View className="flex-1">
      <SafeAreaView edges={['top']} className="flex-1 px-6 pt-24">
        <View className="flex-1 gap-2">
          <SectionTitle title="Pedidos" />

          <ViewToggle
            currentValue={tab}
            onSelect={setTab}
            options={[
              { label: 'Lista', value: 'Lista' },
              { label: 'Mapa', value: 'Mapa' },
            ]}
          />

          <View className="flex-1">
            {tab === 'Lista' && (
              <View className="items-left mb-6 flex-row justify-start gap-6">
                <FilterButton
                  label={statusLabel}
                  isActive={statusFilter !== 'todos'}
                  onPress={handleStatusFilterPress}
                />
                <FilterButton
                  label={typeLabel}
                  isActive={typeFilter !== 'todos'}
                  onPress={handleTypeFilterPress}
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
                filterType={typeFilter}
              />
            )}

            {tab === 'Mapa' && <MapaHomePage />}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
