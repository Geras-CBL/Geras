import BottomActions from '@/components/senior/BottomActions';
import { MedicationSchedule } from '@/components/senior/MedicineDrawer';
import Button from '@/components/shared/Button';
import MedicationCard, {
  AddMedicationCard,
} from '@/components/shared/MedicationCard';
import { NotificationCard } from '@/components/shared/Notification';
import SectionTitle from '@/components/shared/SectionTitle';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';

import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

import { ScrollView, View, ActivityIndicator, Alert } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';

// =========================
// TYPES
// =========================

interface NotificationItem {
  id: string;
  description: string;
  type?: string;
}

interface MonitoringItem {
  id: number;
  metricType: string;
  title: string;
  value: number | string;
  unit: string;
  status: 'Adequado' | 'Moderado' | 'Excessivo';
  previousRecord?: {
    value_primary: number;
    value_secondary?: number | null;
    measured_at: string | null;
  };
}

interface MedicineItem {
  id: string;
  name: string;
  dosage?: number;
  scheduled_time?: string;
  start_date?: string;
  end_date?: string;
}

// =========================
// HELPERS
// =========================

export const METRIC_LABELS: Record<string, string> = {
  'HEART RATE': 'Batimento Cardíaco',
  'BLOOD PRESSURE': 'Pressão Arterial',
  TEMPERATURE: 'Temperatura',
  'BLOOD GLUCOSE': 'Glicémia',
  'BLOOD OXYGEN': 'Saturação de Oxigénio',
  WEIGHT: 'Peso',
};

export const getMetricStatus = (
  type: string | null,
  valuePrimary: number,
  valueSecondary?: number | null,
): 'Adequado' | 'Moderado' | 'Excessivo' => {
  if (valuePrimary === undefined || valuePrimary === null) return 'Adequado';
  switch (type) {
    case 'HEART RATE':
      if (valuePrimary < 50 || valuePrimary > 120) return 'Excessivo';
      if (valuePrimary < 60 || valuePrimary > 100) return 'Moderado';
      return 'Adequado';
    case 'TEMPERATURE':
      if (valuePrimary < 35.5 || valuePrimary >= 37.8) return 'Excessivo';
      if (valuePrimary < 35.8 || valuePrimary > 37.2) return 'Moderado';
      return 'Adequado';
    case 'BLOOD PRESSURE': {
      const sbp = valuePrimary; // Sistólica
      const dbp = valueSecondary; // Diastólica
      // Caso não exista valor diastólico (fallback de segurança)
      if (dbp === undefined || dbp === null) {
        if (sbp < 85 || sbp >= 160) return 'Excessivo';
        if (sbp < 90 || sbp >= 140) return 'Moderado';
        return 'Adequado';
      }
      // Avaliação conjunta (Sistólica & Diastólica)
      if (sbp < 85 || sbp >= 160 || dbp < 50 || dbp >= 100) {
        return 'Excessivo';
      }
      if (sbp >= 90 && sbp < 140 && dbp >= 60 && dbp < 90) {
        return 'Adequado';
      }
      return 'Moderado';
    }
    case 'BLOOD OXYGEN':
      if (valuePrimary < 90) return 'Excessivo';
      if (valuePrimary < 94) return 'Moderado';
      return 'Adequado';
    case 'BLOOD GLUCOSE':
      if (valuePrimary < 70 || valuePrimary > 180) return 'Excessivo';
      if (valuePrimary < 80 || valuePrimary > 140) return 'Moderado';
      return 'Adequado';
    case 'WEIGHT':
    default:
      return 'Adequado';
  }
};

// =========================
// COMPONENT
// =========================

export default function Health() {
  const router = useRouter();
  const { profile } = useAuth();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [monitoring, setMonitoring] = useState<MonitoringItem[]>([]);
  const [medicines, setMedicines] = useState<MedicineItem[]>([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH DATA
  // =========================

  const fetchHealthData = useCallback(async () => {
    if (!profile?.id) return;

    try {
      const nowIso = new Date().toISOString();
      const { data: notificationsData, error: notificationsError } =
        await supabase
          .from('notifications')
          .select('*')
          .eq('id_senior', profile.id)
          .is('dismissed_at', null)
          .or(`expires_at.is.null,expires_at.gt.${nowIso}`)
          .order('created_at', { ascending: false });

      if (!notificationsError && notificationsData) {
        setNotifications(
          notificationsData.map((item) => ({
            id: item.id.toString(),
            description: item.description,
            type: item.type,
          })),
        );
      }

      const { data: monitoringData, error: monitoringError } = await supabase
        .from('monitoring')
        .select('*, metric_definitions(*)')
        .eq('id_senior', profile.id)
        .order('measured_at', { ascending: false });

      if (!monitoringError && monitoringData) {
        const latestMetrics: Record<string, (typeof monitoringData)[0]> = {};
        const previousMetrics: Record<string, (typeof monitoringData)[0]> = {};

        for (const item of monitoringData) {
          if (item.metric_type) {
            if (!latestMetrics[item.metric_type]) {
              latestMetrics[item.metric_type] = item;
            } else if (!previousMetrics[item.metric_type]) {
              previousMetrics[item.metric_type] = item;
            }
          }
        }

        const mapped = Object.values(latestMetrics).map((item) => {
          const def = (item as any).metric_definitions;
          const title =
            METRIC_LABELS[item.metric_type] || item.metric_type || 'Métrica';
          const unit = def?.unit || '';

          let value: number | string = item.value_primary;
          if (
            item.metric_type === 'BLOOD PRESSURE' &&
            item.value_secondary !== null
          ) {
            value = `${Math.round(item.value_primary)}/${Math.round(item.value_secondary)}`;
          }
          let status = getMetricStatus(
            item.metric_type,
            item.value_primary,
            item.value_secondary,
          );
          const prev = previousMetrics[item.metric_type];
          const previousRecord = prev
            ? {
                value_primary: prev.value_primary,
                value_secondary: prev.value_secondary,
                measured_at: prev.measured_at,
              }
            : undefined;
          return {
            id: item.id,
            metricType: item.metric_type,
            title,
            value,
            unit,
            status,
            previousRecord,
          };
        });

        setMonitoring(mapped);
      }

      const { data: medicineData, error: medicineError } = await supabase
        .from('medicine')
        .select('*')
        .eq('id_senior', profile.id);

      if (!medicineError && medicineData) {
        setMedicines(
          medicineData.map((item) => ({
            id: item.id,
            name: item.name,
            dosage: item.dosage,
            scheduled_time: item.scheduled_time,
            start_date: item.start_date,
            end_date: item.end_date,
          })),
        );
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  }, [profile?.id]);

  useFocusEffect(
    useCallback(() => {
      fetchHealthData();

      if (!profile?.id) return;

      const filter = `id_senior=eq.${profile.id}`;
      const channel = supabase
        .channel('health_realtime')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'medicine', filter },
          () => fetchHealthData(),
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'monitoring', filter },
          () => fetchHealthData(),
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'notifications', filter },
          () => fetchHealthData(),
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }, [profile?.id, fetchHealthData]),
  );

  const handleEditMetric = async (
    id: number,
    valuePrimary: number,
    valueSecondary?: number | null,
  ) => {
    // Buscar tipo de métrica antes de atualizar
    const { data: metricData } = await supabase
      .from('monitoring')
      .select('metric_type')
      .eq('id', id)
      .maybeSingle();

    const metricType = metricData?.metric_type;

    const { error } = await supabase
      .from('monitoring')
      .update({
        value_primary: valuePrimary,
        value_secondary: valueSecondary,
      })
      .eq('id', id);

    if (error) {
      console.error('Erro ao editar métrica:', error);
      throw error;
    }

    if (metricType && profile?.id) {
      const metricLabels: Record<string, string> = {
        'HEART RATE': 'Batimento Cardíaco',
        'BLOOD PRESSURE': 'Pressão Arterial',
        TEMPERATURE: 'Temperatura',
        'BLOOD GLUCOSE': 'Glicémia',
        'BLOOD OXYGEN': 'Saturação de Oxigénio',
        WEIGHT: 'Peso',
      };
      const pattern = metricLabels[metricType];

      // Descartar notificações anteriores ativas deste tipo de métrica
      if (pattern) {
        await supabase
          .from('notifications')
          .update({ dismissed_at: new Date().toISOString() })
          .eq('id_senior', profile.id)
          .ilike('description', `%${pattern}%`)
          .is('dismissed_at', null);
      }

      // Recalcular estado e gerar novo alerta se continuar anómalo
      const status = getMetricStatus(metricType, valuePrimary, valueSecondary);
      if (status === 'Excessivo' || status === 'Moderado') {
        const { data: relation } = await supabase
          .from('senior_caretaker')
          .select('id_caretaker')
          .eq('id_senior', profile.id)
          .maybeSingle();
        const idCaretaker = relation?.id_caretaker || null;

        const formattedVal =
          metricType === 'BLOOD PRESSURE' && valueSecondary
            ? `${Math.round(valuePrimary)}/${Math.round(valueSecondary)}`
            : valuePrimary;

        const unit =
          metricType === 'HEART RATE'
            ? 'bpm'
            : metricType === 'BLOOD PRESSURE'
              ? 'mmHg'
              : metricType === 'TEMPERATURE'
                ? '°C'
                : metricType === 'BLOOD GLUCOSE'
                  ? 'mg/dL'
                  : metricType === 'BLOOD OXYGEN'
                    ? '%'
                    : 'kg';

        const description =
          status === 'Excessivo'
            ? `Urgente: A medição de ${pattern} registou um valor excessivo de ${formattedVal} ${unit}.`
            : `Aviso: A medição de ${pattern} registou um valor moderado de ${formattedVal} ${unit}.`;
        const notifType = status === 'Excessivo' ? 'alert' : 'info';
        const expiresAt = new Date(
          Date.now() + 5 * 60 * 60 * 1000,
        ).toISOString();

        await supabase.from('notifications').insert([
          {
            id_senior: profile.id,
            id_caretaker: idCaretaker,
            description,
            type: notifType,
            expires_at: expiresAt,
          },
        ]);
      }
    }

    fetchHealthData();
  };

  const handleDeleteMetric = async (id: number) => {
    // Buscar tipo de métrica antes de apagar
    const { data: metricData } = await supabase
      .from('monitoring')
      .select('metric_type')
      .eq('id', id)
      .maybeSingle();

    const metricType = metricData?.metric_type;

    const { error } = await supabase.from('monitoring').delete().eq('id', id);

    if (error) {
      console.error('Erro ao eliminar métrica:', error);
      throw error;
    }

    if (metricType && profile?.id) {
      const metricLabels: Record<string, string> = {
        'HEART RATE': 'Batimento Cardíaco',
        'BLOOD PRESSURE': 'Pressão Arterial',
        TEMPERATURE: 'Temperatura',
        'BLOOD GLUCOSE': 'Glicémia',
        'BLOOD OXYGEN': 'Saturação de Oxigénio',
        WEIGHT: 'Peso',
      };
      const pattern = metricLabels[metricType];
      if (pattern) {
        await supabase
          .from('notifications')
          .update({ dismissed_at: new Date().toISOString() })
          .eq('id_senior', profile.id)
          .ilike('description', `%${pattern}%`)
          .is('dismissed_at', null);
      }
    }

    fetchHealthData();
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 pt-24">
      <ScrollView
        className="flex-1"
        contentContainerClassName="items-center gap-10 px-6 pb-44"
        showsVerticalScrollIndicator={false}
      >
        {/* NOTIFICATIONS */}
        <SectionTitle title={'Eventos Recentes'}>
          {loading ? (
            <ActivityIndicator size="large" color="#2F5C3E" />
          ) : notifications.length === 0 ? (
            <View className="items-center py-4">
              <ThemedText type="bodyInfo" className="text-neutral">
                Não tens eventos de saúde recentes.
              </ThemedText>
            </View>
          ) : (
            notifications.map((notification) => {
              let title = 'Aviso';
              let icon = 'info';
              if (notification.type === 'medication') {
                title = 'Medicação';
                icon = 'medication';
              }
              if (notification.type === 'health') {
                title = 'Saúde';
                icon = 'health-and-safety';
              }
              if (notification.type === 'motion') {
                title = 'Movimento';
                icon = 'directions-walk';
              }
              if (notification.type === 'alert') {
                title = 'Alerta';
                icon = 'report';
              }

              return (
                <NotificationCard
                  key={notification.id}
                  variant={(notification.type as any) || 'medication'}
                  title={title}
                  iconName={icon as any}
                  description={notification.description}
                />
              );
            })
          )}
        </SectionTitle>

        {/* MONITORING */}
        <SectionTitle title={'Monitorização'}>
          <View className="-m-4 flex-row flex-wrap">
            {loading ? (
              <ActivityIndicator size="large" color="#2F5C3E" />
            ) : (
              monitoring.map((metric) => (
                <View key={metric.id} className="aspect-square w-1/2 p-4">
                  <MedicationCard
                    id={metric.id}
                    metricType={metric.metricType}
                    title={metric.title}
                    status={metric.status}
                    value={metric.value}
                    unit={metric.unit}
                    previousRecord={metric.previousRecord}
                    onEdit={handleEditMetric}
                    onDelete={handleDeleteMetric}
                  />
                </View>
              ))
            )}

            <View className="aspect-square w-1/2 p-4">
              <AddMedicationCard
                onPress={() => {
                  router.push('../shared/AddHealthMetric');
                }}
              />
            </View>
          </View>
        </SectionTitle>

        {/* MEDICINE SCHEDULE */}
        <SectionTitle title={'Horário da Medicação'}>
          <MedicationSchedule medicines={medicines} />
          <View className="mt-4 w-full gap-4">
            <Button
              title="Adicionar Medicação"
              variant="outlined"
              icon={
                <MaterialCommunityIcons name="plus" size={24} color="#205a2d" />
              }
              onPress={() => {
                router.push({
                  pathname: '../shared/AddMedication',
                  params: { id_senior: profile?.id },
                });
              }}
            />
            <Button
              title="Fazer pedido farmácia"
              icon={
                <MaterialCommunityIcons name="pill" size={24} color="#ffff" />
              }
              onPress={() => {
                router.push('../senior/Requests?type=pharmacy');
              }}
            />
          </View>
        </SectionTitle>
      </ScrollView>
      <BottomActions />
    </SafeAreaView>
  );
}
