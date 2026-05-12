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
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type EvaluationTaskVariant =
  | 'sentiment_dissatisfied'
  | 'sentiment_neutral'
  | 'sentiment_satisfied';

const requestConfig: Record<
  string,
  //Alterenative text (Colocar alt a seguir a descriçãos)
  { title: string; image: any; description: string; alt?: string }
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

import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

export default function RequestDetails() {
  const { profile } = useAuth();
  const { type, requestId } = useLocalSearchParams<{
    type?: string;
    requestId?: string;
  }>();
  const requestType = type && requestConfig[type] ? type : 'other';

  const { title, image, alt } = requestConfig[requestType];

  const [taskStatus, setTaskStatus] = useState<'inProgress' | 'complete'>(
    'inProgress',
  );

  const [selectedVariant, setSelectedVariant] =
    useState<EvaluationTaskVariant | null>(null);

  const [observation, setObservation] = useState('');
  const [dbDescription, setDbDescription] = useState('');

  const [caretaker, setCaretaker] = useState<{
    name: string;
    role: string;
    profile_picture?: string;
  } | null>(null);

  useEffect(() => {
    if (!requestId) return;

    async function checkStatus() {
      try {
        const { data, error } = await supabase
          .from('requests')
          .select('*, caretaker:users!id_caretaker(*)')
          .eq('id', requestId)
          .single();

        if (error) throw error;
        if (data) {
          if (data.description) {
            setDbDescription(data.description);
          }
          if (data.state !== 'PENDING') {
            setTaskStatus('complete');
          }
          if (data.caretaker) {
            setCaretaker({
              name: data.caretaker.name,
              role: 'Cuidador',
              profile_picture: data.caretaker.profile_picture,
            });
          }
        }
      } catch (err) {
        console.error('Error checking request status:', err);
      }
    }

    checkStatus();
    const interval = setInterval(checkStatus, 5000);

    return () => clearInterval(interval);
  }, [requestId]);

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
              <View
                accessible={true}
                accessibilityLabel={`Estado da tarefa: ${
                  taskStatus === 'inProgress' ? 'Em progresso' : 'Completa'
                }`}
              >
                <InfoPill
                  text={
                    taskStatus === 'inProgress' ? 'Em progresso' : 'Completa'
                  }
                  variant={
                    taskStatus === 'inProgress' ? 'secondary' : 'success'
                  }
                />
              </View>
            </View>

            <SectionTitle title="Descrição do Pedido" />
            <ThemedText type="body">
              {profile?.name
                ? `O/A Sr(a). ${profile.name.split(' ')[0]}`
                : 'O sénior'}{' '}
              precisa de ajuda com {title.toLowerCase()}. É pedido:
              {dbDescription ? ` ${dbDescription}` : ''}
            </ThemedText>

            <SectionTitle title="Cuidador" />

            {caretaker ? (
              <View
                accessible={true}
                accessibilityRole="text"
                accessibilityLabel={`Cuidador atribuído: ${caretaker.name}`}
              >
                <ContainerVoluntario
                  name={caretaker.name}
                  role={caretaker.role}
                  avatarUri={caretaker.profile_picture}
                />
              </View>
            ) : (
              <ThemedText type="bodySmall" className="text-gray-400">
                A aguardar atribuição...
              </ThemedText>
            )}

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

            <View
              accessible={true}
              accessibilityLabel="Caixa de texto para escrever uma observação sobre a tarefa"
            >
              <CommentBox value={observation} onChangeText={setObservation} />
            </View>

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
