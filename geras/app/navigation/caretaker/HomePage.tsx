import * as React from 'react';
import { Linking, ScrollView, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProfilePicker from '@/components/caretaker/ProfilePicker';
import Resume from '@/components/caretaker/Resume';
import SensorCardInfo from '@/components/caretaker/SensorCardInfo';
import SectionTitle from '@/components/shared/SectionTitle';
import {
  NotificationCard,
  ActionButton,
} from '@/components/shared/Notification';
import ProfileBottomSheet from '@/components/caretaker/ProfileBottomSheet';
import { useRouter, useFocusEffect } from 'expo-router';
import { useProfile } from '@/context/ProfileContext';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { ThemedText } from '@/components/ThemedText';

const NOTIFICATION_CONFIG: Record<
  string,
  {
    variant: 'alert' | 'medication' | 'info' | 'pantry' | 'reminder';
    icon: any;
    title: string;
  }
> = {
  medication: { variant: 'medication', icon: 'medication', title: 'Medicação' },
  alert: { variant: 'alert', icon: 'report', title: 'Urgente' },
  pantry: { variant: 'pantry', icon: 'shopping-basket', title: 'Despensa' },
  info: { variant: 'info', icon: 'info', title: 'Informação' },
};

export default function HomePage() {
  const sheetRef = React.useRef<any>(null);
  const router = useRouter();
  const {
    selectedProfile,
    handleSelectProfile,
    isLoading: isProfilesLoading,
  } = useProfile();
  const { profile } = useAuth();
  const [notifications, setNotifications] = React.useState<any[]>([]);
  const [healthProblemsCount, setHealthProblemsCount] = React.useState(0);
  const [loadingData, setLoadingData] = React.useState(true);
  const [activeSensors, setActiveSensors] = React.useState<any[]>([]);
  const [recentReadings, setRecentReadings] = React.useState<
    { value: string; type: string; triggeredAt: string; sensorName: string }[]
  >([]);

  const handleOpenSheet = () => {
    sheetRef.current?.present();
  };

  const fetchData = React.useCallback(async () => {
    if (!selectedProfile?.id) {
      setLoadingData(false);
      return;
    }

    setLoadingData(true);
    try {
      const seniorId = selectedProfile!.id;
      const caretakerId = profile?.id;

      // 1. Notificações
      const { data: notifs, error: notifError } = await supabase
        .from('notifications')
        .select('*')
        .eq('id_senior', seniorId);

      if (!notifError && notifs) {
        setNotifications(notifs);
      }

      // 2. Monitorização (para contar problemas de saúde)
      const { data: monitor, error: monitorError } = await supabase
        .from('monitoring')
        .select('*')
        .eq('id_senior', seniorId);

      if (!monitorError && monitor) {
        const problems = monitor.filter((m) => {
          const value = m.custom_metric_value || m.value || 0;
          return value > 70;
        });
        setHealthProblemsCount(problems.length);
      }

      // 3. Sensores ativos + última leitura de movimento
      if (caretakerId) {
        const { data: sensorData } = await supabase
          .from('sensors')
          .select('*, sensor_readings(type, value, triggered_at)')
          .eq('id_senior', seniorId)
          .eq('id_caretaker', caretakerId)
          .eq('active', true);

        if (sensorData) {
          setActiveSensors(sensorData);

          const readings: {
            value: string;
            type: string;
            triggeredAt: string;
            sensorName: string;
          }[] = [];

          sensorData.forEach((s: any) => {
            (s.sensor_readings || []).forEach((r: any) => {
              readings.push({
                value: r.value || 'Alerta',
                type: r.type || 'info',
                triggeredAt: r.triggered_at,
                sensorName: s.name,
              });
            });
          });

          const twoHoursAgo = Date.now() - 2 * 60 * 60 * 1000;

          readings.sort(
            (a, b) =>
              new Date(b.triggeredAt).getTime() -
              new Date(a.triggeredAt).getTime(),
          );

          const recentOnly = readings.filter(
            (r) => new Date(r.triggeredAt).getTime() > twoHoursAgo,
          );

          setRecentReadings(recentOnly);
        }
      }
    } catch (err) {
      console.error('Erro ao carregar dados do idoso:', err);
    } finally {
      setLoadingData(false);
    }
  }, [selectedProfile?.id, profile?.id]);

  useFocusEffect(
    React.useCallback(() => {
      fetchData();

      // Subscrição realtime: atualiza quando há nova leitura de sensor
      const channel = supabase
        .channel('sensor_readings_home')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'sensor_readings' },
          () => fetchData(),
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }, [fetchData]),
  );

  const alertsCount = notifications.filter((n) => n.type === 'alert').length;

  return (
    <SafeAreaView edges={['top']} className="flex-1 pt-24">
      {isProfilesLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#205a2d" />
          <ThemedText className="mt-4">A carregar perfis...</ThemedText>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-6 gap-6 pb-40"
          showsVerticalScrollIndicator={false}
        >
          <ProfilePicker onPress={handleOpenSheet} profile={selectedProfile} />

          <Resume
            alertsCount={alertsCount}
            healthProblemsCount={healthProblemsCount}
          />

          <View className="pt-6">
            <SectionTitle title="Notificações">
              {loadingData ? (
                <ActivityIndicator
                  size="large"
                  color="#205a2d"
                  className="py-4"
                />
              ) : notifications.length > 0 ? (
                notifications.map((notification) => {
                  const typeKey = (notification.type || 'info').toLowerCase();
                  const config =
                    NOTIFICATION_CONFIG[typeKey] || NOTIFICATION_CONFIG.info;

                  return (
                    <NotificationCard
                      key={notification.id}
                      variant={config.variant}
                      title={config.title}
                      iconName={config.icon}
                      description={notification.description}
                      rightContent={
                        notification.type === 'alert' ? (
                          <>
                            <ActionButton
                              icon="call"
                              onPress={() =>
                                Linking.openURL(`tel:${963744454}`)
                              }
                            />
                            <ActionButton
                              icon="videocam"
                              onPress={() => router.push('./Sensors')}
                            />
                          </>
                        ) : null
                      }
                    />
                  );
                })
              ) : (
                <ThemedText
                  type="body"
                  className="text-neutralDark py-10 text-center"
                >
                  Não há notificações novas para este perfil.
                </ThemedText>
              )}
            </SectionTitle>
          </View>

          <View className="pt-6">
            <SectionTitle title="Sensores">
              {loadingData ? (
                <ActivityIndicator size="small" color="#205a2d" />
              ) : activeSensors.length === 0 ? (
                <SensorCardInfo
                  title="SEM SENSORES"
                  subtitle="Nenhum sensor configurado"
                  isAlert={false}
                  onPress={() => router.push('./Sensors')}
                />
              ) : recentReadings.length === 0 ? (
                <SensorCardInfo
                  title="SEM ALERTAS RECENTES"
                  subtitle="Nenhum alerta nas últimas 2 horas"
                  isAlert={false}
                  onPress={() => router.push('./Sensors')}
                />
              ) : (
                recentReadings.map((reading, index) => {
                  const isAlert = reading.type === 'alert';
                  const date = new Date(reading.triggeredAt);
                  const formattedTime = date.toLocaleTimeString('pt-PT', {
                    hour: '2-digit',
                    minute: '2-digit',
                  });
                  const formattedDate = date.toLocaleDateString('pt-PT', {
                    day: '2-digit',
                    month: '2-digit',
                  });

                  return (
                    <SensorCardInfo
                      key={index}
                      title={reading.value.toUpperCase()}
                      subtitle={`${reading.sensorName} · ${formattedDate} ${formattedTime}`}
                      isAlert={isAlert}
                      onPress={() => router.push('./Sensors')}
                    />
                  );
                })
              )}
            </SectionTitle>
          </View>
        </ScrollView>
      )}
      <ProfileBottomSheet
        ref={sheetRef}
        onSelectProfile={handleSelectProfile}
      />
    </SafeAreaView>
  );
}
