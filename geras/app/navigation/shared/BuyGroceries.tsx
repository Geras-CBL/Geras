import { View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

export default function BuyGroceries() {
  return (
    <View className="flex-1 items-center justify-center">
      <ThemedText type="title" className="text-primary">
        Comprar Mercearias
      </ThemedText>

      <ThemedText type="title" className="text-primary">
        Confirmar Pedido
      </ThemedText>
    </View>
  );
}
