import React from 'react';
import { render } from '@testing-library/react-native';
import { ThemedText } from '../ThemedText';

// Mock do FontContext será usado automaticamente pelo Jest
jest.mock('../../__mocks__/FontContext');

describe('ThemedText component', () => {
  it('renderiza texto padrão', () => {
    const { getByText } = render(<ThemedText>Olá Mundo</ThemedText>);
    expect(getByText('Olá Mundo')).toBeTruthy();
  });

  it('aplica o estilo correto para cada tipo', () => {
    const tipos = [
      { type: 'title', fontSize: 20 },
      { type: 'subtitle', fontSize: 18 },
      { type: 'bodytitle', fontSize: 16 },
      { type: 'body', fontSize: 16 },
      { type: 'bodySmall', fontSize: 12 },
      { type: 'bodyBold', fontSize: 16 },
      { type: 'bigButton', fontSize: 20 },
      { type: 'bodyInfo', fontSize: 14 },
    ] as const; // mantém os tipos literais

    tipos.forEach(({ type, fontSize }) => {
      const { getByText } = render(
        <ThemedText type={type}>{`Teste ${type}`}</ThemedText>,
      );
      const text = getByText(`Teste ${type}`);

      // Verifica se o fontSize está aplicado (considerando scale = 1 do mock)
      expect(text.props.style).toEqual(
        expect.arrayContaining([expect.objectContaining({ fontSize })]),
      );
    });
  });

  it('aplica style extra passado como prop', () => {
    const { getByText } = render(
      <ThemedText style={{ color: 'red' }}>Texto colorido</ThemedText>,
    );
    const text = getByText('Texto colorido');
    expect(text.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ color: 'red' })]),
    );
  });
});
