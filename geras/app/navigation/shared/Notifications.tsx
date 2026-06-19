import { View, ScrollView, Linking, ActivityIndicator } from 'react-native';
import {
  NotificationCard,
  ActionButton,
} from '@/components/shared/Notification';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { useRouter, useFocusEffect } from 'expo-router';
import { supabase } from '@/lib/supabase';
import React from 'react';
import { useNotifications } from '@/context/NotificationsContext';

const NOTIFICATION_CONFIG: Record<
  string,
  {
    variant:
      | 'alert'
      | 'request'
      | 'health'
      | 'medication'
      | 'info'
      | 'pantry'
      | 'reminder';
    icon: any;
    label: string;
  }
> = {
  alert: { variant: 'alert', icon: 'warning', label: 'Aviso' },
  request: { variant: 'request', icon: 'people', label: 'Pedido de Ajuda' },
  accepted_request: {
    variant: 'info',
    icon: 'check-circle',
    label: 'Pedido Aceite',
  },
  medication: { variant: 'medication', icon: 'medication', label: 'Medicação' },
  pantry: { variant: 'pantry', icon: 'shopping-basket', label: 'Despensa' },
  reminder: { variant: 'reminder', icon: 'alarm', label: 'Lembrete' },
  info: { variant: 'info', icon: 'info', label: 'Informação' },
};

export default function Notifications() {
  const router = useRouter();
  const {
    notifications,
    loading: isLoading,
    refreshNotifications,
  } = useNotifications();

  const handleDismiss = React.useCallback(async (notificationId: number) => {
    const { error } = await supabase
      .from('notifications')
      .update({ dismissed_at: new Date().toISOString() })
      .eq('id', notificationId);

    if (error) {
      console.error('Erro ao dispensar notificação:', error.message);
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      refreshNotifications();
    }, [refreshNotifications]),
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
                  onDismiss={() => handleDismiss(notif.id)}
                  rightContent={
                    isAlert ? (
                      <>
                        <ActionButton
                          icon="call"
                          onPress={() => Linking.openURL(`tel:${963744454}`)}
                        />
                        <ActionButton
                          icon="videocam"
                          onPress={() =>
                            router.push('/navigation/caretaker/Sensors')
                          }
                        />
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
