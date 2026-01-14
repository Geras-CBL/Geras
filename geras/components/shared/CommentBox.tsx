import * as React from 'react';
import { TextInput, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface CommentBoxProps {
  value: string;
  onChangeText: (text: string) => void;
}

const CommentBox = ({ value, onChangeText }: CommentBoxProps) => {
  return (
    <View className="h-32 w-full flex-row items-start rounded-xl bg-white p-4 shadow-md">
      <TextInput
        className="flex-1 text-base text-neutral"
        multiline
        value={value}
        onChangeText={onChangeText}
        textAlignVertical="top"
        placeholder="Escreva a sua observação..."
        placeholderTextColor="#999999"
      />
      <MaterialIcons
        name="edit"
        size={24}
        color="black"
        className="ml-2 mt-1"
      />
    </View>
  );
};

export default CommentBox;
