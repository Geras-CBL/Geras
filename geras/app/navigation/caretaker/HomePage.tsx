import * as React from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProfilePicker from '@/components/caretaker/ProfilePicker';
import Resume from '@/components/caretaker/Resume';
import SensorCardInfo from '@/components/caretaker/SensorCardInfo';
import SectionTitle from '@/components/shared/SectionTitle';
import { NotificationCard, ActionButton } from '@/components/shared/Notification';

export default function HomePage() {
  return (
    <SafeAreaView edges={['top']} className="flex-1 pt-16">
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>

        <View className="p-1">
          <ProfilePicker />
        </View>

        <View className="p-1">
          <Resume />
        </View>

        <View>
          <SectionTitle title="Notificações">
            <View className="w-full mb-6">
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
            <View className="flex-col gap-4 mt-2">
              <SensorCardInfo status="motion" sensorCount={3} />
              <SensorCardInfo status="noMotion" sensorCount={2} />
            </View>
          </SectionTitle>
        </View>

        <View className="h-40" />
      </ScrollView>
    </SafeAreaView>
  );
}
