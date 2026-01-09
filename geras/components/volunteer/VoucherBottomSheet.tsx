import React, { forwardRef, useMemo } from 'react';
import { View, Image } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import { ThemedText } from '@/components/ThemedText';
import { MaterialIcons } from '@expo/vector-icons';

interface VoucherData {
  name_store: string;
  value: string;
  address: string;
  currentTasks: number;
  totalTasks: number;
  status: boolean; // Importante ter o status aqui
}

interface VoucherBottomSheetProps {
  voucher: VoucherData | null;
  onChange?: (index: number) => void;
}

const VoucherBottomSheet = forwardRef<
  BottomSheetModal,
  VoucherBottomSheetProps
>(({ voucher, onChange }, ref) => {
  const snapPoints = useMemo(() => ['45%'], []);

  const renderBackdrop = (props: any) => (
    <BottomSheetBackdrop
      {...props}
      disappearsOnIndex={-1}
      appearsOnIndex={0}
      opacity={0.5}
    />
  );

  if (!voucher) return null;

  // --- LÓGICA DE ESTADOS ---
  const isUsed = voucher.status === false;
  const isCompleted = voucher.currentTasks >= voucher.totalTasks;

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      enablePanDownToClose={true}
      onChange={onChange}
      backgroundStyle={{ borderRadius: 32, backgroundColor: '#fafafa' }}
      handleIndicatorStyle={{
        backgroundColor: '#205a2d',
        width: 35,
        height: 6,
      }}
    >
      <BottomSheetView className="z-10 flex-1 items-center gap-6 px-[30px] pb-16 pt-3">
        {/* Título da Loja */}
        <ThemedText type="title" className="text-center text-neutral">
          {voucher.name_store}
        </ThemedText>

        {/*Usado*/}
        {isUsed ? (
          <View className="mt-2 items-center justify-center gap-4">
            <View className="rounded-full bg-gray-200 p-6">
              <MaterialIcons
                name="check-circle-outline"
                size={48}
                color="#666"
              />
            </View>

            <ThemedText
              type="subtitle"
              className="mt-2 text-center text-gray-500"
            >
              Voucher Utilizado
            </ThemedText>

            <ThemedText className="px-4 text-center text-neutral">
              Este voucher já foi descontado e não pode ser usado novamente.
            </ThemedText>

            <View className="mt-2 rounded-full bg-gray-200 px-4 py-2">
              <ThemedText className="font-rubik text-gray-600">
                Valor descontado: {voucher.value}
              </ThemedText>
            </View>
          </View>
        ) : isCompleted ? (
          // Disponível - Completo
          <>
            <View className="items-center justify-center overflow-hidden rounded-full bg-primary px-4 py-2">
              <ThemedText type="body" className="text-neutralLight">
                {voucher.value}
              </ThemedText>
            </View>

            <Image
              className="h-[142px] w-[142px]"
              source={{
                uri: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Example',
              }}
              resizeMode="cover"
            />

            <ThemedText className="text-center text-base capitalize text-neutral">
              <ThemedText type="bodyBold">Localização: </ThemedText>
              <ThemedText className="font-rubik">{voucher.address}</ThemedText>
            </ThemedText>
          </>
        ) : (
          //  Incompleto - Não disponível
          <View className="mt-4 items-center justify-center gap-4">
            <View className="rounded-full bg-orange-100 p-6">
              <MaterialIcons name="lock-outline" size={48} color="#db6536" />
            </View>

            <ThemedText
              type="subtitle"
              className="mt-2 text-center text-tertiary"
            >
              Voucher Bloqueado
            </ThemedText>

            <ThemedText className="px-4 text-center text-neutral">
              Completa as tarefas restantes para desbloquear.
            </ThemedText>

            <View className="mt-2 h-3 w-[200px] w-full rounded-full bg-gray-200">
              <View
                className="h-full rounded-full bg-primary"
                style={{
                  width: `${(voucher.currentTasks / voucher.totalTasks) * 100}%`,
                }}
              />
            </View>

            <ThemedText type="bodyBold" className="text-neutral">
              {voucher.currentTasks} / {voucher.totalTasks} Tarefas
            </ThemedText>
          </View>
        )}
      </BottomSheetView>
    </BottomSheetModal>
  );
});

VoucherBottomSheet.displayName = 'VoucherBottomSheet';

export default VoucherBottomSheet;
