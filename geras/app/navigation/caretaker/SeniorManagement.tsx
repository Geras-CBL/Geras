import { ScrollView, View } from 'react-native';
import SectionTitle from '@/components/shared/SectionTitle';
import MedicineInfo from '@/components/caretaker/MedicineInfo';
import MedicationCard, {
  AddMedicationCard,
} from '@/components/shared/MedicationCard';
import { ListItem } from '@/components/caretaker/ListItem';
import Button from '@/components/shared/Button';

export default function GeraisScreen() {
  return (
    <ScrollView
      className="flex-1 bg-neutralLight"
      contentContainerStyle={{ padding: 16, gap: 32 }}
      showsVerticalScrollIndicator={false}
    >
      <SectionTitle title="Medicação">
        <MedicineInfo
          title="Flexofytol Plus - por tomar"
          time="07:00"
          actions={
            <>
              <Button title="Ignorar" variant="outlined" className="flex-1" />
              <Button title="Avisar" variant="warning" className="flex-1" />
              <Button title="Ligar" className="flex-1" />
            </>
          }
        />
      </SectionTitle>

      <SectionTitle title="Monitorização">
        <View className="flex-row flex-wrap gap-4">
          <View className="aspect-square w-[48%]">
            <MedicationCard
              title="Batimento Cardíaco"
              status="Adequado"
              value={89}
              unit="bpm"
            />
          </View>

          <View className="aspect-square w-[48%]">
            <MedicationCard
              title="Temperatura"
              status="Moderado"
              value={37.7}
              unit="°C"
            />
          </View>

          <View className="aspect-square w-[48%]">
            <MedicationCard
              title="Peso"
              status="Excessivo"
              value={81}
              unit="kg"
            />
          </View>

          <View className="aspect-square w-[48%]">
            <AddMedicationCard onPress={() => {}} />
          </View>
        </View>
      </SectionTitle>

      <SectionTitle title="Mercearias em falta">
        <View className="gap-3">
          <ListItem label="Atum em lata (em água) – 4 latas" />
          <ListItem label="Ovos – 12 unidades" />
          <ListItem label="Peito de frango sem pele – 500 g" />

          <View className="flex-row gap-4 pt-2">
            <Button title="Adicionar" variant="outlined" className="flex-1" />
            <Button title="Comprar" className="flex-1" />
          </View>
        </View>
      </SectionTitle>
    </ScrollView>
  );
}
