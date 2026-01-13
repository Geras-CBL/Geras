import React from 'react';
import { View, Pressable } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

// Props para o componente Voucher
interface VoucherProps {
  name_store: string;
  address: string;
  value: string;
  currentTasks: number;
  totalTasks: number;
  onPress: () => void; // Função para abrir a bottom sheet
}

const Voucher = ({
  name_store,
  address,
  value,
  currentTasks,
  totalTasks,
  onPress,
}: VoucherProps) => {
  // Calcula a percentagem para a barra de progresso
  const progressPercentage = Math.min((currentTasks / totalTasks) * 100, 100);

  return (
    <Pressable
      onPress={onPress}
      className="w-full gap-6 rounded-xl bg-neutralLight p-4 shadow-md"
    >
      {/* --- Secção Superior: Informação e Valor --- */}
      <View className="flex-row items-start justify-between gap-5">
        {/* Texto Esquerda */}
        <View className="flex-1 gap-1">
          <ThemedText type="subtitle" className="uppercase text-neutral">
            {name_store}
          </ThemedText>
          <ThemedText className="capitalize text-neutral">{address}</ThemedText>
        </View>

        {/* Chip de Valor (Direita) */}
        <View className="items-center justify-center rounded-full bg-primary px-4 py-2">
          <ThemedText className="text-neutralLight">{value}</ThemedText>
        </View>
      </View>

      {/* --- Secção Inferior: Progresso --- */}
      <View className="w-full gap-2">
        <View className="flex-row justify-between">
          <ThemedText type="bodyBold" className="text-left text-primary">
            {currentTasks}/{totalTasks}
          </ThemedText>
          <ThemedText className="text-right text-base text-neutral">
            Tarefas completadas
          </ThemedText>
        </View>

        {/* Barra de Progresso */}
        {/* Barra Cinzenta (Fundo) */}
        <View className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
          {/* Barra Verde (Preenchimento) */}
          <View
            className="h-full rounded-full bg-primary"
            style={{ width: `${progressPercentage}%` }}
          />
        </View>
      </View>
    </Pressable>
  );
};

export default Voucher;
