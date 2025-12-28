import React from 'react';
import { TouchableOpacity } from 'react-native';
import { ThemedText } from '../ThemedText';
import { MaterialIcons } from '@expo/vector-icons';
import { Route, useRouter } from 'expo-router';

interface BigButtonProps {
  iconName: keyof typeof MaterialIcons.glyphMap;
  label: string;
  route?: string;
}

const BigButton = ({ iconName, label, route }: BigButtonProps) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      className="h-full w-full items-center justify-center gap-4 rounded-2xl bg-primary"
      activeOpacity={0.8}
      onPress={() => {
        if (route) router.push(route as Route);
      }}
    >
      <MaterialIcons name={iconName} size={80} color="#fbfbfb" />
      <ThemedText type="bigButton" className="text-neutralLight">
        {label}
      </ThemedText>
    </TouchableOpacity>
  );
};

export default BigButton;
