import { View, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from '../ThemedText';
import HelpShape from '../../assets/images/HelpShape.png';
import { useEffect, useState } from 'react';
import { useAudioPlayer } from 'expo-audio';
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from 'react-native-reanimated';
import Button from '../shared/Button';
import Voice, { SpeechResultsEvent } from '@react-native-voice/voice';

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
          <HelpContent toggleOpen={toggleOpen} />
        )}
      </Animated.View>
    </>
  );
}

export const HelpContent = ({ toggleOpen }: { toggleOpen: () => void }) => {
  const [started, setStarted] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  const onSpeechResultsHandler = (e: SpeechResultsEvent) => {
    setResults(e.value ?? []);
  };

  const onSpeechErrorHandler = (e: any) => {
    console.error(e);
    setStarted(false);
  };

  // Resets state when the OS stops listening automatically
  const onSpeechEndHandler = () => {
    setStarted(false);
  };

  useEffect(() => {
    Voice.onSpeechError = onSpeechErrorHandler;
    Voice.onSpeechResults = onSpeechResultsHandler;
    Voice.onSpeechEnd = onSpeechEndHandler;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const handleSpeechToggle = async () => {
    if (started) {
      await Voice.stop();
      setStarted(false);
    } else {
      setResults([]); // Clear previous text when starting new
      try {
        await Voice.start('pt-PT');
        setStarted(true);
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
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

        <View className="w-full gap-4">
          {/* Bot Message */}
          <View className="mt-2 self-start rounded-2xl rounded-tl-none bg-gray-200 px-6 py-4">
            <ThemedText className="text-base font-medium text-gray-700">
              Olá! Como posso ajudar?
            </ThemedText>
          </View>

          {/* User Message (Voice Result) - Only shows if there is text */}
          {results.length > 0 && (
            <Animated.View
              entering={FadeIn}
              className="self-end rounded-2xl rounded-tr-none bg-primary px-6 py-4"
            >
              <ThemedText className="text-base font-medium text-white">
                {results[0]}
              </ThemedText>
            </Animated.View>
          )}

          {/* Spacer if no results yet, to keep layout consistent */}
          {results.length === 0 && <View className="h-4" />}

          <Button
            title={
              started ? 'Ouvindo... (Toque para parar)' : 'Pressione para falar'
            }
            icon={
              <MaterialIcons
                name={started ? 'stop' : 'record-voice-over'}
                size={24}
                color="#ffff"
              />
            }
            className={`mb-2 w-full ${started ? 'bg-red-500' : ''}`} // Optional: change color when recording
            onPress={handleSpeechToggle}
          />
        </View>
      </View>
    </Animated.View>
  );
};
