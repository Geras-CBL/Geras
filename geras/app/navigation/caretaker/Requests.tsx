import { useState, useRef, useCallback } from 'react';
import {
  View,
  ScrollView,
  Alert,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { type Pedido, type RequestType } from '@/data/requestData';
import SectionTitle from '@/components/shared/SectionTitle';
import SearchBar from '@/components/caretaker/SearchBar';
import Button from '@/components/shared/Button';
import { useRouter, useFocusEffect } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import ProfilePicker from '@/components/caretaker/ProfilePicker';
import ProfileBottomSheet from '@/components/caretaker/ProfileBottomSheet';
import { useProfile } from '@/context/ProfileContext';
import { supabase } from '@/lib/supabase';

export default function Requests() {
  const router = useRouter();
  const [requests, setRequests] = useState<Pedido[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const sheetRef = useRef<any>(null);
  const { selectedProfile, handleSelectProfile } = useProfile();

  const fetchRequests = useCallback(async () => {
    if (!selectedProfile?.id) return;
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('requests')
        .select('*')
        .eq('id_senior', selectedProfile.id)
        .eq('state', 'PENDING');

      if (error) throw error;

      if (data) {
        setRequests(
          data.map((req) => ({
            id: req.id.toString(),
            title: req.category?.toUpperCase() || 'PEDIDO',
            subtitle: new Date(req.created_at).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
            type: (req.category?.toLowerCase() === 'compras'
              ? 'food'
              : req.category?.toLowerCase() === 'medicamentos'
                ? 'pharmacy'
                : req.category?.toLowerCase() === 'limpeza'
                  ? 'cleaning'
                  : 'other') as RequestType,
          })),
        );
      }
    } catch (err) {
      console.error('Error fetching requests:', err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedProfile?.id]);

  useFocusEffect(
    useCallback(() => {
      fetchRequests();
    }, [fetchRequests]),
  );

  const filteredRequests = requests.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.subtitle.toLowerCase().includes(search.toLowerCase()),
  );

  const getIconProps = (type: RequestType) => {
    switch (type) {
      case 'food':
        return { name: 'shopping-cart' as const, color: '#1d1d1b' };
      case 'cleaning':
        return { name: 'cleaning-services' as const, color: '#1d1d1b' };
      case 'pharmacy':
        return { name: 'local-pharmacy' as const, color: '#1d1d1b' };
      default:
        return { name: 'info' as const, color: '#1d1d1b' };
    }
  };

  const handleForward = () =>
    Alert.alert('Sucesso', 'Reencaminhado para a rede de voluntários');

  const handleOpenSheet = () => sheetRef.current?.present();

  const handleAccept = async (id: string) => {
    try {
      const { error } = await supabase
        .from('requests')
        .update({ state: 'ACCEPTED' })
        .eq('id', id);

      if (error) throw error;

      Alert.alert('Sucesso', 'Pedido aceite', [
        {
          text: 'OK',
          onPress: () => fetchRequests(),
        },
      ]);
    } catch (err) {
      console.error('Error accepting request:', err);
      Alert.alert('Erro', 'Não foi possível aceitar o pedido.');
    }
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 pt-24">
      <ScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-60"
      >
        <View className="mb-6">
          <ProfilePicker onPress={handleOpenSheet} profile={selectedProfile} />
        </View>

        <SectionTitle title="Pedidos" />

        <View className="mb-8 mt-4">
          <SearchBar searchValue={search} onSearchChange={setSearch} />
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color="#205a2d" className="mt-10" />
        ) : (
          <View className="gap-6">
            {filteredRequests.map((request) => {
              const iconProps = getIconProps(request.type);
              return (
                <Pressable
                  key={request.id}
                  className="rounded-2xl bg-white p-5 shadow-md"
                  onPress={() =>
                    router.push({
                      pathname: '/navigation/caretaker/RequestDetails',
                      params: { type: request.type },
                    })
                  }
                >
                  <View className="mb-6 flex-row items-center gap-4">
                    <View className="h-12 w-12 items-center justify-center">
                      <MaterialIcons
                        name={iconProps.name}
                        size={24}
                        color={iconProps.color}
                      />
                    </View>
                    <View className="flex-1 gap-1">
                      <ThemedText type="bodyBold">{request.title}</ThemedText>
                      <ThemedText type="bodySmall">
                        {request.subtitle}
                      </ThemedText>
                    </View>
                  </View>
                  <View className="flex-row gap-3">
                    <Button
                      title="Reencaminhar"
                      variant="outlined"
                      className="flex-1"
                      onPress={handleForward}
                    />
                    <Button
                      title="Aceitar Pedido"
                      variant="default"
                      className="flex-1"
                      onPress={() => handleAccept(request.id)}
                    />
                  </View>
                </Pressable>
              );
            })}
            {filteredRequests.length === 0 && (
              <ThemedText className="mt-10 text-center text-gray-500">
                Não existem pedidos pendentes.
              </ThemedText>
            )}
          </View>
        )}
        <View className="h-40" />
      </ScrollView>

      <ProfileBottomSheet
        ref={sheetRef}
        onSelectProfile={handleSelectProfile}
      />
    </SafeAreaView>
  );
}
