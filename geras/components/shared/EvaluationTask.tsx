import * as React from 'react';
import { Image, View, Pressable } from 'react-native';

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
  sentiment_dissatisfied: require('../../assets/images/sentiment_dissatisfied.png'),
  sentiment_neutral: require('../../assets/images/sentiment_neutral.png'),
  sentiment_satisfied: require('../../assets/images/sentiment_satisfied.png'),
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
}: EvaluationTaskProps) {
  const bgColor = backgroundColors[variant];

  // Se algum botão estiver selecionado, diminui a opacidade dos não selecionados
  const containerClasses = selected
    ? `${bgColor} h-20 w-20 rounded-xl flex items-center justify-center`
    : isAnySelected
      ? `${bgColor} h-20 w-20 rounded-xl flex items-center justify-center opacity-50`
      : `${bgColor} h-20 w-20 rounded-xl flex items-center justify-center`; // nenhum selecionado inicialmente

  return (
    <Pressable onPress={onPress}>
      <View className={containerClasses}>
        <Image
          source={evaluationTaskSources[variant]}
          resizeMode="contain"
          className="h-10 w-10"
        />
      </View>
    </Pressable>
  );
}
