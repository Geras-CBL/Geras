import { MaterialIcons } from '@expo/vector-icons';
import { Route, useRouter } from 'expo-router';
import { Pressable } from 'react-native';
import { ThemedText } from '../ThemedText';
import { FocusFeedbackWrapper, useFocusRingFeedback } from '../FocusFeedback';

interface BigButtonProps {
  iconName: keyof typeof MaterialIcons.glyphMap;
  label: string;
  route?: string;
  onPress?: () => void;
  nextFocusForward?: number;
  nextFocusDown?: number;
}

const BigButton = ({
  iconName,
  label,
  route,
  onPress,
  nextFocusForward,
  nextFocusDown,
}: BigButtonProps) => {
  const router = useRouter();
  const focusRing = useFocusRingFeedback({
    nextFocusForward,
    nextFocusDown,
  });

  return (
    <FocusFeedbackWrapper
      isFocused={focusRing.isFocused}
      style={{ height: '100%', width: '100%' }}
      useExperimentalOutline={false}
    >
      <Pressable
        className="h-full w-full items-center justify-center gap-4 rounded-2xl bg-primary"
        {...focusRing.bindFocusHandlers()}
        accessible={true}
        focusable={true}
        importantForAccessibility="yes"
        onPress={() => {
          if (route) router.push(route as Route);
          onPress?.();
        }}
      >
        <MaterialIcons name={iconName} size={80} color="#fbfbfb" />
        <ThemedText type="bigButton" className="text-neutralLight">
          {label}
        </ThemedText>
      </Pressable>
    </FocusFeedbackWrapper>
  );
};

export default BigButton;
