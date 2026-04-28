import BottomActions from '@/components/senior/BottomActions';
import { MedicationSchedule } from '@/components/senior/MedicineDrawer';
import Button from '@/components/shared/Button';
import ClockPill from '@/components/shared/InfoPill';
import MedicationCard, {
  AddMedicationCard,
} from '@/components/shared/MedicationCard';
import { NotificationCard } from '@/components/shared/Notification';
import SectionTitle from '@/components/shared/SectionTitle';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';

import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

import {
  ScrollView,
  View,
  ActivityIndicator,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';



// =========================
// TYPES
// =========================

interface NotificationItem {
  id: string;
  description: string;
  type?: string;
}

interface MonitoringItem {
  id: string;
  title: string;
  value: number;
  unit: string;
  status: 'Adequado' | 'Moderado' | 'Excessivo';
}

interface MedicineItem {
  id: string;
  name: string;
  dosage?: number;
  scheduled_time?: string;
}



// =========================
// COMPONENT
// =========================

export default function Health() {

  const router = useRouter();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [monitoring, setMonitoring] = useState<MonitoringItem[]>([]);
  const [medicines, setMedicines] = useState<MedicineItem[]>([]);
  const [loading, setLoading] = useState(true);



  // =========================
  // FETCH DATA
  // =========================

  const MONITORING_CONFIG: Record<string, { label: string, unit: string }> = {
    'HEART RATE': { label: 'Batimento Cardíaco', unit: 'bpm' },
    'BLOOD PRESSURE': { label: 'Pressão Arterial', unit: 'mmHg' },
    'TEMPERATURE': { label: 'Temperatura', unit: 'ºC' }
  };

  useFocusEffect(
    useCallback(() => {
      async function fetchHealthData() {
        try {
          const { data: notificationsData, error: notificationsError } = await supabase
            .from('notifications')
            .select('*');

          if (!notificationsError && notificationsData) {
            setNotifications(notificationsData.map(item => ({
              id: item.id.toString(),
              description: item.description,
              type: item.type,
            })));
          }

          const { data: monitoringData, error: monitoringError } = await supabase
            .from('monitoring')
            .select('*');

          if (!monitoringError && monitoringData) {
            setMonitoring(monitoringData.map(item => {
              const config = item.type ? MONITORING_CONFIG[item.type] : null;
              const title = item.custom_metric_name || config?.label || item.type || 'Métrica';
              const value = item.custom_metric_value || item.value || 0;
              const unit = item.unit || config?.unit || '';
              
              let status: 'Adequado' | 'Moderado' | 'Excessivo' = 'Adequado';
              if (value > 100) status = 'Excessivo';
              else if (value > 70) status = 'Moderado';

              return {
                id: item.id.toString(),
                title,
                value,
                unit,
                status,
              };
            }));
          }

          const { data: medicineData, error: medicineError } = await supabase
            .from('medicine')
            .select('*');

          if (!medicineError && medicineData) {
            setMedicines(medicineData.map(item => ({
              id: item.id.toString(),
              name: item.name,
              dosage: item.dosage,
              scheduled_time: item.scheduled_time,
            })));
          }
        } catch (err) {
          console.error('Unexpected error:', err);
        } finally {
          setLoading(false);
        }
      }
      fetchHealthData();
    }, [])
  );

  return (
    <SafeAreaView
      edges={['top']}
      className="flex-1 pt-24"
    >
      <ScrollView
        className="flex-1"
        contentContainerClassName="items-center gap-10 px-6 pb-44"
        showsVerticalScrollIndicator={false}
      >

        {/* NOTIFICATIONS */}
        <SectionTitle title={'Notificações'}>
          {loading ? (
            <ActivityIndicator
              size="large"
              color="#2F5C3E"
            />

          ) : (

            notifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                variant="medication"
                title="Aviso"
                iconName="medication"
                description={notification.description}
              />
            ))
          )}
        </SectionTitle>

        {/* MONITORING */}
        <SectionTitle title={'Monitorização'}>
          <View className="-m-4 flex-row flex-wrap">
            {loading ? (
              <ActivityIndicator
                size="large"
                color="#2F5C3E"
              />

            ) : (

              monitoring.map((metric) => (
                <View
                  key={metric.id}
                  className="aspect-square w-1/2 p-4"
                >
                  <MedicationCard
                    title={metric.title}
                    status={metric.status}
                    value={metric.value}
                    unit={metric.unit}
                  />
                </View>
              ))
            )}

            <View className="aspect-square w-1/2 p-4">

              <AddMedicationCard
                onPress={() => {

                  router.push(
                    '../shared/AddHealthMetric'
                  );

                }}
              />
            </View>
          </View>
        </SectionTitle>

        {/* MEDICINE SCHEDULE */}
        <MedicationSchedule medicines={medicines} />
        <Button
          title="Fazer pedido farmácia"
          icon={
            <MaterialCommunityIcons
              name="pill"
              size={24}
              color="#ffff"
            />
          }
          onPress={() => {

            router.push(
              './PharmacyShopping'
            );

          }}
        />
      </ScrollView>
      <BottomActions />
    </SafeAreaView>
  );
}