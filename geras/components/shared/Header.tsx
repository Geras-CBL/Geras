import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GerasLogo from '../../assets/logo/GerasLogo.svg';
import { useSegments } from 'expo-router';
import { Colors } from '@/constants/theme';

interface HeaderProps {
  leftIconName?: keyof typeof MaterialIcons.glyphMap;
  rightIconName?: keyof typeof MaterialIcons.glyphMap;
  onLeftPress?: () => void;
  onRightPress?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  leftIconName = 'person',
  rightIconName = 'notifications',
  onLeftPress,
  onRightPress,
}) => {
  const segments = useSegments();
  const onNotificationsRoute = (segments as string[]).includes('Notifications');

  return (
    <SafeAreaView edges={['top']} className="w-full bg-transparent">
      <View className="flex-row items-center justify-between px-5">
        <TouchableOpacity
          onPress={onLeftPress}
          className="items-center justify-center p-2"
        >
          <MaterialIcons name={leftIconName} size={28} color="black" />
        </TouchableOpacity>

        <View className="flex-1 items-center justify-center">
          <GerasLogo width={100} height={30} />
        </View>

        <TouchableOpacity
          onPress={onRightPress}
          className="items-center justify-center p-2"
        >
          <MaterialIcons
            name={rightIconName}
            size={28}
            color={onNotificationsRoute ? Colors.light.tint : 'black'}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Header;
