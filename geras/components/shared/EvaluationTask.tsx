import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Pressable } from 'react-native';

type EvaluationTaskVariant =
  | 'sentiment_dissatisfied'
  | 'sentiment_neutral'
  | 'sentiment_satisfied';

interface EvaluationTaskProps {
  variant: EvaluationTaskVariant;
  selected: boolean; // botão atualmente selecionado
  isAnySelected: boolean; // se algum botão foi selecionado
  onPress: () => void;
}

const evaluationTaskSources: Record<EvaluationTaskVariant, any> = {
  sentiment_dissatisfied: 'emoticon-sad',
  sentiment_neutral: 'emoticon-neutral',
  sentiment_satisfied: 'emoticon-happy',
};

const backgroundColors: Record<EvaluationTaskVariant, string> = {
  sentiment_dissatisfied: 'bg-tertiary',
  sentiment_neutral: 'bg-secondary',
  sentiment_satisfied: 'bg-primary',
};

export default function EvaluationTask({
  variant,
  selected,
  isAnySelected,
  onPress,
}: Readonly<EvaluationTaskProps>) {
  const bgColor = backgroundColors[variant];

  let containerClasses = `${bgColor} h-20 w-20 rounded-xl flex items-center justify-center`;
  if (selected) {
    containerClasses = `${bgColor} h-20 w-20 rounded-xl flex items-center justify-center`;
  } else if (isAnySelected) {
    containerClasses = `${bgColor} h-20 w-20 rounded-xl flex items-center justify-center opacity-50`;
  }

  return (
    <Pressable onPress={onPress}>
      <View className={containerClasses}>
        <MaterialCommunityIcons
          name={evaluationTaskSources[variant]}
          size={40}
          color="#ffffff"
        />
      </View>
    </Pressable>
  );
}
