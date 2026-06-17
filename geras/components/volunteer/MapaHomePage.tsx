import { useRef, useState, useCallback, useEffect } from 'react';
import { View, Pressable } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { REQUESTS_DATA, RequestData } from '@/data/requestVolunteerData';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import RequestDetailsBottomSheet from '@/components/volunteer/RequestsBottomSheet';
import VoucherBottomSheet from '@/components/volunteer/VoucherBottomSheet';
import Pin_Marker_ from '@/assets/illustrations/Pin_Marker_.png';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { VoucherData } from '@/data/vouchersData';
import { syncVolunteerVouchers } from '@/services/vouchersVolunteerService';
import {
  getDistanceInKm,
  getVoucherCoordinate,
  parsePostGISPoint,
} from '@/services/locationHelperService';
import { useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';

export default function MapaHomePage() {
  const { profile } = useAuth();
  const [requests, setRequests] = useState<RequestData[]>([]);
  const [vouchers, setVouchers] = useState<VoucherData[]>([]);

  const mapRef = useRef<MapView>(null);
  const [hasCentered, setHasCentered] = useState(false);

  // Localização do utilizador voluntário
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    async function getInitialLocation() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const position = await Location.getCurrentPositionAsync({});
          const newLoc = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setUserLocation(newLoc);

          mapRef.current?.animateToRegion(
            {
              ...newLoc,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            },
            1000,
          );
          setHasCentered(true);
        }
      } catch (err) {
        console.log('Erro ao obter localização inicial no mapa:', err);
      }
    }
    getInitialLocation();
  }, []);

  // Bottom Sheets
  const requestBottomSheetRef = useRef<BottomSheetModal>(null);
  const voucherBottomSheetRef = useRef<BottomSheetModal>(null);

  const [selectedRequest, setSelectedRequest] = useState<RequestData | null>(
    null,
  );
  const [selectedVoucher, setSelectedVoucher] = useState<VoucherData | null>(
    null,
  );

  const INITIAL_REGION = {
    latitude: userLocation?.latitude || 40.6405,
    longitude: userLocation?.longitude || -8.6538,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  const fetchRequests = useCallback(async () => {
    if (!profile?.id) return;
    try {
      const storedDeclined = await AsyncStorage.getItem(
        `declined_requests_${profile.id}`,
      );
      const declinedList: string[] = storedDeclined
        ? JSON.parse(storedDeclined)
        : [];

      const { data, error } = await supabase
        .from('requests')
        .select(
          '*, senior:users!id_senior(name, profile_picture, gender, location, address, zip_code, local)',
        )
        .in('state', ['PENDING', 'ACCEPTED'])
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const formatted: RequestData[] = data.map((req) => {
          const coords = parsePostGISPoint(req.senior?.location);
          return {
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
            location:
              req.location_address ||
              (req.senior?.address
                ? `${req.senior.address}, ${req.senior.zip_code || ''} ${req.senior.local || ''}`.trim()
                : 'Endereço não disponível'),
            latitude: coords?.latitude || 40.6405,
            longitude: coords?.longitude || -8.6538,
          };
        });

        // Filtrar pedidos recusados localmente
        const filtered = formatted.filter((r) => !declinedList.includes(r.id));
        setRequests(filtered);
      }
    } catch (err) {
      console.error('Erro a carregar pedidos no mapa:', err);
    }
  }, [profile?.id]);

  // Carregar e sincronizar vouchers
  const fetchVouchers = useCallback(async () => {
    if (!profile?.id) return;
    try {
      await syncVolunteerVouchers(profile.id);

      const { data, error } = await supabase
        .from('vouchers_volunteer')
        .select(
          `
          status,
          current_tasks,
          vouchers (
            id,
            store_name,
            address,
            value,
            needed_tasks,
            location
          )
        `,
        )
        .eq('id_volunteer', profile.id);

      if (error) throw error;

      if (data) {
        const mapped = data.map((item: any, index: number) => {
          let distStr = 'N/A';
          const storeCoord = getVoucherCoordinate(
            item.vouchers.location,
            item.vouchers.id.toString(),
          );
          if (userLocation) {
            const dist = getDistanceInKm(
              userLocation.latitude,
              userLocation.longitude,
              storeCoord.latitude,
              storeCoord.longitude,
            );
            distStr = `${dist.toFixed(1)} Km`;
          }

          return {
            id: item.vouchers.id.toString(),
            name_store: item.vouchers.store_name,
            address: item.vouchers.address || '',
            value: `${item.vouchers.value}%`,
            currentTasks: item.current_tasks || 0,
            totalTasks: item.vouchers.needed_tasks || 5,
            status: item.status,
            distance: distStr,
            latitude: storeCoord?.latitude || 40.6405,
            longitude: storeCoord?.longitude || -8.6538,
          };
        });
        setVouchers(mapped);
      }
    } catch (err) {
      console.error('Erro ao carregar vouchers no mapa:', err);
    }
  }, [profile?.id, userLocation]);

  useFocusEffect(
    useCallback(() => {
      fetchRequests();
      fetchVouchers();
    }, [fetchRequests, fetchVouchers]),
  );

  // Ao pressionar uma tarefa
  const handleMarkerPress = useCallback((item: RequestData) => {
    setSelectedRequest(item);
    requestBottomSheetRef.current?.present();
  }, []);

  // Ao pressionar um voucher
  const handleVoucherMarkerPress = useCallback((item: VoucherData) => {
    setSelectedVoucher(item);
    voucherBottomSheetRef.current?.present();
  }, []);

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
      requestBottomSheetRef.current?.dismiss();
      fetchRequests();
    } catch (err) {
      console.error('Erro ao aceitar pedido no mapa:', err);
    }
  };

  const handleDeclineRequest = async () => {
    if (!selectedRequest || !profile?.id) return;
    try {
      const storedDeclined = await AsyncStorage.getItem(
        `declined_requests_${profile.id}`,
      );
      const declinedList: string[] = storedDeclined
        ? JSON.parse(storedDeclined)
        : [];
      const updatedDeclined = [...declinedList, selectedRequest.id];
      await AsyncStorage.setItem(
        `declined_requests_${profile.id}`,
        JSON.stringify(updatedDeclined),
      );
      setRequests((prev) => prev.filter((r) => r.id !== selectedRequest.id));
      requestBottomSheetRef.current?.dismiss();
    } catch (err) {
      console.error('Erro ao recusar pedido no mapa:', err);
    }
  };

  // Filtrar os pedidos que estão dentro do raio de ação do voluntário
  const visibleRequests = requests.filter((req) => {
    if (!userLocation) return true; // Se ainda não obteve GPS, mostra todos para evitar mapa vazio

    const reqDistance = getDistanceInKm(
      userLocation.latitude,
      userLocation.longitude,
      req.latitude,
      req.longitude,
    );

    req.distance = `${reqDistance.toFixed(1)} Km`;

    const maxRadius = profile?.action_radius || 5; // Raio máximo em Km (padrão 5 Km)
    return reqDistance <= maxRadius;
  });

  return (
    <View className="flex-1 overflow-hidden rounded-2xl bg-neutralLight">
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={INITIAL_REGION}
        provider={PROVIDER_DEFAULT}
        showsUserLocation={true}
        onUserLocationChange={(event) => {
          const coord = event.nativeEvent.coordinate;
          if (coord) {
            const newLoc = {
              latitude: coord.latitude,
              longitude: coord.longitude,
            };
            setUserLocation(newLoc);
            if (!hasCentered) {
              mapRef.current?.animateToRegion(
                {
                  ...newLoc,
                  latitudeDelta: 0.05,
                  longitudeDelta: 0.05,
                },
                1000,
              );
              setHasCentered(true);
            }
          }
        }}
        onPress={() => {
          requestBottomSheetRef.current?.dismiss();
          voucherBottomSheetRef.current?.dismiss();
        }}
      >
        {/* Marcadores das Tarefas (Pedidos Filtrados por Raio) */}
        {visibleRequests.map((request) => (
          <Marker
            key={`request-${request.id}`}
            coordinate={{
              latitude: request.latitude,
              longitude: request.longitude,
            }}
            onPress={() => handleMarkerPress(request)}
            image={Pin_Marker_}
          />
        ))}

        {/* Marcadores dos Vouchers */}
        {vouchers.map((voucher) => {
          const isAvailable = voucher.status === 'AVAILABLE';
          const coord = {
            latitude: voucher.latitude || 40.6405,
            longitude: voucher.longitude || -8.6538,
          };

          return (
            <Marker
              key={`voucher-${voucher.id}`}
              coordinate={coord}
              onPress={() => handleVoucherMarkerPress(voucher)}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: isAvailable ? '#ffd700' : '#9ca3af',
                  borderWidth: 2,
                  borderColor: '#ffffff',
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                }}
              >
                <MaterialIcons
                  name={isAvailable ? 'card-giftcard' : 'lock-outline'}
                  size={20}
                  color="#ffffff"
                />
              </View>
            </Marker>
          );
        })}
      </MapView>

      {/* Bottom Sheet de Detalhes do Pedido */}
      <RequestDetailsBottomSheet
        ref={requestBottomSheetRef}
        request={selectedRequest}
        onAccept={handleAcceptRequest}
        onDecline={handleDeclineRequest}
      />

      {/* Bottom Sheet de Detalhes do Voucher */}
      <VoucherBottomSheet
        ref={voucherBottomSheetRef}
        voucher={selectedVoucher}
        onVoucherUsed={fetchVouchers}
      />
    </View>
  );
}
