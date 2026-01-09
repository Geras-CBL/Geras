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
      className="flex-row h-9 rounded-full bg-neutralLight relative overflow-hidden shadow-sm w-full"
    >
      <Animated.View
        style={[
          { width: '50%' },
          animatedStyle,
        ]}
        className="absolute h-full bg-primary rounded-full top-0 left-0 bottom-0"
      />

      {options.map((option) => {
        const isActive = currentValue === option.value;

        return (
          <Pressable
            key={option.value}
            onPress={() => onSelect(option.value)}
            className="flex-1 items-center justify-center z-10"
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