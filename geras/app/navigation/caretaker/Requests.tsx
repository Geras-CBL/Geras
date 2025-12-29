import { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { pedidosData, type Pedido } from '@/data/requestData';
import SectionTitle from '@/components/shared/SectionTitle';
import ActionButton from '@/components/caretaker/ActionButton';
import SearchBar from '@/components/caretaker/SearchBar';

export default function Requests() {
  const [requests] = useState<Pedido[]>(pedidosData);
  const [search, setSearch] = useState('');

  const filteredRequests = requests.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.subtitle.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <SafeAreaView edges={['top']} className="flex-1 pt-24">
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        <SectionTitle title="Pedidos de António Silva" />

        {/* Search */}
        <View className="mb-8 mt-8">
          <SearchBar searchValue={search} onSearchChange={setSearch} />
        </View>

        {/* Lista de pedidos */}
        <View className="gap-6">
          {filteredRequests.map((request) => (
            <View
              key={request.id}
              className="rounded-xl bg-white p-4 shadow-md"
            >
              {/* Conteúdo */}
              <View className="mb-6 gap-1">
                <ThemedText type="bodyBold">{request.title}</ThemedText>

                <ThemedText type="bodySmall">{request.subtitle}</ThemedText>
              </View>

              {/* Ações */}
              <View className="flex-row gap-3">
                <ActionButton
                  title="Reencaminhar"
                  variant="outlined"
                  className="flex-1"
                  onPress={() => console.log('Reencaminhar', request.id)}
                />
                <ActionButton
                  title="Aceitar Pedido"
                  variant="default"
                  className="flex-1"
                  onPress={() => console.log('Aceitar Pedido', request.id)}
                />
              </View>
            </View>
          ))}
        </View>

        <View className="h-40" />
      </ScrollView>
    </SafeAreaView>
  );
}
