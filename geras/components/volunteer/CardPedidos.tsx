import { View, Pressable, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

interface CardPedidosProps {
  name: string;
  category?: string;
  task: string;
  state: boolean; // true: a decorrer | false: disponível
  isNew: boolean;
  date?: string;
  time?: string;
  imageUrl?: string;
  onPress?: () => void;
  variant?: 'home' | 'history';
}

export default function CardPedidos({
  name,
  category = 'TAREFA DOMÉSTICA',
  task,
  state,
  isNew,
  date,
  time,
  imageUrl = 'https://via.placeholder.com/101x71',
  onPress,
  variant = 'home',
}: CardPedidosProps) {
  const isAvailable = state === false;
  const statusLabel = isAvailable ? 'Disponível' : 'A decorrer';
  const cardBackgroundColor =
    variant === 'history'
      ? 'bg-neutralLight'
      : isAvailable
        ? 'bg-neutralLight'
        : 'bg-[#CDE2CD]';

  const statusBorderColor = isAvailable ? 'border-primary' : 'border-[#1d1d1b]';
  const statusTextColor = isAvailable ? 'text-primary' : 'text-[#1d1d1b]';

  return (
    <Pressable
      onPress={onPress}
      className={`relative w-full gap-4 overflow-hidden rounded-3xl p-6 shadow-sm ${cardBackgroundColor}`}
    >
      {/* Top Section: Info & Image */}
      <View className="w-full flex-row items-start justify-between gap-4">
        <View className="flex-1 gap-2">
          <View>
            <ThemedText
              type="bodyBold"
              className="text-lg uppercase text-neutral"
            >
              {category}
            </ThemedText>
            <ThemedText
              type="bodyBold"
              className="mt-1 capitalize text-neutral"
            >
              {name}
            </ThemedText>
          </View>

          <ThemedText type="body" className="capitalize text-neutral">
            {task}
          </ThemedText>
        </View>

        <Image
          resizeMode="cover"
          className="h-24 w-24 rounded-xl bg-gray-200"
          source={{ uri: imageUrl }}
        />
      </View>

      {/* Variante Home: History */}

      {variant === 'home' ? (
        <View className="mt-2 flex-row gap-3">
          <View
            className={`items-center justify-center rounded-full border bg-neutralLight px-4 py-1.5 ${statusBorderColor}`}
          >
            <ThemedText
              type="bodyInfo"
              className={`font-bold ${statusTextColor}`}
            >
              {statusLabel}
            </ThemedText>
          </View>

          {isNew && (
            <View className="items-center justify-center rounded-full border border-[#A17C48] px-4 py-1.5">
              <ThemedText type="bodyInfo" className="font-bold text-[#A17C48]">
                Novo
              </ThemedText>
            </View>
          )}
        </View>
      ) : (
        <View className="mt-2">
          <ThemedText type="bodyInfo" className="text-primary">
            {date} {time}
          </ThemedText>
        </View>
      )}
    </Pressable>
  );
}
