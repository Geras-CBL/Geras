import { View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

export default function RequestHelp() {
  return (
    <View className="flex-1 items-center justify-center">
      <ThemedText type="title" className="text-primary">
        Pedir Ajuda
      </ThemedText>
    </View>
  );
}
