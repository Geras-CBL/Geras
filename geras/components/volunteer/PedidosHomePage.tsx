import React, { useRef, useState, useCallback, useMemo } from 'react';
import { FlatList, View } from 'react-native';
import { REQUESTS_DATA, RequestData } from '@/data/requestVolunteerData';
import CardPedidos from '@/components/volunteer/CardPedidos';
import { ThemedText } from '@/components/ThemedText';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import RequestDetailsBottomSheet from '@/components/volunteer/RequestsBottomSheet';
import { router } from 'expo-router';

interface PedidosHomePageProps {
  filterStatus: 'todos' | 'disponivel' | 'decorrer';
  filterSenior: string | null;
}

export default function PedidosHomePage({
  filterStatus,
  filterSenior,
}: PedidosHomePageProps) {
  const [requests, setRequests] = useState<RequestData[]>(REQUESTS_DATA);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [selectedRequest, setSelectedRequest] = useState<RequestData | null>(
    null,
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

      return matchesStatus && matchesSenior;
    });
  }, [requests, filterStatus, filterSenior]);

  const handleCardPress = useCallback((item: RequestData) => {
    if (item.state === false) {
      setSelectedRequest(item);
      bottomSheetModalRef.current?.present();
    } else {
      router.push({
        pathname: '/navigation/volunteer/RequestDetails',
        params: { type: String(item.type) },
      });
    }
  }, []);

  const handleAcceptRequest = () => {
    if (!selectedRequest) return;

    const updatedList = requests.map((req) =>
      req.id === selectedRequest.id ? { ...req, state: true } : req,
    );

    setRequests(updatedList);
    bottomSheetModalRef.current?.dismiss();
  };

  const handleDeclineRequest = () => {
    if (!selectedRequest) return;

    const updatedList = requests.map((req) =>
      req.id === selectedRequest.id ? { ...req, state: false } : req,
    );
    setRequests(updatedList);
    bottomSheetModalRef.current?.dismiss();
  };

  return (
    <View className="flex-1">
      <FlatList
        data={filteredRequests}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        className="flex-1"
        contentContainerClassName="gap-4 p-4 -m-4"
        renderItem={({ item }) => {
          return (
            <View className="mb-4">
              {/* Card do pedido */}
              <CardPedidos
                name={item.name}
                category={item.category || ''}
                task={item.task}
                state={item.state}
                isNew={item.isNew}
                date={item.date}
                time={item.time}
                variant="home"
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
