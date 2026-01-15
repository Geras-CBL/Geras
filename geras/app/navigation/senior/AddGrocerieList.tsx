import { View, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import BottomActions from '@/components/senior/BottomActions';
import FloatingIconCard from '@/components/senior/FloatingIconCard';
import Button from '@/components/shared/Button';

export default function VoicePage() {
  const router = useRouter();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const renderCardContent = () => (
    <View className="w-full flex-1 justify-start gap-28 py-2">
      <View className="gap-10 pt-8">
        <View className="flex-row items-center rounded-2xl border-2 border-primary bg-white px-4 py-3">
          <TextInput
            placeholder="Escreva aqui"
            className="flex-1 text-lg font-bold text-neutral"
            placeholderTextColor="#666"
          />
          <MaterialIcons name="edit" size={24} color="#2F5C3E" />
        </View>

        <Button
          title={'Pressione Para Falar'}
          variant="outlined"
          className="w-2/3 items-center self-center"
          icon={
            <MaterialIcons name="record-voice-over" size={24} color="#205a2d" />
          }
          onPress={() => router.push('./Voice')}
        />
      </View>

      <View className="flex-row gap-6 px-2">
        <View className="flex-1">
          <Button
            title="Cancelar"
            variant="outlined"
            onPress={handleBack}
            className="w-full"
          />
        </View>
        <View className="flex-1">
          <Button title="Adicionar" className="w-full" onPress={handleBack} />
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView edges={['top']} className="flex-1 pb-56 pt-24">
      <View className="mt-8 items-center px-10">
        <ThemedText type="subtitle" className="text-neutral">
          Adicionar item a lista de compras
        </ThemedText>
      </View>

      <View className="flex-1 px-6 pt-12">
        <FloatingIconCard
          onClose={handleBack}
          icon={<MaterialIcons name="shopping-cart" size={48} color="#ffff" />}
        >
          {renderCardContent()}
        </FloatingIconCard>
      </View>

      <BottomActions />
    </SafeAreaView>
  );
}
