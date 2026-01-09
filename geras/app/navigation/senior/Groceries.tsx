import { useState } from 'react';
import { ScrollView, View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import SectionTitle from '@/components/shared/SectionTitle';
import { NotificationCard } from '@/components/shared/Notification';
import * as Progress from 'react-native-progress';
import Button from '@/components/shared/Button';
import { MaterialIcons } from '@expo/vector-icons';
import { Checkbox } from '@futurejj/react-native-checkbox';
import { GroceryItem, INITIAL_GROCERIES } from '@/data/groceryData';
import BottomActions from '@/components/senior/BottomActions';

export default function Groceries() {
  const router = useRouter();

  const [items, setItems] = useState<GroceryItem[]>(INITIAL_GROCERIES);

  const toggleCheckbox = (id: string) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item,
      ),
    );
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1">
      <ScrollView
        className="flex-1"
        contentContainerClassName="items-center gap-6 px-6 pt-24 pb-44"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex w-full gap-5">
          <SectionTitle title="Alimentação disponível" />
          <NotificationCard
            variant="pantry"
            title="A MINHA DISPENSA"
            iconName="shopping-cart"
            description={
              <Progress.Bar
                progress={0.75}
                width={null}
                height={12}
                color="#2F5C3E"
                unfilledColor="#FFFFFF"
                borderWidth={0}
                borderRadius={8}
              />
            }
          />
        </View>

        <View className="flex w-full gap-5">
          <SectionTitle title="Lista de Compras" />

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
                <ThemedText className={`ml-2 text-base text-neutral`}>
                  {item.name}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="w-full flex-row justify-evenly">
          <Button
            icon={<MaterialIcons name="add" size={24} color="#2F5C3E" />}
            variant="outlined"
            title={'Adicionar'}
            onPress={() =>
              router.push('../../navigation/senior/AddGrocerieList')
            }
          />
          <Button
            icon={
              <MaterialIcons name="shopping-cart" size={24} color="#ffff" />
            }
            title={'Comprar'}
            onPress={() =>
              router.push('../../navigation/senior/RequestDetails')
            }
          />
        </View>
      </ScrollView>
      <BottomActions />
    </SafeAreaView>
  );
}
