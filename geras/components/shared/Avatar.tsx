import React from 'react';
import { View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';

const Avatar = () => {
  return (
    <View className="relative h-32 w-32 items-center justify-center rounded-full border border-secondary bg-secondary/50">
      <ThemedText type="title" className="momo font-bold text-neutral">
        AS
      </ThemedText>

      <View className="absolute bottom-0 right-0 h-8 w-8 items-center justify-center rounded-full border border-white bg-neutral">
        <MaterialIcons name="photo-camera" size={16} color="white" />
      </View>
    </View>
  );
};

export default Avatar;
