import { View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NotificationCard } from '@/components/shared/Notification';
import ClockPill from '@/components/shared/InfoPill';
import MedicationCard, {
  AddMedicationCard,
} from '@/components/shared/MedicationCard';
import { useRouter } from 'expo-router';

export default function Health() {
  const router = useRouter();

  return (
    <SafeAreaView
      edges={['top']}
      className="flex-1 items-center gap-8 px-6 pt-24"
    >
      <View className="w-full flex-col items-start gap-4">
        <ThemedText type="title" className="text-center">
          Notificações
        </ThemedText>
        <NotificationCard
          variant="medication"
          title="Aviso Medicação"
          iconName="medication"
          description="Losartan 50 mg"
          rightContent={<ClockPill time="08:00" />}
        />
      </View>
      <View className="w-full flex-col items-start gap-4">
        <ThemedText type="title" className="text-center">
          Monitorização
        </ThemedText>
        <View className="-m-4 flex-row flex-wrap">
          <View className="aspect-square w-1/2 p-4">
            <MedicationCard
              title={'Batimento Cardíaco'}
              status={'Moderado'}
              value={89}
              unit={'bpm'}
            />
          </View>
          <View className="aspect-square w-1/2 p-4">
            <MedicationCard
              title={'Pressão Arterial'}
              status={'Adequado'}
              value={120}
              unit={'mmHg'}
            />
          </View>
          <View className="aspect-square w-1/2 p-4">
            <MedicationCard
              title={'Temperatura'}
              status={'Excessivo'}
              value={360.5}
              unit={'°C'}
            />
          </View>
          <View className="aspect-square w-1/2 p-4">
            <AddMedicationCard
              onPress={() => {
                router.push('./AddHealthMetric');
              }}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
