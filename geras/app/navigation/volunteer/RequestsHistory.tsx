import { FlatList, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import SectionTitle from '@/components/shared/SectionTitle';
import CardPedidos from '@/components/volunteer/CardPedidos';
import { SafeAreaView } from 'react-native-safe-area-context';
import { REQUESTS_DATA } from '@/data/requestVolunteerData';
import { router } from 'expo-router';

export default function Home() {
  return (
    <View className="flex-1">
      <SafeAreaView edges={['top']} className="flex-1 px-6 pt-24">
        <View className="mb-6">
          <SectionTitle title="Histórico de Pedidos" />
        </View>

        <FlatList
          data={REQUESTS_DATA}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          className="flex-1"
          contentContainerClassName="gap-4 p-4 -m-4 pb-32"
          renderItem={({ item }) => (
            <CardPedidos
              name={item.name}
              task={item.task}
              state={item.state}
              isNew={item.isNew}
              date={item.date}
              time={item.time}
              type={item.type}
              category={item.category || ''}
              variant="history"
              onPress={() =>
                router.push({
                  pathname: '/navigation/volunteer/RequestDetails',
                  params: {
                    type: item.type,
                  },
                })
              }
            />
          )}
          ListEmptyComponent={() => (
            <View className="mt-10 items-center justify-center">
              <ThemedText type="bodyInfo" className="text-neutral">
                Não existem pedidos disponíveis.
              </ThemedText>
            </View>
          )}
        />
      </SafeAreaView>
    </View>
  );
}
