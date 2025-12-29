import { View, ScrollView } from "react-native";
import {
  NotificationCard,
  ActionButton,
} from "@/components/shared/Notification";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";

export default function Notifications() {
  return (
    <SafeAreaView edges={['top']} className="flex-1">
      <ScrollView
        className="flex-1 bg-background px-6 pt-24"
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
                <ActionButton icon="call" />
                <ActionButton icon="videocam" />
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
                <ActionButton icon="sensors" />
                <ActionButton icon="videocam" />
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
                <ActionButton icon="sensors" />
                <ActionButton icon="call" />
              </>
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
