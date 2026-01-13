import { ThemedText } from '@/components/ThemedText';
import Container from '@/components/shared/Container';
import EvaluationTask from '@/components/shared/EvaluationTask';
import { InfoPill } from '@/components/shared/InfoPill';
import SectionTitle from '@/components/shared/SectionTitle';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
  Image,
  ScrollView,
  View,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const requestConfig: Record<
  string,
  { title: string; image: any; description: string }
> = {
  food: {
    title: 'Pedido de Compras',
    image: require('@/assets/images/food.png'),
    description:
      'Auxílio para realizar compras de alimentos essenciais.',
  },
  pharmacy: {
    title: 'Pedido de Farmácia',
    image: require('@/assets/images/medicine.png'),
    description:
      'Auxílio para buscar medicamentos na farmácia.',
  },
  cleaning: {
    title: 'Tarefa Doméstica',
    image: require('@/assets/images/domestic-tasks.png'),
    description:
      'Auxílio para realizar tarefas domésticas devido à mobilidade reduzida.',
  },
  other: {
    title: 'Pedido Personalizado',
    image: require('@/assets/images/domestic-tasks.png'),
    description:
      'Pedido personalizado que necessita de apoio.',
  },
};

export default function RequestDetails() {
  const { type } = useLocalSearchParams<{ type?: string }>();
  const requestType = type && requestConfig[type] ? type : 'other';

  const { title, image, description } = requestConfig[requestType];

  const volunteer = {
    name: 'Lucas Williams',
    age: 27,
    avatarUri: '',
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
          />
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="gap-6 px-6">
            <View className="items-center gap-4 pb-4">
              <ThemedText type="title">{title}</ThemedText>
              <InfoPill text="Completa" variant="success" />
            </View>

            <SectionTitle title="Descrição do Pedido" />
            <View className='-mt-4 pb-6'>
                <ThemedText type="body">{description}</ThemedText>
            </View>

            <SectionTitle title="Voluntári@" />
            <Container {...volunteer} />

            <View className='mt-6'>
                <ThemedText type="title">Classificação de António Silva</ThemedText>
            </View>

            <View className="items-start">
              <EvaluationTask
                variant="sentiment_satisfied"
                selected
                isAnySelected
                onPress={() => {}}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
