import { View } from 'react-native';
import { ThemedText } from '../ThemedText';
import { MaterialIcons } from '@expo/vector-icons';

interface ClockPillProps {
  time: string;
}

export default function ClockPill({ time }: Readonly<ClockPillProps>) {
  return (
    <View className="flex-row items-center gap-1 rounded-full bg-neutralLight px-3 py-1.5">
      <ThemedText className="font-bold text-orange-700">{time}</ThemedText>
      <MaterialIcons name="schedule" size={20} color="#c2410c" />
    </View>
  );
}

interface InfoPillProps {
  text: string;
  variant?: 'success' | 'secondary';
}

export function InfoPill({
  text,
  variant = 'success',
}: Readonly<InfoPillProps>) {
  const variantStyles = {
    success: 'bg-green-800',
    secondary: 'bg-secondary',
  };

  return (
    <View className={`rounded-full px-3 py-1 ${variantStyles[variant]}`}>
      <ThemedText className="text-neutralLight">{text}</ThemedText>
    </View>
  );
}
