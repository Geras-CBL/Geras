import * as React from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import ProfilePicker from '@/components/caretaker/ProfilePicker';
import Resume from '@/components/caretaker/Resume';
import SensorCardInfo from '@/components/caretaker/SensorCardInfo';
import SectionTitle from '@/components/shared/SectionTitle';
import {
  NotificationCard,
  ActionButton,
} from '@/components/shared/Notification';
import ProfileBottomSheet, {
  ProfileBottomSheetRef,
} from '@/components/caretaker/ProfileBottomSheet';

export default function HomePage() {
  const sheetRef = React.useRef<ProfileBottomSheetRef>(null);

  const handleSelectProfile = (profile: { name: string; age: number }) => {
    console.log('Perfil selecionado:', profile);
    sheetRef.current?.dismiss();
  };

  const handleOpenSheet = () => {
    sheetRef.current?.present();
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <View style={{ flex: 1 }}>
          <SafeAreaView edges={['top']} className="flex-1 pt-16">
            <ScrollView
              className="flex-1 p-1 px-6"
              showsVerticalScrollIndicator={false}
            >
              <ProfilePicker onPress={handleOpenSheet} />

              <View className="p-1">
                <Resume />
              </View>

              <View>
                <SectionTitle title="Notificações">
                  <View className="mb-6 w-full">
                    <NotificationCard
                      variant="alert"
                      title="Aviso"
                      iconName="warning"
                      description="Queda na sala há 4 min"
                      rightContent={
                        <>
                          <ActionButton icon="call" />
                          <ActionButton icon="videocam" />
                        </>
                      }
                    />
                  </View>
                </SectionTitle>
              </View>

              <View className="mt-9">
                <SectionTitle title="Sensores">
                  <View className="mt-2 w-full flex-col gap-4">
                    <SensorCardInfo status="motion" sensorCount={3} />
                    <SensorCardInfo status="noMotion" sensorCount={2} />
                  </View>
                </SectionTitle>
              </View>

              <View className="h-40" />
            </ScrollView>
          </SafeAreaView>

          <ProfileBottomSheet
            ref={sheetRef}
            onSelectProfile={handleSelectProfile}
          />
        </View>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
