import * as React from 'react';
import { View, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';

const ProfilePicker = () => {
  return (
    <Pressable
      onPress={() => {}}
      className="w-full flex-1 flex-row items-center gap-2"
    >
      <View className="h-[50px] w-[50px] items-center justify-center rounded-full border border-secondary bg-secondary/50">
        <ThemedText type="subtitle">AS</ThemedText>
      </View>

      <ThemedText type="subtitle">António Silva</ThemedText>

      <MaterialIcons name="keyboard-arrow-down" size={18} color="#1d1d1b" />
    </Pressable>
  );
};

export default ProfilePicker;
