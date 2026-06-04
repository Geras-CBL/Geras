import { Pressable } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { MaterialIcons } from '@expo/vector-icons';

interface FilterButtonProps {
  label: string;
  isActive?: boolean;
  onPress?: () => void;
}

export default function FilterButton({
  label,
  isActive = false,
  onPress,
}: FilterButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`Filtro: ${label}`}
      accessibilityState={{ selected: isActive }}
      accessibilityHint="Toca duas vezes para alterar este filtro"
      className={`flex-row items-center gap-2 rounded-full px-4 py-3 shadow-lg ${
        isActive ? 'bg-[#d0e7d7]' : 'bg-neutralLight'
      }`}
    >
      <ThemedText type="body" className="text-neutral">
        {label}
      </ThemedText>
      <MaterialIcons name="keyboard-arrow-down" size={20} color="#1d1d1b" />
    </Pressable>
  );
}
