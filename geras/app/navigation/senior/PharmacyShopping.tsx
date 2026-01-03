import { View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

export default function PharmacyShopping() {
  return (
    <View className="flex-1 items-center justify-center">
      <ThemedText type="title" className="text-primary">
        Compras na Farmácia
      </ThemedText>
    </View>
  );
}
