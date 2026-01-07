import { View, Pressable, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

// refazer componente

interface CardPedidosProps {
  name?: string;
  category?: string;
  task?: string;
  status?: 'disponivel' | 'decorrer' | 'concluido';
  imageUrl?: string;
  onPress?: () => void;
}

export default function CardPedidos({
  name = 'António Silva',
  category = 'Tarefa doméstica',
  task = 'Limpeza de casa',
  status = 'disponivel',
  imageUrl = 'https://via.placeholder.com/101x71',
  onPress,
}: CardPedidosProps) {
  
  const isAvailable = status === 'disponivel';
  
  return (
    <Pressable
      onPress={onPress}
      className="w-full bg-neutralLight p-6 gap-4 rounded-3xl shadow-md"
    >
      {/* Top Section: Info & Image */}
      <View className="flex-row w-full justify-between items-start gap-4">
        <View className="flex-1 gap-4">
          <View className="gap-1">
            <ThemedText type="bodyBold" className="uppercase text-neutral">
              {category}
            </ThemedText>
            <ThemedText type="body" className="capitalize text-neutral">
              {name}
            </ThemedText>
          </View>

          <ThemedText type="bodyInfo" className="capitalize text-neutral">
            {task}
          </ThemedText>
        </View>

        <Image
          resizeMode="cover"
          className="h-30 w-30 rounded-lg bg-gray-200"
          source={{ uri: imageUrl }}
        />
      </View>

      {/* Status Chip */}
      <View
        className={`
          self-start rounded-full border px-3 py-1 items-center justify-center
          ${isAvailable ? 'border-primary' : 'border-neutral'}
        `}
      >
        <ThemedText
          type="bodyInfo"
          className={isAvailable ? 'text-primary' : 'text-neutral'}
        >
          {isAvailable ? 'Disponível' : status}
        </ThemedText>
      </View>
    </Pressable>
  );
}