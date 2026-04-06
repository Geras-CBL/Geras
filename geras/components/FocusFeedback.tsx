import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from './ThemedText';

type FocusRingOverlayProps = {
  visible: boolean;
  ringWidth?: number;
  ringRadius?: number;
  ringColors?: [string, string];
  label?: string;
};

type FocusRingState = {
  isFocused: boolean;
  handleFocus: () => void;
  handleBlur: () => void;
  bindFocusHandlers: <T>(handlers?: {
    onFocus?: (event: T) => void;
    onBlur?: (event: T) => void;
  }) => {
    onFocus: (event: T) => void;
    onBlur: (event: T) => void;
  };
};

const DEFAULT_RING_COLORS: [string, string] = ['#a9e7bd', '#4d9966'];

export function useFocusRingFeedback(initialFocused = false): FocusRingState {
  const [isFocused, setIsFocused] = useState(initialFocused);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return {
    isFocused,
    handleFocus,
    handleBlur,
    bindFocusHandlers: <T,>(handlers?: {
      onFocus?: (event: T) => void;
      onBlur?: (event: T) => void;
    }) => ({
      onFocus: (event: T) => {
        handleFocus();
        handlers?.onFocus?.(event);
      },
      onBlur: (event: T) => {
        handleBlur();
        handlers?.onBlur?.(event);
      },
    }),
  };
}

export function FocusRingOverlay({
  visible,
  ringWidth = 3,
  ringRadius = 12,
  ringColors = DEFAULT_RING_COLORS,
  label,
}: FocusRingOverlayProps) {
  if (!visible) {
    return null;
  }

  return (
    <View
      pointerEvents="none"
      style={[
        StyleSheet.absoluteFillObject,
        styles.overlay,
        { borderRadius: ringRadius },
      ]}
    >
      <LinearGradient
        colors={ringColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          StyleSheet.absoluteFillObject,
          styles.gradient,
          { borderRadius: ringRadius },
        ]}
      />

      <View
        style={[
          StyleSheet.absoluteFillObject,
          styles.ring,
          {
            borderRadius: ringRadius,
            borderWidth: ringWidth,
            borderColor: ringColors[1],
          },
        ]}
      />

      {label ? (
        <View style={styles.labelContainer}>
          <ThemedText type="bodySmall" className="text-neutralLight">
            {label}
          </ThemedText>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    overflow: 'hidden',
    zIndex: 20,
  },
  gradient: {
    opacity: 0.14,
  },
  ring: {
    backgroundColor: 'transparent',
  },
  labelContainer: {
    position: 'absolute',
    top: -20,
    right: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: '#4d9966',
    zIndex: 21,
  },
});
