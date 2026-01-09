import { View, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

type RequestType = 'food' | 'domestic' | 'medicine';

interface RequestDetailsProps {
  requestType: RequestType;
}

const requestImages = {
  food: require('@/assets/images/food.png'),
  domestic: require('@/assets/images/domestic-tasks.png'),
  medicine: require('@/assets/images/medicine.png'),
};

export default function RequestDetails({ requestType }: RequestDetailsProps) {
  return (
    <View className="bg-background flex-1 p-4">
      {/* Imagem do tipo de pedido */}
      <Image
        source={requestImages[requestType]}
        className="mb-4 h-40 w-full rounded-xl"
        resizeMode="cover"
      />

      <ThemedText type="title" className="mb-2 text-primary">
        Detalhes do Pedido
      </ThemedText>
    </View>
  );
}
