import * as React from 'react';
import { ScrollView, View } from 'react-native';
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
    <SafeAreaView edges={['top']} className="flex-1 pt-24">
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6 gap-6 pb-10"
        showsVerticalScrollIndicator={false}
      >
        <ProfilePicker onPress={handleOpenSheet} profile={selectedProfile} />
        <Resume />

        <View className="pt-6">
          <SectionTitle title="Notificações">
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
          </SectionTitle>
        </View>

        <View className="pt-6">
          <SectionTitle title="Sensores">
            <SensorCardInfo status="motion" sensorCount={3} />
            <SensorCardInfo status="noMotion" sensorCount={2} />
          </SectionTitle>
        </View>
      </ScrollView>
      <ProfileBottomSheet
        ref={sheetRef}
        onSelectProfile={handleSelectProfile}
      />
    </SafeAreaView>
  );
}
