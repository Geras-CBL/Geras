// components/__tests__/Header.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Header from '../shared/Header';

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
    replace: jest.fn(),
  }),
  useSegments: () => [],
}));

jest.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    profile: { role: 'SENIOR' },
  }),
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: { signOut: jest.fn(), getSession: jest.fn() },
    from: jest.fn(() => ({ select: jest.fn(), insert: jest.fn() })),
  },
}));

describe('Header component', () => {
  it('renderiza os ícones padrão', () => {
    const { getByText } = render(<Header />);
    expect(getByText('person')).toBeTruthy();
    expect(getByText('notifications')).toBeTruthy();
  });

  it('chama onLeftPress ao clicar no ícone esquerdo', () => {
    const onLeftPress = jest.fn();
    const { getByText } = render(<Header onLeftPress={onLeftPress} />);
    fireEvent.press(getByText('person'));
    expect(onLeftPress).toHaveBeenCalled();
  });

  it('chama onRightPress ao clicar no ícone direito', () => {
    const onRightPress = jest.fn();
    const { getByText } = render(<Header onRightPress={onRightPress} />);
    fireEvent.press(getByText('notifications'));
    expect(onRightPress).toHaveBeenCalled();
  });
});
