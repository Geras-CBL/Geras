import { View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import SensorComponent from "@/components/caretaker/SensorComponent";
import AddButtonComponent from "@/components/caretaker/AddButtonComponent";
import { sensorsData, type Sensor } from "@/data/sensorsData";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Sensors() {
  const [sensors, setSensors] = useState<Sensor[]>(sensorsData);

  const toggleSensor = (id: string) => {
    setSensors((currentSensors) =>
      currentSensors.map((s) =>
        s.id === id ? { ...s, active: !s.active } : s
      )
    );
  };

  return (
    <SafeAreaView
        edges={['top']}
        className="flex-1 pt-24"
      > 
      <ScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-6">
          <ThemedText type="title" className="mb-6">
            Sensores de António Silva
          </ThemedText>

          <View className="flex-row flex-wrap justify-between">
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
        </View>

        <AddButtonComponent
          onPress={() => console.log("Add Sensor Button Pressed")}
          title="Adicionar"
        />

        <View className="h-40" />
      </ScrollView>
    </SafeAreaView>
  );
}
