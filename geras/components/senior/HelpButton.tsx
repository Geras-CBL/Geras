import { View, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from '../ThemedText';
import HelpShape from '../../assets/images/HelpShape.png';
import { useState } from 'react';
import { useAudioPlayer } from 'expo-audio';
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from 'react-native-reanimated';

export default function HelpButton() {
  const [isOpen, setIsOpen] = useState(false);
  const audioSource = require('../../assets/audio/assistant.mp3');
  const player = useAudioPlayer(audioSource);
  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      player.seekTo(0);
      player.play();
    }
  };

  return (
    <>
      {isOpen && (
        <Animated.View
          entering={FadeIn.duration(250)}
          exiting={FadeOut.duration(250)}
          className="absolute bottom-0 left-0 right-0 top-0 z-40"
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={toggleOpen}
            className="h-full w-full bg-neutral/60"
          />
        </Animated.View>
      )}

      <Animated.View
        layout={LinearTransition.springify().damping(30).stiffness(200)}
        className="pointer-events-box-none absolute bottom-0 z-50 w-full items-center"
      >
        {!isOpen ? (
          <Animated.View
            key="closed-button"
            entering={FadeIn.duration(150)}
            exiting={FadeOut.duration(100)}
            className="items-center pb-8"
          >
            <View className="relative">
              <TouchableOpacity
                onPress={toggleOpen}
                className="absolute -top-10 left-0 right-0 z-20 items-center shadow-sm"
              >
                <View className="h-20 w-20 items-center justify-center rounded-full bg-primary">
                  <MaterialIcons name="question-mark" size={42} color="white" />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.9}
                onPress={toggleOpen}
                className="relative h-28 w-80 items-center justify-center"
              >
                <View
                  className="absolute inset-0"
                  style={{
                    elevation: 12,
                    shadowColor: '#000',
                    shadowOpacity: 0.3,
                    shadowRadius: 12,
                    shadowOffset: { width: 0, height: 6 },
                  }}
                >
                  <Image
                    source={HelpShape}
                    className="h-full w-full"
                    resizeMode="contain"
                  />
                </View>

                <ThemedText type="title" className="pt-6 text-lg text-black">
                  Tenho dúvidas
                </ThemedText>
              </TouchableOpacity>
            </View>
          </Animated.View>
        ) : (
          <Animated.View
            key="open-chat"
            entering={FadeIn.duration(150).delay(25)}
            exiting={FadeOut.duration(80)}
            className="w-5/6"
          >
            <View className="w-full rounded-3xl bg-white px-6 pb-10 pt-12 shadow-2xl">
              <View className="absolute -top-8 left-0 right-0 items-center justify-center">
                <View className="absolute top-2 h-20 w-20 rounded-full bg-white" />

                <View className="z-10 h-16 w-16 items-center justify-center rounded-full bg-primary shadow-sm">
                  <MaterialIcons name="question-mark" size={32} color="white" />
                </View>
              </View>

              <TouchableOpacity
                onPress={toggleOpen}
                className="absolute right-6 top-6 rounded-full bg-gray-100 p-2"
              >
                <MaterialIcons name="close" size={24} color="black" />
              </TouchableOpacity>

              <View className="w-full gap-6">
                <View className="mt-2 self-start rounded-2xl rounded-tl-none bg-gray-200 px-6 py-4">
                  <ThemedText className="text-base font-medium text-gray-700">
                    Olá! Como posso ajudar?
                  </ThemedText>
                </View>

                <TouchableOpacity
                  className="w-full flex-row items-center justify-center gap-3 rounded-2xl bg-primary py-4 shadow-md"
                  activeOpacity={0.8}
                >
                  <ThemedText className="text-lg font-bold text-white">
                    Pressione aqui para falar
                  </ThemedText>
                  <MaterialIcons
                    name="record-voice-over"
                    size={24}
                    color="white"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        )}
      </Animated.View>
    </>
  );
}
