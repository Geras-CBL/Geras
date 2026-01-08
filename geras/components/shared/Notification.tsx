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
    container: 'bg-neutralLight',
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

type NotificationCardProps =
  | {
      variant: 'alert' | 'info';
      title: string;
      description: string | React.ReactNode;
      iconName?: keyof typeof MaterialIcons.glyphMap;
      imageSource?: ImageSourcePropType;
      rightContent?: React.ReactNode;
      route?: string;
    }
  | {
      variant: 'medication';
      title: string;
      time: string | React.ReactNode;
      actions?: React.ReactNode;
    };

export const NotificationCard = (props: NotificationCardProps) => {
  const router = useRouter();
  const theme = THEMES[props.variant];

  if (props.variant === 'medication') {
    const { title, time, actions } = props;

    return (
      <View
        className={`w-full gap-6 rounded-xl p-4 shadow-md ${theme.container}`}
      >
        <View className="flex-row items-center justify-between">
          <ThemedText
            type="bodyBold"
            className="flex-1 uppercase text-primary"
            numberOfLines={2}
          >
            {title}
          </ThemedText>

          <View className="flex-row items-center rounded-2xl bg-neutralLight px-3 py-2">
            {typeof time === 'string' ? (
              <ThemedText type="bodyInfo" className="text-primary">
                {time}
              </ThemedText>
            ) : (
              time
            )}
          </View>
        </View>

        {actions && (
          <View className="flex-row justify-between gap-4">{actions}</View>
        )}
      </View>
    );
  }

  const { title, description, iconName, imageSource, rightContent, route } =
    props;

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
            iconName && <MaterialIcons name={iconName} size={48} color="#FFF" />
          )}
        </View>

        <View className="flex-1 justify-center gap-1 pr-4">
          <ThemedText type="bodyBold" className="uppercase">
            {title}
          </ThemedText>

          {typeof description === 'string' ? (
            <ThemedText type="bodyInfo">{description}</ThemedText>
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
