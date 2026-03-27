import BottomActions from '@/components/senior/BottomActions';
import { MedicationSchedule } from '@/components/senior/MedicineDrawer';
import Button from '@/components/shared/Button';
import ClockPill from '@/components/shared/InfoPill';
import MedicationCard, {
  AddMedicationCard,
} from '@/components/shared/MedicationCard';
import { NotificationCard } from '@/components/shared/Notification';
import SectionTitle from '@/components/shared/SectionTitle';
import { ASSISTED_LIVING_DATA } from '@/data/assistedLivingData';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Health() {
  const router = useRouter();

  return (
    <SafeAreaView edges={['top']} className="flex-1 pt-24">
      <ScrollView
        className="flex-1"
        contentContainerClassName="items-center gap-10 px-6 pb-44"
        showsVerticalScrollIndicator={false}
      >
        <SectionTitle title={'Notificações'}>
          <NotificationCard
            variant="medication"
            title="Aviso Medicação"
            iconName="medication"
            description="Losartan 50 mg"
            rightContent={<ClockPill time="08:00" />}
            accessibilityLabel="Aviso de Medicação: Losartan 50 miligramas às 8 horas"
          />
        </SectionTitle>
        <SectionTitle title={'Monitorização'}>
          <View className="-m-4 flex-row flex-wrap">
            {ASSISTED_LIVING_DATA.map((metric) => (
              <View
                key={metric.id}
                className="aspect-square w-1/2 p-4"
                accessible={true}
                accessibilityRole="text"
                accessibilityLabel={`Métrica de saúde: ${metric.title}. Valor: ${metric.value} ${metric.unit}. Estado: ${metric.status}.`}
              >
                <MedicationCard
                  title={metric.title}
                  status={metric.status}
                  value={metric.value}
                  unit={metric.unit}
                />
              </View>
            ))}

            <View
              className="aspect-square w-1/2 p-4"
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Adicionar nova métrica de saúde"
            >
              <AddMedicationCard
                onPress={() => {
                  router.push('../shared/AddHealthMetric');
                }}
              />
            </View>
          </View>
        </SectionTitle>
        <MedicationSchedule />
        <Button
          title="Fazer pedido farmácia"
          icon={<MaterialCommunityIcons name="pill" size={24} color="#ffff" />}
          onPress={() => {
            router.push('./PharmacyShopping');
          }}
        />
      </ScrollView>
      <BottomActions />
    </SafeAreaView>
  );
}
