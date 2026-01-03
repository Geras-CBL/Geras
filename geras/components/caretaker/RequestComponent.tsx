import * as React from 'react';
import { View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

const RequestComponent = () => {
  return (
    <View className="w-full gap-6 rounded-xl bg-white p-4 shadow-md">
      {/* Texto */}
      <View className="gap-2">
        <ThemedText type="body">Precisa de compras</ThemedText>

        <ThemedText type="bodySmall">António Silva</ThemedText>
      </View>

      {/* Botões */}
      <View className="flex-row gap-4">
        <View className="flex-1 items-center justify-center rounded border border-primary py-3">
          <ThemedText type="bodySmall" className="text-primary">
            Reencaminhar
          </ThemedText>
        </View>

        <View className="flex-1 items-center justify-center rounded bg-primary py-3">
          <ThemedText type="bodySmall" className="text-neutralLight">
            Aceitar Pedido
          </ThemedText>
        </View>
      </View>
    </View>
  );
};

export default RequestComponent;
