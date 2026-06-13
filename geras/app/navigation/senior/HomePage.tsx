import BigButton from '@/components/senior/BigButton';
import HelpButton from '@/components/senior/HelpButton';
import {
  ActionButton,
  NotificationCard,
} from '@/components/shared/Notification';
import SectionTitle from '@/components/shared/SectionTitle';
import { ThemedText } from '@/components/ThemedText';
import { Linking, View, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

// ── Tipos de notificação ──────────────────────────────────────────────────────
// Mapeamento: valor do campo `type` no Supabase → configuração visual
// Ordenação de prioridade: alert(0) > request/health(1) > medication/motion/info/pantry(2)
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
    /** Se false, o sénior não pode fechar esta notificação */
    dismissable: boolean;
  }
> = {
  alert: {
    variant: 'alert',
    icon: 'report',
    title: 'Urgente',
    priority: 0,
    ttlHours: undefined, // só o cuidador pode fechar
    dismissable: false,
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
  accepted_request: {
    variant: 'info',
    icon: 'check-circle',
    title: 'Pedido Aceite',
    priority: 1,
    ttlHours: 48,
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

export default function Home() {
  const { profile } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [caretakerName, setCaretakerName] = useState<string>('');

  useFocusEffect(
    useCallback(() => {
      async function fetchData() {
        if (!profile?.id) return;
        setLoading(true);
        try {
          const now = new Date().toISOString();
          const { data: notifs } = await supabase
            .from('notifications')
            .select('*')
            .eq('id_senior', profile.id)
            .is('id_caretaker', null)
            .is('id_volunteer', null)
            .is('dismissed_at', null)
            .or(`expires_at.is.null,expires_at.gt.${now}`)
            .order('created_at', { ascending: false });

          if (notifs) {
            const sorted = [...notifs].sort((a, b) => {
              const typeA = (a.type || 'info').toLowerCase();
              const typeB = (b.type || 'info').toLowerCase();
              const prioA = NOTIFICATION_CONFIG[typeA]?.priority ?? 99;
              const prioB = NOTIFICATION_CONFIG[typeB]?.priority ?? 99;
              return prioA - prioB;
            });
            setNotifications(sorted);
          }

          const { data: assoc } = await supabase
            .from('senior_caretaker')
            .select('caretaker:users!id_caretaker(name)')
            .eq('id_senior', profile.id)
            .limit(1)
            .maybeSingle();

          if (assoc?.caretaker) {
            const name = Array.isArray(assoc.caretaker)
              ? assoc.caretaker[0]?.name
              : (assoc.caretaker as any).name;
            if (name) setCaretakerName(name.split(' ')[0]);
          }
        } catch (err) {
          console.error('Error fetching homepage data:', err);
        } finally {
          setLoading(false);
        }
      }
      fetchData();
    }, [profile?.id]),
  );

  const handleDismiss = useCallback(async (notificationId: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));

    const { error } = await supabase
      .from('notifications')
      .update({ dismissed_at: new Date().toISOString() })
      .eq('id', notificationId);

    if (error) {
      console.error('Erro ao dispensar notificação (RLS?):', error.message);
    }
  }, []);

  return (
    <>
      <SafeAreaView edges={['top']} className="flex-1 px-6 pt-24">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120, gap: 0 }}
          className="flex-1"
        >
          <View>
            <SectionTitle title={'Notificações'}>
              {loading ? (
                <ActivityIndicator size="large" color="#2F5C3E" />
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
                    />
                  );
                })
              ) : (
                <ThemedText
                  type="body"
                  className="text-neutralDark py-10 text-center"
                >
                  Não há notificações novas
                </ThemedText>
              )}
            </SectionTitle>
          </View>

          <View className="-m-4 mb-20 mt-4 flex-row flex-wrap">
            <View className="aspect-square w-1/2 p-4">
              <BigButton
                iconName={'health-and-safety'}
                label={'Saúde'}
                route={'../../navigation/senior/Health'}
              />
            </View>

            <View className="aspect-square w-1/2 p-4">
              <BigButton
                iconName={'people'}
                label={'Pedir ajuda'}
                route={'../../navigation/senior/RequestHelp'}
              />
            </View>

            <View className="aspect-square w-1/2 p-4">
              <BigButton
                iconName={'shopping-cart'}
                label={'Mercearias'}
                route={'../../navigation/senior/Groceries'}
              />
            </View>

            <View className="aspect-square w-1/2 p-4">
              <BigButton
                iconName={'phone'}
                label={caretakerName ? `Ligar a ${caretakerName}` : 'Ligar'}
                onPress={() => {
                  Linking.openURL(`tel:${963744454}`);
                }}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
      <View
        className="absolute bottom-4 left-0 right-0 z-50 items-center"
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Pedir ajuda de emergência"
        accessibilityHint="Toca duas vezes para acionar o alerta de ajuda"
      >
        <HelpButton />
      </View>
    </>
  );
}
