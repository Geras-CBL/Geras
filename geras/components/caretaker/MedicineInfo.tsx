import * as React from 'react';
import { View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

type CardAesProps = {
  title: string;
  time: string;
  actions?: React.ReactNode;
};

const MedicineInfo = ({ title, time, actions }: CardAesProps) => {
  return (
    <View className="w-full gap-6 rounded-xl bg-neutralLight p-4 shadow-md">
      <View className="flex-row items-center justify-between">
        <ThemedText
          type="bodyBold"
          className="flex-1 uppercase text-primary"
          numberOfLines={2}
        >
          {title}
        </ThemedText>

        <View className="flex-row items-center rounded-2xl bg-neutralLight px-3 py-2">
          <ThemedText type="bodyInfo" className="text-primary">
            {time}
          </ThemedText>
        </View>
      </View>

      {actions && (
        <View className="flex-row justify-between gap-4">{actions}</View>
      )}
    </View>
  );
};

export default MedicineInfo;
