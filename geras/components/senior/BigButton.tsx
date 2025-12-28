import React from 'react';
import { TouchableOpacity } from 'react-native';
import { ThemedText } from '../ThemedText';
import { MaterialIcons } from '@expo/vector-icons';

interface BigButtonProps {
  iconName: keyof typeof MaterialIcons.glyphMap;
  label: string;
}

const BigButton = ({ iconName, label }: BigButtonProps) => {
  return (
    <TouchableOpacity
      className="h-full w-full items-center justify-center gap-4 rounded-2xl bg-primary"
      activeOpacity={0.8}
    >
      <MaterialIcons name={iconName} size={80} color="#fbfbfb" />
      <ThemedText type="bigButton" className="text-neutralLight">
        {label}
      </ThemedText>
    </TouchableOpacity>
  );
};

export default BigButton;
