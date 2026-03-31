import React, { forwardRef, useState } from 'react';
import {
  Pressable,
  PressableProps,
  PressableStateCallbackType,
  View,
  StyleProp,
  ViewStyle,
} from 'react-native';

type ThemedPressableState = PressableStateCallbackType & { focused?: boolean };

export interface ThemedPressableProps extends Omit<
  PressableProps,
  'style' | 'children'
> {
  className?: string;
  style?:
    | StyleProp<ViewStyle>
    | ((state: ThemedPressableState) => StyleProp<ViewStyle>);
  children?:
    | React.ReactNode
    | ((state: ThemedPressableState) => React.ReactNode);
}

export const ThemedPressable = forwardRef<View, ThemedPressableProps>(
  ({ className = '', style, children, onFocus, onBlur, ...rest }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <Pressable
        ref={ref}
        className={`outline-none ${className}`}
        onFocus={(e) => {
          setIsFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          onBlur?.(e);
        }}
        style={(state: ThemedPressableState) => {
          const focused = isFocused || (state.focused ?? false);
          const styleArray = [
            { borderWidth: 4, borderColor: 'transparent' },
            focused && { borderColor: '#32e850' },
            state.pressed && { opacity: 0.8 },
          ];

          const computedStyle =
            typeof style === 'function' ? style({ ...state, focused }) : style;

          return [...styleArray, computedStyle];
        }}
        {...rest}
      >
        {typeof children === 'function'
          ? (state: ThemedPressableState) => {
              const focused = isFocused || (state.focused ?? false);
              return children({ ...state, focused });
            }
          : children}
      </Pressable>
    );
  },
);

ThemedPressable.displayName = 'ThemedPressable';
