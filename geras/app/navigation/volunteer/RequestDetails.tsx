import { ThemedText } from '@/components/ThemedText';
import Button from '@/components/shared/Button';
import CommentBox from '@/components/shared/CommentBox';
import EvaluationTask from '@/components/shared/EvaluationTask';
import { InfoPill } from '@/components/shared/InfoPill';
import SectionTitle from '@/components/shared/SectionTitle';
import { useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect, useCallback } from 'react';
import {
  Image,
  ScrollView,
  View,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { router } from 'expo-router';

type EvaluationTaskVariant =
  | 'sentiment_dissatisfied'
  | 'sentiment_neutral'
  | 'sentiment_satisfied';

const requestConfig: Record<
  string,
  { title: string; image: any; alt?: string }
> = {
  food: {
    title: 'Pedido de Compras',
    image: require('@/assets/images/food.png'),
    alt: 'Imagem que representa um pedido de compras, com saco de supermercado',
  },
  pharmacy: {
    title: 'Pedido de Farmácia',
    image: require('@/assets/images/medicine.png'),
    alt: 'Imagem que representa um pedido de farmácia, com uma caixa de remédios',
  },
  cleaning: {
    title: 'Tarefa Doméstica',
    image: require('@/assets/images/domestic-tasks.png'),
    alt: 'Imagem que representa uma tarefa doméstica, com um balde e uma vassoura',
  },
  other: {
    title: 'Pedido Personalizado',
    image: require('@/assets/images/domestic-tasks.png'),
    alt: 'Imagem que representa um pedido personalizado',
  },
};

export default function RequestDetails() {
  const { type, requestId } = useLocalSearchParams<{
    type?: string;
    requestId?: string;
  }>();
  const { profile } = useAuth();
  const requestType = type && requestConfig[type] ? type : 'other';
  const { title, image, alt } = requestConfig[requestType];

  const [loading, setLoading] = useState(true);
  const [requestData, setRequestData] = useState<any>(null);

  const [selectedVariant, setSelectedVariant] =
    useState<EvaluationTaskVariant | null>(null);
  const [observation, setObservation] = useState('');
  const [hasEvaluated, setHasEvaluated] = useState(false);

  const fetchRequestDetails = useCallback(async () => {
    if (!requestId) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('requests')
        .select(
          '*, senior:users!id_senior(id, name, gender, profile_picture, local), evaluations(*)',
        )
        .eq('id', requestId)
        .maybeSingle();

      if (error) throw error;
      setRequestData(data);

      // Verificar se já existe uma avaliação do voluntário atual
      const myEvaluation = data?.evaluations?.find(
        (ev: any) => ev.id_volunteer === profile?.id,
      );

      if (myEvaluation) {
        const rateToVariant: Record<string, EvaluationTaskVariant> = {
          SATISFIED: 'sentiment_satisfied',
          NEUTRAL: 'sentiment_neutral',
          DISSATISFIED: 'sentiment_dissatisfied',
        };
        setSelectedVariant(rateToVariant[myEvaluation.evaluation]);
        setObservation(myEvaluation.description || '');
        setHasEvaluated(true);
      }
    } catch (err) {
      console.error('Error fetching request details:', err);
    } finally {
      setLoading(false);
    }
  }, [requestId]);

  const handleEvaluationSubmit = async () => {
    if (
      !requestId ||
      !selectedVariant ||
      !profile?.id ||
      !requestData?.id_senior
    )
      return;

    const variantToRate: Record<EvaluationTaskVariant, string> = {
      sentiment_satisfied: 'SATISFIED',
      sentiment_neutral: 'NEUTRAL',
      sentiment_dissatisfied: 'DISSATISFIED',
    };

    try {
      const { error } = await supabase.from('evaluations').insert({
        id_request: parseInt(requestId),
        id_volunteer: profile.id,
        id_senior: requestData.id_senior,
        evaluation: variantToRate[selectedVariant],
        description: observation,
      });

      if (error) throw error;
      router.back();
    } catch (err) {
      console.error('Error submitting evaluation:', err);
    }
  };

  useEffect(() => {
    fetchRequestDetails();
  }, [fetchRequestDetails]);

  const seniorName = requestData?.senior?.name || 'Sénior';
  const nameParts = seniorName.split(' ').filter(Boolean);
  const prefix = requestData?.senior?.gender === 'FEMALE' ? 'Sra.' : 'Sr.';
  const firstAndLast =
    nameParts.length > 1
      ? `${nameParts[0]} ${nameParts[nameParts.length - 1]}`
      : nameParts[0] || 'Sénior';
  const displayName =
    seniorName === 'Sénior' || seniorName.startsWith('Sr')
      ? seniorName
      : `${prefix} ${firstAndLast}`;

  const initials =
    nameParts.length > 1
      ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
      : (nameParts[0]?.[0] || '?').toUpperCase();

  const seniorPhoto = requestData?.senior?.profile_picture;
  const hasPhoto = typeof seniorPhoto === 'string' && seniorPhoto.length > 0;

  const reqState = requestData?.state;
  const pillText = reqState === 'COMPLETED' ? 'Completa' : 'Pendente';
  const pillVariant = reqState === 'COMPLETED' ? 'success' : 'secondary';

  const description =
    requestData?.description ||
    `${displayName} realizou um pedido que necessita de apoio.`;

  if (loading) {
    return (
      <SafeAreaView
        edges={['top']}
        className="flex-1 items-center justify-center pt-20"
      >
        <ActivityIndicator size="large" color="#205a2d" />
      </SafeAreaView>
    );
  }

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
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="gap-6 px-6">
            <View className="items-center gap-4">
              <ThemedText type="title">{title}</ThemedText>
              <InfoPill text={pillText} variant={pillVariant} />
            </View>

            <SectionTitle title="Descrição do Pedido" />
            <ThemedText type="body">{description}</ThemedText>

            <View className="h-32 w-full flex-row items-center rounded-2xl bg-white px-4 shadow-md">
              {hasPhoto ? (
                <View className="h-20 w-20 overflow-hidden rounded-full">
                  <Image
                    source={{ uri: seniorPhoto }}
                    className="h-full w-full"
                  />
                </View>
              ) : (
                <View className="h-20 w-20 items-center justify-center rounded-lg bg-[#ffefd3]">
                  <ThemedText type="bodyBold" className="text-2xl text-neutral">
                    {initials}
                  </ThemedText>
                </View>
              )}
              <View className="ml-4 justify-center">
                <ThemedText type="body" className="text-lg text-neutral">
                  {displayName}
                </ThemedText>
                {requestData?.senior?.local && (
                  <ThemedText
                    type="bodyInfo"
                    className="mt-1 text-sm text-neutral/60"
                  >
                    {requestData.senior.local}
                  </ThemedText>
                )}
              </View>
            </View>

            {reqState === 'COMPLETED' && (
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
                      onPress={() => {
                        if (hasEvaluated) return;
                        setSelectedVariant(
                          selectedVariant === variant ? null : variant,
                        );
                      }}
                    />
                  ))}
                </View>

                <SectionTitle
                  title={
                    hasEvaluated ? 'Observação Enviada' : 'Enviar Observação'
                  }
                />
                <CommentBox
                  value={observation}
                  onChangeText={setObservation}
                  editable={!hasEvaluated}
                />

                {selectedVariant && !hasEvaluated && (
                  <Button
                    title="Submeter"
                    className="mt-4"
                    onPress={handleEvaluationSubmit}
                  />
                )}
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
