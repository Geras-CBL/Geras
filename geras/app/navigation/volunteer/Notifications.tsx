import React, { useCallback } from 'react';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { ThemedText } from '@/components/ThemedText';
import { NotificationCard } from '@/components/shared/Notification';
import SectionTitle from '@/components/shared/SectionTitle';
import { useNotifications } from '@/context/NotificationsContext';

// Config visual por tipo de notificação
const NOTIFICATION_CONFIG: Record<
  string,
  {
    variant: 'alert' | 'request' | 'health' | 'medication' | 'info' | 'pantry';
    icon: any;
    title: string;
    dismissable: boolean;
  }
> = {
  request: {
    variant: 'request',
    icon: 'people',
    title: 'Pedido de Ajuda',
    dismissable: true,
  },
  alert: {
    variant: 'alert',
    icon: 'report',
    title: 'Urgente',
    dismissable: true,
  },
  info: {
    variant: 'info',
    icon: 'info',
    title: 'Informação',
    dismissable: true,
  },
  medication: {
    variant: 'medication',
    icon: 'medication',
    title: 'Medicação',
    dismissable: true,
  },
  pantry: {
    variant: 'pantry',
    icon: 'shopping-basket',
    title: 'Despensa',
    dismissable: true,
  },
};

/** Filtra notificações expiradas ou dispensadas */
function isActive(n: any): boolean {
  if (n.dismissed_at) return false;
  if (n.expires_at && new Date(n.expires_at) < new Date()) return false;
  return true;
}

export default function Notifications() {
  const { profile } = useAuth();
  const { notifications, loading, refreshNotifications } = useNotifications();

  const handleDismiss = useCallback(async (notificationId: number) => {
    await supabase
      .from('notifications')
      .update({ dismissed_at: new Date().toISOString() })
      .eq('id', notificationId);
  }, []);

  useFocusEffect(
    useCallback(() => {
      refreshNotifications();
    }, [refreshNotifications]),
  );

  const active = notifications.filter(isActive);

  return (
    <SafeAreaView edges={['top']} className="flex-1 pt-24">
      <ScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <SectionTitle title="Notificações">
          {loading ? (
            <ActivityIndicator size="large" color="#205a2d" className="py-10" />
          ) : active.length === 0 ? (
            <ThemedText
              type="body"
              className="text-neutralDark py-10 text-center"
            >
              Não há notificações novas.
            </ThemedText>
          ) : (
            active.map((notif) => {
              const typeKey = (notif.type || 'info').toLowerCase();
              const config =
                NOTIFICATION_CONFIG[typeKey] || NOTIFICATION_CONFIG.info;

              return (
                <NotificationCard
                  key={notif.id}
                  variant={config.variant}
                  title={config.title}
                  iconName={config.icon}
                  description={notif.description}
                  onDismiss={
                    config.dismissable
                      ? () => handleDismiss(notif.id)
                      : undefined
                  }
                />
              );
            })
          )}
        </SectionTitle>
      </ScrollView>
    </SafeAreaView>
  );
}
