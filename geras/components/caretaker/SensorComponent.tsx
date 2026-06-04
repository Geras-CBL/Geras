import { Pressable, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';

interface SensorProps {
  name: string;
  iconName: keyof typeof MaterialIcons.glyphMap;
  isActive: boolean;
  onPress: () => void;
}

const SensorComponent = ({
  name,
  iconName,
  isActive,
  onPress,
}: SensorProps) => {
  return (
    <View className="mb-4 w-[48%]">
      <Pressable
        onPress={onPress}
        className={`h-32 w-full flex-row items-center justify-center gap-2 rounded-3xl active:opacity-80 ${
          isActive
            ? 'bg-primary'
            : 'border border-slate-200 bg-white shadow-sm shadow-black/5'
        }`}
        style={{
          elevation: isActive ? 0 : 3,
        }}
      >
        <MaterialIcons
          name={iconName}
          size={24}
          color={isActive ? '#FFFFFF' : '#000000'}
        />

        <ThemedText
          type="bodyBold"
          className={`${isActive ? 'text-white' : 'text-black'}`}
        >
          {name}
        </ThemedText>
      </Pressable>
    </View>
  );
};

export default SensorComponent;
