import { Pressable } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { MaterialIcons } from '@expo/vector-icons';

interface FilterButtonProps {
  label: string;
  isActive?: boolean;
  onPress?: () => void;
}

export default function FilterButton({ label, onPress }: FilterButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-2 rounded-full bg-neutralLight px-4 py-3 shadow-lg"
    >
      <ThemedText type="body" className="text-neutral">
        {label}
      </ThemedText>
      <MaterialIcons name="keyboard-arrow-down" size={20} color="#1d1d1b" />
    </Pressable>
  );
}
