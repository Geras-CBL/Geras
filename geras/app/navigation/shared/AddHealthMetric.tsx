import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import {
  View,
  TextInput,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import Header from '@/components/shared/Header';
import Button from '@/components/shared/Button';
import SectionTitle from '@/components/shared/SectionTitle';
import BottomActions from '@/components/senior/BottomActions';
import { useAuth } from '@/context/AuthContext';

import { getMetricStatus } from '../senior/Health';
import { useProfile } from '@/context/ProfileContext';

const AVAILABLE_METRICS = [
  {
    type: 'HEART RATE',
    label: 'Batimento Cardíaco',
    icon: 'heart-pulse',
    unit: 'bpm',
  },
  {
    type: 'BLOOD PRESSURE',
    label: 'Pressão Arterial',
    icon: 'pulse',
    unit: 'mmHg',
  },
  {
    type: 'TEMPERATURE',
    label: 'Temperatura',
    icon: 'thermometer',
    unit: '°C',
  },
  { type: 'BLOOD GLUCOSE', label: 'Glicémia', icon: 'water', unit: 'mg/dL' },
  {
    type: 'BLOOD OXYGEN',
    label: 'Saturação de Oxigénio',
    icon: 'lungs',
    unit: '%',
  },
  { type: 'WEIGHT', label: 'Peso', icon: 'scale-bathroom', unit: 'kg' },
] as const;

export default function AddHealthMetric() {
  const router = useRouter();
  const { profile } = useAuth();

  const role = profile?.role;
  const { selectedProfile } = useProfile();

  const [selectedType, setSelectedType] =
    useState<(typeof AVAILABLE_METRICS)[number]['type']>('HEART RATE');
  const [valuePrimary, setValuePrimary] = useState('');
  const [valueSecondary, setValueSecondary] = useState('');

  const activeMetric = AVAILABLE_METRICS.find((m) => m.type === selectedType)!;

  const handleSave = async () => {
    if (!valuePrimary) {
      Alert.alert('Falta Informação', 'Por favor preencha o valor da medição.');
      return;
    }

    const targetSeniorId =
      profile?.role === 'SENIOR'
        ? profile.id
        : selectedProfile?.id
          ? parseInt(selectedProfile.id)
          : null;

    if (!targetSeniorId) {
      Alert.alert(
        'Erro',
        'Não foi possível identificar o sénior para registar a métrica.',
      );
      return;
    }

    const valPrimary = parseFloat(valuePrimary);
    if (Number.isNaN(valPrimary)) {
      Alert.alert(
        'Falta Informação',
        'Por favor introduza um valor numérico válido.',
      );
      return;
    }

    let valSecondary: number | null = null;
    if (selectedType === 'BLOOD PRESSURE') {
      if (!valueSecondary) {
        Alert.alert(
          'Falta Informação',
          'Por favor preencha o valor da pressão diastólica (mínima).',
        );
        return;
      }
      valSecondary = parseFloat(valueSecondary);
      if (Number.isNaN(valSecondary)) {
        Alert.alert(
          'Falta Informação',
          'Por favor introduza um valor diastólico válido.',
        );
        return;
      }
    }

    try {
      const { error } = await supabase.from('monitoring').insert([
        {
          id_senior: targetSeniorId,
          metric_type: selectedType,
          value_primary: valPrimary,
          value_secondary: valSecondary,
          measured_at: new Date().toISOString(),
          source: 'manual',
        },
      ]);

      if (error) {
        console.error('Error saving metric:', error);
        Alert.alert('Erro', 'Não foi possível guardar o registo.');
        return;
      }

      // Descartar notificações anteriores ativas deste tipo de métrica
      await supabase
        .from('notifications')
        .update({ dismissed_at: new Date().toISOString() })
        .eq('id_senior', targetSeniorId)
        .ilike('description', `%${activeMetric.label}%`)
        .is('dismissed_at', null);

      // --- CRIAÇÃO DA NOTIFICAÇÃO SE FOR ANÓMALA ---
      const status = getMetricStatus(selectedType, valPrimary, valSecondary);
      if (status === 'Excessivo' || status === 'Moderado') {
        let idCaretaker = null;
        // Identificar o cuidador associado
        if (profile?.role === 'CARETAKER') {
          idCaretaker = profile.id;
        } else {
          const { data: relation } = await supabase
            .from('senior_caretaker')
            .select('id_caretaker')
            .eq('id_senior', targetSeniorId)
            .maybeSingle();
          idCaretaker = relation?.id_caretaker || null;
        }
        // Formatar o valor exibido na notificação
        const formattedVal =
          selectedType === 'BLOOD PRESSURE' && valSecondary
            ? `${Math.round(valPrimary)}/${Math.round(valSecondary)}`
            : valPrimary;
        // Definir mensagem em português
        const description =
          status === 'Excessivo'
            ? `Urgente: A medição de ${activeMetric.label} registou um valor excessivo de ${formattedVal} ${activeMetric.unit}.`
            : `Aviso: A medição de ${activeMetric.label} registou um valor moderado de ${formattedVal} ${activeMetric.unit}.`;
        const notifType = status === 'Excessivo' ? 'alert' : 'info';

        // Data de expiração: 5 horas a partir de agora
        const expiresAt = new Date(
          Date.now() + 5 * 60 * 60 * 1000,
        ).toISOString();

        // Gravar na tabela 'notifications'
        await supabase.from('notifications').insert([
          {
            id_senior: targetSeniorId,
            id_caretaker: idCaretaker,
            description,
            type: notifType,
            expires_at: expiresAt,
          },
        ]);
      }
      // Voltar para o ecrã anterior após tudo gravado com sucesso
      router.back();
    } catch (err) {
      console.error('Unexpected error:', err);
      Alert.alert('Erro', 'Ocorreu um erro inesperado ao guardar o registo.');
    }
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-white px-6 pt-24">
      <Stack.Screen
        options={{
          headerShown: true,
          headerTransparent: true,
          header: () => {
            if (role === 'SENIOR') {
              return (
                <Header
                  leftIconName="home"
                  rightIconName="settings"
                  leftIconLabel="Ir para a página inicial"
                  rightIconLabel="Abrir definições"
                  onLeftPress={() => router.push('/navigation/senior/HomePage')}
                  onRightPress={() =>
                    router.push('/navigation/shared/Settings')
                  }
                />
              );
            }
            // CARETAKER ou outro perfil (ex: VOLUNTEER)
            return (
              <Header
                leftIconName="arrow-back"
                rightIconName="notifications"
                leftIconLabel="Voltar"
                rightIconLabel="Notificações"
                onLeftPress={() => router.back()}
                onRightPress={() =>
                  router.push('/navigation/caretaker/Notifications')
                }
              />
            );
          },
        }}
      />

      <SectionTitle title="Nova Leitura" />

      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-6 pb-32"
        showsVerticalScrollIndicator={false}
      >
        <ThemedText
          type="body"
          style={{ fontSize: 18, color: '#4b5563', marginBottom: -4 }}
        >
          Selecione a métrica a registar:
        </ThemedText>

        {/* Grelha de Métricas */}
        <View className="flex-row flex-wrap items-start justify-between gap-y-4">
          {AVAILABLE_METRICS.map((metric) => {
            const isSelected = selectedType === metric.type;
            return (
              <TouchableOpacity
                key={metric.type}
                activeOpacity={0.8}
                onPress={() => {
                  setSelectedType(metric.type);
                  setValuePrimary('');
                  setValueSecondary('');
                }}
                className={`aspect-[1.1] w-[48%] flex-col items-center justify-center rounded-3xl border p-4 shadow-sm ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <MaterialCommunityIcons
                  name={metric.icon as any}
                  size={32}
                  color={isSelected ? '#059669' : '#4b5563'}
                />
                <ThemedText
                  type="bodyBold"
                  style={{
                    fontSize: 14,
                    textAlign: 'center',
                    marginTop: 8,
                    color: isSelected ? '#065f46' : '#1f2937',
                  }}
                >
                  {metric.label}
                </ThemedText>
                <ThemedText
                  type="body"
                  style={{
                    fontSize: 12,
                    color: isSelected ? '#047857' : '#9ca3af',
                  }}
                >
                  ({metric.unit})
                </ThemedText>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Campos de Input Dinâmicos */}
        <View className="mt-4 gap-4">
          {selectedType === 'BLOOD PRESSURE' ? (
            <View className="flex-row gap-4">
              <View className="flex-1 gap-2">
                <ThemedText type="bodyBold">Sistólica (Máxima)</ThemedText>
                <View className="flex-row items-center rounded-2xl bg-gray-100 p-5">
                  <TextInput
                    className="flex-1 p-0 text-lg text-neutral"
                    placeholder="120"
                    value={valuePrimary}
                    onChangeText={setValuePrimary}
                    keyboardType="numeric"
                    placeholderTextColor="#9ca3af"
                  />
                  <ThemedText style={{ color: '#9ca3af' }}>
                    {activeMetric.unit}
                  </ThemedText>
                </View>
              </View>

              <View className="flex-1 gap-2">
                <ThemedText type="bodyBold">Diastólica (Mínima)</ThemedText>
                <View className="flex-row items-center rounded-2xl bg-gray-100 p-5">
                  <TextInput
                    className="flex-1 p-0 text-lg text-neutral"
                    placeholder="80"
                    value={valueSecondary}
                    onChangeText={setValueSecondary}
                    keyboardType="numeric"
                    placeholderTextColor="#9ca3af"
                  />
                  <ThemedText style={{ color: '#9ca3af' }}>
                    {activeMetric.unit}
                  </ThemedText>
                </View>
              </View>
            </View>
          ) : (
            <View className="gap-2">
              <ThemedText type="bodyBold">Valor de Medição</ThemedText>
              <View className="flex-row items-center rounded-2xl bg-gray-100 p-5">
                <TextInput
                  className="flex-1 p-0 text-lg text-neutral"
                  placeholder="Introduza o valor"
                  value={valuePrimary}
                  onChangeText={setValuePrimary}
                  keyboardType="numeric"
                  placeholderTextColor="#9ca3af"
                />
                <ThemedText style={{ color: '#6b7280', fontWeight: 'bold' }}>
                  {activeMetric.unit}
                </ThemedText>
              </View>
            </View>
          )}
        </View>

        <View className="mb-10 mt-4">
          <Button
            title="Guardar Registo"
            onPress={handleSave}
            icon={<MaterialIcons name="check" size={24} color="#fff" />}
          />
        </View>
      </ScrollView>

      {role === 'SENIOR' && <BottomActions />}
    </SafeAreaView>
  );
}
