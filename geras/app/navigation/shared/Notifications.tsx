import {
  View,
  ScrollView,
  Linking,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {
  NotificationCard,
  ActionButton,
} from '@/components/shared/Notification';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { useRouter, useFocusEffect } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useProfile } from '@/context/ProfileContext';
import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';

const NOTIFICATION_CONFIG: Record<
  string,
  {
    variant: 'alert' | 'medication' | 'info' | 'pantry' | 'reminder';
    icon: any;
    label: string;
  }
> = {
  alert: { variant: 'alert', icon: 'warning', label: 'Aviso' },
  medication: { variant: 'medication', icon: 'medication', label: 'Medicação' },
  pantry: { variant: 'pantry', icon: 'shopping-basket', label: 'Despensa' },
  reminder: { variant: 'reminder', icon: 'alarm', label: 'Lembrete' },
  info: { variant: 'info', icon: 'info', label: 'Informação' },
};

export default function Notifications() {
  const router = useRouter();
  const { selectedProfile } = useProfile();
  const [notifications, setNotifications] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchNotifications = React.useCallback(async () => {
    if (!selectedProfile?.id) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('id_senior', selectedProfile.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setNotifications(data);
      }
    } catch (err) {
      console.error('Erro ao carregar notificações:', err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedProfile?.id]);

  useFocusEffect(
    React.useCallback(() => {
      fetchNotifications();

      if (!selectedProfile?.id) return;

      // Subscrição realtime
      const channel = supabase
        .channel('notifications_page')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'notifications',
            filter: `id_senior=eq.${selectedProfile.id}`,
          },
          () => fetchNotifications(),
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }, [fetchNotifications, selectedProfile?.id]),
  );

  return (
    <SafeAreaView edges={['top']} className="flex-1">
      <ScrollView
        className="bg-background flex-1 px-6 pt-24"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <ThemedText type="title" className="mb-6">
          Notificações
        </ThemedText>

        {isLoading ? (
          <ActivityIndicator size="large" color="#205a2d" className="mt-10" />
        ) : notifications.length === 0 ? (
          <ThemedText type="body" className="mt-10 text-center text-gray-500">
            Não há notificações para este perfil.
          </ThemedText>
        ) : (
          notifications.map((notif) => {
            const typeKey = (notif.type || 'info').toLowerCase();
            const config =
              NOTIFICATION_CONFIG[typeKey] || NOTIFICATION_CONFIG.info;
            const isAlert = typeKey === 'alert';

            return (
              <View key={notif.id} className="mb-4">
                <NotificationCard
                  variant={config.variant}
                  title={config.label}
                  iconName={config.icon}
                  description={notif.description}
                  rightContent={
                    isAlert ? (
                      <>
                        <ActionButton
                          icon="call"
                          onPress={() => Linking.openURL(`tel:${963744454}`)}
                        />
                        onPress=
                        {() => router.push('/navigation/caretaker/Sensors')}
                      </>
                    ) : null
                  }
                />
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
