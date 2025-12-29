import { useState } from 'react';
import { View, ScrollView } from 'react-native';
import SensorComponent from '@/components/caretaker/SensorComponent';
import ButtonComponent from '@/components/shared/ButtonComponent';
import { sensorsData, type Sensor } from '@/data/sensorsData';
import { SafeAreaView } from 'react-native-safe-area-context';
import SectionTitle from '@/components/shared/SectionTitle';

export default function Sensors() {
  const [sensors, setSensors] = useState<Sensor[]>(sensorsData);

  const toggleSensor = (id: string) => {
    setSensors((currentSensors) =>
      currentSensors.map((s) =>
        s.id === id ? { ...s, active: !s.active } : s,
      ),
    );
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 pt-24">
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        <SectionTitle title={'Sensores de António Silva'}>
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

        <ButtonComponent
          onPress={() => console.log('Add Sensor Button Pressed')}
          title="Adicionar"
          variant="default" // aqui você pode escolher outras variantes se quiser
        />

        <View className="h-40" />
      </ScrollView>
    </SafeAreaView>
  );
}
