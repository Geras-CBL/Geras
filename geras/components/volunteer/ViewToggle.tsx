import React, { useEffect, useState } from 'react';
import { View, Pressable, LayoutChangeEvent } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { ThemedText } from '@/components/ThemedText';

export interface ToggleOption {
  label: string;
  value: string;
}

interface ViewToggleProps {
  options: [ToggleOption, ToggleOption];
  currentValue: string;
  onSelect: (value: string) => void;
}

export default function ViewToggle({
  options,
  currentValue,
  onSelect,
}: ViewToggleProps) {
  const [containerWidth, setContainerWidth] = useState(0);
  const translateX = useSharedValue(0);

  const activeIndex = options.findIndex((opt) => opt.value === currentValue);

  useEffect(() => {
    if (containerWidth > 0) {
      const tabWidth = containerWidth / 2;
      translateX.value = withSpring(activeIndex * tabWidth, {
        mass: 1,
        damping: 15,
        stiffness: 120,
      });
    }
  }, [activeIndex, containerWidth, translateX]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const handleLayout = (e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
  };

  return (
    <View
      onLayout={handleLayout}
      className="relative mb-4 h-10 w-full flex-row overflow-hidden rounded-full bg-neutralLight shadow-sm"
    >
      <Animated.View
        style={[{ width: '50%' }, animatedStyle]}
        className="absolute bottom-0 left-0 top-0 h-full rounded-full bg-primary"
      />

      {options.map((option) => {
        const isActive = currentValue === option.value;

        return (
          <Pressable
            key={option.value}
            onPress={() => onSelect(option.value)}
            className="z-10 flex-1 items-center justify-center"
          >
            <ThemedText
              type="body"
              className={isActive ? 'text-neutralLight' : 'text-primary'}
            >
              {option.label.toUpperCase()}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}
