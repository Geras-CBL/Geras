import { ScrollView, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NotificationCard } from '@/components/shared/Notification';
import ClockPill from '@/components/shared/InfoPill';
import MedicationCard, {
  AddMedicationCard,
} from '@/components/shared/MedicationCard';
import { useRouter } from 'expo-router';
import { MedicationSchedule } from '@/components/senior/MedicineDrawer';
import { ASSISTED_LIVING_DATA } from '@/data/assistedLivingData';

export default function Health() {
  const router = useRouter();

  return (
    <SafeAreaView edges={['top']} className="flex-1">
      <ScrollView
        className="flex-1"
        contentContainerClassName="items-center gap-10 px-6 pt-24 pb-20"
        showsVerticalScrollIndicator={false}
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
            {ASSISTED_LIVING_DATA.map((metric) => (
              <View key={metric.id} className="aspect-square w-1/2 p-4">
                <MedicationCard
                  title={metric.title}
                  status={metric.status}
                  value={metric.value}
                  unit={metric.unit}
                />
              </View>
            ))}

            <View className="aspect-square w-1/2 p-4">
              <AddMedicationCard
                onPress={() => {
                  router.push('./AddHealthMetric');
                }}
              />
            </View>
          </View>
        </View>
        <MedicationSchedule />
      </ScrollView>
    </SafeAreaView>
  );
}
