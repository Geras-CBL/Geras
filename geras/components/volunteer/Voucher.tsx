import React, { useEffect } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

// Create an Animated component from LinearGradient
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

interface VoucherProps {
  name_store: string;
  address: string;
  value: string;
  currentTasks: number;
  totalTasks: number;
  isCompleted?: boolean;
  onPress: () => void;
}

const Voucher = ({
  name_store,
  address,
  value,
  currentTasks,
  totalTasks,
  isCompleted = false,
  onPress,
}: VoucherProps) => {
  // Percentage calculation
  const progressPercentage = Math.min((currentTasks / totalTasks) * 100, 100);

  // Animation logic
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (isCompleted) {
      rotation.value = withRepeat(
        withTiming(360, { duration: 3000, easing: Easing.linear }),
        -1 // Infinite loop
      );
    } else {
        rotation.value = 0;
    }
  }, [isCompleted]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <Pressable
      onPress={onPress}
      // We keep the shape and shadow here, but remove padding/bg to handle the border effect
      className={`w-full relative overflow-hidden rounded-xl shadow-md ${
        !isCompleted ? 'bg-neutralLight' : ''
      }`}
    >
      {/* --- Golden Gradient Layer (Only visible if completed) --- */}
      {isCompleted && (
        <AnimatedLinearGradient
          colors={['#B8860B', '#FFD700', '#FFE5B4', '#FFD700', '#B8860B']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[StyleSheet.absoluteFill, animatedStyle, { width: '150%', height: '150%', left: '-25%', top: '-25%' }]}
        />
      )}

      {/* --- Main Content Container --- */}
      {/* We add a small margin (m-[2px]) when completed to create the "border" effect */}
      <View 
        className={`gap-6 p-4 ${
          isCompleted ? 'm-[2px] rounded-[10px] bg-neutralLight' : ''
        }`}
      >
        {/* --- Secção Superior: Informação e Valor --- */}
        <View className="flex-row items-start justify-between gap-5">
          {/* Texto Esquerda */}
          <View className="flex-1 gap-1">
            <ThemedText type="subtitle" className="uppercase text-neutral">
              {name_store}
            </ThemedText>
            <ThemedText className="capitalize text-neutral">{address}</ThemedText>
          </View>

          {/* Chip de Valor (Direita) */}
          <View className="items-center justify-center rounded-full border border-primary px-4 py-2">
            <ThemedText className="text-primary">{value}</ThemedText>
          </View>
        </View>

        {/* --- Secção Inferior: Progresso --- */}
        <View className="w-full gap-2">
          <View className="flex-row justify-between">
            <ThemedText type="bodyBold" className="text-left text-primary">
              {currentTasks}/{totalTasks}
            </ThemedText>
            <ThemedText className="text-right text-base text-neutral">
              Tarefas completadas
            </ThemedText>
          </View>

          {/* Barra de Progresso */}
          <View className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <View
              className="h-full rounded-full bg-primary"
              style={{ width: `${progressPercentage}%` }}
            />
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default Voucher;