import BigButton from '@/components/senior/BigButton';
import HelpButton from '@/components/senior/HelpButton';
import {
  ActionButton,
  NotificationCard,
} from '@/components/shared/Notification';
import SectionTitle from '@/components/shared/SectionTitle';
import { ThemedText } from '@/components/ThemedText';
import { Linking, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { syncHealthData } from '@/services/healthService';

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
          const { data: notifs } = await supabase
            .from('notifications')
            .select('*')
            .eq('id_senior', profile.id);
          if (notifs) setNotifications(notifs);

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

          // Executar a sincronização de saúde em background de forma assíncrona
          syncHealthData(profile.id).catch((err) =>
            console.error('Erro ao sincronizar saúde na HomePage:', err),
          );
        } catch (err) {
          console.error('Error fetching homepage data:', err);
        } finally {
          setLoading(false);
        }
      }
      fetchData();
    }, [profile?.id]),
  );

  return (
    <>
      <SafeAreaView
        edges={['top']}
        className="flex-1 items-center gap-12 p-4 px-6 pt-24"
      >
        <SectionTitle title={'Notificações'}>
          {loading ? (
            <ActivityIndicator size="large" color="#2F5C3E" />
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
        <View className="-m-4 flex-row flex-wrap">
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
