import { View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

type ListItemProps = {
  label: string;
};

export function ListItem({ label }: ListItemProps) {
  return (
    <View className="h-12 w-full flex-row items-center bg-neutralLight px-4">
      <ThemedText type="body" className="flex-1 text-neutral" numberOfLines={1}>
        {label}
      </ThemedText>
    </View>
  );
}
