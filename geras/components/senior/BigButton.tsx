import { MaterialIcons } from '@expo/vector-icons';
import { Route, useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { ThemedText } from '../ThemedText';

interface BigButtonProps {
  iconName: keyof typeof MaterialIcons.glyphMap;
  label: string;
  route?: string;
  onPress?: () => void;
}

const BigButton = ({ iconName, label, route, onPress }: BigButtonProps) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      className="h-full w-full items-center justify-center gap-4 rounded-2xl bg-primary"
      activeOpacity={0.8}
      onPress={() => {
        if (route) router.push(route as Route);
        onPress?.();
      }}
    >
      <MaterialIcons name={iconName} size={80} color="#fbfbfb" />
      <ThemedText type="bigButton" className="text-neutralLight">
        {label}
      </ThemedText>
    </TouchableOpacity>
  );
};

export default BigButton;
