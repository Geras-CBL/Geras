import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../ThemedText';

interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: 'default' | 'outlined' | 'destructive' | 'lineThrough';
  icon?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'default',
  icon,
  className = '',
  disabled = false,
}) => {
  const baseButtonStyles =
    'flex-row items-center justify-center rounded-xl py-4 px-6';

  const stylesMap = {
    default: {
      button: 'bg-primary',
      text: 'text-white font-regular',
    },
    outlined: {
      button: 'bg-neutralLight border border-[#e7e7e7] shadow-sm',
      text: 'text-neutral font-regular',
    },
    destructive: {
      button: 'bg-[#dcbfbb] border border-[#a20707]',
      text: 'text-[#a20707] font-bold',
    },
    lineThrough: {
      button: 'bg-primary',
      text: 'text-white font-regular line-through',
    },
  };

  const currentStyle = stylesMap[variant] || stylesMap.default;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      disabled={disabled}
      className={`${baseButtonStyles} ${currentStyle.button} ${className}`}
    >
      {icon && <View className="mr-3">{icon}</View>}

      <ThemedText className={`text-base capitalize ${currentStyle.text}`}>
        {title}
      </ThemedText>
    </TouchableOpacity>
  );
};

export default Button;
