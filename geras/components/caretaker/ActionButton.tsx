import * as React from 'react';
import { TouchableOpacity } from 'react-native';
import { ThemedText } from '../ThemedText';

type ActionButtonProps = {
  title: string;
  variant?: 'outlined' | 'default';
  onPress?: () => void;
  className?: string; // permite passar classes externas
  accessibilityLabel?: string;
  accessibilityHint?: string;
};

const ActionButton: React.FC<ActionButtonProps> = ({
  title,
  variant = 'default',
  onPress,
  className = '',
  accessibilityLabel,
  accessibilityHint,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityHint={accessibilityHint}
      className={`flex-row items-center justify-center rounded-md px-6 py-3 ${
        variant === 'outlined'
          ? 'border border-green-800 bg-transparent'
          : 'bg-green-800'
      } ${className}`}
    >
      <ThemedText
        type="bodyInfo"
        className={`font-rubik text-sm ${
          variant === 'outlined' ? 'text-green-800' : 'text-white'
        }`}
      >
        {title}
      </ThemedText>
    </TouchableOpacity>
  );
};

export default ActionButton;
