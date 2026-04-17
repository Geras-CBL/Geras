import {
  View,
  Image,
  Pressable,
  ImageSourcePropType,
  TouchableOpacity,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from '../ThemedText';
import { Route, useRouter } from 'expo-router';

type CardVariant = 'alert' | 'medication' | 'info' | 'pantry' | 'reminder';

interface Theme {
  container: string;
  border: string;
  iconBg: string;
}

const THEMES: Record<CardVariant, Theme> = {
  alert: {
    container: 'bg-red-100',
    border: 'border-red-700',
    iconBg: 'bg-red-800',
  },
  medication: {
    container: 'bg-orange-100',
    border: 'border-orange-300',
    iconBg: 'bg-orange-500',
  },
  info: {
    container: 'bg-green-600/40',
    border: 'border-primary',
    iconBg: 'bg-green-800',
  },
  pantry: {
    container: 'bg-[#D8E6DE]',
    border: 'border-primary',
    iconBg: 'bg-primary',
  },
  reminder: {
    container: 'bg-white shadow-sm shadow-gray-300',
    border: 'border-transparent',
    iconBg: '',
  },
};

interface ActionButtonProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  onPress?: () => void;
}

export const ActionButton = ({ icon, onPress }: ActionButtonProps) => (
  <Pressable
    onPress={onPress}
    className="h-16 w-14 items-center justify-center rounded-xl bg-neutralLight"
  >
    <MaterialIcons name={icon} size={26} color="black" />
  </Pressable>
);

interface NotificationCardProps {
  variant?: CardVariant;
  title: string;
  description?: string | React.ReactNode;
  iconName?: keyof typeof MaterialIcons.glyphMap;
  imageSource?: ImageSourcePropType;
  rightContent?: React.ReactNode;
  bottomContent?: React.ReactNode;
  route?: string;
  alt?: string;
  accessibilityLabel?: string;
}

export const NotificationCard = ({
  variant = 'alert',
  title,
  description,
  iconName,
  imageSource,
  rightContent,
  bottomContent,
  route,
  alt = 'Imagem da notificação',
  accessibilityLabel,
}: NotificationCardProps) => {
  const theme = THEMES[variant];
  const router = useRouter();

  const handlePress = () => {
    if (route) router.push(route as Route);
  };

  const defaultLabel =
    typeof description === 'string' ? `${title}. ${description}` : title;

  const finalAccessibilityLabel = accessibilityLabel || defaultLabel;

  if (variant === 'reminder') {
    return (
      <Pressable
        onPress={route ? handlePress : undefined}
        className={`w-full rounded-3xl p-5 ${theme.container}`}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={finalAccessibilityLabel}
      >
        <View
          className="flex-row items-start justify-between"
          importantForAccessibility="no"
          accessibilityElementsHidden={true}
        >
          <ThemedText
            type="subtitle"
            className="flex-1 pr-4 text-[16px] font-bold uppercase leading-tight text-green-900"
          >
            {title}
          </ThemedText>
          {rightContent}
        </View>

        {description && (
          <View className="mt-1">
            {typeof description === 'string' ? (
              <ThemedText type="body">{description}</ThemedText>
            ) : (
              description
            )}
          </View>
        )}

        {bottomContent && (
          <View className="mt-6 flex-row items-center justify-between gap-3">
            {bottomContent}
          </View>
        )}
      </Pressable>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={route ? 0.8 : 1}
      className={`flex-row items-center justify-between rounded-3xl border-2 p-4 ${theme.container} ${theme.border}`}
      onPress={handlePress}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={finalAccessibilityLabel}
    >
      <View className="flex-1 flex-row items-center gap-4">
        <View
          className={`h-20 w-20 items-center justify-center rounded-2xl ${theme.iconBg} overflow-hidden`}
        >
          {imageSource ? (
            <Image
              source={imageSource}
              className="h-full w-full"
              resizeMode="cover"
              accessible={true}
              accessibilityRole="image"
              accessibilityLabel={alt}
            />
          ) : (
            <MaterialIcons name={iconName} size={40} color="#FFF" />
          )}
        </View>

        <View className="flex-shrink justify-center gap-1">
          <ThemedText
            type="subtitle"
            className="uppercase"
            accessible={true}
            accessibilityRole="text"
            accessibilityLabel={`${title}'}`}
          >
            {title}
          </ThemedText>

          {description && (
            <>
              {typeof description === 'string' ? (
                <ThemedText
                  type="body"
                  numberOfLines={2}
                  accessible={true}
                  accessibilityRole="text"
                  accessibilityLabel={`Descrição da notificação: ${description}`}
                >
                  {description}
                </ThemedText>
              ) : (
                <View className="mt-1 pr-2">{description}</View>
              )}
            </>
          )}
        </View>
      </View>

      {rightContent && (
        <View className="flex-row items-center gap-2">{rightContent}</View>
      )}
    </TouchableOpacity>
  );
};

// EXEMPLOS:
// Lucas a 5min
{
  /* <NotificationCard
  variant="info"
  title="Lucas Wiliam"
  imageSource={{ uri: 'https://i.pravatar.cc/150?img=12' }}
  description={<InfoPill text="A 5 min..." />}
  rightContent={<ActionButton icon="call" />}
/>; */
}

// Aviso medicação horario
{
  /* <NotificationCard
  variant="medication"
  title="Aviso Medicação"
  iconName="medication"
  description="Losartan 50 mg"
  rightContent={<ClockPill time="08:00" />}
/>; */
}

// Aviso medicação
{
  /* <NotificationCard
  variant="medication"
  title="Medicação"
  iconName="medication" // Pill icon
  description="Sem Benuron 50mg"
  rightContent={
    <>
      <ActionButton icon="sensors" />
      <ActionButton icon="videocam" />
    </>
  }
/>; */
}

// Aviso queda
{
  /* <NotificationCard
  variant="alert"
  title="Aviso"
  iconName="report"
  description={'Tropeçar na sala há 3 min'}
  rightContent={
    <>
      <ActionButton icon="call" />
      <ActionButton icon="videocam" />
    </>
  }
/>; */
}

// Despensa
{
  /* <NotificationCard
  variant="pantry"
  title="Despensa"
  iconName="pantry"
  description="Alimentos disponíveis"
  route="/senior/groceries"
/>; */
}

// Lembrete
{
  /* <NotificationCard
  variant="reminder"
  title="Lembrete"
  description="Consulta médica amanhã às 10:00"
  bottomContent={
    <>
      <Button title="Ver detalhes" variant="outlined" className="flex-1" />
      <Button title="Ok" className="flex-1" />
    </>
  }
  route="/senior/appointments/123"
/>; */
}
