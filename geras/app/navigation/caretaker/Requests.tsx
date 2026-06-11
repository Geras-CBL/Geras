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
import { useAuth } from '@/context/AuthContext';

export default function Requests() {
  const router = useRouter();
  const { profile } = useAuth();
  const [requests, setRequests] = useState<Pedido[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const sheetRef = useRef<any>(null);
  const { selectedProfile, handleSelectProfile } = useProfile();

  const fetchRequests = useCallback(async () => {
    if (!selectedProfile?.id || !profile?.id) return;
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('requests')
        .select('*')
        .eq('id_senior', selectedProfile.id)
        .eq('state', 'PENDING')
        .eq('id_caretaker', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setRequests(
          data.map((req) => ({
            id: req.id.toString(),
            title: `${req.category?.toUpperCase() || 'PEDIDO'}${req.description ? ` - ${req.description}` : ''}`,
            subtitle: new Date(req.created_at).toLocaleString('pt-PT', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            }),
            createdAt: req.created_at,
            type: (req.category?.toLowerCase() === 'compras'
              ? 'food'
              : req.category?.toLowerCase() === 'medicamentos'
                ? 'pharmacy'
                : req.category?.toLowerCase() === 'limpeza'
                  ? 'cleaning'
                  : 'other') as RequestType,
            isPublic: req.is_public,
          })),
        );
      }
    } catch (err) {
      console.error('Error fetching requests:', err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedProfile?.id, profile?.id]);

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

  const handleForward = async (id: string) => {
    try {
      const { error } = await supabase
        .from('requests')
        .update({ is_public: true })
        .eq('id', id);

      if (error) throw error;

      Alert.alert('Sucesso', 'Reencaminhado para a rede de voluntários', [
        {
          text: 'OK',
          onPress: () => setRequests((prev) => prev.map((r) => r.id === id ? { ...r, isPublic: true } as any : r)),
        },
      ]);
    } catch (err) {
      console.error('Error forwarding request:', err);
      Alert.alert('Erro', 'Não foi possível reencaminhar o pedido.');
    }
  };

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
          onPress: () => setRequests((prev) => prev.filter((r) => r.id !== id)),
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
        contentContainerClassName="gap-6"
      >
        <ProfilePicker onPress={handleOpenSheet} profile={selectedProfile} />

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
              const isNew =
                Date.now() - new Date((request as any).createdAt).getTime() <
                3_600_000;
              const isPublic = (request as any).isPublic;
              return (
                <Pressable
                  key={request.id}
                  className={`rounded-2xl p-5 shadow-md ${
                    isPublic ? 'border border-yellow-200 bg-yellow-50' : isNew ? 'border border-green-200 bg-green-50' : 'bg-white'
                  }`}
                  onPress={() =>
                    router.push({
                      pathname: '/navigation/caretaker/RequestDetails',
                      params: {
                        type: request.type,
                        requestId: request.id,
                      },
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
                    {isPublic ? (
                      <View className="rounded-full bg-yellow-500 px-2 py-1">
                        <ThemedText
                          type="bodySmall"
                          className="text-xs font-bold text-white"
                        >
                          Na Comunidade
                        </ThemedText>
                      </View>
                    ) : isNew ? (
                      <View className="rounded-full bg-green-500 px-2 py-1">
                        <ThemedText
                          type="bodySmall"
                          className="text-xs font-bold text-white"
                        >
                          Novo
                        </ThemedText>
                      </View>
                    ) : null}
                  </View>
                  <View className="flex-row gap-3">
                    {!isPublic && (
                      <Button
                        title="Reencaminhar"
                        variant="outlined"
                        className="flex-1"
                        onPress={() => handleForward(request.id)}
                      />
                    )}
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
