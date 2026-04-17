import React from 'react';
import { render, act } from '@testing-library/react-native';
import { FontProvider, useFontScale } from '../FontContext';
import { Text, PixelRatio } from 'react-native';

jest.spyOn(PixelRatio, 'getFontScale').mockReturnValue(1);

const TestComponent = () => {
  const { scale, setScale } = useFontScale();
  return (
    <>
      <Text testID="scale">{scale}</Text>
      <Text testID="increase" onPress={() => setScale(scale + 1)}>
        Increase
      </Text>
    </>
  );
};

describe('FontContext', () => {
  it('fornece valor inicial correto', () => {
    const { getByTestId } = render(
      <FontProvider>
        <TestComponent />
      </FontProvider>,
    );

    const scaleText = getByTestId('scale');
    expect(scaleText.props.children).toBe(1);
  });

  it('atualiza o scale corretamente', () => {
    const { getByTestId } = render(
      <FontProvider>
        <TestComponent />
      </FontProvider>,
    );

    const scaleText = getByTestId('scale');
    const increaseButton = getByTestId('increase');

    act(() => {
      increaseButton.props.onPress();
    });

    expect(scaleText.props.children).toBe(2);
  });
});
