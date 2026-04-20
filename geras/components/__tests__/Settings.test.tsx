import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Settings from '../../app/navigation/senior/Settings';
import { FontProvider } from '@/components/FontContext';
import { StyleSheet } from 'react-native';

// 1. Mocks Essenciais
// O Jest não tem ecrã, por isso temos de "fingir" as bibliotecas visuais e de navegação
jest.mock('@expo/vector-icons', () => ({
  MaterialIcons: 'MaterialIcons',
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn() }),
}));

jest.mock('expo-audio', () => ({
  useAudioPlayer: () => ({
    play: jest.fn(),
    pause: jest.fn(),
    seekTo: jest.fn(),
  }),
}));

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

describe('Ecrã Settings - Teste Funcional', () => {
  it('deve selecionar o tamanho Extra (1.5x) quando o utilizador clica no botão', () => {
    // 2. Renderizar o ecrã real envolvido no Provider
    const { getByText } = render(
      <FontProvider>
        <Settings />
      </FontProvider>,
    );

    // 3. Encontrar o elemento no ecrã tal como o utilizador o vê
    const botaoExtra = getByText('Extra');

    // 4. Verificação inicial
    const estiloInicial = StyleSheet.flatten(botaoExtra.props.style);
    expect(estiloInicial.color).toBe('#4b5563');

    // 5. Ação: O "Senhor António" toca no botão
    fireEvent.press(botaoExtra);

    // 6. Resultado esperado
    const estiloFinal = StyleSheet.flatten(botaoExtra.props.style);
    expect(estiloFinal.color).toBe('white');
  });
});
