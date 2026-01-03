import * as React from 'react';
import { Text, TouchableOpacity } from 'react-native';

type ActionButtonProps = {
  title: string;
  variant?: 'outlined' | 'default';
  onPress?: () => void;
  className?: string; // permite passar classes externas
};

const ActionButton: React.FC<ActionButtonProps> = ({
  title,
  variant = 'default',
  onPress,
  className = '',
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center justify-center rounded-md px-6 py-3 ${
        variant === 'outlined'
          ? 'border border-green-800 bg-transparent'
          : 'bg-green-800'
      } ${className}`}
    >
      <Text
        className={`font-rubik text-sm ${
          variant === 'outlined' ? 'text-green-800' : 'text-white'
        }`}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default ActionButton;
