import { ThemedText } from '@/components/ThemedText';
import BottomActions from '@/components/senior/BottomActions';
import FloatingIconCard from '@/components/senior/FloatingIconCard';
import Button from '@/components/shared/Button';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { DeviceEventEmitter, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useProfile } from '@/context/ProfileContext';

export default function VoicePage() {
  const router = useRouter();
  const { profile: currentUser } = useAuth();
  const { selectedProfile } = useProfile();
  const [groceryName, setGroceryName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      'onSpeechTranscript_grocery',
      (text: string) => {
        setGroceryName(text);
      },
    );

    return () => {
      subscription.remove();
    };
  }, []);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const handleAdd = async () => {
    if (!groceryName.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Determinar o ID do sénior alvo
      let targetSeniorId = null;
      if (currentUser?.role === 'SENIOR') {
        targetSeniorId = currentUser.id;
      } else if (currentUser?.role === 'CARETAKER' && selectedProfile) {
        targetSeniorId = selectedProfile.id;
      }

      if (!targetSeniorId) {
        throw new Error(
          'Não foi possível identificar o sénior para esta lista.',
        );
      }

      // 2. Inserir no catálogo de groceries
      const { data: groceryData, error: groceryError } = await supabase
        .from('groceries')
        .insert({
          name: groceryName.trim(),
          category: 'Geral',
          unit: 1,
        })
        .select()
        .single();

      if (groceryError) throw groceryError;

      // 3. Associar ao sénior na tabela senior_groceries
      const { error: associationError } = await supabase
        .from('senior_groceries')
        .insert({
          id_senior: targetSeniorId,
          id_groceries: groceryData.id,
        });

      if (associationError) throw associationError;

      handleBack();
    } catch (err: any) {
      console.error('Error adding grocery:', err);
      alert(err.message || 'Erro ao adicionar item.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCardContent = () => (
    <View className="w-full flex-1 justify-start gap-4">
      <View className="gap-10 pt-8">
        <View className="flex-row items-center rounded-2xl border-2 border-primary bg-white px-4 py-3">
          <TextInput
            placeholder="Escreva aqui"
            accessibilityLabel="Campo para escrever item da lista de compras"
            accessibilityHint="Introduza o nome do produto que deseja adicionar"
            className="flex-1 text-lg font-bold text-neutral"
            placeholderTextColor="#666"
            value={groceryName}
            onChangeText={setGroceryName}
          />
          <MaterialIcons
            name="edit"
            size={24}
            color="#2F5C3E"
            accessible={false}
          />
        </View>

        <Button
          title={'Pressione Para Falar'}
          accessibilityLabel="Iniciar gravação por voz"
          accessibilityHint="Permite adicionar um item à lista de compras usando a voz"
          variant="outlined"
          className="w-2/3 items-center self-center"
          icon={
            <MaterialIcons name="record-voice-over" size={24} color="#205a2d" />
          }
          onPress={() =>
            router.push({
              pathname: './Voice',
              params: { mode: 'grocery' },
            })
          }
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
          <Button
            title={isSubmitting ? 'A Guardar...' : 'Adicionar'}
            className="w-full"
            onPress={handleAdd}
          />
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView edges={['top']} className="flex-1 pb-56 pt-24">
      <View className="mt-8 items-center px-10">
        <ThemedText
          type="subtitle"
          className="text-neutral"
          accessibilityRole="header"
        >
          Adicionar item a lista de compras
        </ThemedText>
      </View>

      <View className="flex-1 px-6 pt-12">
        <FloatingIconCard
          onClose={handleBack}
          icon={
            <MaterialIcons
              name="shopping-cart"
              size={48}
              color="#ffff"
              accessibilityLabel="Lista de compras"
            />
          }
        >
          {renderCardContent()}
        </FloatingIconCard>
      </View>

      <BottomActions />
    </SafeAreaView>
  );
}
