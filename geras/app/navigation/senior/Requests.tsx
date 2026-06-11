import { ThemedText } from '@/components/ThemedText';
import BottomActions from '@/components/senior/BottomActions';
import FloatingIconCard from '@/components/senior/FloatingIconCard';
import Button from '@/components/shared/Button';
import SectionTitle from '@/components/shared/SectionTitle';
import { supabase } from '@/lib/supabase';
import { MaterialIcons } from '@expo/vector-icons';
import { Checkbox } from '@futurejj/react-native-checkbox';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { useState, useCallback } from 'react';
import {
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';

interface RequestItem {
  id: string;
  name: string;
  checked: boolean;
}

type IconName = keyof typeof MaterialIcons.glyphMap;

export default function Requests() {
  const router = useRouter();
  const { profile } = useAuth();

  const { type } = useLocalSearchParams<{ type: string }>();

  const requestType = type || 'pharmacy';

  const [items, setItems] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDestinationModalVisible, setDestinationModalVisible] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<'caretaker' | 'community'>('caretaker');

  useFocusEffect(
    useCallback(() => {
      if (requestType !== 'pharmacy') return;

      async function fetchMedicines() {
        if (!profile?.id) return;
        setLoading(true);
        try {
          const { data, error } = await supabase
            .from('medicine')
            .select('name');
          if (error) {
            console.error('Error fetching medicines:', error);
          } else if (data) {
            const uniqueNames = [...new Set(data.map((m) => m.name))];
            const formattedItems = uniqueNames.map((name, index) => ({
              id: index.toString(),
              name,
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

      fetchMedicines();
    }, [requestType]),
  );

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
          accessibilityLabel="Pesquisar medicamento"
          placeholder="Pesquise o medicamento"
          className="flex-1 text-base text-neutral"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <MaterialIcons
          importantForAccessibility="no"
          name="search"
          size={24}
          color="#0000"
        />
      </View>

      <ScrollView
        className="-m-4 flex-1 p-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 36 }}
      >
        {loading ? (
          <ActivityIndicator size="large" color="#2F5C3E" className="mt-4" />
        ) : (
          <>
            {filteredItems.slice(0, 3).map((item) => (
              <View
                key={item.id}
                accessible={true}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: item.checked }}
                accessibilityLabel={item.name}
                accessibilityHint={`Toca duas vezes para ${
                  item.checked ? 'remover da' : 'adicionar à'
                } lista de pedidos`}
              >
                <TouchableOpacity
                  className="mb-3 flex-row items-center rounded-2xl border border-gray-100 bg-white p-2 shadow-lg"
                  onPress={() => toggleCheckbox(item.id)}
                  importantForAccessibility="no-hide-descendants"
                >
                  <Checkbox
                    status={item.checked ? 'checked' : 'unchecked'}
                    onPress={() => toggleCheckbox(item.id)}
                    color={item.checked ? '#205a2d' : '#969696'}
                    style={{ transform: [{ scale: 1.4 }] }}
                  />

                  <ThemedText className="ml-2 text-neutral">
                    {item.name}
                  </ThemedText>
                </TouchableOpacity>
              </View>
            ))}
            {filteredItems.length === 0 && (
              <ThemedText className="mt-4 text-center text-gray-400">
                Nenhum medicamento encontrado.
              </ThemedText>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );

  const [description, setDescription] = useState('');

  const renderGenericContent = () => (
    <View className="h-full w-full gap-4">
      <ThemedText type="bodyBold" className="mb-6 text-center text-neutral">
        {config.title}
      </ThemedText>

      <View className="relative mb-2 flex-1 rounded-2xl border-2 border-primary bg-white p-4 shadow-sm">
        <TextInput
          accessibilityLabel="Escreva uma breve descrição da tarefa em que precisa de ajuda"
          placeholder="Breve descrição da tarefa..."
          multiline
          className="flex-1 pb-8 font-rubik text-lg text-neutral"
          textAlignVertical="top"
          value={description}
          onChangeText={setDescription}
        />

        <View className="absolute bottom-4 right-4">
          <MaterialIcons name="edit" size={24} color="#0000" />
        </View>
      </View>
    </View>
  );

  const openDestinationModal = () => {
    setDestinationModalVisible(true);
  };

  const handleMakeRequest = async () => {
    setDestinationModalVisible(false);
    let finalDescription = description;
    if (requestType === 'pharmacy') {
      const selectedNames = items.filter((i) => i.checked).map((i) => i.name);
      finalDescription = selectedNames.join(', ');
    }

    try {
      const { data: associations, error: assocError } = await supabase
        .from('senior_caretaker')
        .select('id_caretaker')
        .eq('id_senior', profile?.id);

      const caretakerId =
        associations && associations.length > 0
          ? associations[0].id_caretaker
          : null;

      const categoryLabel =
        requestType === 'food'
          ? 'Compras'
          : requestType === 'pharmacy'
            ? 'Medicamentos'
            : requestType === 'cleaning'
              ? 'Limpeza'
              : 'Outros';

      const { data, error } = await supabase
        .from('requests')
        .insert({
          id_senior: profile?.id,
          id_caretaker: selectedDestination === 'community' ? null : caretakerId,
          category: categoryLabel,
          description: finalDescription || '',
          state: 'PENDING',
          is_public: selectedDestination === 'community',
        })
        .select()
        .single();

      if (error) throw error;

      router.replace({
        pathname: './RequestDetails',
        params: {
          type: requestType,
          requestId: data.id.toString(),
        },
      });
    } catch (err) {
      console.error('Error creating request:', err);
    }
  };

  const renderActions = () => {

    if (requestType === 'pharmacy') {
      return (
        <Button
          title="Fazer Pedido"
          className="w-2/3"
          onPress={openDestinationModal}
        />
      );
    }

    return (
      <View className="h-36 w-full flex-col justify-center gap-4 px-4">
        <Button
          title={'Pressione para falar'}
          variant="outlined"
          icon={
            <MaterialIcons name="record-voice-over" size={24} color="#205a2d" />
          }
          className="mb-2 w-full"
          onPress={() => router.push('./Voice')}
        />
        <Button
          title="Fazer pedido"
          className="w-full"
          onPress={openDestinationModal}
        />
      </View>
    );
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 gap-8 px-6 pb-56">
      <View className="pb-4 pt-24">
        <SectionTitle title="Pedir Ajuda" />
        <View className="mt-2">
          <ThemedText
            type="subtitle"
            className="pt-4"
            style={{ fontSize: 16 }}
            accessibilityRole="header"
          >
            Olá Sr(a).{profile?.name?.split(' ')[0] || 'Senhor'}, o que
            precisa...
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
            <ThemedText type="subtitle" className="mb-6 text-center text-neutral">
              Quem prefere que resolva o pedido?
            </ThemedText>
            
            <TouchableOpacity
              className={`mb-4 flex-row items-center rounded-2xl border-2 p-4 ${selectedDestination === 'caretaker' ? 'border-primary bg-primary/10' : 'border-gray-200 bg-white'}`}
              onPress={() => setSelectedDestination('caretaker')}
            >
              <MaterialIcons name="people" size={28} color={selectedDestination === 'caretaker' ? '#2F5C3E' : '#9CA3AF'} />
              <View className="ml-4 flex-1">
                <ThemedText type="bodyBold" className={selectedDestination === 'caretaker' ? 'text-primary' : 'text-neutral'}>
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
              <MaterialIcons name="public" size={28} color={selectedDestination === 'community' ? '#2F5C3E' : '#9CA3AF'} />
              <View className="ml-4 flex-1">
                <ThemedText type="bodyBold" className={selectedDestination === 'community' ? 'text-primary' : 'text-neutral'}>
                  Comunidade (Voluntários)
                </ThemedText>
                <ThemedText className="text-sm text-gray-500">
                  O pedido fica visível para voluntários disponíveis na sua área.
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
