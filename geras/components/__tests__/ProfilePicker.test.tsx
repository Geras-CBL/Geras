import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ProfilePicker from '../caretaker/ProfilePicker';
import { SeniorProfile } from '@/data/profilesData';

describe('ProfilePicker', () => {
  const mockProfile: SeniorProfile = {
    id: '2',
    name: 'Maria Silva',
    age: 73,
    email: 'maria.silva@gmail.com',
    password: '********',
    birthDate: '23/05/1950',
    country: 'Portugal',
    image: null,
    selected: false,
  };

  it('renderiza as iniciais do perfil', () => {
    const { getByText } = render(<ProfilePicker profile={mockProfile} />);

    expect(getByText('MS')).toBeTruthy();
  });

  it('renderiza o nome completo do perfil', () => {
    const { getByText } = render(<ProfilePicker profile={mockProfile} />);

    expect(getByText('Maria Silva')).toBeTruthy();
  });

  it('renderiza o ícone de dropdown', () => {
    const { getByTestId } = render(<ProfilePicker profile={mockProfile} />);

    expect(getByTestId('icon-keyboard-arrow-down')).toBeTruthy();
  });

  it('chama onPress quando pressionado', () => {
    const onPressMock = jest.fn();

    const { getByText } = render(
      <ProfilePicker profile={mockProfile} onPress={onPressMock} />,
    );

    fireEvent.press(getByText('Maria Silva'));

    expect(onPressMock).toHaveBeenCalledTimes(1);
  });
});
