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
import { useNotifications } from '@/context/NotificationsContext';

const NOTIFICATION_CONFIG: Record<
  string,
  {
    variant:
      | 'alert'
      | 'request'
      | 'health'
      | 'medication'
      | 'motion'
      | 'info'
      | 'pantry';
    icon: any;
    title: string;
    priority: number;
    /** TTL em horas. undefined = sem expiração automática */
    ttlHours?: number;
    /** Se false, o cuidador não pode fechar esta notificação */
    dismissable: boolean;
  }
> = {
  alert: {
    variant: 'alert',
    icon: 'report',
    title: 'Urgente',
    priority: 0,
    ttlHours: undefined,
    dismissable: true, // o cuidador pode fechar alertas
  },
  request: {
    variant: 'request',
    icon: 'people',
    title: 'Pedido',
    priority: 1,
    ttlHours: 48,
    dismissable: true,
  },
  health: {
    variant: 'health',
    icon: 'health-and-safety',
    title: 'Saúde',
    priority: 1,
    ttlHours: 24,
    dismissable: true,
  },
  medication: {
    variant: 'medication',
    icon: 'medication',
    title: 'Medicação',
    priority: 2,
    ttlHours: 12,
    dismissable: true,
  },
  motion: {
    variant: 'motion',
    icon: 'directions-walk',
    title: 'Movimento',
    priority: 2,
    ttlHours: 6,
    dismissable: true,
  },
  info: {
    variant: 'info',
    icon: 'info',
    title: 'Informação',
    priority: 2,
    ttlHours: 24,
    dismissable: true,
  },
  pantry: {
    variant: 'pantry',
    icon: 'shopping-basket',
    title: 'Despensa',
    priority: 2,
    ttlHours: undefined,
    dismissable: true,
  },
};

/** Filtra notificações já expiradas ou dispensadas (client-side safety net) */
function isActive(notification: any): boolean {
  if (notification.dismissed_at) return false;
  if (notification.expires_at && new Date(notification.expires_at) < new Date())
    return false;
  return true;
}

export default function HomePage() {
  const sheetRef = React.useRef<any>(null);
  const router = useRouter();
  const {
    selectedProfile,
    handleSelectProfile,
    isLoading: isProfilesLoading,
  } = useProfile();
  const { profile } = useAuth();
  const { sendLocalNotification, saveNotificationToDB } = useNotifications();
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

      // 1. Notificações (só as activas e não dispensadas)
      const now = new Date().toISOString();
      const { data: notifs, error: notifError } = await supabase
        .from('notifications')
        .select('*')
        .eq('id_senior', seniorId)
        .is('dismissed_at', null)
        .or(`expires_at.is.null,expires_at.gt.${now}`)
        .order('created_at', { ascending: false });

      if (!notifError && notifs) {
        const sorted = [...notifs].sort((a, b) => {
          const typeA = (a.type || 'info').toLowerCase();
          const typeB = (b.type || 'info').toLowerCase();
          const prioA = NOTIFICATION_CONFIG[typeA]?.priority ?? 99;
          const prioB = NOTIFICATION_CONFIG[typeB]?.priority ?? 99;
          return prioA - prioB;
        });
        setNotifications(sorted);
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

  const handleDismiss = React.useCallback(async (notificationId: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));

    const { error } = await supabase
      .from('notifications')
      .update({ dismissed_at: new Date().toISOString() })
      .eq('id', notificationId);

    if (error) {
      console.error('Erro ao dispensar notificação (RLS?):', error.message);
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchData();

      if (!selectedProfile?.id) return;

      // Subscrição realtime: atualiza quando há nova leitura de sensor
      const channel = supabase
        .channel('sensor_readings_home')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'sensor_readings' },
          async (payload) => {
            // Refrescar dados na UI
            fetchData();

            // Extrair info da leitura para a notificação
            const reading = payload.new as any;
            const readingValue = reading?.value || 'Alerta do sensor';
            const notifTitle =
              reading?.type === 'motion'
                ? '\ud83d\udea8 Movimento Detetado'
                : '\ud83d\udce1 Alerta do Sensor';

            // 1. Notificação local (banner)
            await sendLocalNotification(notifTitle, readingValue);

            // 2. Guardar na tabela notifications do Supabase
            if (selectedProfile?.id) {
              await saveNotificationToDB({
                type: reading?.type === 'motion' ? 'alert' : 'info',
                description: readingValue,
                id_senior: Number(selectedProfile.id),
                id_caretaker: profile?.id ?? null,
              });
            }
          },
        )
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'notifications' },
          async (payload) => {
            const newNotif = payload.new as any;

            // Apenas atualizar a UI se for para este cuidador ou sénior
            if (
              (newNotif.id_senior === selectedProfile?.id ||
                newNotif.id_caretaker === profile?.id) &&
              newNotif.type === 'alert'
            ) {
              fetchData(); // Refresh UI
            }
          },
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'monitoring',
            filter: `id_senior=eq.${selectedProfile.id}`,
          },
          () => fetchData(),
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }, [
      fetchData,
      sendLocalNotification,
      saveNotificationToDB,
      selectedProfile?.id,
      profile?.id,
    ]),
  );

  const alertsCount = notifications.filter((n) => n.type === 'alert').length;
  const sensorAlertsCount = recentReadings.filter(
    (r) => r.type === 'alert',
  ).length;

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
            sensorAlertsCount={sensorAlertsCount}
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
                notifications.filter(isActive).map((notification) => {
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
                      onDismiss={
                        config.dismissable
                          ? () => handleDismiss(notification.id)
                          : undefined
                      }
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
