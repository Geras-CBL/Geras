import { useRef, useState, useCallback, useMemo } from 'react';
import { FlatList, View, ActivityIndicator } from 'react-native';
import { RequestData } from '@/data/requestVolunteerData';
import CardPedidos from '@/components/volunteer/CardPedidos';
import { ThemedText } from '@/components/ThemedText';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import RequestDetailsBottomSheet from '@/components/volunteer/RequestsBottomSheet';
import { useRouter, useFocusEffect } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { getDistanceInKm } from '@/services/locationHelperService';

interface PedidosHomePageProps {
  filterStatus: 'todos' | 'disponivel' | 'decorrer';
  filterSenior: string | null;
  filterType: 'todos' | 'cleaning' | 'food' | 'other';
}

export default function PedidosHomePage({
  filterStatus,
  filterSenior,
  filterType,
}: Readonly<PedidosHomePageProps>) {
  const router = useRouter();
  const { profile } = useAuth();
  const [requests, setRequests] = useState<RequestData[]>([]);
  const [loading, setLoading] = useState(true);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [selectedRequest, setSelectedRequest] = useState<RequestData | null>(
    null,
  );
  const [declinedIds, setDeclinedIds] = useState<string[]>([]);

  const fetchRequests = useCallback(async () => {
    if (!profile?.id) return;
    setLoading(true);

    const storedDeclined = await AsyncStorage.getItem(
      `declined_requests_${profile.id}`,
    );
    const declinedList: string[] = storedDeclined
      ? JSON.parse(storedDeclined)
      : [];
    setDeclinedIds(declinedList);

    try {
      const { data, error } = await supabase
        .from('requests')
        .select('*, senior:users!id_senior(name, profile_picture, gender)')
        .in('state', ['PENDING', 'ACCEPTED'])
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const formatted: RequestData[] = data.map((req) => ({
          id: req.id.toString(),
          name: req.senior?.name || 'Sénior',
          gender: req.senior?.gender,
          category: req.category || 'Pedido',
          task: req.description || '',
          type:
            req.category?.toLowerCase() === 'compras'
              ? 'food'
              : req.category?.toLowerCase() === 'medicamentos'
                ? 'pharmacy'
                : req.category?.toLowerCase() === 'limpeza'
                  ? 'cleaning'
                  : 'other',
          state: req.state === 'ACCEPTED',
          isNew:
            req.state === 'PENDING' &&
            Date.now() - new Date(req.created_at).getTime() <
              24 * 60 * 60 * 1000,
          date: new Date(req.created_at).toLocaleDateString('pt-PT'),
          time: new Date(req.created_at).toLocaleTimeString('pt-PT', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }),
          imageUrl: req.senior?.profile_picture || '',
          distance: req.distance ? `${req.distance} Km` : 'N/A',
          location: req.location_address || 'Endereço não disponível',
          latitude: req.latitude || 40.6405,
          longitude: req.longitude || -8.6538,
        }));

        // Filtrar pedidos recusados localmente
        let filtered = formatted.filter((r) => !declinedList.includes(r.id));

        // Aplicar filtragem de raio com base na localização atual do voluntário
        if (global.navigator && global.navigator.geolocation) {
          global.navigator.geolocation.getCurrentPosition(
            (position) => {
              const uLat = position.coords.latitude;
              const uLng = position.coords.longitude;
              const maxRadius = profile?.action_radius || 5; // Raio em Km (5 por defeito)

              filtered = filtered.filter((req) => {
                const dist = getDistanceInKm(
                  uLat,
                  uLng,
                  req.latitude,
                  req.longitude,
                );
                // Atualizar dinamicamente a distância para o ecrã
                req.distance = `${dist.toFixed(1)} Km`;
                return dist <= maxRadius;
              });

              setRequests(filtered);
            },
            (err) => {
              console.log(
                'Erro ao obter localização para filtrar a lista:',
                err,
              );
              // Fallback: caso dê erro de GPS, carrega todos sem filtragem geográfica
              setRequests(filtered);
            },
          );
        } else {
          // Fallback sem suporte a localização
          setRequests(filtered);
        }
      }
    } catch (err) {
      console.error('Error fetching volunteer requests:', err);
    } finally {
      setLoading(false);
    }
  }, [profile?.id, profile?.action_radius]);

  useFocusEffect(
    useCallback(() => {
      fetchRequests();
    }, [fetchRequests]),
  );

  const filteredRequests = useMemo(() => {
    return requests.filter((item) => {
      let matchesStatus = true;
      if (filterStatus === 'disponivel') matchesStatus = item.state === false;
      if (filterStatus === 'decorrer') matchesStatus = item.state === true;

      let matchesSenior = true;
      if (filterSenior) {
        matchesSenior = item.name
          .toLowerCase()
          .includes(filterSenior.toLowerCase());
      }

      let matchesType = true;
      if (filterType !== 'todos') {
        matchesType = item.type === filterType;
      }

      return matchesStatus && matchesSenior && matchesType;
    });
  }, [requests, filterStatus, filterSenior, filterType]);

  const handleCardPress = useCallback(
    (item: RequestData) => {
      if (item.state === false) {
        setSelectedRequest(item);
        bottomSheetModalRef.current?.present();
      } else {
        router.push({
          pathname: '/navigation/volunteer/RequestDetails',
          params: { type: String(item.type), requestId: item.id },
        });
      }
    },
    [router],
  );

  const handleAcceptRequest = async () => {
    if (!selectedRequest || !profile?.id) return;
    try {
      const { error } = await supabase
        .from('requests')
        .update({
          id_volunteer: profile.id,
          state: 'ACCEPTED',
        })
        .eq('id', selectedRequest.id);

      if (error) throw error;
      bottomSheetModalRef.current?.dismiss();
      fetchRequests();
    } catch (err) {
      console.error('Error accepting request:', err);
    }
  };

  const handleDeclineRequest = async () => {
    if (!selectedRequest || !profile?.id) return;

    // Guardar o ID recusado localmente
    const updatedDeclined = [...declinedIds, selectedRequest.id];
    setDeclinedIds(updatedDeclined);
    await AsyncStorage.setItem(
      `declined_requests_${profile.id}`,
      JSON.stringify(updatedDeclined),
    );

    // Remover da lista local imediatamente
    setRequests((prev) => prev.filter((r) => r.id !== selectedRequest.id));
    bottomSheetModalRef.current?.dismiss();
  };

  if (loading) {
    return (
      <View className="mt-10 items-center justify-center">
        <ActivityIndicator size="large" color="#205a2d" />
      </View>
    );
  }

  return (
    <View className="flex-1">
      <FlatList
        data={filteredRequests}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        className="flex-1"
        contentContainerClassName="gap-4 p-4 -m-4 pb-32"
        renderItem={({ item }) => {
          return (
            <View className="mb-4">
              <CardPedidos
                name={item.name}
                gender={item.gender}
                category={item.category || ''}
                task={item.task}
                state={item.state}
                isNew={item.isNew}
                date={item.date}
                time={item.time}
                variant="home"
                imageUrl={item.imageUrl}
                onPress={() => handleCardPress(item)}
                type={String(item.type)}
              />
            </View>
          );
        }}
        ListEmptyComponent={() => (
          <View className="mt-10 items-center justify-center">
            <ThemedText type="bodyInfo" className="text-neutral">
              Não existem pedidos disponíveis.
            </ThemedText>
          </View>
        )}
      />

      <RequestDetailsBottomSheet
        ref={bottomSheetModalRef}
        request={selectedRequest}
        onAccept={handleAcceptRequest}
        onDecline={handleDeclineRequest}
      />
    </View>
  );
}
