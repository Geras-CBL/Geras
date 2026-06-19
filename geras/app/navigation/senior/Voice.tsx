import { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  DeviceEventEmitter,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { ThemedText } from '@/components/ThemedText';
import BottomActions from '@/components/senior/BottomActions';
import FloatingIconCard from '@/components/senior/FloatingIconCard';
import Button from '@/components/shared/Button';
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from 'expo-speech-recognition';

const NUM_BARS = 40;

const WaveBar = ({
  index,
  isListening,
}: {
  index: number;
  isListening: boolean;
}) => {
  const height = useSharedValue(15);

  useEffect(() => {
    if (isListening) {
      const randomHeight = Math.random() * 35 + 15;
      const duration = Math.random() * 300 + 400;

      height.value = withDelay(
        index * 50,
        withRepeat(
          withTiming(randomHeight, {
            duration: duration,
            easing: Easing.inOut(Easing.quad),
          }),
          -1,
          true,
        ),
      );
    } else {
      // Fica flat (estático) se não estiver a gravar
      height.value = withTiming(8, { duration: 300 });
    }
  }, [height, index, isListening]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
  }));

  return (
    <Animated.View
      className="mx-[1.5px] mt-12 w-1 rounded-full bg-primary"
      style={animatedStyle}
    />
  );
};

const AudioWaveform = ({ isListening }: { isListening: boolean }) => (
  <View className="mb-8 h-8 w-full flex-row items-center justify-center">
    {Array.from({ length: NUM_BARS }).map((_, i) => (
      <WaveBar key={i} index={i} isListening={isListening} />
    ))}
  </View>
);

export default function VoicePage() {
  const router = useRouter();
  const { mode, type } = useLocalSearchParams<{
    mode?: 'grocery' | 'request';
    type?: string;
  }>();

  const [transcriptText, setTranscriptText] = useState('');
  const [isListening, setIsListening] = useState(false);

  // Escutar eventos do microfone
  useSpeechRecognitionEvent('start', () => {
    setIsListening(true);
  });

  useSpeechRecognitionEvent('result', (event) => {
    if (event.results && event.results.length > 0) {
      setTranscriptText(event.results[0].transcript);
    }
  });

  useSpeechRecognitionEvent('end', () => {
    setIsListening(false);
  });

  useSpeechRecognitionEvent('error', (event) => {
    console.error('Erro no Speech Recognition:', event.error, event.message);
    setIsListening(false);
  });

  // Função para ligar/desligar gravação
  const toggleListening = async () => {
    if (isListening) {
      ExpoSpeechRecognitionModule.stop();
    } else {
      const permission =
        await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      if (!permission.granted) return;

      ExpoSpeechRecognitionModule.start({
        lang: 'pt-PT',
        interimResults: true,
        maxAlternatives: 1,
      });
    }
  };

  // Iniciar gravação automaticamente ao montar a tela
  useEffect(() => {
    let active = true;

    async function startSpeech() {
      const permission =
        await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      if (!permission.granted) {
        console.warn('Permissão de microfone negada.');
        return;
      }

      if (active) {
        ExpoSpeechRecognitionModule.start({
          lang: 'pt-PT',
          interimResults: true,
          maxAlternatives: 1,
        });
      }
    }

    startSpeech();

    return () => {
      active = false;
      ExpoSpeechRecognitionModule.stop();
    };
  }, []);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  // Confirmar e retornar o texto
  // Confirmar e retornar o texto
  const handleConfirmText = () => {
    if (!transcriptText.trim()) return;

    if (mode === 'grocery') {
      // Envia especificamente para o ecrã de compras
      DeviceEventEmitter.emit(
        'onSpeechTranscript_grocery',
        transcriptText.trim(),
      );
    } else {
      // Envia especificamente para o ecrã de pedidos
      DeviceEventEmitter.emit(
        'onSpeechTranscript_request',
        transcriptText.trim(),
      );
    }

    // Recua no histórico (garante que volta para o ecrã exato de onde veio)
    router.back();
  };

  // Obter configurações de UI com base no modo
  const getUIConfig = () => {
    if (mode === 'grocery') {
      return {
        headerTitle: 'Adicionar à Lista de Compras',
        cardIcon: 'shopping-cart' as const,
        inputLabel: 'O seu produto...',
      };
    }

    // Caso contrário, é modo request
    const requestType = type || 'other';
    let iconName = 'hearing' as any;
    let categoryTitle = 'Pedido';

    if (requestType === 'cleaning') {
      iconName = 'cleaning-services';
      categoryTitle = 'Limpeza';
    } else if (requestType === 'other') {
      iconName = 'construction';
      categoryTitle = 'Outros';
    } else if (requestType === 'pharmacy') {
      iconName = 'local-pharmacy';
      categoryTitle = 'Medicamentos';
    }

    return {
      headerTitle: `Pedir Ajuda - ${categoryTitle}`,
      cardIcon: iconName,
      inputLabel: 'O seu pedido...',
    };
  };

  const uiConfig = getUIConfig();

  const renderCardContent = () => (
    <View className="w-full flex-1 justify-center gap-4">
      {/* Ondas sonoras */}
      <AudioWaveform isListening={isListening} />
      {/* Botão de Gravar/Parar interativo para facilitar a usabilidade */}
      <View className="mb-2 items-center">
        <TouchableOpacity
          onPress={toggleListening}
          className={`h-16 w-16 items-center justify-center rounded-full ${isListening ? 'bg-red-500' : 'bg-primary'} shadow-lg`}
        >
          <MaterialIcons
            name={isListening ? 'stop' : 'mic'}
            size={36}
            color="white"
          />
        </TouchableOpacity>
        <ThemedText className="mt-2 text-sm font-bold text-gray-500">
          {isListening ? 'Pressione para parar' : 'Pressione para falar'}
        </ThemedText>
      </View>
      <View className="px-2">
        <ThemedText
          type="bodyBold"
          className="mb-2 text-left text-lg text-neutral"
        >
          {uiConfig.inputLabel}
        </ThemedText>
        <View className="mb-6 h-32 w-full rounded-2xl border-2 border-primary bg-neutralLight px-3">
          <TextInput
            value={transcriptText}
            onChangeText={setTranscriptText}
            placeholder="A falar..."
            placeholderTextColor="#888"
            multiline
            className="flex-1 font-rubik text-lg text-neutral"
            textAlignVertical="top"
            editable={true}
          />
        </View>
      </View>
      <View className="mb-4 items-center">
        <Button
          title="Confirmar Texto"
          className="w-2/3 border-primary text-primary"
          onPress={handleConfirmText}
          disabled={!transcriptText.trim()}
        />
      </View>
    </View>
  );
  return (
    <SafeAreaView edges={['top']} className="flex-1 pb-56 pt-24">
      <View className="mt-8 items-center">
        <ThemedText type="subtitle" className="text-xl text-[#1A1A1A]">
          {uiConfig.headerTitle}
        </ThemedText>
      </View>
      <View className="flex-1 px-6 pt-12">
        <FloatingIconCard
          onClose={handleBack}
          icon={
            <MaterialIcons name={uiConfig.cardIcon} size={48} color="#ffff" />
          }
        >
          {renderCardContent()}
        </FloatingIconCard>
      </View>
      <BottomActions />
    </SafeAreaView>
  );
}
