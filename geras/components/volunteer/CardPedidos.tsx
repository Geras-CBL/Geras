import { View, Pressable, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

interface CardPedidosProps {
  name: string;
  task: string;
  type: string | number | (string | number)[] | null | undefined;
  category: string;
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
  task,
  type,
  category,
  state,
  isNew,
  date,
  time,
  imageUrl = 'https://via.placeholder.com/101x71',
  onPress,
  variant = 'home',
}: Readonly<CardPedidosProps>) {
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
      className={`relative w-full flex-row items-center justify-between gap-4 overflow-hidden rounded-3xl p-6 shadow-sm ${cardBackgroundColor}`}
    >
      <View className="flex-1 gap-4">
        <View className="gap-2">
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

        {variant === 'home' ? (
          <View className="flex-row gap-3">
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
                <ThemedText
                  type="bodyInfo"
                  className="font-bold text-[#A17C48]"
                >
                  Novo
                </ThemedText>
              </View>
            )}
          </View>
        ) : (
          <View>
            <ThemedText type="bodyInfo" className="text-primary">
              {date} {time}
            </ThemedText>
          </View>
        )}
      </View>

      <Image
        resizeMode="cover"
        className="h-24 w-24 rounded-xl bg-gray-200"
        source={{ uri: imageUrl }}
      />
    </Pressable>
  );
}
