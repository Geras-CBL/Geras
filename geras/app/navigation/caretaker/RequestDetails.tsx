import { supabase } from '@/lib/supabase';
import { ThemedText } from '@/components/ThemedText';
import Container from '@/components/shared/Container';
import EvaluationTask from '@/components/shared/EvaluationTask';
import { InfoPill } from '@/components/shared/InfoPill';
import SectionTitle from '@/components/shared/SectionTitle';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  View,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Button from '@/components/shared/Button';
import { SafeAreaView } from 'react-native-safe-area-context';

const requestConfig: Record<
  string,
  { title: string; image: any; description: string; alt: string }
> = {
  food: {
    title: 'Pedido de Compras',
    image: require('@/assets/images/food.png'),
    description: 'Auxílio para realizar compras de alimentos essenciais.',
    alt: 'Imagem ilustrativa de compras de alimentos',
  },
  pharmacy: {
    title: 'Pedido de Farmácia',
    image: require('@/assets/images/medicine.png'),
    description: 'Auxílio para buscar medicamentos na farmácia.',
    alt: 'Imagem ilustrativa de medicamentos',
  },
  cleaning: {
    title: 'Tarefa Doméstica',
    image: require('@/assets/images/domestic-tasks.png'),
    description:
      'Auxílio para realizar tarefas domésticas devido à mobilidade reduzida.',
    alt: 'Imagem ilustrativa de tarefas domésticas',
  },
  other: {
    title: 'Pedido Personalizado',
    image: require('@/assets/images/domestic-tasks.png'),
    description: 'Pedido personalizado que necessita de apoio.',
    alt: 'Imagem ilustrativa de ajuda doméstica',
  },
};

export default function RequestDetails() {
  const router = useRouter();
  const { type, requestId } = useLocalSearchParams<{
    type?: string;
    requestId?: string;
  }>();
  const requestType = type && requestConfig[type] ? type : 'other';
  const { title, image, alt } = requestConfig[requestType];

  const [loading, setLoading] = useState(true);
  const [requestData, setRequestData] = useState<any>(null);
  const [senior, setSenior] = useState<{
    name: string;
    local: string;
    avatarUri: string;
  } | null>(null);

  useEffect(() => {
    async function fetchDetails() {
      if (!requestId) return;
      try {
        const { data, error } = await supabase
          .from('requests')
          .select('*, senior:users!id_senior(*)')
          .eq('id', requestId)
          .single();

        if (error) throw error;
        if (data) {
          setRequestData(data);
          if (data.senior) {
            setSenior({
              name: data.senior.name,
              local: data.senior.local || 'Local não especificado',
              avatarUri: data.senior.profile_picture || '',
            });
          }
        }
      } catch (err) {
        console.error('Error fetching request details:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [requestId]);

  const handleComplete = () => {
    Alert.alert('Concluir Tarefa', 'Tem a certeza que concluiu esta tarefa?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Concluir',
        style: 'default',
        onPress: async () => {
          try {
            if (!requestId) return;
            const { error } = await supabase
              .from('requests')
              .update({ state: 'COMPLETED' })
              .eq('id', requestId);

            if (error) throw error;
            Alert.alert('Sucesso', 'Tarefa marcada como concluída!');
            router.back();
          } catch (err) {
            console.error('Error completing request:', err);
            Alert.alert('Erro', 'Não foi possível concluir a tarefa.');
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#205a2d" />
      </View>
    );
  }

  return (
    <SafeAreaView edges={['top']} className="flex-1 pt-20">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <View className="w-full px-6 pb-6 pt-4">
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
          contentContainerStyle={{ paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="gap-6 px-6">
            <View className="items-center gap-4 pb-4">
              <ThemedText type="title">{title}</ThemedText>
              <InfoPill
                text={
                  requestData?.state === 'PENDING'
                    ? 'Pendente'
                    : requestData?.state === 'ACCEPTED'
                      ? 'Em progresso'
                      : 'Concluído'
                }
                variant={
                  requestData?.state === 'PENDING' ? 'secondary' : 'success'
                }
              />
            </View>

            <SectionTitle title="Descrição do Pedido" />
            <View className="-mt-4 pb-6">
              <ThemedText type="body">
                {senior?.name
                  ? `O/A Sr(a). ${senior.name.split(' ')[0]}`
                  : 'O sénior'}{' '}
                precisa de ajuda com {title.toLowerCase()}.
                {requestData?.description
                  ? `\nPedido do sénior: "${requestData.description}"`
                  : ''}
              </ThemedText>
            </View>

            <SectionTitle title="Sénior" />
            {senior && (
              <Container
                name={senior.name}
                age={0}
                role={senior.local}
                avatarUri={senior.avatarUri}
              />
            )}

            {requestData?.state === 'COMPLETED' && (
              <>
                <View className="mt-6">
                  <ThemedText type="title">
                    Classificação de {senior?.name}
                  </ThemedText>
                </View>

                <View className="items-start">
                  <EvaluationTask
                    variant="sentiment_satisfied"
                    selected
                    isAnySelected
                    onPress={() => {}}
                  />
                </View>
              </>
            )}
          </View>
        </ScrollView>
        {requestData?.state === 'ACCEPTED' && (
          <View className="absolute bottom-0 w-full border-t border-gray-100 bg-white px-6 pb-8 pt-4 shadow-xl">
            <Button
              title="Concluir Tarefa"
              variant="default"
              className="bg-primary"
              onPress={handleComplete}
            />
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
