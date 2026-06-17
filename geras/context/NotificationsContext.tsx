import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import {
  getDistanceInKm,
  parsePostGISPoint,
} from '@/services/locationHelperService';
import * as Location from 'expo-location';

// Configuração de como as notificações aparecem enquanto a app está aberta (foreground)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowList: true,
  }),
});

interface NotificationsContextType {
  expoPushToken: string | null;
  sendLocalNotification: (title: string, body: string) => Promise<void>;
  saveNotificationToDB: (params: {
    type: string;
    description: string;
    id_senior?: number | null;
    id_caretaker?: number | null;
    id_volunteer?: number | null;
  }) => Promise<void>;
}

const NotificationsContext = createContext<
  NotificationsContextType | undefined
>(undefined);

export function NotificationsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = useAuth();
  const [expoPushToken, setExpoPushToken] = React.useState<string | null>(null);
  const notificationListener = useRef<Notifications.EventSubscription | null>(
    null,
  );
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  // Registar o dispositivo para push notifications
  const registerForPushNotifications = useCallback(async () => {
    if (!Device.isDevice) {
      // Simuladores não suportam push tokens reais
      return null;
    }

    // Pedir permissões
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('NotificationsContext: Permissão de notificações negada.');
      return null;
    }

    // Criar canal Android
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Geras Alertas',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#205a2d',
      });
    }

    try {
      const projectId = '0cb812b9-b636-474f-a176-616ed4e7c804';
      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId,
      });
      return tokenData.data;
    } catch (err) {
      console.log(
        'NotificationsContext: Não foi possível obter push token (normal em Expo Go):',
        err,
      );
      return null;
    }
  }, []);

  // Guardar o push token na tabela users para futura utilização com push remoto
  const savePushTokenToDB = useCallback(
    async (token: string) => {
      if (!profile?.id) return;
      await supabase
        .from('users')
        .update({ push_token: token })
        .eq('id', profile.id);
    },
    [profile?.id],
  );

  // Disparar uma notificação local (aparece enquanto a app está aberta)
  const sendLocalNotification = useCallback(
    async (title: string, body: string) => {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: true,
        },
        trigger: null, // null = dispara imediatamente
      });
    },
    [],
  );

  // Guardar notificação na tabela `notifications` do Supabase
  const saveNotificationToDB = useCallback(
    async (params: {
      type: string;
      description: string;
      id_senior?: number | null;
      id_caretaker?: number | null;
      id_volunteer?: number | null;
    }) => {
      const { error } = await supabase.from('notifications').insert({
        type: params.type,
        description: params.description,
        id_senior: params.id_senior ?? null,
        id_caretaker: params.id_caretaker ?? null,
        id_volunteer: params.id_volunteer ?? null,
      });

      if (error) {
        console.error(
          'NotificationsContext: Erro ao guardar notificação:',
          error,
        );
      }
    },
    [],
  );

  useEffect(() => {
    registerForPushNotifications().then((token) => {
      if (token) {
        setExpoPushToken(token);
        savePushTokenToDB(token);
      }
    });

    // Listener: notificação recebida enquanto a app está aberta
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log(
          'Notificação recebida em foreground:',
          notification.request.content.title,
        );
      });

    // Listener: utilizador clicou numa notificação
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(
          'Utilizador clicou na notificação:',
          response.notification.request.content.title,
        );
      });

    // Listener global para a base de dados (dispara popup em qualquer página)
    let channel: any = null;
    if (profile?.id && profile?.role === 'CARETAKER') {
      channel = supabase
        .channel('global_notifications')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'notifications' },
          async (payload) => {
            const newNotif = payload.new as any;
            if (
              newNotif.type === 'alert' &&
              newNotif.id_caretaker === profile.id
            ) {
              await sendLocalNotification(
                '🔔 Novo Pedido de Ajuda',
                newNotif.description || 'O sénior precisa da sua ajuda.',
              );
            }
          },
        )
        .subscribe();
    } else if (profile?.id && profile?.role === 'VOLUNTEER') {
      // Voluntários: escutar notificações de pedidos públicos em tempo real
      channel = supabase
        .channel('volunteer_notifications')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'notifications' },
          async (payload) => {
            const newNotif = payload.new as any;
            // Reagir a pedidos broadcast (sem id_volunteer específico)
            // OU a notificações dirigidas especificamente a este voluntário
            const isForMe =
              newNotif.id_volunteer === profile.id ||
              (newNotif.type === 'request' && !newNotif.id_volunteer);
            if (isForMe) {
              if (newNotif.type === 'request' && !newNotif.id_volunteer) {
                // Procurar a localização do sénior na base de dados
                const { data: senior, error } = await supabase
                  .from('users')
                  .select('location')
                  .eq('id', newNotif.id_senior)
                  .single();
                if (!error && senior?.location) {
                  const seniorCoords = parsePostGISPoint(senior.location);
                  if (seniorCoords) {
                    try {
                      const { status } =
                        await Location.requestForegroundPermissionsAsync();
                      if (status === 'granted') {
                        const position = await Location.getCurrentPositionAsync(
                          {},
                        );
                        const dist = getDistanceInKm(
                          position.coords.latitude,
                          position.coords.longitude,
                          seniorCoords.latitude,
                          seniorCoords.longitude,
                        );
                        const maxRadius = profile?.action_radius || 5;
                        if (dist <= maxRadius) {
                          await sendLocalNotification(
                            '🤝 Novo Pedido de Ajuda',
                            newNotif.description ||
                              'Há um pedido de ajuda na tua área!',
                          );
                        }
                      }
                    } catch (err) {
                      console.log(
                        'Erro ao obter localização no listener:',
                        err,
                      );
                    }
                  }
                }
              } else {
                // Notificação dirigida especificamente a este voluntário
                await sendLocalNotification(
                  '🤝 Novo Pedido de Ajuda',
                  newNotif.description || 'Há um pedido de ajuda na tua área!',
                );
              }
            }
          },
        )
        .subscribe();
    } else if (profile?.id && profile?.role === 'SENIOR') {
      // Seniores: escutar notificações de medicação, pedidos aceites, etc.
      channel = supabase
        .channel('senior_notifications')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'notifications' },
          async (payload) => {
            const newNotif = payload.new as any;
            // O sénior só quer ver popups das notificações diretamente para ele
            if (
              newNotif.id_senior === profile.id &&
              !newNotif.id_caretaker &&
              !newNotif.id_volunteer
            ) {
              let title = '🔔 Geras';
              if (newNotif.type === 'medication')
                title = '💊 Hora da Medicação';
              if (newNotif.type === 'accepted_request')
                title = '✅ O seu pedido foi aceite!';

              await sendLocalNotification(
                title,
                newNotif.description || 'Tens uma nova notificação.',
              );
            }
          },
        )
        .subscribe();
    }

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
      if (channel) supabase.removeChannel(channel);
    };
  }, [
    registerForPushNotifications,
    savePushTokenToDB,
    profile?.id,
    profile?.role,
    sendLocalNotification,
  ]);

  return (
    <NotificationsContext.Provider
      value={{ expoPushToken, sendLocalNotification, saveNotificationToDB }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error(
      'useNotifications deve ser usado dentro de NotificationsProvider',
    );
  }
  return context;
}
