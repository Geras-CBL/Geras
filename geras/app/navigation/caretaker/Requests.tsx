import { useState } from 'react';
import { View, ScrollView, Alert, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { pedidosData, type Pedido, type RequestType } from '@/data/requestData';
import SectionTitle from '@/components/shared/SectionTitle';
import SearchBar from '@/components/caretaker/SearchBar';
import Button from '@/components/shared/Button';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function Requests() {
  const [requests, setRequests] = useState<Pedido[]>(pedidosData);
  const [search, setSearch] = useState('');

  const filteredRequests = requests.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.subtitle.toLowerCase().includes(search.toLowerCase()),
  );

  const getIconProps = (type: RequestType) => {
    switch (type) {
      case 'food':
        return { name: 'shopping-cart' as const, color: '#1d1d1b' }; // Orange
      case 'cleaning':
        return { name: 'cleaning-services' as const, color: '#1d1d1b' }; // Blue
      case 'pharmacy':
        return { name: 'local-pharmacy' as const, color: '#1d1d1b' }; // Red
      default:
        return { name: 'info' as const, color: '#1d1d1b' }; // Gray
    }
  };

  const handleForward = () => {
    Alert.alert('Sucesso', 'Reencaminhado para a rede de voluntários');
  };

  const handleAccept = (id: string) => {
    Alert.alert('Sucesso', 'Pedido aceite', [
      {
        text: 'OK',
        onPress: () => {
          setRequests((currentRequests) =>
            currentRequests.filter((req) => req.id !== id),
          );
        },
      },
    ]);
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 pt-24">
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        <SectionTitle title="Pedidos de António Silva" />

        <View className="mb-8 mt-8">
          <SearchBar searchValue={search} onSearchChange={setSearch} />
        </View>

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
                    params: {
                      type: request.type,
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
                    <ThemedText type="bodySmall">{request.subtitle}</ThemedText>
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

        <View className="h-40" />
      </ScrollView>
    </SafeAreaView>
  );
}
