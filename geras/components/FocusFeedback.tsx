import { useState, type ReactNode } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Pressable,
  StyleSheet,
  View,
  type ColorValue,
  type PressableProps,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from 'react-native';
import { ThemedText } from './ThemedText';

type FocusRingOverlayProps = {
  visible: boolean;
  ringWidth?: number;
  ringRadius?: number;
  ringColors?: [string, string];
  label?: string;
};

type FocusNavigationProps = {
  nextFocusForward?: number;
  nextFocusDown?: number;
  nextFocusUp?: number;
  nextFocusLeft?: number;
  nextFocusRight?: number;
};

type UseFocusRingFeedbackOptions = FocusNavigationProps & {
  initialFocused?: boolean;
  accessible?: boolean;
  focusable?: boolean;
  importantForAccessibility?: ViewProps['importantForAccessibility'];
};

type FocusA11yProps = FocusNavigationProps & {
  accessible?: boolean;
  focusable?: boolean;
  importantForAccessibility?: ViewProps['importantForAccessibility'];
};

type FocusableProps<T> = FocusA11yProps & {
  onFocus: (event: T) => void;
  onBlur: (event: T) => void;
};

type InteractiveProps<TFocus, TPress> = FocusableProps<TFocus> & {
  onPressIn: (event: TPress) => void;
  onPressOut: (event: TPress) => void;
};

type FocusRingState = {
  isFocused: boolean;
  handleFocus: () => void;
  handleBlur: () => void;
  handlePressIn: () => void;
  handlePressOut: () => void;
  getA11yProps: (options?: {
    includeFocusable?: boolean;
    includeAccessible?: boolean;
  }) => FocusA11yProps;
  bindFocusEvents: <T>(handlers?: {
    onFocus?: (event: T) => void;
    onBlur?: (event: T) => void;
  }) => Pick<FocusableProps<T>, 'onFocus' | 'onBlur'>;
  bindInteractiveEvents: <TFocus, TPress>(handlers?: {
    onFocus?: (event: TFocus) => void;
    onBlur?: (event: TFocus) => void;
    onPressIn?: (event: TPress) => void;
    onPressOut?: (event: TPress) => void;
  }) => Pick<
    InteractiveProps<TFocus, TPress>,
    'onFocus' | 'onBlur' | 'onPressIn' | 'onPressOut'
  >;
  focusableProps: FocusableProps<unknown>;
  interactiveProps: InteractiveProps<unknown, unknown>;
  bindFocusHandlers: <T>(handlers?: {
    onFocus?: (event: T) => void;
    onBlur?: (event: T) => void;
  }) => FocusableProps<T>;
  bindInteractiveHandlers: <TFocus, TPress>(handlers?: {
    onFocus?: (event: TFocus) => void;
    onBlur?: (event: TFocus) => void;
    onPressIn?: (event: TPress) => void;
    onPressOut?: (event: TPress) => void;
  }) => InteractiveProps<TFocus, TPress>;
};

type FocusFeedbackWrapperProps = {
  isFocused: boolean;
  children: ReactNode;
  ringWidth?: number;
  ringRadius?: number;
  ringColors?: [string, string];
  label?: string;
  style?: StyleProp<ViewStyle>;
  useExperimentalOutline?: boolean;
  outlineColor?: ColorValue;
  outlineWidth?: number;
};

type FocusablePressableWrapperProps = Omit<PressableProps, 'children'> & {
  label: string;
  ringRadius?: number;
  ringWidth?: number;
  ringColors?: [string, string];
  focusOptions?: UseFocusRingFeedbackOptions;
};

const DEFAULT_RING_COLORS: [string, string] = ['#a9e7bd4b', '#09ae40'];

const DEFAULT_IMPORTANT_FOR_ACCESSIBILITY: ViewProps['importantForAccessibility'] =
  'yes';

export function useFocusRingFeedback(
  options: UseFocusRingFeedbackOptions | boolean = false,
): FocusRingState {
  const resolvedOptions: UseFocusRingFeedbackOptions =
    typeof options === 'boolean' ? { initialFocused: options } : options;

  const {
    initialFocused = false,
    accessible = true,
    focusable = true,
    importantForAccessibility = DEFAULT_IMPORTANT_FOR_ACCESSIBILITY,
    nextFocusForward,
    nextFocusDown,
    nextFocusUp,
    nextFocusLeft,
    nextFocusRight,
  } = resolvedOptions;

  const navigationProps: FocusNavigationProps = {
    nextFocusForward,
    nextFocusDown,
    nextFocusUp,
    nextFocusLeft,
    nextFocusRight,
  };

  const [isFocused, setIsFocused] = useState(initialFocused);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  const handlePressIn = () => {};
  const handlePressOut = () => {};

  const getA11yProps = (
    a11yOptions: {
      includeFocusable?: boolean;
      includeAccessible?: boolean;
    } = {},
  ): FocusA11yProps => {
    const { includeFocusable = true, includeAccessible = true } = a11yOptions;

    return {
      ...(includeAccessible ? { accessible } : {}),
      ...(includeFocusable ? { focusable } : {}),
      importantForAccessibility,
      ...navigationProps,
    };
  };

  const bindFocusEvents = <T,>(handlers?: {
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
  });

  const bindInteractiveEvents = <TFocus, TPress>(handlers?: {
    onFocus?: (event: TFocus) => void;
    onBlur?: (event: TFocus) => void;
    onPressIn?: (event: TPress) => void;
    onPressOut?: (event: TPress) => void;
  }) => ({
    onFocus: (event: TFocus) => {
      handleFocus();
      handlers?.onFocus?.(event);
    },
    onBlur: (event: TFocus) => {
      handleBlur();
      handlers?.onBlur?.(event);
    },
    onPressIn: (event: TPress) => {
      handlePressIn();
      handlers?.onPressIn?.(event);
    },
    onPressOut: (event: TPress) => {
      handlePressOut();
      handlers?.onPressOut?.(event);
    },
  });

  return {
    isFocused,
    handleFocus,
    handleBlur,
    handlePressIn,
    handlePressOut,
    getA11yProps,
    bindFocusEvents,
    bindInteractiveEvents,
    focusableProps: {
      ...getA11yProps(),
      ...bindFocusEvents(),
    },
    interactiveProps: {
      ...getA11yProps(),
      ...bindInteractiveEvents(),
    },
    bindFocusHandlers: <T,>(handlers?: {
      onFocus?: (event: T) => void;
      onBlur?: (event: T) => void;
    }) => ({
      ...getA11yProps(),
      ...bindFocusEvents(handlers),
    }),
    bindInteractiveHandlers: <TFocus, TPress>(handlers?: {
      onFocus?: (event: TFocus) => void;
      onBlur?: (event: TFocus) => void;
      onPressIn?: (event: TPress) => void;
      onPressOut?: (event: TPress) => void;
    }) => ({
      ...getA11yProps(),
      ...bindInteractiveEvents(handlers),
    }),
  };
}

export function FocusFeedbackWrapper({
  isFocused,
  children,
  ringWidth = 3,
  ringRadius = 12,
  ringColors = DEFAULT_RING_COLORS,
  label,
  style,
  useExperimentalOutline = false,
  outlineColor,
  outlineWidth = 2,
}: FocusFeedbackWrapperProps) {
  const experimentalOutlineStyle = useExperimentalOutline
    ? ({
        outlineColor: outlineColor ?? ringColors[1],
        outlineWidth,
        outlineStyle: 'solid',
      } as ViewStyle)
    : null;

  return (
    <View
      style={[
        styles.wrapper,
        { borderRadius: ringRadius },
        experimentalOutlineStyle,
        style,
      ]}
    >
      <FocusRingOverlay
        visible={isFocused}
        ringWidth={ringWidth}
        ringRadius={ringRadius}
        ringColors={ringColors}
        label={label}
      />
      {children}
    </View>
  );
}

export function FocusablePressableWrapper({
  label,
  ringRadius = 12,
  ringWidth = 3,
  ringColors = DEFAULT_RING_COLORS,
  focusOptions,
  style,
  ...pressableProps
}: FocusablePressableWrapperProps) {
  const focusRing = useFocusRingFeedback(focusOptions);
  const mergedPressableStyle: PressableProps['style'] = (state) => {
    const resolvedStyle = typeof style === 'function' ? style(state) : style;

    return [styles.pressableBase, resolvedStyle];
  };

  return (
    <FocusFeedbackWrapper
      isFocused={focusRing.isFocused}
      ringRadius={ringRadius}
      ringWidth={ringWidth}
      ringColors={ringColors}
      label={focusRing.isFocused ? 'Foco por teclado' : undefined}
    >
      <Pressable
        style={mergedPressableStyle}
        {...focusRing.bindInteractiveHandlers({
          onFocus: pressableProps.onFocus ?? undefined,
          onBlur: pressableProps.onBlur ?? undefined,
          onPressIn: pressableProps.onPressIn ?? undefined,
          onPressOut: pressableProps.onPressOut ?? undefined,
        })}
        {...pressableProps}
      >
        <ThemedText type="bodyBold" style={styles.exampleLabel}>
          {label}
        </ThemedText>
      </Pressable>
    </FocusFeedbackWrapper>
  );
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
  wrapper: {
    position: 'relative',
    overflow: 'visible',
  },
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
  pressableBase: {
    minHeight: 48,
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#0db316',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  exampleLabel: {
    color: '#fbfbfb',
  },
});

/*
Estrutura de integração do FocusFeedback

1) Padrão base para qualquer componente interativo
   - cria o hook no topo do componente
   - usa FocusFeedbackWrapper para desenhar o anel sem layout shift
   - espalha bindFocusHandlers ou bindInteractiveHandlers no elemento que recebe foco

   const focusRing = useFocusRingFeedback({
     nextFocusForward,
     nextFocusDown,
   });

   return (
     <FocusFeedbackWrapper isFocused={focusRing.isFocused} ringRadius={12}>
       <Pressable
         {...focusRing.bindFocusHandlers()}
         accessible={true}
         focusable={true}
         accessibilityRole="button"
       >
         ...conteúdo...
       </Pressable>
     </FocusFeedbackWrapper>
   );

2) Quando o componente já é focável nativamente
   - TextInput, Pressable, TouchableOpacity e alguns componentes customizados já emitem onFocus/onBlur
   - não precisas de os converter obrigatoriamente para Pressable
   - basta ligar os handlers certos e manter accessible/focusable

   const focusRing = useFocusRingFeedback();

   return (
     <FocusFeedbackWrapper isFocused={focusRing.isFocused} ringRadius={10}>
       <TextInput
         {...focusRing.bindFocusHandlers({
           onFocus: props.onFocus,
           onBlur: props.onBlur,
         })}
         accessible={true}
         focusable={true}
       />
     </FocusFeedbackWrapper>
   );

3) Quando o elemento visual não suporta foco diretamente
   - usa um contentor focável por fora e deixa o conteúdo interno livre
   - útil para View, Image, Card, ícones, badges ou layouts compostos

   const focusRing = useFocusRingFeedback();

   return (
     <FocusFeedbackWrapper isFocused={focusRing.isFocused} ringRadius={16}>
       <Pressable
         {...focusRing.bindFocusHandlers()}
         accessible={true}
         focusable={true}
         accessibilityRole="button"
       >
         <View>...</View>
       </Pressable>
     </FocusFeedbackWrapper>
   );

4) Se precisares de foco + press para um componente realmente interativo
   - usa bindInteractiveHandlers
   - mas, como aqui o foco é pensado para teclado/acessibilidade, o feedback visual deve continuar a depender apenas de onFocus/onBlur
   - o press pode continuar a existir para comportamento funcional, sem acender o anel por toque

5) Ordem de navegação por teclado
   - nextFocusForward, nextFocusDown, nextFocusUp, nextFocusLeft e nextFocusRight podem ser passados ao hook
   - isso ajuda a controlar a sequência em layouts complexos sem mexer nas páginas existentes

   const focusRing = useFocusRingFeedback({
     nextFocusForward: nextRef,
     nextFocusDown: downRef,
   });

Nota prática
   - se um componente aceitar onFocus/onBlur, o hook pode ser aplicado sem mudar a página inteira
   - se não aceitar, envolve-o num Pressable ou num contentor focável e liga o hook ao elemento exterior
*/
