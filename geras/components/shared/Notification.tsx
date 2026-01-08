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

type CardVariant = 'alert' | 'medication' | 'info';

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
};

interface ActionButtonProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  onPress?: () => void;
}

export const ActionButton = ({ icon, onPress }: ActionButtonProps) => (
  <Pressable
    onPress={onPress}
    className="h-12 w-12 items-center justify-center rounded-xl bg-neutralLight"
  >
    <MaterialIcons name={icon} size={24} color="black" />
  </Pressable>
);

interface NotificationCardProps {
  variant?: CardVariant;
  title: string;
  description: string | React.ReactNode;
  iconName?: keyof typeof MaterialIcons.glyphMap;
  imageSource?: ImageSourcePropType;
  rightContent?: React.ReactNode;
  route?: string;
}

export const NotificationCard = ({
  variant = 'alert',
  title,
  description,
  iconName,
  imageSource,
  rightContent,
  route,
}: NotificationCardProps) => {
  const theme = THEMES[variant];
  const router = useRouter();

  return (
    <TouchableOpacity
      activeOpacity={route ? 0.8 : 1}
      className={`flex-row items-center justify-between rounded-3xl border-2 p-4 ${theme.container} ${theme.border}`}
      onPress={() => {
        if (route) router.push(route as Route);
      }}
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
            />
          ) : (
            <MaterialIcons name={iconName} size={48} color="#FFF" />
          )}
        </View>

        <View className="flex-1 justify-center gap-1">
          <ThemedText type="subtitle" className="uppercase">
            {title}
          </ThemedText>

          {typeof description === 'string' ? (
            <ThemedText type="body" className="w-52 truncate">
              {description}
            </ThemedText>
          ) : (
            <View className="mt-1">{description}</View>
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
