import { View, ScrollView, Linking } from 'react-native';
import {
  NotificationCard,
  ActionButton,
} from '@/components/shared/Notification';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { useRouter } from 'expo-router';

export default function Notifications() {
  const router = useRouter();

  return (
    <SafeAreaView edges={['top']} className="flex-1">
      <ScrollView
        className="bg-background flex-1 px-6 pt-24"
        showsVerticalScrollIndicator={false}
      >
        <ThemedText type="title" className="mb-6">
          Notificações
        </ThemedText>

        {/* AVISO */}
        <View className="mb-6">
          <NotificationCard
            variant="alert"
            title="Aviso"
            iconName="warning"
            description="Queda na sala há 4 min"
            rightContent={
              <>
                <ActionButton
                  icon="call"
                  onPress={() => {
                    Linking.openURL(`tel:${963744454}`);
                  }}
                />
                <ActionButton
                  icon="videocam"
                  onPress={() => {
                    router.push('./Sensors');
                  }}
                />
              </>
            }
          />
        </View>

        {/* MEDICAÇÃO */}
        <View className="mb-6">
          <NotificationCard
            variant="medication"
            title="Medicação"
            iconName="medication"
            description="Sem Benuron 50mg"
            rightContent={
              <>
                <ActionButton
                  icon="sensors"
                  onPress={() => {
                    router.push('./Sensors');
                  }}
                />
                <ActionButton
                  icon="videocam"
                  onPress={() => {
                    router.push('./Sensors');
                  }}
                />
              </>
            }
          />
        </View>

        {/* SEM TOMA */}
        <View className="mb-6">
          <NotificationCard
            variant="medication"
            title="Sem Toma"
            iconName="medication"
            description="António não tomou a medicação"
            rightContent={
              <>
                <ActionButton
                  icon="sensors"
                  onPress={() => {
                    router.push('./Sensors');
                  }}
                />
                <ActionButton
                  icon="call"
                  onPress={() => {
                    Linking.openURL(`tel:${963744454}`);
                  }}
                />
              </>
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
