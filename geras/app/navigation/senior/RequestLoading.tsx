import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const GIFS = [
  { id: 'gif1', source: require('../../../assets/images/loading1.gif') },
  { id: 'gif2', source: require('../../../assets/images/loading2.gif') },
];

const STEPS = [
  { id: 'step1', label: 'A processar o seu pedido' },
  { id: 'step2', label: 'A procurar voluntários' },
  { id: 'step3', label: 'Voluntário encontrado' },
];

interface BaseProps {
  isActive: boolean;
}

interface AnimatedStepProps extends BaseProps {
  label: string;
}

interface AnimatedGifProps extends BaseProps {
  source: any;
}

const AnimatedStep: React.FC<AnimatedStepProps> = ({ label, isActive }) => {
  const scale = useSharedValue(1);
  const colorProgress = useSharedValue(0);

  useEffect(() => {
    scale.value = withTiming(isActive ? 1.8 : 1, {
      duration: 20,
      easing: Easing.inOut(Easing.quad),
    });

    colorProgress.value = withTiming(isActive ? 1 : 0, {
      duration: 20,
      easing: Easing.inOut(Easing.quad),
    });
  }, [colorProgress, isActive, scale]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      transformOrigin: '0% 50%',
      color: interpolateColor(
        colorProgress.value,
        [0, 1],
        ['#9CA3AF', '#F5F5F5'],
      ),
    };
  });

  return (
    <Animated.Text
      className="my-6 text-left text-lg font-bold"
      style={animatedStyle}
    >
      {label}
    </Animated.Text>
  );
};

const AnimatedGif: React.FC<AnimatedGifProps> = ({ source, isActive }) => {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(isActive ? 1 : 0, { duration: 10 });
  }, [isActive, opacity]);

  const animatedStyle = useAnimatedStyle(() => {
    return { opacity: opacity.value };
  });

  return (
    <Animated.Image
      source={source}
      className="absolute h-64 w-64"
      resizeMode="contain"
      style={animatedStyle}
    />
  );
};

const AnimatedRedirect: React.FC<BaseProps> = ({ isActive }) => {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(isActive ? 1 : 0, { duration: 10 });
  }, [isActive, opacity]);

  const animatedStyle = useAnimatedStyle(() => {
    return { opacity: opacity.value };
  });

  return (
    <Animated.Text
      className="absolute text-lg font-medium text-neutralLight"
      style={animatedStyle}
    >
      Redirecting...
    </Animated.Text>
  );
};

export default function RequestDetails() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    if (currentStepIndex < STEPS.length) {
      const timeout = setTimeout(() => {
        setCurrentStepIndex((prev) => prev + 1);
      }, 300);

      return () => clearTimeout(timeout);
    } else {
      router.replace('./RequestDetails');
    }
  }, [currentStepIndex]);

  return (
    <View className="relative flex-1 items-start justify-start bg-primary px-10 pt-40">
      <View className="z-10 w-full flex-col items-start">
        {STEPS.map((step, index) => (
          <AnimatedStep
            key={step.id}
            label={step.label}
            isActive={index === currentStepIndex}
          />
        ))}
      </View>

      <View className="absolute bottom-96 left-0 right-0 items-center justify-center">
        {GIFS.map((gif, index) => (
          <AnimatedGif
            key={gif.id}
            source={gif.source}
            isActive={index === currentStepIndex}
          />
        ))}

        <AnimatedRedirect isActive={currentStepIndex === 2} />
      </View>
    </View>
  );
}
