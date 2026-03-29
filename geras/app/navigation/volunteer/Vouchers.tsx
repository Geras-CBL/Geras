import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SectionTitle from '@/components/shared/SectionTitle';
import ViewToggle from '@/components/volunteer/ViewToggle';
import ActionVouchers from '@/components/volunteer/ActiveVouchers';
import UsedVouchers from '@/components/volunteer/UsedVouchers';
import React from 'react';

export default function Vouchers() {
  const [tab, setTab] = React.useState('disponíveis');

  return (
    <View className="flex-1">
      <SafeAreaView edges={['top']} className="flex-1 px-6 pt-24">
        <View className="flex-1 gap-6">
          {/* Título */}
          <SectionTitle title="Vouchers" />

          {/* Tabs / Botões */}
          <ViewToggle
            currentValue={tab}
            onSelect={setTab}
            options={[
              { label: 'disponíveis', value: 'disponíveis' },
              { label: 'usados', value: 'usados' },
            ]}
          />

          <View className="flex-1">
            {tab === 'disponíveis' && <ActionVouchers />}
            {tab === 'usados' && <UsedVouchers />}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
