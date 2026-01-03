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
}

export function InfoPill({ text }: Readonly<InfoPillProps>) {
  return (
    <View className="self-start rounded-full bg-green-800 px-3 py-1">
      <ThemedText className="text-neutralLight">{text}</ThemedText>
    </View>
  );
}
