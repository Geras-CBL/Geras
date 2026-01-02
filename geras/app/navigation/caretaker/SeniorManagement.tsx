import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';

import SectionTitle from '@/components/shared/SectionTitle';
import MedicineInfo from '@/components/caretaker/MedicineInfo';
import MedicationCard, {
  AddMedicationCard,
} from '@/components/shared/MedicationCard';
import { ListItem } from '@/components/caretaker/ListItem';
import Button from '@/components/shared/Button';
import { ThemedText } from '@/components/ThemedText';
import { fetchItems, ItemDTO } from '@/data/items';

export default function SeniorManagement() {
  const [items, setItems] = useState<ItemDTO[]>([]);

  useEffect(() => {
    async function loadItems() {
      const data = await fetchItems();
      setItems(data);
    }
    loadItems();
  }, []);

  return (
    <SafeAreaView edges={['top']} className="flex-1">
      <ScrollView
        className="flex-1 px-6 pt-24"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="flex-col pb-60"
      >
        <SectionTitle title="Gestão de António Silva" />

        <View className="mt-12">
          <SectionTitle title="Medicação">
            <MedicineInfo
              title="Flexofytol Plus - por tomar"
              time={
                <View className="flex-row items-center gap-1">
                  <ThemedText type="bodyInfo" className="text-primary">
                    07:00
                  </ThemedText>
                  <MaterialIcons name="schedule" size={20} color="#205a2d" />
                </View>
              }
              actions={
                <>
                  <Button
                    title="Ignorar"
                    variant="outlined"
                    className="flex-1"
                  />

                  <Button
                    title="Avisar"
                    variant="warning"
                    className="flex-1"
                    icon={
                      <MaterialIcons name="warning" size={20} color="#db6536" />
                    }
                  />

                  <Button
                    title="Ligar"
                    className="flex-1"
                    icon={<MaterialIcons name="call" size={20} color="white" />}
                  />
                </>
              }
            />
          </SectionTitle>
        </View>

        <View className="mt-12">
          <SectionTitle title="Monitorização">
            <View className="flex-row flex-wrap justify-between gap-y-4">
              {[
                {
                  title: 'Batimento Cardíaco',
                  status: 'Adequado' as const,
                  value: 89,
                  unit: 'bpm',
                },
                {
                  title: 'Temperatura',
                  status: 'Moderado' as const,
                  value: 37.7,
                  unit: '°C',
                },
                {
                  title: 'Peso',
                  status: 'Excessivo' as const,
                  value: 81,
                  unit: 'kg',
                },
              ].map((item, index) => (
                <View key={index} className="aspect-square w-[48%]">
                  <MedicationCard
                    title={item.title}
                    status={item.status}
                    value={item.value}
                    unit={item.unit}
                  />
                </View>
              ))}

              <View className="aspect-square w-[48%]">
                <AddMedicationCard onPress={() => {}} />
              </View>
            </View>
          </SectionTitle>
        </View>

        <View className="mt-12">
          <SectionTitle title="Mercearias em falta">
            <View className="flex-col gap-3">
              {items.map((item) => (
                <ListItem key={item.id} label={item.name} />
              ))}

              <View className="flex-row gap-4 p-4 pt-2">
                <Button
                  title="Adicionar"
                  variant="outlined"
                  className="flex-1"
                  icon={<MaterialIcons name="add" size={20} color="#205a2d" />}
                />

                <Button
                  title="Comprar"
                  className="flex-1"
                  icon={
                    <MaterialIcons
                      name="shopping-cart"
                      size={20}
                      color="white"
                    />
                  }
                />
              </View>
            </View>
          </SectionTitle>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
