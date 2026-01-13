import { View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { useFontScale } from '@/components/FontContext';
import SectionTitle from '@/components/shared/SectionTitle';
import BottomActions from '@/components/senior/BottomActions';
import { MaterialIcons } from '@expo/vector-icons';

export default function Settings() {
  const { scale, setScale } = useFontScale();

  const fontOptions = [
    { value: 1.0, label: 'Normal' },
    { value: 1.2, label: 'Grande' },
    { value: 1.5, label: 'Extra' },
  ];

  return (
    <SafeAreaView edges={['top']} className="flex-1 gap-8 bg-white px-6 pt-24">
      <SectionTitle title="Acessibilidade" />

      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-8 pb-32"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-2">
          <ThemedText type="subtitle" className="text-neutral-800">
            Tamanho do Texto
          </ThemedText>
          <ThemedText type="body" className="text-gray-500">
            Ajuste o tamanho do texto para facilitar a leitura em toda a
            aplicação.
          </ThemedText>
        </View>

        <View className="flex-row gap-3">
          {fontOptions.map((option) => {
            const isSelected = scale === option.value;

            return (
              <TouchableOpacity
                key={option.value}
                onPress={() => setScale(option.value)}
                activeOpacity={0.7}
                className={`flex-1 items-center justify-center rounded-2xl border py-4 shadow-sm ${
                  isSelected
                    ? 'border-transparent bg-primary'
                    : 'border-gray-200 bg-white'
                }`}
              >
                {isSelected && (
                  <View className="mb-1">
                    <MaterialIcons
                      name="check-circle"
                      size={20}
                      color="white"
                    />
                  </View>
                )}

                <ThemedText
                  type="bodyBold"
                  style={{
                    color: isSelected ? 'white' : '#4b5563',
                  }}
                >
                  {option.label}
                </ThemedText>

                <ThemedText
                  style={{
                    fontSize: 12,
                    color: isSelected ? 'rgba(255,255,255,0.8)' : '#9ca3af',
                  }}
                >
                  {option.value}x
                </ThemedText>
              </TouchableOpacity>
            );
          })}
        </View>

        <View className="mt-4 gap-3">
          <ThemedText type="subtitle">Pré-visualização</ThemedText>

          <View className="rounded-3xl border border-gray-200 bg-gray-100 p-6">
            <View className="mb-4 flex-row items-center gap-3">
              <View className="h-10 w-10 items-center justify-center rounded-full bg-secondary">
                <MaterialIcons name="text-fields" size={24} color="white" />
              </View>
              <ThemedText type="bodyBold">Exemplo de Título</ThemedText>
            </View>

            <ThemedText type="body" className="leading-relaxed text-gray-600">
              Este é um exemplo de como o texto do corpo ficará. Ao alterar as
              definições acima, este texto mudará de tamanho instantaneamente.
            </ThemedText>
          </View>
        </View>
      </ScrollView>

      <BottomActions />
    </SafeAreaView>
  );
}
