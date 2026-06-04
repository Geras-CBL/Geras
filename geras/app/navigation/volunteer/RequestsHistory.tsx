import { FlatList, View, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import SectionTitle from '@/components/shared/SectionTitle';
import CardPedidos from '@/components/volunteer/CardPedidos';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RequestData } from '@/data/requestVolunteerData';
import { useRouter, useFocusEffect } from 'expo-router';
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

export default function RequestsHistory() {
  const router = useRouter();
  const { profile } = useAuth();
  const [requests, setRequests] = useState<RequestData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCompletedRequests = useCallback(async () => {
    if (!profile?.id) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('requests')
        .select('*, senior:users!id_senior(name, profile_picture, gender)')
        .eq('state', 'COMPLETED')
        .eq('id_volunteer', profile.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const formatted: RequestData[] = data.map((req) => ({
          id: req.id.toString(),
          name: req.senior?.name || 'Sénior',
          gender: req.senior?.gender,
          category: req.category || 'Pedido',
          task: req.description || '',
          type:
            req.category?.toLowerCase() === 'compras'
              ? 'food'
              : req.category?.toLowerCase() === 'medicamentos'
                ? 'pharmacy'
                : req.category?.toLowerCase() === 'limpeza'
                  ? 'cleaning'
                  : 'other',
          state: true,
          isNew: false,
          date: new Date(req.created_at).toLocaleDateString('pt-PT'),
          time: new Date(req.created_at).toLocaleTimeString('pt-PT', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }),
          imageUrl: req.senior?.profile_picture || '',
          latitude: req.latitude || 40.6405,
          longitude: req.longitude || -8.6538,
        }));
        setRequests(formatted);
      }
    } catch (err) {
      console.error('Error fetching completed requests:', err);
    } finally {
      setLoading(false);
    }
  }, [profile?.id]);

  useFocusEffect(
    useCallback(() => {
      fetchCompletedRequests();
    }, [fetchCompletedRequests]),
  );

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#205a2d" />
      </View>
    );
  }

  return (
    <View className="flex-1">
      <SafeAreaView edges={['top']} className="flex-1 px-6 pt-24">
        <View className="mb-6">
          <SectionTitle title="Histórico de Pedidos" />
        </View>

        <FlatList
          data={requests}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          className="flex-1"
          contentContainerClassName="gap-4 p-4 -m-4 pb-32"
          renderItem={({ item }) => (
            <CardPedidos
              name={item.name}
              gender={item.gender}
              task={item.task}
              state={item.state}
              isNew={item.isNew}
              date={item.date}
              time={item.time}
              type={item.type}
              category={item.category || ''}
              imageUrl={item.imageUrl}
              variant="history"
              onPress={() =>
                router.push({
                  pathname: '/navigation/volunteer/RequestDetails',
                  params: {
                    type: String(item.type),
                    requestId: item.id,
                  },
                })
              }
            />
          )}
          ListEmptyComponent={() => (
            <View className="mt-10 items-center justify-center">
              <ThemedText type="bodyInfo" className="text-neutral">
                Ainda não completou nenhum pedido.
              </ThemedText>
            </View>
          )}
        />
      </SafeAreaView>
    </View>
  );
}
