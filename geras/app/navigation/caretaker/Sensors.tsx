import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import SensorComponent from "@/components/caretaker/SensorComponent";
import AddButtonComponent from "@/components/caretaker/AddButtonComponent";
import { sensorsData, type Sensor } from "@/data/sensorsData";

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
    <View className="flex-1 bg-[#F5F7F5]">
      <ScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 110 }}
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
    </View>
  );
}
