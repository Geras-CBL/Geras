import * as React from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProfilePicker from '@/components/caretaker/ProfilePicker';
import Resume from '@/components/caretaker/Resume';
import SensorCardInfo from '@/components/caretaker/SensorCardInfo';
import SectionTitle from '@/components/shared/SectionTitle';
import {
  NotificationCard,
  ActionButton,
} from '@/components/shared/Notification';
import ProfileBottomSheet from '@/components/caretaker/ProfileBottomSheet';
import { profilesData, SeniorProfile } from '@/data/profilesData';

export default function HomePage() {
  const sheetRef = React.useRef<any>(null);

  const [selectedProfile, setSelectedProfile] = React.useState<SeniorProfile>(
    profilesData.find((p) => p.selected) || profilesData[0],
  );

  const handleSelectProfile = (profile: { name: string; age: number }) => {
    console.log('Perfil selecionado:', profile);
    const newSelected = profilesData.find((p) => p.name === profile.name);
    if (newSelected) setSelectedProfile(newSelected);
  };

  const handleOpenSheet = () => {
    sheetRef.current?.present();
  };

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView edges={['top']} className="flex-1 pt-16">
        <ScrollView
          className="flex-1"
          contentContainerClassName="p-1 px-6 gap-6 pb-10"
          showsVerticalScrollIndicator={false}
        >
          <ProfilePicker onPress={handleOpenSheet} profile={selectedProfile} />

          <Resume />

          <View className="pt-8">
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

          <View className="mt-6">
            <SectionTitle title="Sensores">
              <View className="mt-2 gap-4">
                <SensorCardInfo status="motion" sensorCount={3} />
                <SensorCardInfo status="noMotion" sensorCount={2} />
              </View>
            </SectionTitle>
          </View>
        </ScrollView>
      </SafeAreaView>

      <ProfileBottomSheet
        ref={sheetRef}
        onSelectProfile={handleSelectProfile}
      />
    </View>
  );
}
