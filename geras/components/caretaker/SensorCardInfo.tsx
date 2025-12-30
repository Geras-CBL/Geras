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
      className="w-full flex-row items-center justify-between gap-[15px] rounded-2xl bg-neutralLight p-4"
      style={{ elevation: 10 }} // Android
    >
      <View className="h-[72px] flex-row">
        <View className="justify-center gap-2 self-stretch px-1 py-2">
          <ThemedText type="bodyBold" className="font-semibold uppercase">
            {data.title}
          </ThemedText>

          <ThemedText type="bodyInfo">{data.subtitle(sensorCount)}</ThemedText>
        </View>
      </View>

      <MaterialIcons name="keyboard-arrow-right" size={28} color="#1d1d1b" />
    </Pressable>
  );
};

export default SensorCardInfo;
