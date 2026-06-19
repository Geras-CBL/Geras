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
  getUserCoordinate,
} from '@/services/locationHelperService';

import { Database } from '@/types/supabase';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowList: true,
  }),
});
// Exportar o tipo Notification para ser reutilizado
export type Notification = Database['public']['Tables']['notifications']['Row'];

interface NotificationsContextType {
  expoPushToken: string | null;
  notifications: Notification[];
  unreadCount: number;
  loading: boolean; // Mantido por compatibilidade
  isLoading: boolean; // Novo padrão proposto
  sendLocalNotification: (title: string, body: string) => Promise<void>;
  saveNotificationToDB: (params: {
    type: string;
    description: string;
    id_senior?: number | null;
    id_caretaker?: number | null;
    id_volunteer?: number | null;
  }) => Promise<void>;
  refreshNotifications: () => Promise<void>;
  dismiss: (notificationId: number) => Promise<void>;
  dismissAll: () => Promise<void>;
}

const NotificationsContext = createContext<
  NotificationsContextType | undefined
>(undefined);

const allowedTypes: Record<string, string[]> = {
  SENIOR: ['medication', 'health', 'accepted_request', 'completed_request'],
  CARETAKER: [
    'medication',
    'health',
    'motion',
    'request',
    'community_request',
    'accepted_request',
    'completed_request',
    'alert',
    'info',
  ],
  VOLUNTEER: ['request', 'voucher'],
};

const labelByType: Record<string, string> = {
  medication: '💊 Hora da Medicação',
  health: '🚨 Alerta de Saúde',
  motion: '🚶 Alerta de Movimento',
  request: '🤝 Pedido de Ajuda',
  community_request: '🤝 Pedido da Comunidade',
  accepted_request: '✅ O seu pedido foi aceite!',
  completed_request: '✅ O seu pedido foi completado!',
  voucher: '🎫 Novo Voucher Disponível',
};

export function NotificationsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = useAuth();
  const [expoPushToken, setExpoPushToken] = React.useState<string | null>(null);
  const [notifications, setNotifications] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  const notificationListener = useRef<Notifications.EventSubscription | null>(
    null,
  );
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  const registerForPushNotifications = useCallback(async () => {
    if (!Device.isDevice) return null;

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('NotificationsContext: Permissão negada.');
      return null;
    }

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
        'NotificationsContext: Não foi possível obter token push:',
        err,
      );
      return null;
    }
  }, []);

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

  const sendLocalNotification = useCallback(
    async (title: string, body: string) => {
      await Notifications.scheduleNotificationAsync({
        content: { title, body, sound: true },
        trigger: null,
      });
    },
    [],
  );

  const fetchNotifications = useCallback(async () => {
    if (!profile?.id) {
      setNotifications([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const now = new Date().toISOString();

      if (profile.role === 'CARETAKER') {
        // 1. Procurar os IDs dos seniores associados ao cuidador
        const { data: relations } = await supabase
          .from('senior_caretaker')
          .select('id_senior')
          .eq('id_caretaker', profile.id);

        const seniorIds = relations?.map((r) => r.id_senior) || [];

        // 2. Executar as queries paralela e juntar no cliente
        const queries = [];

        // Notificações endereçadas diretamente ao cuidador
        queries.push(
          supabase
            .from('notifications')
            .select('*')
            .eq('id_caretaker', profile.id)
            .in('type', [
              'request',
              'community_request',
              'accepted_request',
              'completed_request',
            ])
            .is('dismissed_at', null)
            .or(`expires_at.is.null,expires_at.gt.${now}`),
        );

        // Notificações de saúde, medicação e movimento dos seniores associados
        if (seniorIds.length > 0) {
          queries.push(
            supabase
              .from('notifications')
              .select('*')
              .in('id_senior', seniorIds)
              .in('type', ['medication', 'health', 'motion', 'alert', 'info'])
              .is('dismissed_at', null)
              .or(`expires_at.is.null,expires_at.gt.${now}`),
          );
        }

        const results = await Promise.all(queries);
        let merged: Notification[] = [];

        results.forEach((res) => {
          if (res.data) {
            merged = [...merged, ...res.data];
          }
        });

        // Ordenar por created_at descendente
        merged.sort((a, b) => {
          const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
          return timeB - timeA;
        });

        setNotifications(merged);
      } else if (profile.role === 'VOLUNTEER') {
        const { data, error } = await supabase
          .from('notifications')
          .select('*, senior:users!id_senior(location)')
          .or(
            `id_volunteer.eq.${profile.id},and(type.eq.request,id_volunteer.is.null,id_caretaker.is.null)`,
          )
          .is('dismissed_at', null)
          .or(`expires_at.is.null,expires_at.gt.${now}`)
          .order('created_at', { ascending: false });

        if (!error && data) {
          const notificationsWithRequest = data as any[];
          const missingSeniorRequestIds = notificationsWithRequest
            .filter((n) => !n.id_senior && n.id_request)
            .map((n) => n.id_request);

          let requestMap: Record<number, { id_senior: number; location: any }> =
            {};

          if (missingSeniorRequestIds.length > 0) {
            const { data: requestsData } = await supabase
              .from('requests')
              .select('id, id_senior, senior:users!id_senior(location)')
              .in('id', missingSeniorRequestIds);

            if (requestsData) {
              requestsData.forEach((req: any) => {
                if (req.id_senior) {
                  requestMap[req.id] = {
                    id_senior: req.id_senior,
                    location: req.senior?.location,
                  };
                }
              });
            }
          }

          const volunteerCoord = getUserCoordinate(
            (profile as any).location,
            profile.id,
          );
          const radiusLimit = profile.action_radius || 10;

          const filtered = notificationsWithRequest.filter((notif) => {
            if (notif.type === 'voucher') return true;
            if (notif.type === 'request') {
              let seniorId = notif.id_senior;
              let seniorLoc = notif.senior?.location;

              if (
                !seniorId &&
                notif.id_request &&
                requestMap[notif.id_request]
              ) {
                seniorId = requestMap[notif.id_request].id_senior;
                seniorLoc = requestMap[notif.id_request].location;
              }

              const seniorCoord = getUserCoordinate(seniorLoc, seniorId);

              const distance = getDistanceInKm(
                volunteerCoord.latitude,
                volunteerCoord.longitude,
                seniorCoord.latitude,
                seniorCoord.longitude,
              );
              return distance <= radiusLimit;
            }
            return false;
          });

          setNotifications(filtered);
        }
      } else if (profile.role === 'SENIOR') {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('id_senior', profile.id)
          .in('type', [
            'medication',
            'health',
            'accepted_request',
            'completed_request',
          ])
          .is('dismissed_at', null)
          .or(`expires_at.is.null,expires_at.gt.${now}`)
          .order('created_at', { ascending: false });

        if (!error && data) setNotifications(data);
      }
    } catch (err) {
      console.error('Erro ao carregar notificações centralizadas:', err);
    } finally {
      setLoading(false);
    }
  }, [profile?.id, profile?.role]);
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

    fetchNotifications();

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log(
          'Notificação recebida em foreground:',
          notification.request.content.title,
        );
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(
          'Utilizador clicou na notificação:',
          response.notification.request.content.title,
        );
      });

    let isMounted = true;
    let activeChannels: any[] = [];

    const setupSubscriptions = async () => {
      if (!profile?.id) return;

      const handlePayload = async (payload: any) => {
        if (!isMounted) return;
        if (payload.eventType === 'INSERT') {
          const newNotif = payload.new as Notification;
          const roleAllowedTypes = allowedTypes[profile.role] || [];

          if (!roleAllowedTypes.includes(newNotif.type || '')) return;

          // Adicionar ao estado local se não existir
          setNotifications((prev) => {
            if (prev.some((n) => n.id === newNotif.id)) return prev;
            return [newNotif, ...prev];
          });

          // Disparar notificação local
          let title = '🔔 Geras';
          if (newNotif.type && labelByType[newNotif.type]) {
            title = labelByType[newNotif.type];
          }
          await sendLocalNotification(
            title,
            newNotif.description || 'Tem uma nova notificação.',
          );
        } else if (payload.eventType === 'UPDATE') {
          const updatedNotif = payload.new as Notification;
          if (updatedNotif.dismissed_at) {
            // Se foi descartada, removemos da lista
            setNotifications((prev) =>
              prev.filter((n) => n.id !== updatedNotif.id),
            );
          }
        }
      };

      if (profile.role === 'SENIOR') {
        const chan = supabase
          .channel(`notifications:senior:${profile.id}`)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'notifications',
              filter: `id_senior=eq.${profile.id}`,
            },
            handlePayload,
          )
          .subscribe();
        if (!isMounted) {
          supabase.removeChannel(chan);
          return;
        }
        activeChannels.push(chan);
      } else if (profile.role === 'VOLUNTEER') {
        const chan = supabase
          .channel(`notifications:volunteer:${profile.id}`)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'notifications',
              filter: `id_volunteer=eq.${profile.id}`,
            },
            handlePayload,
          )
          .subscribe();
        if (!isMounted) {
          supabase.removeChannel(chan);
          return;
        }
        activeChannels.push(chan);

        const communityChan = supabase
          .channel(`notifications:volunteer:community`)
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'notifications',
              filter: 'type=eq.request',
            },
            async (payload) => {
              if (!isMounted) return;
              const newNotif = payload.new as any;
              if (newNotif.id_caretaker || newNotif.id_volunteer) return;

              let seniorId = newNotif.id_senior;
              let seniorLoc = null;

              if (!seniorId && newNotif.id_request) {
                const { data: reqData } = await supabase
                  .from('requests')
                  .select('id_senior, senior:users!id_senior(location)')
                  .eq('id', newNotif.id_request)
                  .single();

                if (reqData && reqData.id_senior) {
                  seniorId = reqData.id_senior;
                  seniorLoc = (reqData as any).senior?.location;
                }
              } else if (seniorId) {
                const { data: senior } = await supabase
                  .from('users')
                  .select('location')
                  .eq('id', seniorId)
                  .single();
                if (senior) {
                  seniorLoc = senior.location;
                }
              }

              if (!isMounted) return;

              const volunteerCoord = getUserCoordinate(
                (profile as any).location,
                profile.id,
              );
              const seniorCoord = getUserCoordinate(seniorLoc, seniorId);

              const distance = getDistanceInKm(
                volunteerCoord.latitude,
                volunteerCoord.longitude,
                seniorCoord.latitude,
                seniorCoord.longitude,
              );

              const radiusLimit = profile.action_radius || 10;
              if (distance <= radiusLimit) {
                setNotifications((prev) => {
                  if (prev.some((n) => n.id === newNotif.id)) return prev;
                  return [newNotif, ...prev];
                });

                let title = '🤝 Pedido de Ajuda';
                await sendLocalNotification(
                  title,
                  newNotif.description || 'Novo pedido de ajuda na sua área.',
                );
              }
            },
          )
          .subscribe();
        if (!isMounted) {
          supabase.removeChannel(communityChan);
          return;
        }
        activeChannels.push(communityChan);
      } else if (profile.role === 'CARETAKER') {
        // Canal para notificações diretas do cuidador
        const caretakerChan = supabase
          .channel(`notifications:caretaker:${profile.id}`)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'notifications',
              filter: `id_caretaker=eq.${profile.id}`,
            },
            handlePayload,
          )
          .subscribe();
        if (!isMounted) {
          supabase.removeChannel(caretakerChan);
          return;
        }
        activeChannels.push(caretakerChan);

        // Procurar seniores para criar canais adicionais
        const { data: relations } = await supabase
          .from('senior_caretaker')
          .select('id_senior')
          .eq('id_caretaker', profile.id);

        if (!isMounted) return;

        const seniorIds = relations?.map((r) => r.id_senior) || [];

        seniorIds.forEach((seniorId) => {
          const seniorChan = supabase
            .channel(`notifications:caretaker:senior:${seniorId}`)
            .on(
              'postgres_changes',
              {
                event: '*',
                schema: 'public',
                table: 'notifications',
                filter: `id_senior=eq.${seniorId}`,
              },
              handlePayload,
            )
            .subscribe();
          if (!isMounted) {
            supabase.removeChannel(seniorChan);
            return;
          }
          activeChannels.push(seniorChan);
        });
      }
    };

    setupSubscriptions();

    return () => {
      isMounted = false;
      notificationListener.current?.remove();
      responseListener.current?.remove();
      activeChannels.forEach((chan) => supabase.removeChannel(chan));
    };
  }, [
    registerForPushNotifications,
    savePushTokenToDB,
    profile?.id,
    profile?.role,
    fetchNotifications,
    sendLocalNotification,
  ]);

  const dismiss = useCallback(async (id: number) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ dismissed_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      // Remover do estado local
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error('Erro ao descartar notificação:', err);
    }
  }, []);

  const dismissAll = useCallback(async () => {
    try {
      if (notifications.length === 0) return;
      const ids = notifications.map((n) => n.id);

      const { error } = await supabase
        .from('notifications')
        .update({ dismissed_at: new Date().toISOString() })
        .in('id', ids);

      if (error) throw error;

      // Limpar estado local
      setNotifications([]);
    } catch (err) {
      console.error('Erro ao descartar todas as notificações:', err);
    }
  }, [notifications]);

  return (
    <NotificationsContext.Provider
      value={{
        expoPushToken,
        notifications,
        unreadCount: notifications.length,
        loading,
        isLoading: loading, // mapeado para compatibilidade
        sendLocalNotification,
        saveNotificationToDB,
        refreshNotifications: fetchNotifications,
        dismiss,
        dismissAll,
      }}
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
