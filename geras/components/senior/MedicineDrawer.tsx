import { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MEDICINE_DATA } from '@/data/medicineData';

export function MedicationSchedule() {
  const [selectedDayId, setSelectedDayId] = useState(MEDICINE_DATA[0].id);

  const currentDayData = MEDICINE_DATA.find((d) => d.id === selectedDayId);

  return (
    <View className="w-full flex-col gap-4">
      <View className="flex-row items-center gap-2">
        {MEDICINE_DATA.map((day) => {
          const isSelected = selectedDayId === day.id;
          return (
            <TouchableOpacity
              key={day.id}
              onPress={() => setSelectedDayId(day.id)}
              className={`${
                isSelected ? 'rounded-full bg-primary px-4 py-1.5' : 'px-2'
              }`}
            >
              <ThemedText
                className={`${isSelected ? 'font-semibold text-white' : 'text-neutral'}`}
              >
                {day.label}
              </ThemedText>
            </TouchableOpacity>
          );
        })}
      </View>

      {currentDayData?.schedule.length ? (
        currentDayData.schedule.map((slot, index) => (
          <View
            key={index}
            className="w-full rounded-2xl bg-white p-5 shadow-sm"
          >
            <View className="mb-4 flex-row items-start justify-between">
              <View className="rounded-full bg-primary px-4 py-1">
                <ThemedText type="bodyBold" className="text-white">
                  {slot.time}
                </ThemedText>
              </View>
              <MaterialCommunityIcons name="pill" size={32} color="#1a1a1a" />
            </View>

            <View className="gap-3">
              {slot.medications.map((med, idx) => (
                <View key={idx} className="flex-row items-center gap-2">
                  <View className="h-1.5 w-1.5 rounded-full bg-black" />
                  <ThemedText>{med}</ThemedText>
                </View>
              ))}
            </View>
          </View>
        ))
      ) : (
        <View className="items-center rounded-2xl bg-white p-6 shadow-sm">
          <ThemedText className="text-neutral">
            Sem medicação para este dia.
          </ThemedText>
        </View>
      )}
    </View>
  );
}
