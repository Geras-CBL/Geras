import React, { forwardRef, useMemo } from 'react';
import { View, Image } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import { ThemedText } from '@/components/ThemedText';
import { RequestData } from '@/data/requestVolunteerData';
import Button from '@/components/shared/Button';
import srAntonio from '@/assets/images/srAntonio.png';

interface RequestsBottomSheetProps {
  request: RequestData | null;
  onAccept: () => void;
  onDecline: () => void;
}

const RequestDetailsBottomSheet = forwardRef<
  BottomSheetModal,
  RequestsBottomSheetProps
>(({ request, onAccept, onDecline }, ref) => {
  const snapPoints = useMemo(() => ['75%'], []);

  const renderBackdrop = (props: any) => (
    <BottomSheetBackdrop
      {...props}
      disappearsOnIndex={-1}
      appearsOnIndex={0}
      opacity={0.5}
    />
  );

  if (!request) return null;

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      enablePanDownToClose={true}
      backgroundStyle={{ borderRadius: 32, backgroundColor: '#fafafa' }}
      handleIndicatorStyle={{
        backgroundColor: '#205a2d',
        width: 35,
        height: 6,
      }}
    >
      <BottomSheetView className="flex-1 items-center gap-6 px-[30px] pb-16 pt-3">
        {/* --- Título --- */}
        <ThemedText type="title" className="text-center text-neutral">
          {request.category || 'Tarefa doméstica'}
        </ThemedText>

        {/* --- Cartão de Perfil --- */}
        <View className="w-full flex-row items-center gap-6 rounded-2xl bg-neutralLight p-6 shadow-lg shadow-neutral">
          <Image
            className="h-[100px] w-[100px] rounded-lg bg-gray-200"
            source={srAntonio}
            resizeMode="cover"
          />
          <View className="flex-1 gap-2 overflow-hidden">
            <ThemedText type="subtitle" className="uppercase text-neutral">
              {request.name}
            </ThemedText>
            {request.age && (
              <ThemedText type="body" className="text-neutral">
                {request.age}
              </ThemedText>
            )}
          </View>
        </View>

        {/* --- Botões de Ação --- */}
        <View className="w-full flex-row gap-6">
          {/* Botão Recusar */}
          <Button
            title="Recusar"
            onPress={onDecline}
            variant="outlined"
            className="flex-1"
          />

          {/* Botão Aceitar */}
          <Button
            title="Aceitar"
            onPress={onAccept}
            variant="default"
            className="flex-1"
          />
        </View>

        {/* --- Detalhes (Lista) --- */}
        <View className="w-full gap-2">
          {/* Distância */}
          <ThemedText className="text-base text-[#1d1d1b]">
            <ThemedText type="bodyBold">Distância: </ThemedText>
            {request.distance || '2.3 Km'}
          </ThemedText>

          {/* Tempo */}
          <ThemedText className="text-base text-[#1d1d1b]">
            <ThemedText type="bodyBold">Tempo: </ThemedText>
            {request.time || '30min'}
          </ThemedText>

          {/* Localização */}
          <ThemedText className="text-base text-[#1d1d1b]">
            <ThemedText type="bodyBold">Localização: </ThemedText>
            {request.location ||
              'Rua João Pereira Almeida 76, Safira, Portugal'}
          </ThemedText>

          {/* Descrição */}
          <ThemedText className="text-base text-[#1d1d1b]">
            <ThemedText type="bodyBold">Descrição do pedido: </ThemedText>
            {request.task}
          </ThemedText>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

RequestDetailsBottomSheet.displayName = 'RequestDetailsBottomSheet';

export default RequestDetailsBottomSheet;
