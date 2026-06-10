import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import {
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import Button from '@/components/shared/Button';
import SectionTitle from '@/components/shared/SectionTitle';
import BottomActions from '@/components/senior/BottomActions';
import { useAuth } from '@/context/AuthContext';

export default function AddHealthMetric() {
  const router = useRouter();
  const { profile } = useAuth();

  const [title, setTitle] = useState('');
  const [value, setValue] = useState('');

  const handleSave = async () => {
    if (!title || !value) {
      Alert.alert('Falta Informação', 'Por favor preencha o nome e o valor.');
      return;
    }

    if (!profile?.id) {
      Alert.alert('Erro', 'Sessão inválida. Por favor faça login novamente.');
      return;
    }

    let typeToSave = null;
    let customName: string | null = title;
    let mainValue: number | null = null;
    let customValue: number | null = parseFloat(value);

    const t = title.toLowerCase();
    if (t.includes('press') || t.includes('arterial') || t.includes('tensão')) {
      typeToSave = 'BLOOD PRESSURE';
      customName = null;
      mainValue = customValue;
      customValue = null;
    } else if (
      t.includes('batiment') ||
      t.includes('cora') ||
      t.includes('heart')
    ) {
      typeToSave = 'HEART RATE';
      customName = null;
      mainValue = customValue;
      customValue = null;
    } else if (t.includes('temp')) {
      typeToSave = 'TEMPERATURE';
      customName = null;
      mainValue = customValue;
      customValue = null;
    }

    try {
      const { error } = await supabase.from('monitoring').insert([
        {
          id_senior: profile.id,
          type: typeToSave as any,
          value: mainValue,
          custom_metric_name: customName,
          custom_metric_value: customValue,
        },
      ]);

      if (error) {
        console.error('Error saving metric:', error);
        Alert.alert('Erro', 'Não foi possível guardar o registo.');
      } else {
        router.back();
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      Alert.alert('Erro', 'Ocorreu um erro inesperado.');
    }
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 gap-8 bg-white px-6 pt-24">
      <SectionTitle title="Nova Leitura" />
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-6 pb-32"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-2">
          <ThemedText type="body">Nome da Métrica</ThemedText>
          <TextInput
            className="text-neutral-800 rounded-2xl bg-gray-100 p-5 text-lg"
            placeholder="Ex: Glicémia"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor="#9ca3af"
          />
        </View>

        <View className="gap-2">
          <ThemedText type="body">Valor</ThemedText>
          <TextInput
            className="text-neutral-800 rounded-2xl bg-gray-100 p-5 text-lg"
            placeholder="120"
            value={value}
            onChangeText={setValue}
            keyboardType="numeric"
            placeholderTextColor="#9ca3af"
          />
        </View>

        <View className="mt-8 gap-16">
          <Button
            title="Guardar Registo"
            onPress={handleSave}
            icon={<MaterialIcons name="check" size={24} color="#fff" />}
          />
        </View>
      </ScrollView>
      <BottomActions />
    </SafeAreaView>
  );
}
