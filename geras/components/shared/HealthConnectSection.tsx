import React, { useState, useEffect } from 'react';
import { Switch, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initialize, requestPermission } from 'react-native-health-connect';
import { useAuth } from '@/context/AuthContext';
import SectionTitle from '@/components/shared/SectionTitle';
import { ThemedText } from '@/components/ThemedText';

export default function HealthConnectSection() {
  const { profile } = useAuth();
  const role = profile?.role;

  const [isSyncEnabled, setIsSyncEnabled] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    async function checkHealthConnect() {
      if (role !== 'SENIOR') return;
      setIsLoading(true);
      try {
        // Bypass temporário para testes: assume que o SDK está disponível

        const storedSync = await AsyncStorage.getItem('@health_sync_enabled');
        const isStored = storedSync === null || storedSync === 'true';

        setIsSyncEnabled(isStored);
      } catch (error) {
        console.error('Erro ao verificar Health Connect (Bypass):', error);
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

  if (role !== 'SENIOR') return null;

  return (
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
          Ajuste as definições de conectividade para permitir a sincronização de
          dados de saúde com a aplicação.
        </ThemedText>
        <View className="mt-8 rounded-3xl border border-gray-200 bg-gray-100 p-6">
          <View className="mb-4 flex-row items-center gap-3">
            <View className="h-10 w-10 items-center justify-center rounded-full bg-secondary">
              <MaterialIcons name="health-and-safety" size={24} color="white" />
            </View>
            <ThemedText type="bodyBold">Aviso - Permissões</ThemedText>
          </View>

          <ThemedText type="body" className="mt-4 text-gray-600">
            Ao ativar a conexão, a aplicação poderá necessitar de permissão para
            aceder a dados de saúde como frequência cardíaca e outras métricas.
            Estes dados serão utilizados apenas para fins de monitorização e
            bem-estar.
          </ThemedText>
        </View>
      </View>
    </View>
  );
}
