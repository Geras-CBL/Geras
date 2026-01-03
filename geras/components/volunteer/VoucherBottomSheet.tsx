import React, { forwardRef, useMemo } from 'react';
import { View, Image } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import { ThemedText } from '@/components/ThemedText';

interface VoucherData {
  name_store: string;
  value: string;
  address: string;
}

interface VoucherBottomSheetProps {
  voucher: VoucherData | null;
  // Adicionamos esta prop para notificar mudanças de estado
  onChange?: (index: number) => void;
}

const VoucherBottomSheet = forwardRef<BottomSheetModal, VoucherBottomSheetProps>(
  ({ voucher, onChange }, ref) => {
    const snapPoints = useMemo(() => ['45%'], []);

    const renderBackdrop = (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    );

    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        enablePanDownToClose={true}
        backgroundStyle={{ borderRadius: 32, backgroundColor: '#fafafa' }}
        handleIndicatorStyle={{ backgroundColor: '#205a2d', width: 35, height: 6 }}
      >
        <BottomSheetView className="flex-1 items-center px-[30px] pt-3 pb-16 gap-6 z-10">
          
          <ThemedText type='title' className="text-neutral">
            {voucher?.name_store || 'Loja'}
          </ThemedText>

          <View className="bg-primary rounded-full px-4 py-2 justify-center items-center overflow-hidden">
            <ThemedText type='body' className="text-neutralLight">
              {voucher?.value || '0%'}
            </ThemedText>
          </View>

          <Image 
            className="w-[142px] h-[142px]" 
            source={{ uri: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Example' }} 
            resizeMode="cover"
          />

          <ThemedText className="text-neutral text-base capitalize text-center">
            <ThemedText type='bodyBold'>Localização: </ThemedText>
            <ThemedText className="font-rubik">{voucher?.address}</ThemedText>
          </ThemedText>

        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

VoucherBottomSheet.displayName = 'VoucherBottomSheet';

export default VoucherBottomSheet;