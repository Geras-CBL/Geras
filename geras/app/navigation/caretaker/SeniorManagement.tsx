import { useEffect, useState, useRef } from 'react';
import {
  View,
  ScrollView,
  Alert,
  Linking,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Checkbox } from '@futurejj/react-native-checkbox';
import { useRouter } from 'expo-router';

import SectionTitle from '@/components/shared/SectionTitle';
import MedicationCard, {
  AddMedicationCard,
} from '@/components/shared/MedicationCard';
import Button from '@/components/shared/Button';
import { fetchItems, ItemDTO } from '@/data/items';
import { NotificationCard } from '@/components/shared/Notification';
import ClockPill from '@/components/shared/InfoPill';
import { ThemedText } from '@/components/ThemedText';
import ProfilePicker from '@/components/caretaker/ProfilePicker';
import ProfileBottomSheet from '@/components/caretaker/ProfileBottomSheet';
import { useProfile } from '@/context/ProfileContext';

interface GroceryItemState extends ItemDTO {
  checked?: boolean;
}

export default function SeniorManagement() {
  const [items, setItems] = useState<GroceryItemState[]>([]);
  const [showMedication, setShowMedication] = useState(true);
  const router = useRouter();

  const sheetRef = useRef<any>(null);
  const { selectedProfile, handleSelectProfile } = useProfile();

  useEffect(() => {
    async function loadItems() {
      const data = await fetchItems();
      setItems(data.map((item) => ({ ...item, checked: false })));
    }
    loadItems();
  }, []);

  const toggleCheckbox = (id: string) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item,
      ),
    );
  };

  const handleOpenSheet = () => {
    sheetRef.current?.present();
  };

  const handleIgnore = () => {
    Alert.alert('Notificação ignorada');
    setShowMedication(false);
  };

  const handleWarn = () => Alert.alert('António avisado');
  const handleCall = () => Linking.openURL(`tel:${963744454}`);

  return (
    <SafeAreaView edges={['top']} className="flex-1 pt-24">
      <ScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="flex-col pb-60 gap-6"
      >
        <ProfilePicker onPress={handleOpenSheet} profile={selectedProfile} />

        <SectionTitle title="Gestão" />

        {showMedication && (
          <View>
            <SectionTitle title="Medicação">
              <NotificationCard
                variant="reminder"
                title="Flexofytol Plus - por tomar"
                rightContent={<ClockPill time="14:00" />}
                bottomContent={
                  <>
                    <Button
                      title="Ignorar"
                      variant="outlined"
                      className="flex-1"
                      onPress={handleIgnore}
                    />
                    <Button
                      title="Avisar"
                      variant="warning"
                      icon={
                        <MaterialIcons
                          name="warning-amber"
                          size={20}
                          color="#db6536"
                        />
                      }
                      className="flex-1"
                      onPress={handleWarn}
                    />
                    <Button
                      title="Ligar"
                      className="flex-1"
                      icon={
                        <MaterialIcons name="call" size={20} color="white" />
                      }
                      onPress={handleCall}
                    />
                  </>
                }
                route="/senior/appointments/123"
              />
            </SectionTitle>
          </View>
        )}

        <View>
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

        <View className="w-full">
          <SectionTitle title="Mercearias em falta">
            <View className="w-full flex-col gap-3">
              <View className="w-full">
                {items.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    className="mb-3 flex-row items-center rounded-2xl border border-gray-100 bg-white p-3 shadow-lg"
                    onPress={() => toggleCheckbox(item.id)}
                  >
                    <Checkbox
                      status={item.checked ? 'checked' : 'unchecked'}
                      onPress={() => toggleCheckbox(item.id)}
                      color={item.checked ? '#205a2d' : '#969696'}
                    />
                    <ThemedText
                      className={`ml-1 text-base text-neutral`}
                      style={{ fontSize: 15 }}
                    >
                      {item.name}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
              <View className="flex-row gap-4 p-4 pt-2">
                <Button
                  title="Adicionar"
                  variant="outlined"
                  className="flex-1"
                  onPress={() => router.push('../senior/AddGrocerieList')}
                  icon={<MaterialIcons name="add" size={20} color="#205a2d" />}
                />
                <Button
                  title="Comprar"
                  className="flex-1"
                  onPress={() => router.push('../senior/RequestLoading')}
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

      <ProfileBottomSheet
        ref={sheetRef}
        onSelectProfile={handleSelectProfile}
      />
    </SafeAreaView>
  );
}
