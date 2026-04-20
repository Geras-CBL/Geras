import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import RequestDetails from '../../app/navigation/senior/RequestDetails';

// 1. Mocks Essenciais
jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({ type: 'food' }),
  useRouter: () => ({ push: jest.fn(), back: jest.fn() }),
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: any) => children,
}));

// 2. MOCK DO SMILEY:
jest.mock('@/components/shared/EvaluationTask', () => {
  const { TouchableOpacity, Text } = require('react-native');

  const MockEvaluationTask = ({ variant, onPress }: any) => (
    <TouchableOpacity onPress={onPress}>
      <Text>{variant}</Text>
    </TouchableOpacity>
  );

  MockEvaluationTask.displayName = 'MockEvaluationTask';

  return MockEvaluationTask;
});

jest.mock('expo-audio', () => ({
  useAudioPlayer: () => ({
    play: jest.fn(),
    pause: jest.fn(),
    seekTo: jest.fn(),
  }),
}));

// Mock do Microfone
jest.mock('expo-speech-recognition', () => ({
  ExpoSpeechRecognitionModule: {
    requestPermissionsAsync: jest.fn().mockResolvedValue({ granted: true }),
    start: jest.fn(),
    stop: jest.fn(),
  },
  useSpeechRecognitionEvent: jest.fn(),
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: any) => children,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

describe('Ecrã RequestDetails - Teste Funcional', () => {
  // Prepara a Máquina do Tempo do Jest antes de cada teste
  beforeEach(() => {
    jest.useFakeTimers();
  });

  // Desliga a Máquina do Tempo no final para não estragar outros testes
  afterEach(() => {
    jest.useRealTimers();
  });

  it('deve mostrar a avaliação após 3s e submeter o formulário corretamente', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    const { getByText, queryByText } = render(<RequestDetails />);

    // Passo 1: Garantir que o botão Submeter está escondido no início
    expect(queryByText('Submeter')).toBeNull();

    // Passo 2: Avançar o tempo em 3 segundos para mostrar a avaliação
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    // Passo 3: Clicar no smiley "satisfeito" (que agora é um botão de texto)
    const botaoSatisfeito = getByText('sentiment_satisfied');
    fireEvent.press(botaoSatisfeito);

    // Passo 4: Clicar no botão Submeter (aparece após selecionar um smiley)
    const botaoSubmeter = getByText('Submeter');
    fireEvent.press(botaoSubmeter);

    // Passo 5: Verificar se o código registou "satisfeito" e texto vazio ("") na observação
    expect(consoleSpy).toHaveBeenCalledWith('sentiment_satisfied', '');

    // Limpar o espião no final
    consoleSpy.mockRestore();
  });
});
