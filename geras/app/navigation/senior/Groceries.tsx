import BottomActions from '@/components/senior/BottomActions';
import Button from '@/components/shared/Button';
import { NotificationCard } from '@/components/shared/Notification';
import SectionTitle from '@/components/shared/SectionTitle';
import { ThemedText } from '@/components/ThemedText';
import { Alert } from 'react-native';
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
import { useAuth } from '@/context/AuthContext';
import {
  ScrollView,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Modal,
} from 'react-native';
import * as Progress from 'react-native-progress';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Groceries() {
  const router = useRouter();
  const { profile } = useAuth();

  const [items, setItems] = useState<GroceryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDestinationModalVisible, setDestinationModalVisible] =
    useState(false);
  const [selectedDestination, setSelectedDestination] = useState<
    'caretaker' | 'community'
  >('caretaker');

  const openDestinationModal = () => {
    const selectedNames = items.filter((i) => i.checked).map((i) => i.name);
    if (selectedNames.length === 0) {
      Alert.alert('Erro', 'Por favor, selecione pelo menos um item para o seu pedido.');
      return;
    }
    setDestinationModalVisible(true);
  };

  const handleMakeRequest = async () => {
    setDestinationModalVisible(false);
    try {
      const { data: associations, error: assocError } = await supabase
        .from('senior_caretaker')
        .select('id_caretaker')
        .eq('id_senior', profile?.id);

      const caretakerId =
        associations && associations.length > 0
          ? associations[0].id_caretaker
          : null;

      const selectedNames = items.filter((i) => i.checked).map((i) => i.name);
      const finalDescription = `Comprar: ${selectedNames.join(', ')}`;

      const { data, error } = await supabase
        .from('requests')
        .insert({
          id_senior: profile?.id,
          id_caretaker:
            selectedDestination === 'community' ? null : caretakerId,
          category: 'Compras',
          description: finalDescription,
          state: 'PENDING',
          is_public: selectedDestination === 'community',
        })
        .select()
        .single();

      if (error) throw error;

      router.replace({
        pathname: '../../navigation/senior/RequestDetails',
        params: { type: 'food', requestId: data.id.toString() },
      });
    } catch (err) {
      console.error('Error creating request:', err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      async function fetchGroceries() {
        if (!profile?.id) return;
        try {
          const { data, error } = await supabase
            .from('senior_groceries')
            .select('*, groceries(*)')
            .eq('id_senior', profile.id);

          if (error) {
            console.error('Error fetching groceries:', error);
          } else if (data) {
            const formattedItems = data.map((item: any) => ({
              id: item.id.toString(),
              name: item.groceries?.name || 'Item desconhecido',
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
    }, []),
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
            onPress={openDestinationModal}
            accessibilityLabel="Concluir e comprar itens da lista"
          />
        </View>
      </ScrollView>

      <Modal
        visible={isDestinationModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setDestinationModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="rounded-t-3xl bg-white p-6 pb-12 shadow-xl">
            <View className="mb-6 items-center">
              <View className="h-1.5 w-12 rounded-full bg-gray-300" />
            </View>
            <ThemedText
              type="subtitle"
              className="mb-6 text-center text-neutral"
            >
              Quem prefere que resolva o pedido?
            </ThemedText>

            <TouchableOpacity
              className={`mb-4 flex-row items-center rounded-2xl border-2 p-4 ${selectedDestination === 'caretaker' ? 'border-primary bg-primary/10' : 'border-gray-200 bg-white'}`}
              onPress={() => setSelectedDestination('caretaker')}
            >
              <MaterialIcons
                name="people"
                size={28}
                color={
                  selectedDestination === 'caretaker' ? '#2F5C3E' : '#9CA3AF'
                }
              />
              <View className="ml-4 flex-1">
                <ThemedText
                  type="bodyBold"
                  className={
                    selectedDestination === 'caretaker'
                      ? 'text-primary'
                      : 'text-neutral'
                  }
                >
                  O meu Cuidador
                </ThemedText>
                <ThemedText className="text-sm text-gray-500">
                  O pedido é enviado diretamente para o seu cuidador associado.
                </ThemedText>
              </View>
              {selectedDestination === 'caretaker' && (
                <MaterialIcons name="check-circle" size={24} color="#2F5C3E" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              className={`mb-8 flex-row items-center rounded-2xl border-2 p-4 ${selectedDestination === 'community' ? 'border-primary bg-primary/10' : 'border-gray-200 bg-white'}`}
              onPress={() => setSelectedDestination('community')}
            >
              <MaterialIcons
                name="public"
                size={28}
                color={
                  selectedDestination === 'community' ? '#2F5C3E' : '#9CA3AF'
                }
              />
              <View className="ml-4 flex-1">
                <ThemedText
                  type="bodyBold"
                  className={
                    selectedDestination === 'community'
                      ? 'text-primary'
                      : 'text-neutral'
                  }
                >
                  Comunidade (Voluntários)
                </ThemedText>
                <ThemedText className="text-sm text-gray-500">
                  O pedido fica visível para voluntários disponíveis na sua
                  área.
                </ThemedText>
              </View>
              {selectedDestination === 'community' && (
                <MaterialIcons name="check-circle" size={24} color="#2F5C3E" />
              )}
            </TouchableOpacity>

            <View className="flex-row justify-between gap-4">
              <Button
                title="Cancelar"
                variant="outlined"
                className="flex-1"
                onPress={() => setDestinationModalVisible(false)}
              />
              <Button
                title="Confirmar"
                className="flex-1"
                onPress={handleMakeRequest}
              />
            </View>
          </View>
        </View>
      </Modal>

      <BottomActions />
    </SafeAreaView>
  );
}
