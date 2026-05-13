import { View, Pressable, Image, ImageSourcePropType } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

interface CardPedidosProps {
  name: string;
  gender?: string;
  task: string;
  type: string | number | (string | number)[] | null | undefined;
  category: string;
  state: boolean;
  isNew: boolean;
  date?: string;
  time?: string;
  imageUrl?: string | ImageSourcePropType;
  onPress?: () => void;
  variant?: 'home' | 'history';
}

export default function CardPedidos({
  name,
  gender,
  task,
  type,
  category,
  state,
  isNew,
  date,
  time,
  imageUrl,
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

  const nameParts = name.split(' ').filter(Boolean);
  const prefix = gender === 'FEMALE' ? 'Sra.' : 'Sr.';
  const firstAndLast =
    nameParts.length > 1
      ? `${nameParts[0]} ${nameParts[nameParts.length - 1]}`
      : nameParts[0] || 'Sénior';
  const displayName =
    name === 'Sénior' || name.startsWith('Sr')
      ? name
      : `${prefix} ${firstAndLast}`;

  const initials =
    nameParts.length > 1
      ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
      : (nameParts[0]?.[0] || '?').toUpperCase();

  const hasValidImage =
    typeof imageUrl === 'string' ? imageUrl.length > 0 : imageUrl != null;
  const imageSource =
    typeof imageUrl === 'string' ? { uri: imageUrl } : imageUrl;

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
              {displayName}
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
              <View className="items-center justify-center rounded-full border border-[#8F5D0D] px-4 py-1.5">
                <ThemedText
                  type="bodyInfo"
                  className="font-bold text-[#8F5D0D]"
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

      {hasValidImage && imageSource ? (
        <Image
          resizeMode="cover"
          className="h-24 w-24 rounded-xl bg-gray-200"
          source={imageSource}
          accessible={true}
          accessibilityRole="image"
          accessibilityLabel={`Foto de perfil de ${displayName}`}
        />
      ) : (
        <View className="h-24 w-24 items-center justify-center rounded-3xl bg-[#ffefd3]">
          <ThemedText type="bodyBold" className="text-2xl text-neutral">
            {initials}
          </ThemedText>
        </View>
      )}
    </Pressable>
  );
}
