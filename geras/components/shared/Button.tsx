import { TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../ThemedText';

interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?:
    | 'default'
    | 'outlined'
    | 'destructive'
    | 'warning'
    | 'lineThrough'
    | 'transparent';
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
      button: 'bg-neutralLight border border-primary shadow-sm',
      text: 'text-primary font-regular',
    },
    destructive: {
      button: 'bg-[#dcbfbb] border border-[#a20707]',
      text: 'text-[#a20707] font-bold',
    },
    warning: {
      button: 'bg-secondary/10 border border-tertiary',
      text: 'text-tertiary font-regular',
    },
    lineThrough: {
      button: 'bg-primary',
      text: 'text-neutralLight font-regular line-through',
    },
    transparent: {
      button: 'bg-primary border-2 border-neutralLight bg-transparent',
      text: 'text-neutralLight font-extrabold',
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
