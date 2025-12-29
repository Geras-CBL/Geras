import { ThemedText } from '@/components/ThemedText';
import { View } from 'react-native';

// malta, ver aqui a documentação: https://docs.expo.dev/router/error-handling/

export default function NotFound() {
  return (
    <View className="flex-1 items-center justify-center">
      <ThemedText type="title" className="text-primary">
        Página Não Encontrada 404
      </ThemedText>
    </View>
  );
}
