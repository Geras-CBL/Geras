import { useState } from 'react';
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

type MetricStatus = 'Adequado' | 'Moderado' | 'Excessivo';

export default function AddHealthMetric() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [value, setValue] = useState('');
  const [unit, setUnit] = useState('');
  const [status, setStatus] = useState<MetricStatus>('Adequado');

  const handleSave = () => {
    if (!title || !value || !unit) {
      Alert.alert(
        'Falta Informação',
        'Por favor preencha o nome, valor e unidade.',
      );
      return;
    }

    const newMetric = { id: Date.now(), title, value, unit, status };
    console.log('Saving:', newMetric);

    router.back();
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

        <View className="flex-row gap-4">
          <View className="flex-1 gap-2">
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

          <View className="flex-1 gap-2">
            <ThemedText type="body">Unidade</ThemedText>
            <TextInput
              className="text-neutral-800 rounded-2xl bg-gray-100 p-5 text-lg"
              placeholder="mg/dL"
              value={unit}
              onChangeText={setUnit}
              placeholderTextColor="#9ca3af"
              autoCapitalize="none"
            />
          </View>
        </View>

        <View className="gap-16">
          <View className="gap-3">
            <ThemedText type="body">Classificação</ThemedText>
            <View className="flex-row justify-between gap-2">
              {(['Adequado', 'Moderado', 'Excessivo'] as MetricStatus[]).map(
                (s) => {
                  const isSelected = status === s;
                  let activeColor = 'bg-primary';
                  if (s === 'Moderado') activeColor = 'bg-secondary';
                  if (s === 'Excessivo') activeColor = 'bg-tertiary';

                  return (
                    <TouchableOpacity
                      key={s}
                      onPress={() => setStatus(s)}
                      className={`flex-1 items-center justify-center rounded-xl border py-3 ${
                        isSelected
                          ? `${activeColor} border-transparent`
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <ThemedText
                        type="body"
                        style={{
                          color: isSelected ? 'white' : '#6b7280',
                          fontSize: 14,
                        }}
                      >
                        {s}
                      </ThemedText>
                    </TouchableOpacity>
                  );
                },
              )}
            </View>
          </View>
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
