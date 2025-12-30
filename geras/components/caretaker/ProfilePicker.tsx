import * as React from 'react';
import { View, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';

const ProfilePicker = () => {
  return (
    <Pressable
      onPress={() => {}}
      className="flex-1 w-full flex-row items-center gap-2"
    >
      <View
        className="
          h-[50px] w-[50px] rounded-full
          bg-secondary/50
          border border-secondary
          items-center justify-center
        "
      >
        <ThemedText type="subtitle">AS</ThemedText>
      </View>

      <ThemedText type="subtitle">
        António Silva
      </ThemedText>

      <MaterialIcons
        name="keyboard-arrow-down"
        size={18}
        color="#1d1d1b"
      />
    </Pressable>
  );
};

export default ProfilePicker;
