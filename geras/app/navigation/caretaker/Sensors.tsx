import { useState, useRef } from 'react';
import { View, ScrollView } from 'react-native';
import SensorComponent from '@/components/caretaker/SensorComponent';
import Button from '@/components/shared/Button';
import { sensorsData, type Sensor } from '@/data/sensorsData';
import { SafeAreaView } from 'react-native-safe-area-context';
import SectionTitle from '@/components/shared/SectionTitle';
import ProfilePicker from '@/components/caretaker/ProfilePicker';
import ProfileBottomSheet from '@/components/caretaker/ProfileBottomSheet';
import { useProfile } from '@/context/ProfileContext';

export default function Sensors() {
  const [sensors, setSensors] = useState<Sensor[]>(sensorsData);

  const sheetRef = useRef<any>(null);
  const { selectedProfile, handleSelectProfile } = useProfile();

  const toggleSensor = (id: string) => {
    setSensors((currentSensors) =>
      currentSensors.map((s) =>
        s.id === id ? { ...s, active: !s.active } : s,
      ),
    );
  };

  const handleOpenSheet = () => sheetRef.current?.present();

  return (
    <SafeAreaView edges={['top']} className="flex-1 pt-24">
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        <View className="mb-6">
          <ProfilePicker onPress={handleOpenSheet} profile={selectedProfile} />
        </View>

        <SectionTitle title="Sensores">
          <View className="mb-10 mt-4 flex-row flex-wrap justify-between">
            {sensors.map((sensor) => (
              <SensorComponent
                key={sensor.id}
                name={sensor.name}
                iconName={sensor.icon}
                isActive={sensor.active}
                onPress={() => toggleSensor(sensor.id)}
              />
            ))}
          </View>
        </SectionTitle>

        <Button
          onPress={() => console.log('Add Sensor Button Pressed')}
          title="Adicionar"
          variant="default"
        />

        <View className="h-40" />
      </ScrollView>

      <ProfileBottomSheet
        ref={sheetRef}
        onSelectProfile={handleSelectProfile}
      />
    </SafeAreaView>
  );
}
