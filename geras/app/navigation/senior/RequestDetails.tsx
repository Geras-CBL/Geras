import React, { useState, useEffect } from 'react';
import { View, Image, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { InfoPill } from '@/components/shared/InfoPill';
import SectionTitle from '@/components/shared/SectionTitle';
import ContainerVoluntario from '@/components/shared/ContainerVolunteer';
import BottomActions from '@/components/senior/BottomActions';
import EvaluationTask from '@/components/shared/EvaluationTask';
import CommentBox from '@/components/shared/CommentBox';
import Button from '@/components/shared/Button';

type EvaluationTaskVariant =
  | 'sentiment_dissatisfied'
  | 'sentiment_neutral'
  | 'sentiment_satisfied';

// Configuração completa por tipo de pedido
const requestConfig: Record<
  string,
  { title: string; image: any; description: string }
> = {
  domestic: {
    title: 'Tarefa Doméstica',
    image: require('@/assets/images/domestic-tasks.png'),
    description:
      'O Sr. António precisa de auxílio para limpar o pó da sala. Ele sofre de mobilidade reduzida, não conseguindo realizar esta tarefa sozinho.',
  },
  food: {
    title: 'Pedido de Compras',
    image: require('@/assets/images/food.png'),
    description:
      'O Sr. António precisa de auxílio para fazer compras de alimentos essenciais.',
  },
  medicine: {
    title: 'Pedido de Farmácia',
    image: require('@/assets/images/medicine.png'),
    description:
      'O Sr. António precisa de auxílio para buscar medicamentos na farmácia.',
  },
};

export default function RequestDetails() {
  const { type } = useLocalSearchParams<{ type: string }>();
  const [observation, setObservation] = useState('');

  const requestType =
    type === 'food' || type === 'medicine' || type === 'domestic'
      ? type
      : 'domestic';

  // Pega a configuração do pedido atual
  const {
    title: requestTitle,
    image: requestImage,
    description: requestDescription,
  } = requestConfig[requestType];

  const volunteer = {
    name: 'Lucas William',
    age: 20,
    role: 'Estudante',
    avatarUri: undefined,
  };

  const [selectedVariant, setSelectedVariant] =
    useState<EvaluationTaskVariant | null>(null);

  // Status da tarefa: inProgress → complete
  const [taskStatus, setTaskStatus] = useState<'inProgress' | 'complete'>(
    'inProgress',
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setTaskStatus('complete');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Seleção/deseleção das avaliações
  const handlePress = (variant: EvaluationTaskVariant) => {
    if (selectedVariant === variant) {
      setSelectedVariant(null);
    } else {
      setSelectedVariant(variant);
    }
  };

  const isAnySelected = selectedVariant !== null;

  const handleSubmit = () => {
    console.log('Avaliação selecionada:', selectedVariant);
    console.log('Observação:', observation);
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: 180,
          paddingTop: 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-6">
          {/* Imagem do pedido */}
          <View className="mt-8 items-center">
            <Image
              source={requestImage}
              style={{ height: 90 }}
              resizeMode="contain"
            />
          </View>

          {/* Status da tarefa */}
          <View className="mb-4 mt-4 items-center justify-center gap-4 text-center">
            <ThemedText type="title">{requestTitle}</ThemedText>
            <ThemedText type="bodytitle">Estado da Tarefa</ThemedText>
            <InfoPill
              text={taskStatus === 'inProgress' ? 'Em progresso' : 'Completa'}
              variant={taskStatus === 'inProgress' ? 'secondary' : 'success'}
            />
          </View>

          {/* Descrição do pedido */}
          <SectionTitle title="Descrição do Pedido" />
          <ThemedText className="-mt-4 mb-4" type="body">
            {requestDescription}
          </ThemedText>

          {/* Voluntário */}
          <SectionTitle title="Voluntário" />
          <ContainerVoluntario
            name={volunteer.name}
            age={volunteer.age}
            role={volunteer.role}
            avatarUri={volunteer.avatarUri}
          />

          {/* Avaliação - só aparece se a tarefa estiver completa */}
          {taskStatus === 'complete' && (
            <>
              <ThemedText className="mt-4" type="title">
                Como correu a tarefa
              </ThemedText>
              <View className="-mt-2 mb-4 flex-row gap-4">
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
                    isAnySelected={isAnySelected}
                    onPress={() => handlePress(variant)}
                  />
                ))}
              </View>
            </>
          )}

          {/* Observação */}
          <SectionTitle title="Enviar Observação" />
          <CommentBox value={observation} onChangeText={setObservation} />

          {/* Botão Submeter */}
          {isAnySelected && (
            <Button title="Submeter" onPress={handleSubmit} className="mt-4" />
          )}
        </View>
      </ScrollView>

      {/* Bottom Actions fixo */}
      <BottomActions />
    </SafeAreaView>
  );
}
