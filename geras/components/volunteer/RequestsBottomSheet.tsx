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

  const nameParts = request.name.split(' ').filter(Boolean);
  const prefix = request.gender === 'FEMALE' ? 'Sra.' : 'Sr.';
  const firstAndLast =
    nameParts.length > 1
      ? `${nameParts[0]} ${nameParts[nameParts.length - 1]}`
      : nameParts[0] || 'Sénior';
  const displayName =
    request.name === 'Sénior' || request.name.startsWith('Sr')
      ? request.name
      : `${prefix} ${firstAndLast}`;

  const initials =
    nameParts.length > 1
      ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
      : (nameParts[0]?.[0] || '?').toUpperCase();

  const hasValidImage =
    typeof request.imageUrl === 'string' && request.imageUrl.length > 0;

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
        <ThemedText type="title" className="text-center text-neutral">
          {request.category || 'Tarefa doméstica'}
        </ThemedText>

        <View className="w-full flex-row items-center gap-6 rounded-2xl bg-neutralLight p-6 shadow-lg shadow-neutral">
          {hasValidImage ? (
            <Image
              className="h-[100px] w-[100px] rounded-lg bg-gray-200"
              source={{ uri: request.imageUrl as string }}
              resizeMode="cover"
              accessible={true}
              accessibilityRole="image"
              accessibilityLabel={`Foto de perfil de ${displayName}`}
            />
          ) : (
            <View className="h-[100px] w-[100px] items-center justify-center rounded-lg bg-[#ffefd3]">
              <ThemedText type="bodyBold" className="text-3xl text-neutral">
                {initials}
              </ThemedText>
            </View>
          )}
          <View className="flex-1 gap-2 overflow-hidden">
            <ThemedText type="subtitle" className="uppercase text-neutral">
              {displayName}
            </ThemedText>
            {request.age && (
              <ThemedText type="body" className="text-neutral">
                {request.age}
              </ThemedText>
            )}
          </View>
        </View>

        <View className="w-full flex-row gap-6">
          <Button
            title="Recusar"
            onPress={onDecline}
            variant="outlined"
            className="flex-1"
          />

          <Button
            title="Aceitar"
            onPress={onAccept}
            variant="default"
            className="flex-1"
          />
        </View>

        <View className="w-full gap-2">
          <ThemedText className="text-base text-[#1d1d1b]">
            <ThemedText type="bodyBold">Distância: </ThemedText>
            {request.distance || '2.3 Km'}
          </ThemedText>

          <ThemedText className="text-base text-[#1d1d1b]">
            <ThemedText type="bodyBold">Tempo: </ThemedText>
            {request.time || '30min'}
          </ThemedText>

          <ThemedText className="text-base text-[#1d1d1b]">
            <ThemedText type="bodyBold">Localização: </ThemedText>
            {request.location ||
              'Rua João Pereira Almeida 76, Safira, Portugal'}
          </ThemedText>

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
