import { ThemedText } from '@/components/ThemedText';
import BottomActions from '@/components/senior/BottomActions';
import Button from '@/components/shared/Button';
import CommentBox from '@/components/shared/CommentBox';
import ContainerVoluntario from '@/components/shared/ContainerVolunteer';
import EvaluationTask from '@/components/shared/EvaluationTask';
import { InfoPill } from '@/components/shared/InfoPill';
import SectionTitle from '@/components/shared/SectionTitle';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  View,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type EvaluationTaskVariant =
  | 'sentiment_dissatisfied'
  | 'sentiment_neutral'
  | 'sentiment_satisfied';

const requestConfig: Record<
  string,
  //Alterenative text (Colocar alt a seguir a descriçãos)
  { title: string; image: any; description: string, alt?: string }
> = {
  food: {
    title: 'Pedido de Compras',
    image: require('@/assets/images/food.png'),
    description:
      'O Sr. António precisa de auxílio para realizar compras de alimentos essenciais.',
    alt: 'Imagem de alimentos',
  },
  pharmacy: {
    title: 'Pedido de Farmácia',
    image: require('@/assets/images/medicine.png'),
    description:
      'O Sr. António precisa de auxílio para buscar medicamentos na farmácia.',
    alt: 'Imagem de medicamentos',  
  },
  cleaning: {
    title: 'Tarefa Doméstica',
    image: require('@/assets/images/domestic-tasks.png'),
    description:
      'O Sr. António precisa de ajuda para realizar tarefas domésticas devido à sua mobilidade reduzida.',
    alt: 'Imagem de tarefas domésticas',
  },
  other: {
    title: 'Pedido Personalizado',
    image: require('@/assets/images/domestic-tasks.png'),
    description:
      'O Sr. António realizou um pedido personalizado que necessita de apoio.',
    alt: 'Imagem de pedido personalizado',
  },
};

export default function RequestDetails() {
  const { type } = useLocalSearchParams<{ type?: string }>();
  const requestType = type && requestConfig[type] ? type : 'other';

  const { title, image, description, alt } = requestConfig[requestType];

  const [taskStatus, setTaskStatus] = useState<'inProgress' | 'complete'>(
    'inProgress',
  );

  const [selectedVariant, setSelectedVariant] =
    useState<EvaluationTaskVariant | null>(null);

  const [observation, setObservation] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setTaskStatus('complete');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const volunteer = {
    name: 'Lucas William',
    age: 20,
    role: 'Estudante',
    avatarUri: undefined,
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 pt-20">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <View className="w-full px-6 pb-6">
          <Image
            source={image}
            resizeMode="cover"
            className="h-36 w-full rounded-2xl"
            accessible={true}
            accessibilityRole="image"
            accessibilityLabel={alt}
          />
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 180 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="gap-6 px-6">
            <View className="items-center gap-4">
              <ThemedText type="title">{title}</ThemedText>
              <InfoPill
                text={taskStatus === 'inProgress' ? 'Em progresso' : 'Completa'}
                variant={taskStatus === 'inProgress' ? 'secondary' : 'success'}
              />
            </View>

            <SectionTitle title="Descrição do Pedido" />
            <ThemedText type="body">{description}</ThemedText>

            <SectionTitle title="Voluntário" />
            <ContainerVoluntario {...volunteer} />

            {taskStatus === 'complete' && (
              <>
                <ThemedText type="title">Como Correu A Tarefa</ThemedText>

                <View className="flex-row gap-4">
                  {(
                    [
                      'sentiment_dissatisfied',
                      'sentiment_neutral',
                      'sentiment_satisfied',
                    ] as EvaluationTaskVariant[]
                  ).map((variant) => (
                    <EvaluationTask
                      key={variant}
                      variant={variant}
                      selected={selectedVariant === variant}
                      isAnySelected={!!selectedVariant}
                      onPress={() =>
                        setSelectedVariant(
                          selectedVariant === variant ? null : variant,
                        )
                      }
                    />
                  ))}
                </View>
              </>
            )}

            <SectionTitle title="Enviar Observação" />
            <CommentBox value={observation} onChangeText={setObservation} />

            {selectedVariant && (
              <Button
                title="Submeter"
                className="mt-4"
                onPress={() => console.log(selectedVariant, observation)}
              />
            )}
          </View>
        </ScrollView>

        {/* FIXO NO FUNDO */}
      </KeyboardAvoidingView>
      <BottomActions />
    </SafeAreaView>
  );
}
