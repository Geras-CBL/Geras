import React, { useState } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from 'react-native-reanimated';
import { useAudioPlayer } from 'expo-audio';

import { ThemedText } from '../ThemedText';
import { HelpContent } from './HelpButton';

const LeftActionImage = require('@/assets/images/arrowleft.png');
const RightActionImage = require('@/assets/images/actionright.png');
const audioSource = require('../../assets/audio/assistant.mp3');

export default function BottomActions() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [isOpen, setIsOpen] = useState(false);
  const player = useAudioPlayer(audioSource);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const toggleOpen = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);

    if (nextState) {
      player.seekTo(0);
      player.play();
    }
  };

  const BTN_WIDTH = 200;
  const BTN_HEIGHT = 120;

  return (
    <>
      {isOpen && (
        <Animated.View
          entering={FadeIn.duration(250)}
          exiting={FadeOut.duration(250)}
          className="absolute bottom-0 left-0 right-0 z-40"
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={toggleOpen}
            className="h-full w-full"
          />
        </Animated.View>
      )}

      <Animated.View
        layout={LinearTransition.springify().damping(30).stiffness(200)}
        className="pointer-events-box-none absolute left-0 right-0 z-50 items-center justify-end"
        style={{ bottom: insets.bottom }}
      >
        {!isOpen ? (
          <Animated.View
            key="button-row"
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(150)}
            className="w-full flex-row justify-around pb-4"
          >
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleBack}
              className="relative"
            >
              <Image
                source={LeftActionImage}
                style={{ width: BTN_WIDTH, height: BTN_HEIGHT }}
                resizeMode="contain"
              />
              <View className="absolute inset-0 justify-center pl-8">
                <ThemedText
                  type="subtitle"
                  className="text-center"
                  style={{ fontSize: 16 }}
                >
                  Voltar{'\n'}Atrás
                </ThemedText>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={toggleOpen}
              className="relative"
            >
              <Image
                source={RightActionImage}
                style={{ width: BTN_WIDTH, height: BTN_HEIGHT }}
                resizeMode="contain"
              />
              <View className="absolute inset-0 justify-center pb-1 pr-8">
                <ThemedText
                  type="subtitle"
                  className="text-center"
                  style={{ fontSize: 16 }}
                >
                  Tenho{'\n'}Dúvidas
                </ThemedText>
              </View>
            </TouchableOpacity>
          </Animated.View>
        ) : (
          <HelpContent toggleOpen={toggleOpen} />
        )}
      </Animated.View>
    </>
  );
}
