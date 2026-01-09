import { View, Pressable } from 'react-native';
import { useState } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { MaterialIcons } from '@expo/vector-icons';

type ListItemProps = {
  label: string;
};

export function ListItem({ label }: ListItemProps) {
  const [checked, setChecked] = useState(false);

  return (
    <View className="h-12 w-full flex-row items-center justify-between rounded-xl bg-white px-4">
      <ThemedText
        type="bodyBold"
        className="flex-1 text-neutral"
        numberOfLines={1}
      >
        {label}
      </ThemedText>

      <Pressable
        onPress={() => setChecked(!checked)}
        className={`ml-3 h-6 w-6 items-center justify-center rounded border border-primary bg-neutralLight`}
      >
        {checked && <MaterialIcons name="check" size={20} color="#205a2d" />}
      </Pressable>
    </View>
  );
}
