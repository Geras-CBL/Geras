import { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  ScrollView,
  Alert,
  Linking,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Checkbox } from '@futurejj/react-native-checkbox';
import { useRouter, useFocusEffect } from 'expo-router';

import SectionTitle from '@/components/shared/SectionTitle';
import MedicationCard, {
  AddMedicationCard,
} from '@/components/shared/MedicationCard';
import Button from '@/components/shared/Button';
import { NotificationCard } from '@/components/shared/Notification';
import ClockPill from '@/components/shared/InfoPill';
import { ThemedText } from '@/components/ThemedText';
import ProfilePicker from '@/components/caretaker/ProfilePicker';
import ProfileBottomSheet from '@/components/caretaker/ProfileBottomSheet';
import { useProfile } from '@/context/ProfileContext';
import { supabase } from '@/lib/supabase';
import { getMetricStatus, METRIC_LABELS } from '../senior/Health';

interface GroceryItemState {
  id: string;
  name: string;
  checked: boolean;
}

interface MonitoringItem {
  id: number;
  metricType: string;
  title: string;
  status: 'Adequado' | 'Moderado' | 'Excessivo';
  value: number | string;
  unit: string;
  previousRecord?: {
    value_primary: number;
    value_secondary?: number | null;
    measured_at: string | null;
  };
}

interface MedicationAlert {
  id: string;
  name: string;
  time: string;
  description: string;
}

export default function SeniorManagement() {
  const router = useRouter();
  const sheetRef = useRef<any>(null);
  const { selectedProfile, handleSelectProfile } = useProfile();

  const [items, setItems] = useState<GroceryItemState[]>([]);
  const [monitoring, setMonitoring] = useState<MonitoringItem[]>([]);
  const [medicationAlert, setMedicationAlert] =
    useState<MedicationAlert | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSeniorData = useCallback(async () => {
    if (!selectedProfile?.id) return;
    setLoading(true);

    try {
      const { data: monitoringData } = await supabase
        .from('monitoring')
        .select('*, metric_definitions(*)')
        .eq('id_senior', selectedProfile.id)
        .order('measured_at', { ascending: false });

      if (monitoringData) {
        // Agrupar por tipo para reter apenas o mais recente
        const latestMetrics: Record<string, (typeof monitoringData)[0]> = {};
        for (const item of monitoringData) {
          if (item.metric_type && !latestMetrics[item.metric_type]) {
            latestMetrics[item.metric_type] = item;
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

          return { title, value, unit, status };
        });

        if (monitoringData) {
          // Agrupar por tipo para reter apenas o mais recente e o anterior
          const latestMetrics: Record<string, (typeof monitoringData)[0]> = {};
          const previousMetrics: Record<string, (typeof monitoringData)[0]> =
            {};
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
      }

      const { data: groceriesData } = await supabase
        .from('senior_groceries')
        .select('*, groceries(*)')
        .eq('id_senior', selectedProfile.id);

      if (groceriesData) {
        setItems(
          groceriesData.map((item: any) => ({
            id: item.id.toString(),
            name: item.groceries?.name || 'Item desconhecido',
            checked: false,
          })),
        );
      }

      const { data: notificationData } = await supabase
        .from('notifications')
        .select('*')
        .eq('id_senior', selectedProfile.id)
        .eq('type', 'medication')
        .limit(1)
        .maybeSingle();

      if (notificationData) {
        setMedicationAlert({
          id: notificationData.id.toString(),
          name: notificationData.description, // Simplified
          time: '14:00', // Mock time as it's not in notification table directly
          description: notificationData.description,
        });
      } else {
        setMedicationAlert(null);
      }
    } catch (err) {
      console.error('Error fetching senior data:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedProfile?.id]);

  useFocusEffect(
    useCallback(() => {
      fetchSeniorData();
    }, [fetchSeniorData]),
  );

  const toggleCheckbox = (id: string) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item,
      ),
    );
  };

  const handleOpenSheet = () => {
    sheetRef.current?.present();
  };

  const handleIgnore = () => {
    Alert.alert('Notificação ignorada');
    setMedicationAlert(null);
  };

  const handleWarn = () =>
    Alert.alert(`${selectedProfile?.name || 'Sénior'} avisado`);
  const handleCall = () => Linking.openURL(`tel:${963744454}`);

  const handleEditMetric = async (
    id: number,
    valuePrimary: number,
    valueSecondary?: number | null,
  ) => {
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
    fetchSeniorData();
  };

  const handleDeleteMetric = async (id: number) => {
    const { error } = await supabase.from('monitoring').delete().eq('id', id);

    if (error) {
      console.error('Erro ao eliminar métrica:', error);
      throw error;
    }
    fetchSeniorData();
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 pt-24">
      <ScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="flex-col pb-40 gap-6"
      >
        <ProfilePicker onPress={handleOpenSheet} profile={selectedProfile} />

        <SectionTitle title="Gestão" />

        {loading ? (
          <ActivityIndicator size="large" color="#205a2d" className="py-10" />
        ) : (
          <>
            {/* MEDICAÇÃO */}
            {medicationAlert && (
              <View>
                <SectionTitle title="Medicação">
                  <NotificationCard
                    variant="reminder"
                    title={medicationAlert.name}
                    rightContent={<ClockPill time={medicationAlert.time} />}
                    bottomContent={
                      <>
                        <Button
                          title="Ignorar"
                          variant="outlined"
                          className="flex-1"
                          onPress={handleIgnore}
                        />
                        <Button
                          title="Avisar"
                          variant="warning"
                          icon={
                            <MaterialIcons
                              name="warning-amber"
                              size={20}
                              color="#db6536"
                            />
                          }
                          className="flex-1"
                          onPress={handleWarn}
                        />
                        <Button
                          title="Ligar"
                          className="flex-1"
                          icon={
                            <MaterialIcons
                              name="call"
                              size={20}
                              color="white"
                            />
                          }
                          onPress={handleCall}
                        />
                      </>
                    }
                  />
                </SectionTitle>
              </View>
            )}

            {/* MONITORIZAÇÃO */}
            <View>
              <SectionTitle title="Monitorização">
                <View className="flex-row flex-wrap justify-between gap-x-4 gap-y-4">
                  {monitoring.map((item, index) => (
                    <View key={index} className="aspect-square w-[48%]">
                      <MedicationCard
                        id={item.id}
                        metricType={item.metricType}
                        title={item.title}
                        status={item.status}
                        value={item.value}
                        unit={item.unit}
                        previousRecord={item.previousRecord}
                        onEdit={handleEditMetric}
                        onDelete={handleDeleteMetric}
                      />
                    </View>
                  ))}
                  <View className="aspect-square w-[48%]">
                    <AddMedicationCard
                      onPress={() => router.push('../shared/AddHealthMetric')}
                    />
                  </View>
                </View>
              </SectionTitle>
            </View>

            {/* MERCEARIAS */}
            <View className="w-full">
              <SectionTitle title="Mercearias em falta">
                <View className="w-full flex-col gap-3">
                  {items.length > 0 ? (
                    <View className="w-full">
                      {items.map((item) => (
                        <TouchableOpacity
                          key={item.id}
                          className="mb-3 flex-row items-center rounded-2xl border border-gray-100 bg-white p-3 shadow-lg"
                          onPress={() => toggleCheckbox(item.id)}
                        >
                          <Checkbox
                            status={item.checked ? 'checked' : 'unchecked'}
                            onPress={() => toggleCheckbox(item.id)}
                            color={item.checked ? '#205a2d' : '#969696'}
                          />
                          <ThemedText
                            className={`ml-1 text-base text-neutral`}
                            style={{ fontSize: 15 }}
                          >
                            {item.name}
                          </ThemedText>
                        </TouchableOpacity>
                      ))}
                    </View>
                  ) : (
                    <ThemedText className="py-4 text-center text-neutral">
                      Não existem mercearias em falta
                    </ThemedText>
                  )}
                  <View className="flex-row gap-4 p-4 pt-2">
                    <Button
                      title="Adicionar"
                      variant="outlined"
                      className="flex-1"
                      onPress={() => router.push('../senior/AddGrocerieList')}
                      icon={
                        <MaterialIcons name="add" size={20} color="#205a2d" />
                      }
                    />
                    <Button
                      title="Comprar"
                      className="flex-1"
                      onPress={() => router.push('../senior/RequestLoading')}
                      icon={
                        <MaterialIcons
                          name="shopping-cart"
                          size={20}
                          color="white"
                        />
                      }
                    />
                  </View>
                </View>
              </SectionTitle>
            </View>
          </>
        )}
      </ScrollView>

      <ProfileBottomSheet
        ref={sheetRef}
        onSelectProfile={handleSelectProfile}
      />
    </SafeAreaView>
  );
}
