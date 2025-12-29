import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../ThemedText';

interface ButtonComponentProps {
  title: string;
  onPress?: () => void;
  variant?: 'default' | 'withIcon' | 'outlined' | 'destructive' | 'lineThrough';
  icon?: React.ReactNode;
  className?: string;
}

const ButtonComponent: React.FC<ButtonComponentProps> = ({
  title,
  onPress,
  variant = 'default',
  icon,
  className = '',
}) => {
  const variantStyles: Record<string, string> = {
    default: 'bg-[#205a2d] rounded-xl py-4 px-16',
    withIcon:
      'bg-[#205a2d] rounded-xl py-4 px-6 flex-row items-center justify-center space-x-4',
    outlined:
      'bg-[#fbfbfb] border border-[#e7e7e7] rounded-xl py-4 px-16 shadow-md',
    destructive: 'bg-[#dcbfbb] border border-[#a20707] rounded-xl py-4 px-16',
    lineThrough: 'bg-[#205a2d] rounded-xl py-4 px-16',
  };

  const textVariantStyles: Record<string, string> = {
    default: 'text-white text-base font-regular capitalize',
    withIcon: 'text-white text-base font-regular capitalize',
    outlined: 'text-[#1d1d1b] text-base font-regular capitalize',
    destructive: 'text-[#a20707] text-base font-medium capitalize',
    lineThrough: 'text-white text-base font-regular capitalize line-through',
  };

  return (
    <View className="mt-4 w-full">
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        className={`${variantStyles[variant]} ${className} items-center justify-center`}
      >
        {icon && <View className="mr-2">{icon}</View>}
        <ThemedText className={textVariantStyles[variant]}>{title}</ThemedText>
      </TouchableOpacity>
    </View>
  );
};

export default ButtonComponent;
