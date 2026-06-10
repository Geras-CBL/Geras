import * as React from 'react';
import { View, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
type SensorCardInfoProps = {
  title: string;
  subtitle: string;
  isAlert: boolean;
  onPress?: () => void;
};

const SensorCardInfo = ({
  title,
  subtitle,
  isAlert = false,
  onPress,
}: SensorCardInfoProps) => {
  return (
    <Pressable
      onPress={onPress}
      className={`w-full flex-row items-center justify-between gap-[15px] rounded-2xl p-4 shadow-lg ${
        isAlert ? 'bg-[#ffcdd2]' : 'bg-neutralLight'
      }`}
    >
      <View className="h-20 flex-row">
        <View className="justify-center gap-2 self-stretch px-1 py-2">
          <ThemedText type="bodyBold">{title}</ThemedText>

          <ThemedText type="bodyInfo">{subtitle}</ThemedText>
        </View>
      </View>

      <MaterialIcons name="keyboard-arrow-right" size={28} color="#1d1d1b" />
    </Pressable>
  );
};

export default SensorCardInfo;
