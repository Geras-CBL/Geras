import { useState } from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface MedicineItem {
  id: string;
  name: string;
  dosage?: number;
  scheduled_time?: string;
  start_date?: string;
  end_date?: string;
  description?: string;
}

export function MedicationSchedule({
  medicines,
  onDelete,
}: {
  medicines: MedicineItem[];
  onDelete?: (id: string) => Promise<void>;
}) {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [expandedMedId, setExpandedMedId] = useState<string | null>(null);

  const handleDeletePress = (id: string, name: string) => {
    Alert.alert(
      'Eliminar Medicamento',
      `Tem a certeza que deseja eliminar o medicamento "${name}" de forma permanente?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              if (onDelete) {
                await onDelete(id);
              }
            } catch (error) {
              console.error('Erro ao eliminar medicamento:', error);
              Alert.alert('Erro', 'Não foi possível eliminar o medicamento.');
            }
          },
        },
      ],
    );
  };

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
        currentDay.medicines.map((med) => {
          const isExpanded = expandedMedId === med.id;
          return (
            <TouchableOpacity
              key={med.id}
              activeOpacity={0.9}
              onPress={() => setExpandedMedId(isExpanded ? null : med.id)}
              className="w-full rounded-2xl bg-white p-5 shadow-sm"
            >
              <View className="mb-4 flex-row items-start justify-between">
                <View className="rounded-full bg-primary px-4 py-1">
                  <ThemedText type="bodyBold" className="text-white">
                    {med.scheduled_time
                      ? new Date(med.scheduled_time).toLocaleTimeString(
                          'pt-PT',
                          {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false,
                          },
                        )
                      : 'Sem hora'}
                  </ThemedText>
                </View>
                <MaterialCommunityIcons name="pill" size={32} color="#1a1a1a" />
              </View>

              <View className="gap-3">
                <View className="flex-row items-center gap-2">
                  <View className="h-1.5 w-1.5 rounded-full bg-black" />
                  <ThemedText className="font-semibold text-neutral">
                    {med.name} {med.dosage ? `- ${med.dosage}mg` : ''}
                  </ThemedText>
                </View>
              </View>

              {isExpanded && (
                <View className="mt-4 gap-3 border-t border-gray-100 pt-4">
                  {med.description ? (
                    <View className="gap-1">
                      <ThemedText
                        type="bodyBold"
                        className="text-xs uppercase text-gray-500"
                      >
                        Instruções
                      </ThemedText>
                      <ThemedText className="text-sm text-neutral">
                        {med.description}
                      </ThemedText>
                    </View>
                  ) : null}

                  <View className="mt-1 flex-row justify-between gap-4">
                    {med.start_date && (
                      <View className="flex-1">
                        <ThemedText
                          type="bodyBold"
                          className="text-xs uppercase text-gray-500"
                        >
                          Início
                        </ThemedText>
                        <ThemedText className="text-sm text-neutral">
                          {new Date(med.start_date).toLocaleDateString('pt-PT')}
                        </ThemedText>
                      </View>
                    )}
                    {med.end_date && (
                      <View className="flex-1">
                        <ThemedText
                          type="bodyBold"
                          className="text-xs uppercase text-gray-500"
                        >
                          Fim
                        </ThemedText>
                        <ThemedText className="text-sm text-neutral">
                          {new Date(med.end_date).toLocaleDateString('pt-PT')}
                        </ThemedText>
                      </View>
                    )}
                  </View>

                  {onDelete && (
                    <View className="mt-3 flex-row justify-end">
                      <TouchableOpacity
                        className="flex-row items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2"
                        onPress={() => handleDeletePress(med.id, med.name)}
                      >
                        <MaterialCommunityIcons
                          name="delete-outline"
                          size={20}
                          color="#dc2626"
                        />
                        <ThemedText className="font-semibold text-red-600">
                          Eliminar
                        </ThemedText>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}
            </TouchableOpacity>
          );
        })
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
