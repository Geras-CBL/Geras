import { useRef, useState, useCallback } from 'react';
import { View } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { REQUESTS_DATA, RequestData } from '@/data/requestVolunteerData';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import RequestDetailsBottomSheet from '@/components/volunteer/RequestsBottomSheet';
import Pin_Marker_ from '@/assets/illustrations/Pin_Marker_.png';

export default function MapaHomePage() {
  const [requests, setRequests] = useState<RequestData[]>(REQUESTS_DATA);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [selectedRequest, setSelectedRequest] = useState<RequestData | null>(
    null,
  );

  const INITIAL_REGION = {
    latitude: 40.6405,
    longitude: -8.6538,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  const handleMarkerPress = useCallback((item: RequestData) => {
    setSelectedRequest(item);
    bottomSheetModalRef.current?.present();
  }, []);

  const handleAcceptRequest = () => {
    if (!selectedRequest) return;

    const updatedList = requests.map((req) =>
      req.id === selectedRequest.id ? { ...req, state: true } : req,
    );

    setRequests(updatedList);
    console.log(`Pedido ${selectedRequest.id} aceite via Mapa`);
    bottomSheetModalRef.current?.dismiss();
  };

  const handleDeclineRequest = () => {
    bottomSheetModalRef.current?.dismiss();
  };

  return (
    <View className="flex-1 overflow-hidden rounded-2xl bg-neutralLight">
      <MapView
        style={{ flex: 1 }}
        initialRegion={INITIAL_REGION}
        provider={PROVIDER_DEFAULT}
        showsUserLocation={true}
        onPress={() => bottomSheetModalRef.current?.dismiss()}
      >
        {requests.map((request) => (
          <Marker
            key={request.id}
            coordinate={{
              latitude: request.latitude,
              longitude: request.longitude,
            }}
            onPress={() => handleMarkerPress(request)}
            image={Pin_Marker_}
          >
            {/* --- UI PIN --- */}
          </Marker>
        ))}
      </MapView>

      {/* --- BOTTOM SHEET --- */}
      <RequestDetailsBottomSheet
        ref={bottomSheetModalRef}
        request={selectedRequest}
        onAccept={handleAcceptRequest}
        onDecline={handleDeclineRequest}
      />
    </View>
  );
}
