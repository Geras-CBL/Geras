import { MaterialIcons } from '@expo/vector-icons';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { useAudioPlayer } from 'expo-audio';
import { router } from 'expo-router';
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from 'expo-speech-recognition';
import { useState } from 'react';
import { ActivityIndicator, Image, TouchableOpacity, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from 'react-native-reanimated';
import HelpShape from '../../assets/images/HelpShape.png';
import Button from '../shared/Button';
import { ThemedText } from '../ThemedText';
import { API_KEY } from '../../api/api';

// Aqui, é onde configuramos o Gemini (usa a tua chave aqui)
const genAI = new GoogleGenerativeAI(API_KEY);

// Aqui, é onde mapeamos os nomes amigáveis para as rotas reais da app
const SENIOR_SCREENS = {
  home: '/navigation/senior/HomePage',
  saude: '/navigation/senior/Health',
  definicoes: '/navigation/senior/Settings',
  pedir_ajuda: '/navigation/senior/RequestHelp',
  meus_pedidos: '/navigation/senior/Requests',
  compras: '/navigation/senior/Groceries',
  adicionar_compras: '/navigation/senior/AddGrocerieList',
  registar_saude: '/navigation/shared/AddHealthMetric',
  editar_perfil: '/navigation/shared/EditProfile',
};

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
  const [recognizing, setRecognizing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Aqui, é onde capturamos o que o utilizador diz em tempo real
  useSpeechRecognitionEvent('result', (event) => {
    if (event.results && event.results.length > 0) {
      setTranscript(event.results[0].transcript);
    }
  });

  // Aqui, é onde detetamos o fim da fala e enviamos para o Gemini
  useSpeechRecognitionEvent('end', () => {
    setRecognizing(false);
    if (transcript.length > 2) {
      handleGeminiRequest(transcript);
    }
  });

  // Aqui, é onde processamos o pedido com o Gemini e gerimos a navegação
  const handleGeminiRequest = async (userText: string) => {
    setIsLoading(true);
    try {
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        systemInstruction:
          "És um assistente para idosos. Responde curto e em Português. Usa a ferramenta 'navigate' se o utilizador quiser ir a algum lado.",
        tools: [
          {
            functionDeclarations: [
              {
                name: 'navigate',
                description: 'Navega para um ecrã da aplicação.',
                parameters: {
                  type: SchemaType.OBJECT,
                  properties: {
                    screen: {
                      type: SchemaType.STRING,
                      format: 'enum',
                      description: `Ecrã de destino:
                        - 'home': Início.
                        - 'saude': Ver saúde/medicação.
                        - 'registar_saude': Registar tensão/dados.
                        - 'definicoes': Configurações.
                        - 'pedir_ajuda': Emergência/Ajuda.
                        - 'meus_pedidos': Ver pedidos.
                        - 'compras': Ver lista.
                        - 'adicionar_compras': Adicionar items à lista.
                        - 'editar_perfil': Mudar perfil.`,
                      enum: Object.keys(SENIOR_SCREENS),
                    },
                  },
                  required: ['screen'],
                },
              },
            ],
          },
        ],
      });

      const chat = model.startChat();
      const result = await chat.sendMessage(userText);
      const response = result.response;
      const call = response.functionCalls();

      // Se o Gemini pedir para navegar
      if (call && call.length > 0) {
        const firstCall = call[0];
        if (firstCall.name === 'navigate') {
          const screenKey = (firstCall.args as { screen: string })
            .screen as keyof typeof SENIOR_SCREENS;
          const targetPath = SENIOR_SCREENS[screenKey];

          if (targetPath) {
            setAiResponse(`A abrir ${screenKey.replace('_', ' ')}...`);
            setTimeout(() => {
              toggleOpen();
              router.push(targetPath as any);
            }, 1000);
          }
        }
      } else {
        // Se for apenas uma conversa normal
        setAiResponse(response.text());
      }
    } catch (error) {
      console.error(error);
      setAiResponse('Ocorreu um erro. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Aqui, é onde iniciamos ou paramos o reconhecimento de voz
  const handleSpeechToggle = async () => {
    if (recognizing) {
      ExpoSpeechRecognitionModule.stop();
    } else {
      const result =
        await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      if (!result.granted) return;

      setAiResponse('');
      setTranscript('');

      ExpoSpeechRecognitionModule.start({
        lang: 'pt-PT',
        interimResults: true,
        maxAlternatives: 1,
      });
      setRecognizing(true);
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

        <View className="w-full gap-6">
          <View className="mt-2 min-h-[80px] w-full justify-center self-start rounded-2xl rounded-tl-none bg-gray-200 px-6 py-4">
            {/* Aqui, é onde mostramos o estado (a pensar, resposta da AI ou o que o utilizador disse) */}
            {isLoading ? (
              <View className="flex-row items-center gap-2">
                <ActivityIndicator color="#4B5563" />
                <ThemedText className="text-gray-500">A pensar...</ThemedText>
              </View>
            ) : (
              <ThemedText className="text-base font-medium text-gray-700">
                {aiResponse ||
                  transcript ||
                  'Olá! Pode pedir para ir às definições, ver compras ou tirar dúvidas.'}
              </ThemedText>
            )}
          </View>

          <Button
            title={recognizing ? 'Parar' : 'Pressione para falar'}
            icon={
              <MaterialIcons
                name={recognizing ? 'stop' : 'record-voice-over'}
                size={24}
                color="#ffff"
              />
            }
            className={`mb-2 w-full ${recognizing ? 'bg-tertiary' : ''}`}
            onPress={handleSpeechToggle}
          />
        </View>
      </View>
    </Animated.View>
  );
};
