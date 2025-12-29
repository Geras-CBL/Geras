import { View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

export default function AddHealthMetric() {
  return (
    <View className="flex-1 items-center justify-center">
      <ThemedText type="title" className="text-primary">
        Adicionar Métrica de Saúde
      </ThemedText>
    </View>
  );
}
