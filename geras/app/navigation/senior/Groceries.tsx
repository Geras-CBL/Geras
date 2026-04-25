import BottomActions from '@/components/senior/BottomActions';
import Button from '@/components/shared/Button';
import { NotificationCard } from '@/components/shared/Notification';
import SectionTitle from '@/components/shared/SectionTitle';
import { ThemedText } from '@/components/ThemedText';
interface GroceryItem {
  id: string;
  name: string;
  checked: boolean;
}
import { MaterialIcons } from '@expo/vector-icons';
import { Checkbox } from '@futurejj/react-native-checkbox';
import { useRouter, useFocusEffect } from 'expo-router';
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { ScrollView, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import * as Progress from 'react-native-progress';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Groceries() {
  const router = useRouter();

  const [items, setItems] = useState<GroceryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      async function fetchGroceries() {
        try {
          const { data, error } = await supabase.from('groceries').select('*');
          if (error) {
            console.error('Error fetching groceries:', error);
          } else if (data) {
            const formattedItems = data.map((item) => ({
              id: item.id.toString(),
              name: item.name,
              checked: false,
            }));
            setItems(formattedItems);
          }
        } catch (err) {
          console.error('Unexpected error:', err);
        } finally {
          setLoading(false);
        }
      }

      fetchGroceries();
    }, [])
  );

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
              <View
                accessible={true}
                accessibilityRole="progressbar"
                accessibilityValue={{ min: 0, max: 100, now: 75 }}
                accessibilityLabel="A minha dispensa está a 75 porcento da capacidade"
              >
                <Progress.Bar
                  progress={0.75}
                  width={null}
                  height={12}
                  color="#2F5C3E"
                  unfilledColor="#FFFFFF"
                  borderWidth={0}
                  borderRadius={8}
                />
              </View>
            }
          />
        </View>

        <View className="flex w-full gap-5">
          <SectionTitle title="Lista de Compras" />

          <View className="w-full">
            {loading ? (
              <ActivityIndicator size="large" color="#2F5C3E" />
            ) : (
              items.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  className="mb-3 flex-row items-center rounded-2xl border border-gray-100 bg-white p-3 shadow-lg"
                  onPress={() => toggleCheckbox(item.id)}
                  accessible={true}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: item.checked }}
                  accessibilityLabel={item.name}
                  accessibilityHint={`Toca duas vezes para ${item.checked ? 'remover da' : 'adicionar à'} lista de compras`}
                >
                  <Checkbox
                    status={item.checked ? 'checked' : 'unchecked'}
                    onPress={() => toggleCheckbox(item.id)}
                    color={item.checked ? '#205a2d' : '#969696'}
                    style={{ transform: [{ scale: 1.4 }] }}
                  />
                  <ThemedText className={`ml-2 text-base text-neutral`}>
                    {item.name}
                  </ThemedText>
                </TouchableOpacity>
              ))
            )}
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
            accessibilityLabel="Adicionar novo artigo à lista"
          />
          <Button
            icon={
              <MaterialIcons name="shopping-cart" size={24} color="#ffff" />
            }
            title={'Comprar'}
            onPress={() =>
              router.push('../../navigation/senior/RequestLoading?type=food')
            }
            accessibilityLabel="Concluir e comprar itens da lista"
          />
        </View>
      </ScrollView>
      <BottomActions />
    </SafeAreaView>
  );
}
