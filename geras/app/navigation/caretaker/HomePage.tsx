import * as React from 'react';
import { Linking, ScrollView, View } from 'react-native';
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
import { useRouter } from 'expo-router';
import { useProfile } from '@/context/ProfileContext';

export default function HomePage() {
  const sheetRef = React.useRef<any>(null);
  const router = useRouter();
  const { selectedProfile, handleSelectProfile } = useProfile();

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
                  <ActionButton
                    icon="call"
                    onPress={() => Linking.openURL(`tel:${963744454}`)}
                  />
                  <ActionButton
                    icon="videocam"
                    onPress={() => router.push('./Sensors')}
                  />
                </>
              }
            />
          </SectionTitle>
        </View>

        <View className="pt-6">
          <SectionTitle title="Sensores">
            <SensorCardInfo
              status="motion"
              sensorCount={3}
              onPress={() => router.push('./Sensors')}
            />
            <SensorCardInfo
              status="noMotion"
              sensorCount={2}
              onPress={() => router.push('./Sensors')}
            />
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
