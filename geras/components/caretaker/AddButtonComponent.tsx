import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { ThemedText } from '../ThemedText';

interface AddButtonComponentProps {
  onPress?: () => void;
  title?: string;
}

const AddButtonComponent = ({
  onPress,
  title = 'Adicionar',
}: AddButtonComponentProps) => {
  return (
    <View className="mt-4 w-full">
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        className="elevation-5 w-full items-center justify-center rounded-lg bg-primary py-4 shadow-md shadow-black/10"
      >
        <ThemedText
          type="body"
          className="text-center capitalize text-neutralLight"
        >
          {title}
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
};

export default AddButtonComponent;
