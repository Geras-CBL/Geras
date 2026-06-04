import { useState, useRef, useCallback } from 'react';
import { View, ScrollView, ActivityIndicator, Alert } from 'react-native';
import SensorComponent from '@/components/caretaker/SensorComponent';
import Button from '@/components/shared/Button';
import { SafeAreaView } from 'react-native-safe-area-context';
import SectionTitle from '@/components/shared/SectionTitle';
import ProfilePicker from '@/components/caretaker/ProfilePicker';
import ProfileBottomSheet from '@/components/caretaker/ProfileBottomSheet';
import AddSensorBottomSheet, {
  SensorCatalogueItem,
} from '@/components/caretaker/AddSensorBottomSheet';
import { useProfile } from '@/context/ProfileContext';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useFocusEffect } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { MaterialIcons } from '@expo/vector-icons';

interface DbSensor {
  id: number;
  id_senior: number;
  name: string;
  icon: string;
  active: boolean;
  created_at: string;
}

export default function Sensors() {
  const [sensors, setSensors] = useState<DbSensor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const sheetRef = useRef<any>(null);
  const addSensorSheetRef = useRef<any>(null);
  const { selectedProfile, handleSelectProfile } = useProfile();
  const { profile } = useAuth();

  const fetchSensors = useCallback(async () => {
    if (!selectedProfile?.id || !profile?.id) return;
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('sensors')
        .select('*')
        .eq('id_senior', selectedProfile.id)
        .eq('id_caretaker', profile.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setSensors(data ?? []);
    } catch (err) {
      console.error('Error fetching sensors:', err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedProfile?.id, profile?.id]);

  useFocusEffect(
    useCallback(() => {
      fetchSensors();
    }, [fetchSensors]),
  );

  const toggleSensor = async (id: number, currentActive: boolean) => {
    setSensors((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !currentActive } : s)),
    );

    try {
      const { error } = await supabase
        .from('sensors')
        .update({ active: !currentActive })
        .eq('id', id);

      if (error) throw error;
    } catch (err) {
      console.error('Error toggling sensor:', err);
      setSensors((prev) =>
        prev.map((s) => (s.id === id ? { ...s, active: currentActive } : s)),
      );
      Alert.alert('Erro', 'Não foi possível atualizar o sensor.');
    }
  };

  const handleAddSensor = async (item: SensorCatalogueItem) => {
    if (!selectedProfile?.id || !profile?.id) return;

    try {
      const { data, error } = await supabase
        .from('sensors')
        .insert({
          id_senior: selectedProfile.id,
          id_caretaker: profile.id,
          name: item.name,
          icon: item.icon,
          active: true,
        })
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setSensors((prev) => [...prev, data]);
      }
    } catch (err) {
      console.error('Error adding sensor:', err);
      Alert.alert('Erro', 'Não foi possível adicionar o sensor.');
    }
  };

  const handleOpenSheet = () => sheetRef.current?.present();

  return (
    <SafeAreaView edges={['top']} className="flex-1 pt-24">
      <ScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="gap-6 pb-10"
      >
        <ProfilePicker onPress={handleOpenSheet} profile={selectedProfile} />

        <SectionTitle title="Sensores" />

        {isLoading ? (
          <ActivityIndicator size="large" color="#205a2d" className="mt-10" />
        ) : sensors.length === 0 ? (
          <ThemedText className="mt-6 text-center text-gray-500">
            Nenhum sensor configurado.
          </ThemedText>
        ) : (
          <View className="mb-10 mt-4 flex-row flex-wrap justify-between">
            {sensors.map((sensor) => (
              <SensorComponent
                key={sensor.id}
                name={sensor.name}
                iconName={sensor.icon as keyof typeof MaterialIcons.glyphMap}
                isActive={sensor.active}
                onPress={() => toggleSensor(sensor.id, sensor.active)}
              />
            ))}
          </View>
        )}

        <Button
          onPress={() => addSensorSheetRef.current?.present()}
          title="Adicionar"
          variant="default"
        />

        <View className="h-40" />
      </ScrollView>

      <ProfileBottomSheet
        ref={sheetRef}
        onSelectProfile={handleSelectProfile}
      />

      <AddSensorBottomSheet
        ref={addSensorSheetRef}
        existingNames={sensors.map((s) => s.name)}
        onAddSensor={handleAddSensor}
      />
    </SafeAreaView>
  );
}
