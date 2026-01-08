import { useState } from 'react';
import { View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import SectionTitle from '@/components/shared/SectionTitle';
import BottomActions from '@/components/senior/BottomActions';
import { MaterialIcons } from '@expo/vector-icons';
import Button from '@/components/shared/Button';
import { Checkbox } from '@futurejj/react-native-checkbox';
import { MEDICINE_DATA } from '@/data/medicineData';
import { useRouter, useLocalSearchParams } from 'expo-router';
import FloatingIconCard from '@/components/senior/FloatingIconCard';

interface RequestItem {
  id: string;
  name: string;
  checked: boolean;
}

type IconName = keyof typeof MaterialIcons.glyphMap;

export default function Requests() {
  const router = useRouter();

  const { type } = useLocalSearchParams<{ type: string }>();

  const requestType = type || 'pharmacy';

  const [items, setItems] = useState<RequestItem[]>(() => {
    const allMedications = MEDICINE_DATA.flatMap((day) =>
      day.schedule.flatMap((slot) => slot.medications),
    );
    const uniqueMedications = [...new Set(allMedications)];
    return uniqueMedications.map((medName, index) => ({
      id: index.toString(),
      name: medName,
      checked: false,
    }));
  });
  const [searchQuery, setSearchQuery] = useState('');

  const toggleCheckbox = (id: string) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item,
      ),
    );
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  const getPageConfig = () => {
    switch (requestType) {
      case 'cleaning':
        return {
          icon: 'cleaning-services' as IconName,
          title: 'Diga a tarefa em que precisa de ajuda',
        };
      case 'other':
        return {
          icon: 'construction' as IconName,
          title: 'Diga a tarefa em que precisa de ajuda',
        };
      case 'pharmacy':
      default:
        return {
          icon: 'local-pharmacy' as IconName,
          title: 'Selecione os produtos',
        };
    }
  };

  const config = getPageConfig();
  const renderPharmacyContent = () => (
    <View className="h-full gap-3">
      <ThemedText type="bodyBold" className="mb-2 text-center text-neutral">
        {config.title}
      </ThemedText>

      <View className="mb-4 flex-row items-center rounded-full border-2 border-primary px-4 py-2">
        <TextInput
          placeholder="Pesquise o medicamento"
          className="flex-1 text-base text-neutral"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <MaterialIcons name="search" size={24} color="#0000" />
      </View>

      <ScrollView
        className="-m-4 flex-1 p-4"
        showsVerticalScrollIndicator={false}
      >
        {filteredItems.slice(0, 3).map((item) => (
          <TouchableOpacity
            key={item.id}
            className="mb-3 flex-row items-center rounded-2xl border border-gray-100 bg-white p-2 shadow-lg"
            onPress={() => toggleCheckbox(item.id)}
          >
            <Checkbox
              status={item.checked ? 'checked' : 'unchecked'}
              onPress={() => toggleCheckbox(item.id)}
              color="#969696"
            />
            <ThemedText className="text-neutral">{item.name}</ThemedText>
          </TouchableOpacity>
        ))}
        {filteredItems.length === 0 && (
          <ThemedText className="mt-4 text-center text-gray-400">
            Nenhum medicamento encontrado.
          </ThemedText>
        )}
      </ScrollView>
    </View>
  );

  const renderGenericContent = () => (
    <View className="h-full w-full gap-4">
      <ThemedText type="bodyBold" className="mb-6 text-center text-neutral">
        {config.title}
      </ThemedText>

      <View className="relative mb-2 flex-1 rounded-2xl border-2 border-primary bg-white p-4 shadow-sm">
        <TextInput
          placeholder="Breve descrição da tarefa..."
          multiline
          className="flex-1 pb-8 font-rubik text-lg text-neutral"
          textAlignVertical="top"
        />

        <View className="absolute bottom-4 right-4">
          <MaterialIcons name="edit" size={24} color="#0000" />
        </View>
      </View>
    </View>
  );

  const renderActions = () => {
    if (requestType === 'pharmacy') {
      return (
        <Button
          title={'Fazer Pedido'}
          variant="outlined"
          className="w-2/3"
          onPress={() => router.push('./RequestDetails')}
        />
      );
    }

    return (
      <View className="h-36 w-full flex-col justify-center gap-4 px-4">
        <Button
          title={'Pressione para falar'}
          icon={
            <MaterialIcons name="record-voice-over" size={24} color="#ffff" />
          }
          className="mb-2 w-full"
          onPress={() => router.push('./Voice')}
        />
        <Button
          title={'Fazer pedido'}
          variant="outlined"
          className="w-full"
          onPress={() => router.push('./RequestDetails')}
        />
      </View>
    );
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 gap-8 px-6 pb-56">
      <View className="pb-4 pt-24">
        <SectionTitle title="Pedir Ajuda" />
        <View className="mt-2">
          <ThemedText type="subtitle" className="pt-4" style={{ fontSize: 16 }}>
            Olá Senhor António, o que precisa...
          </ThemedText>
        </View>
      </View>

      <FloatingIconCard
        onClose={router.back}
        icon={<MaterialIcons name={config.icon} size={40} color="#ffff" />}
        actions={renderActions()}
      >
        {requestType === 'pharmacy'
          ? renderPharmacyContent()
          : renderGenericContent()}
      </FloatingIconCard>

      <BottomActions />
    </SafeAreaView>
  );
}
