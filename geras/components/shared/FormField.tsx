import { Pressable, TextInput, View } from 'react-native';
import { ThemedText, styles as themedStyles } from '@/components/ThemedText';
import { MaterialIcons } from '@expo/vector-icons';
import {
  FocusRingOverlay,
  useFocusRingFeedback,
} from '@/components/FocusFeedback';

type FormFieldProps =
  | ({
      variant?: 'input';
      className?: string;
    } & React.ComponentProps<typeof TextInput>)
  | {
      variant: 'dropdown';
      value?: string;
      placeholder?: string;
      onPress: () => void;
      className?: string;
    };

export function FormField(props: FormFieldProps) {
  const dropdownFocus = useFocusRingFeedback();
  const inputFocus = useFocusRingFeedback();

  const baseContainerClasses = `
    w-full
    h-12      
    border
    border-neutral/15
    rounded-lg 
    px-6           
    justify-center
  `;

  const inputTextStyle = {
    flex: 1,
    fontFamily: themedStyles.body.fontFamily,
    fontSize: themedStyles.body.fontSize,
    lineHeight: themedStyles.body.lineHeight,
    color: 'text-neutral',
  };

  if (props.variant === 'dropdown') {
    const { value, placeholder = 'Selecionar', onPress, className } = props;

    return (
      <Pressable
        onPress={onPress}
        className="relative rounded-lg"
        accessible={true}
        focusable={true}
        {...dropdownFocus.bindFocusHandlers()}
      >
        <FocusRingOverlay
          visible={dropdownFocus.isFocused}
          ringWidth={2}
          ringRadius={8}
          label="Focus"
        />

        <View
          className={` ${baseContainerClasses} flex-row items-center justify-between ${className ?? ''} `}
        >
          <ThemedText
            type="body"
            className={value ? 'text-neutral' : 'text-neutral/40'}
          >
            {value ?? placeholder}
          </ThemedText>

          <MaterialIcons
            name="keyboard-arrow-down"
            size={20}
            className="text-neutral/60"
          />
        </View>
      </Pressable>
    );
  }

  const { className, ...inputProps } = props;

  return (
    <View className="relative">
      <FocusRingOverlay
        visible={inputFocus.isFocused}
        ringWidth={2}
        ringRadius={8}
        label="Focado"
      />

      <View className={`${baseContainerClasses} ${className ?? ''}`}>
        <TextInput
          style={inputTextStyle}
          placeholderTextColor="rgba(29,29,27,0.4)"
          onFocus={(e) => {
            inputFocus.handleFocus();
            inputProps.onFocus?.(e);
          }}
          onBlur={(e) => {
            inputFocus.handleBlur();
            inputProps.onBlur?.(e);
          }}
          {...inputProps}
        />
      </View>
    </View>
  );
}
