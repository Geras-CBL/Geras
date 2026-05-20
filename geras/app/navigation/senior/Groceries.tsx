import BottomActions from '@/components/senior/BottomActions';
import Button from '@/components/shared/Button';
import { NotificationCard } from '@/components/shared/Notification';
import SectionTitle from '@/components/shared/SectionTitle';
import { ThemedText } from '@/components/ThemedText';
import { MaterialIcons } from '@expo/vector-icons';
import { Checkbox } from '@futurejj/react-native-checkbox';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import * as Progress from 'react-native-progress';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { getGroceries } from '@/services/groceriesService';

export default function Groceries() {
  const router = useRouter();

  const {
    data: groceries,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['groceries'],
    queryFn: () => getGroceries(),
  });

  const [checkedIds, setCheckedIds] = useState<number[]>([]);

  if (isLoading)
    return (
      <ThemedText className="mt-24 self-center pt-10 text-center text-primary">
        A carregar as tuas mercearias...
      </ThemedText>
    );
  if (isError)
    return (
      <ThemedText className="mt-24 self-center pt-10 text-center text-secondary">
        Ocorreu um erro ao carregar as mercearias.
      </ThemedText>
    );

  const toggleCheckbox = (id: number) => {
    setCheckedIds((prev) =>
      prev.includes(id)
        ? prev.filter((checkedId) => checkedId !== id)
        : [...prev, id],
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
            {groceries?.map((item) => (
              <TouchableOpacity
                key={item.id}
                className="mb-3 flex-row items-center rounded-2xl border border-gray-100 bg-white p-3 shadow-lg"
                onPress={() => toggleCheckbox(item.id)}
                accessible={true}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: checkedIds.includes(item.id) }}
                accessibilityLabel={item.name}
                accessibilityHint={`Toca duas vezes para ${checkedIds.includes(item.id) ? 'remover da' : 'adicionar à'} lista de compras`}
              >
                <Checkbox
                  status={
                    checkedIds.includes(item.id) ? 'checked' : 'unchecked'
                  }
                  onPress={() => toggleCheckbox(item.id)}
                  color={checkedIds.includes(item.id) ? '#205a2d' : '#969696'}
                  style={{ transform: [{ scale: 1.4 }] }}
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
