import * as React from 'react';
import { View, TouchableOpacity } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';

export interface SensorCatalogueItem {
  name: string;
  icon: keyof typeof MaterialIcons.glyphMap;
}

export const SENSOR_CATALOGUE: SensorCatalogueItem[] = [
  { name: 'Câmara Entrada', icon: 'videocam' },
  { name: 'Câmara Sala', icon: 'home' },
  { name: 'Medicação', icon: 'medical-services' },
  { name: 'Detetor de Queda', icon: 'personal-injury' },
  { name: 'Detetor de Fumo', icon: 'local-fire-department' },
  { name: 'Monitor Cardíaco', icon: 'favorite' },
  { name: 'Movimento', icon: 'directions-walk' },
  { name: 'Casa de Banho', icon: 'bathroom' },
  { name: 'Sono', icon: 'bedtime' },
  { name: 'Temperatura', icon: 'thermostat' },
];

type AddSensorBottomSheetProps = {
  existingNames: string[];
  onAddSensor: (sensor: SensorCatalogueItem) => void;
};

type AddSensorBottomSheetRef = BottomSheetModal;

const AddSensorBottomSheet = React.forwardRef<
  AddSensorBottomSheetRef,
  AddSensorBottomSheetProps
>(({ existingNames, onAddSensor }, ref) => {
  const snapPoints = React.useMemo(() => ['70%'], []);

  const renderBackdrop = React.useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
        pressBehavior="close"
      />
    ),
    [],
  );

  const handleSelect = (item: SensorCatalogueItem) => {
    const alreadyAdded = existingNames.includes(item.name);
    if (alreadyAdded) return;

    onAddSensor(item);

    const modalRef = ref as React.RefObject<BottomSheetModal>;
    modalRef.current?.dismiss();
  };

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: '#FFFFFF', borderRadius: 32 }}
      handleIndicatorStyle={{
        backgroundColor: '#205a2d',
        width: 35,
        height: 6,
        borderRadius: 7,
      }}
    >
      <BottomSheetView className="px-8 pt-3">
        <ThemedText type="title" className="mb-6 text-center">
          Adicionar Sensor
        </ThemedText>
      </BottomSheetView>

      <BottomSheetScrollView
        contentContainerStyle={{
          paddingHorizontal: 32,
          paddingBottom: 40,
          gap: 12,
        }}
        showsVerticalScrollIndicator={false}
      >
        {SENSOR_CATALOGUE.map((item) => {
          const alreadyAdded = existingNames.includes(item.name);
          return (
            <TouchableOpacity
              key={item.name}
              onPress={() => handleSelect(item)}
              activeOpacity={alreadyAdded ? 1 : 0.75}
              className={`flex-row items-center gap-4 rounded-2xl p-5 ${
                alreadyAdded
                  ? 'bg-gray-100 opacity-40'
                  : 'bg-neutralLight shadow-sm shadow-black/10'
              }`}
            >
              <View
                className={`h-11 w-11 items-center justify-center rounded-xl ${
                  alreadyAdded ? 'bg-gray-200' : 'bg-primary/10'
                }`}
              >
                <MaterialIcons
                  name={item.icon}
                  size={22}
                  color={alreadyAdded ? '#9ca3af' : '#205a2d'}
                />
              </View>

              <View className="flex-1">
                <ThemedText
                  type="bodyBold"
                  className={alreadyAdded ? 'text-gray-400' : 'text-neutral'}
                >
                  {item.name}
                </ThemedText>
                {alreadyAdded && (
                  <ThemedText type="bodySmall" className="text-gray-400">
                    Já adicionado
                  </ThemedText>
                )}
              </View>

              {!alreadyAdded && (
                <MaterialIcons
                  name="add-circle-outline"
                  size={24}
                  color="#205a2d"
                />
              )}
            </TouchableOpacity>
          );
        })}
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
});

AddSensorBottomSheet.displayName = 'AddSensorBottomSheet';
export default AddSensorBottomSheet;
