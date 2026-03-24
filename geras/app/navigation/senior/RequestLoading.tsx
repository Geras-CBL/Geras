import { FontAwesome } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const STEPS = [
  { id: 'step1', label: 'A processar o seu pedido', icon: 'spinner' },
  { id: 'step2', label: 'A procurar voluntários', icon: 'search' },
  { id: 'step3', label: 'Voluntário encontrado!', icon: 'check' },
];

const CentralAnimation = ({ stepIndex }: { stepIndex: number }) => {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    rotation.value = 0;
    scale.value = 1;

    if (stepIndex === 0) {
      rotation.value = withRepeat(
        withTiming(1, { duration: 1000, easing: Easing.linear }),
        -1,
        false,
      );
    }

    if (stepIndex === 1) {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.15, { duration: 600 }),
          withTiming(1.0, { duration: 600 }),
        ),
        -1,
        false,
      );
    }

    if (stepIndex === 2) {
      scale.value = withSpring(1.2, { damping: 10, stiffness: 100 }, () => {
        scale.value = withSpring(1);
      });
    }
  }, [rotation, scale, stepIndex]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: stepIndex === 0 ? `${rotation.value * 360}deg` : '0deg' },
    ],
  }));

  const currentIcon = STEPS[stepIndex]?.icon || 'question';
  const iconColor = stepIndex === 2 ? '#4ADE80' : '#F5F5F5';

  return (
    <View
      className="mb-10 h-40 w-40 items-center justify-center rounded-full bg-white/10"
      importantForAccessibility="no-hide-descendants"
      accessibilityElementsHidden={true}
    >
      <Animated.View style={animatedStyle}>
        <FontAwesome name={currentIcon as any} size={60} color={iconColor} />
      </Animated.View>
    </View>
  );
};

const AnimatedStepText = ({
  label,
  index,
  currentIndex,
}: {
  label: string;
  index: number;
  currentIndex: number;
}) => {
  const isActive = index === currentIndex;
  const isPast = index < currentIndex;

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isActive || isPast ? 1 : 0.4, { duration: 300 }),
    transform: [{ translateX: withTiming(isActive ? 10 : 0) }],
    color: interpolateColor(
      isPast ? 1 : 0,
      [0, 1],
      [isActive ? '#F5F5F5' : '#9CA3AF', '#4ADE80'],
    ),
  }));

  return (
    <Animated.Text
      className="my-2 text-xl font-bold"
      style={animatedStyle}
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={
        isPast
          ? `Concluído: ${label}`
          : isActive
            ? `A decorrer: ${label}`
            : `Próximo passo: ${label}`
      }
    >
      {isPast ? '✓ ' : ''}
      {label}
    </Animated.Text>
  );
};

export default function RequestLoading() {
  const { type } = useLocalSearchParams<{ type?: string }>();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const duration = currentStepIndex === 2 ? 2000 : 5000;

    const timeout = setTimeout(() => {
      if (currentStepIndex < STEPS.length - 1) {
        setCurrentStepIndex((prev) => prev + 1);
      } else {
        router.replace({
          pathname: './RequestDetails',
          params: { type },
        });
      }
    }, duration);

    return () => clearTimeout(timeout);
  }, [currentStepIndex, type]);

  return (
    <SafeAreaView
      edges={['top']}
      className="flex-1 justify-between bg-primary px-10 pb-20 pt-16"
    >
      <Text
        className="mb-2 pt-8 text-3xl font-bold text-neutralLight"
        accessibilityRole="header"
      >
        Aguarde...
      </Text>

      <View className="flex-1 items-center justify-center">
        <CentralAnimation stepIndex={currentStepIndex} />
      </View>

      <View className="mb-20 w-full flex-col items-start">
        {STEPS.map((step, index) => (
          <AnimatedStepText
            key={step.id}
            label={step.label}
            index={index}
            currentIndex={currentStepIndex}
          />
        ))}
      </View>
    </SafeAreaView>
  );
}
