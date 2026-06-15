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
} from '@/services/locationHelperService';
import { MaterialIcons } from '@expo/vector-icons';

export default function MapaHomePage() {
  const { profile } = useAuth();
  const [requests, setRequests] = useState<RequestData[]>(REQUESTS_DATA);
  const [vouchers, setVouchers] = useState<VoucherData[]>([]);

  // Localização do utilizador voluntário
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

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
    latitude: 40.6405,
    longitude: -8.6538,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

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
            needed_tasks
          )
        `,
        )
        .eq('id_volunteer', profile.id);

      if (error) throw error;

      if (data) {
        const mapped = data.map((item: any, index: number) => {
          let distStr = 'N/A';
          if (userLocation) {
            const storeCoord = getVoucherCoordinate(
              item.vouchers.id.toString(),
              item.vouchers.store_name,
              index,
            );
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
          };
        });
        setVouchers(mapped);
      }
    } catch (err) {
      console.error('Erro ao carregar vouchers no mapa:', err);
    }
  }, [profile?.id, userLocation]);

  useEffect(() => {
    fetchVouchers();
  }, [fetchVouchers]);

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

  const handleAcceptRequest = () => {
    if (!selectedRequest) return;
    const updatedList = requests.map((req) =>
      req.id === selectedRequest.id ? { ...req, state: true } : req,
    );
    setRequests(updatedList);
    requestBottomSheetRef.current?.dismiss();
  };

  const handleDeclineRequest = () => {
    requestBottomSheetRef.current?.dismiss();
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
    const maxRadius = profile?.action_radius || 5; // Raio máximo em Km (padrão 5 Km)
    return reqDistance <= maxRadius;
  });

  return (
    <View className="flex-1 overflow-hidden rounded-2xl bg-neutralLight">
      <MapView
        style={{ flex: 1 }}
        initialRegion={INITIAL_REGION}
        provider={PROVIDER_DEFAULT}
        showsUserLocation={true}
        onUserLocationChange={(event) => {
          const coord = event.nativeEvent.coordinate;
          if (coord) {
            setUserLocation({
              latitude: coord.latitude,
              longitude: coord.longitude,
            });
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

        {/* Marcadores dos Vouchers (Aparecem sempre no mapa com pins customizados) */}
        {vouchers.map((voucher, index) => {
          const coord = getVoucherCoordinate(
            voucher.id,
            voucher.name_store,
            index,
          );
          const isAvailable = voucher.status === 'AVAILABLE';

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
