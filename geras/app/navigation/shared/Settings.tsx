import { useFontScale } from '@/components/FontContext';
import { useState, useEffect } from 'react';
import { Linking, Alert } from 'react-native';
import SectionTitle from '@/components/shared/SectionTitle';
import { ThemedText } from '@/components/ThemedText';
import { MaterialIcons } from '@expo/vector-icons';
import { ScrollView, Switch, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  initialize,
  getSdkStatus,
  getGrantedPermissions,
  requestPermission,
} from 'react-native-health-connect';

export default function Settings() {
  const { scale, setScale } = useFontScale();
  const { profile } = useAuth();

  const fontOptions = [
    { value: 1.0, label: 'Normal' },
    { value: 1.2, label: 'Grande' },
    { value: 1.5, label: 'Extra' },
  ];

  //Lógica para ativação ou desativação da sincronização com API Health Connect - Role Sénior e Cuidador

  const role = profile?.role; // 'SENIOR' | 'CARETAKER' | 'VOLUNTEER'

  const [isSyncEnabled, setIsSyncEnabled] = useState<boolean>(false);
  const [sdkStatus, setSdkStatus] = useState<
    'AVAILABLE' | 'NOT_INSTALLED' | 'UNSUPPORTED'
  >();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    async function checkHealthConnect() {
      if (role !== 'SENIOR') return;
      setIsLoading(true);
      try {
        // Bypass temporário para testes: assume que o SDK está disponível
        setSdkStatus('AVAILABLE');

        const storedSync = await AsyncStorage.getItem('@health_sync_enabled');
        const isStored = storedSync === null || storedSync === 'true';

        setIsSyncEnabled(isStored);
      } catch (error) {
        console.error('Erro ao verificar Health Connect (Bypass):', error);
        setSdkStatus('UNSUPPORTED');
        setIsSyncEnabled(false);
      } finally {
        setIsLoading(false);
      }
    }

    checkHealthConnect();
  }, [role]);

  const handleToggleSync = async () => {
    if (isLoading) return;

    if (isSyncEnabled) {
      setIsSyncEnabled(false);
      await AsyncStorage.setItem('@health_sync_enabled', 'false');
    } else {
      setIsLoading(true);
      try {
        const isSdkInitialized = await initialize();
        if (isSdkInitialized) {
          const permissionsToRequest = [
            { accessType: 'read' as const, recordType: 'HeartRate' },
            { accessType: 'read' as const, recordType: 'BloodPressure' },
            { accessType: 'read' as const, recordType: 'BodyTemperature' },
            { accessType: 'read' as const, recordType: 'BloodGlucose' },
            { accessType: 'read' as const, recordType: 'OxygenSaturation' },
            { accessType: 'read' as const, recordType: 'Weight' },
          ];
          const granted = await requestPermission(permissionsToRequest as any);
          console.log(
            'Permissões do Health Connect atualizadas nas definições:',
            granted,
          );
        }
        setIsSyncEnabled(true);
        await AsyncStorage.setItem('@health_sync_enabled', 'true');
      } catch (err) {
        console.error('Erro ao pedir permissões nas definições:', err);
        // Mesmo com falha na inicialização nativa (por exemplo, em emulador de testes), ativa no estado local
        setIsSyncEnabled(true);
        await AsyncStorage.setItem('@health_sync_enabled', 'true');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 gap-8 bg-white px-6 pt-24">
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-8 pb-32"
        showsVerticalScrollIndicator={false}
      >
        <SectionTitle title="Acessibilidade" />
        <View className="gap-2">
          <ThemedText
            type="subtitle"
            className="text-neutral-800"
            accessibilityRole="header"
          >
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
                accessible={true}
                accessibilityRole="radio"
                accessibilityState={{ checked: isSelected }}
                accessibilityLabel={`Tamanho ${option.label}`}
                accessibilityHint={`Toca duas vezes para alterar a escala do texto para ${option.value} vezes`}
              >
                {isSelected && (
                  <View className="mb-1" importantForAccessibility="no">
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
          <ThemedText type="subtitle" accessibilityRole="header">
            Pré-visualização
          </ThemedText>

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

        {role === 'SENIOR' && (
          <View className="gap-4">
            <SectionTitle title="Conectividade" />
            <View className="gap-2" style={{ marginTop: 16 }}>
              <ThemedText type="subtitle" className="text-neutral-800">
                Ativação da Conexão - Saúde
              </ThemedText>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleToggleSync}
                className="mr-2 flex-row items-center justify-between py-4"
                accessible={true}
                accessibilityRole="switch"
                accessibilityState={{ checked: isSyncEnabled }}
                accessibilityLabel="Conexão com dados de saúde"
              >
                <ThemedText type="bodyBold" className="text-lg">
                  Conexão
                </ThemedText>
                <Switch
                  style={{ transform: [{ scale: 1.4 }] }}
                  trackColor={{
                    false: '#767577',
                    true: '#0c550925',
                  }}
                  thumbColor={isSyncEnabled ? '#134e19ff' : '#f4f3f4'}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={handleToggleSync}
                  value={isSyncEnabled}
                />
              </TouchableOpacity>
              <ThemedText type="body" className="text-gray-500">
                Ajuste as definições de conectividade para permitir a
                sincronização de dados de saúde com a aplicação.
              </ThemedText>
              <View className="mt-8 rounded-3xl border border-gray-200 bg-gray-100 p-6">
                <View className="mb-4 flex-row items-center gap-3">
                  <View className="h-10 w-10 items-center justify-center rounded-full bg-secondary">
                    <MaterialIcons
                      name="health-and-safety"
                      size={24}
                      color="white"
                    />
                  </View>
                  <ThemedText type="bodyBold">Aviso - Permissões</ThemedText>
                </View>

                <ThemedText type="body" className="mt-4 text-gray-600">
                  Ao ativar a conexão, a aplicação poderá necessitar de
                  permissão para aceder a dados de saúde como frequência
                  cardíaca e outras métricas. Estes dados serão utilizados
                  apenas para fins de monitorização e bem-estar.
                </ThemedText>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
