import { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { MaterialCommunityIcons } from '@expo/vector-icons';
interface MedicineItem {
  id: string;
  name: string;
  dosage?: number;
  scheduled_time?: string;
  start_date?: string;
  end_date?: string;
}

export function MedicationSchedule({
  medicines,
}: {
  medicines: MedicineItem[];
}) {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  // Agrupar medicamentos por data
  const groupMedicinesByDay = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const daysMap = [
      { label: 'Hoje', date: today, medicines: [] as MedicineItem[] },
      { label: 'Amanhã', date: tomorrow, medicines: [] as MedicineItem[] },
    ];

    medicines.forEach((med) => {
      const medStart = med.start_date ? new Date(med.start_date) : null;
      if (medStart) medStart.setHours(0, 0, 0, 0);

      const medEnd = med.end_date ? new Date(med.end_date) : null;
      if (medEnd) medEnd.setHours(23, 59, 59, 999);

      daysMap.forEach((dayObj) => {
        const checkDate = dayObj.date;
        let isActive = true;

        if (!medStart && !medEnd) {
          isActive = false;
        } else {
          if (medStart && checkDate < medStart) isActive = false;
          if (medEnd && checkDate > medEnd) isActive = false;
        }

        if (isActive) {
          dayObj.medicines.push(med);
        }
      });
    });

    return daysMap;
  };

  const days = groupMedicinesByDay();
  const currentDay = days[selectedDayIndex];

  return (
    <View className="w-full flex-col gap-4">
      {/* Seleção de Dia */}
      <View className="flex-row items-center gap-2">
        {days.map((day, index) => {
          const isSelected = selectedDayIndex === index;
          return (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedDayIndex(index)}
              className={`${
                isSelected ? 'rounded-full bg-primary px-7 py-1.5' : 'px-2'
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

      {/* Lista de Medicamentos do Dia */}
      {currentDay?.medicines.length > 0 ? (
        currentDay.medicines.map((med) => (
          <View
            key={med.id}
            className="w-full rounded-2xl bg-white p-5 shadow-sm"
          >
            <View className="mb-4 flex-row items-start justify-between">
              <View className="rounded-full bg-primary px-4 py-1">
                <ThemedText type="bodyBold" className="text-white">
                  {med.scheduled_time
                    ? new Date(med.scheduled_time).toLocaleTimeString('pt-PT', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                      })
                    : 'Sem hora'}
                </ThemedText>
              </View>
              <MaterialCommunityIcons name="pill" size={32} color="#1a1a1a" />
            </View>

            <View className="gap-3">
              <View className="flex-row items-center gap-2">
                <View className="h-1.5 w-1.5 rounded-full bg-black" />
                <ThemedText>
                  {med.name} {med.dosage ? `- ${med.dosage}mg` : ''}
                </ThemedText>
              </View>
            </View>
          </View>
        ))
      ) : (
        <View className="items-center rounded-2xl bg-white p-6 shadow-sm">
          <ThemedText className="text-neutral">
            Sem medicação registada para este dia.
          </ThemedText>
        </View>
      )}
    </View>
  );
}
