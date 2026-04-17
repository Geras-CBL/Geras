import { TouchableOpacity } from 'react-native';
import { ThemedText } from '../ThemedText';
import { MaterialIcons } from '@expo/vector-icons';
import { Route, useRouter } from 'expo-router';

export interface RequestHelpButtonProps {
  iconName: keyof typeof MaterialIcons.glyphMap;
  label: string;
  route: string;
  acessibilityLabel?: string;
  accessibilityHint?: string;
}

export default function RequestHelpButton({
  iconName,
  label,
  route,
}: Readonly<RequestHelpButtonProps>) {
  const router = useRouter();
  return (
    <TouchableOpacity
      accessible={true}
      focusable={true}
      accessibilityRole="button"
      accessibilityLabel={`Pedir ajuda com ${label}`}
      accessibilityHint={`Toca duas vezes para pedir ajuda com ${label}`}
      activeOpacity={0.8}
      className="flex-row items-center gap-6 rounded-3xl bg-primary p-8"
      onPress={() => router.push(route as Route)}
    >
      <MaterialIcons name={iconName} size={52} color="#fbfbfb" />
      <ThemedText type="subtitle" className="text-neutralLight">
        {label}
      </ThemedText>
    </TouchableOpacity>
  );
}
