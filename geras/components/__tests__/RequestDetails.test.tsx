/* eslint-disable @typescript-eslint/no-require-imports */
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import RequestDetails from '../../app/navigation/senior/RequestDetails';

// ─── Supabase Mock ────────────────────────────────────────────────────────────
const mockSingle = jest.fn().mockResolvedValue({
  data: {
    state: 'COMPLETED',
    description: 'Teste de pedido',
    id_senior: 99,
    senior: {
      name: 'António Silva',
      gender: 'MALE',
      profile_picture: null,
      local: 'Aveiro',
    },
    evaluations: [],
  },
  error: null,
});

const mockInsert = jest.fn().mockResolvedValue({ data: null, error: null });

jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn((table: string) => {
      if (table === 'requests') {
        return {
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: mockSingle,
              maybeSingle: mockSingle,
            }),
          }),
        };
      }
      if (table === 'evaluations') {
        return { insert: mockInsert };
      }
      return {};
    }),
  },
}));

// ─── AsyncStorage Mock ────────────────────────────────────────────────────────
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// ─── Expo Router Mock ─────────────────────────────────────────────────────────
jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({ type: 'food', requestId: '123' }),
  useRouter: () => ({ push: jest.fn(), back: jest.fn() }),
  router: { back: jest.fn() },
}));

// ─── Auth Context Mock ────────────────────────────────────────────────────────
jest.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    profile: { id: 1, role: 'senior', name: 'António' },
    session: null,
  }),
}));

// ─── Safe Area Mock ───────────────────────────────────────────────────────────
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: any) => children,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

// ─── EvaluationTask Mock ──────────────────────────────────────────────────────
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

// ─── Expo Audio Mock ──────────────────────────────────────────────────────────
jest.mock('expo-audio', () => ({
  useAudioPlayer: () => ({
    play: jest.fn(),
    pause: jest.fn(),
    seekTo: jest.fn(),
  }),
}));

// ─── Expo Speech Recognition Mock ────────────────────────────────────────────
jest.mock('expo-speech-recognition', () => ({
  ExpoSpeechRecognitionModule: {
    requestPermissionsAsync: jest.fn().mockResolvedValue({ granted: true }),
    start: jest.fn(),
    stop: jest.fn(),
  },
  useSpeechRecognitionEvent: jest.fn(),
}));

// ─── Tests ────────────────────────────────────────────────────────────────────
describe('Ecrã RequestDetails - Teste Funcional', () => {
  beforeEach(() => {
    mockSingle.mockClear();
    mockInsert.mockClear();
  });

  it('deve mostrar a avaliação após carregar e submeter o formulário corretamente', async () => {
    const { getByText, queryByText } = render(<RequestDetails />);

    // Passo 1: Enquanto carrega, o botão Submeter não existe
    expect(queryByText('Submeter')).toBeNull();

    // Passo 2: Aguardar que os dados assíncronos carreguem e a UI atualize
    await waitFor(() => {
      expect(getByText('sentiment_satisfied')).toBeTruthy();
    });

    // Passo 3: Clicar no smiley "satisfeito"
    fireEvent.press(getByText('sentiment_satisfied'));

    // Passo 4: O botão Submeter aparece após selecionar um smiley
    await waitFor(() => {
      expect(getByText('Submeter')).toBeTruthy();
    });
    fireEvent.press(getByText('Submeter'));

    // Passo 5: Verificar que o insert foi chamado com os dados corretos
    await waitFor(() => {
      expect(mockInsert).toHaveBeenCalledWith({
        id_request: 123,
        id_volunteer: 1,
        id_senior: 99,
        evaluation: 'SATISFIED',
        description: '',
      });
    });
  });
});
