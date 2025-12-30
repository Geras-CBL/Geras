import * as React from 'react';
import { View, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import {
  sensorCardInfoData,
  SensorCardStatus,
} from '@/data/sensorCardInfoData';

type SensorCardInfoProps = {
  status: SensorCardStatus;
  sensorCount?: number;
  onPress?: () => void;
};

const SensorCardInfo = ({
  status,
  sensorCount = 0,
  onPress,
}: SensorCardInfoProps) => {
  const data = sensorCardInfoData[status];

  return (
    <Pressable
      onPress={onPress}
      className="
        w-full flex-row items-center justify-between
        p-4 gap-[15px]
        bg-neutralLight
        rounded-2xl
      "
      style={{ elevation: 10 }} // Android
    >
      <View className="flex-row h-[72px]">
        <View className="self-stretch justify-center px-1 py-2 gap-2">
          <ThemedText
            type="bodyBold"
            className="uppercase font-semibold"
          >
            {data.title}
          </ThemedText>

          <ThemedText type="bodyInfo">
            {data.subtitle(sensorCount)}
          </ThemedText>
        </View>
      </View>

      <MaterialIcons
        name="keyboard-arrow-right"
        size={28}
        color="#1d1d1b"
      />
    </Pressable>
  );
};

export default SensorCardInfo;
