// components/__tests__/Header.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Header from '../shared/Header';

// Nenhum jest.mock() inline necessário, os mocks serão carregados automaticamente

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
