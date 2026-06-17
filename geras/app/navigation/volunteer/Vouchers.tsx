import { View, Alert, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import SectionTitle from '@/components/shared/SectionTitle';
import ViewToggle from '@/components/volunteer/ViewToggle';
import ActionVouchers from '@/components/volunteer/ActiveVouchers';
import UsedVouchers from '@/components/volunteer/UsedVouchers';
import React from 'react';

export default function Vouchers() {
  const [tab, setTab] = React.useState('disponíveis');

  const handleShowRulesInfo = () => {
    Alert.alert(
      'Regras dos Vouchers',
      '1. Cada tarefa concluída e verificada equivale a 1 ponto.\n\n' +
        '2. A verificação é imediata se o sénior der feedback positivo (Satisfatório/Neutro). Caso contrário, a tarefa é verificada automaticamente após 4 horas sem reclamações.\n\n' +
        '3. A progressão é estritamente sequencial: os pontos só começam a contar para o voucher seguinte quando o anterior estiver completamente preenchido e desbloqueado.',
      [{ text: 'Entendido', style: 'default' }],
    );
  };

  return (
    <View className="flex-1">
      <SafeAreaView edges={['top']} className="flex-1 px-6 pt-24">
        <View className="flex-1 gap-6">
          {/* Título */}
          <View className="flex-row items-center gap-2">
            <SectionTitle title="Vouchers" />
            <Pressable
              onPress={handleShowRulesInfo}
              className="-ml-10"
              hitSlop={8}
              accessibilityLabel="Informações sobre regras de vouchers"
              accessibilityRole="button"
            >
              <MaterialIcons name="info-outline" size={24} color="#205a2d" />
            </Pressable>
          </View>

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
